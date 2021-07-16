<!--
  date: 2021-07-16
  modified: 2021-07-16
  slug: implementing-css-color-functions
  type: post
  header: lucas-benjamin-MyU3s1VasA4-unsplash.jpg
  headerColofon: photo by [Lucas Benjamin](https://unsplash.com/@aznbokchoy)
  headerClassName: no-blur
  excerpt: a CSS color functions implementation
  
  categories: Javascript
  tags: CSS
-->

# Implementing CSS color functions
 
It is unfortunate that CSS evolves a lot slower than JavaScript. One of the reasons is that JavaScript is standardised by [Ecma](https://www.ecma-international.org/) while CSS is being worked on by the W3C [CSS Working Group](http://www.w3.org/Style/CSS/).

Lately color functions have been postponed: removed from [Color Module lvl 4](https://www.w3.org/TR/css-color-4/) and included in [Color Module lvl 5](https://www.w3.org/TR/css-color-5/#intro). For those who don't know: while JavaScript is based on the premise of stages where higher is better, CSS is based on snapshots and modules where [higher does not mean better](https://www.w3.org/Style/CSS/current-work.en.html).

So even though logic in CSS is becoming more sophisticated (calc, max etc...) we still have to rely on preprocessors to deal with color calculations.


## Unless we write it ourselves

We could just loop the stylesheets with JavaScript in search for unresolved calculations and apply them.

If this were to be proper open-source it would have to work for a lot of cases. But for now I'm going to set some clear boundaries. The functions are only applied to variables (or custom properties) in the CSS `:root` node. The calculations will be triggered manually: we're not going to use watchers or change listeners.

We also need to decide on an API. Not to reïnvent the wheel I'll think I'll stick with the Sass implementation for now.


## So let's get to it

The idea is:
 - loop the stylesheets and index variables that use color function
 - create a new rule and overwrite the variables with the applied color functions

Looping the stylesheets is easy enough (we'll have to use try..catch in case we access external stylesheets).
To weed out any valid functions we can use `getComputedStyle`. So for each definition we end up with an initial value and a computed value. Variable definitions are stored in an object because we might need their values if they are used in a function.
Color functions are stored in a separate object because we'll need to loop them separately.

```TypeScript
interface ICSSVar {
  name: string
  , value: string
  , computed: string
}

const cssVars:{[key:string]:ICSSVar} = {}
const cssVarFunctions:{[key:string]:ICSSVar} = {}

const colorFunctionsRegex = /^\s*(lighten|darken|desaturate|adjust|alpha)\(/

const computedStyle = getComputedStyle(document.body)
Array.from(document.styleSheets).forEach(sheet=>{
  const rules = []
  try { rules.push(...Array.from(sheet.rules)) } catch (err) {}
  rules
    .filter((rule:CSSStyleRule)=>rule.selectorText===':root')
    .forEach((rule:CSSStyleRule)=>{
      const {style} = rule
      for (let i = 0, l = style.length; i < l; i++) {
        const name = style[i]
        const value = style.getPropertyValue(name).trim()
        const computed = computedStyle.getPropertyValue(name).trim()
        const cssVar:ICSSVar = {name, value, computed}
        const isFnc = colorFunctionsRegex.test(computed)
        cssVars[name] = cssVar
        isFnc&&(cssVarFunctions[name] = cssVar)
      }
    })
})
```


## Now what?

We have the function names and parameters, how do we run them?
We could use regex to dismantle them but that would get messy pretty soon because functions can be nested. Even CSS variables use a lookup function: `var(--my-value)`.
I'm afraid we're going to have to write... <small>_(imagine spooky sound effects here)_</small>... a parser.

I'm a very visual programmer and I imagine a lot of front-end developers are. I've always steered clear of lexers, parsers and AST thinking it was for smart people, with thick glasses.

But it's really not all that hard once you get into it: just really verbose and meticulous.
Besides, we'll only be parsing some functions and we can cut a few corners implementing it.

For our corner cutting: we'll just lexe our function string straight into an AST (of sorts).
The following is crude and simple but produces the tree we want.

```TypeScript
const type = {
  FUNCTION: 'FUNCTION'
  , STRING: 'STRING'
  , NUMBER: 'NUMBER'
}

const paren1 = '('
const paren0 = ')'
const comma = ','
const space = ' '

const regexNumeric = /^\d+(\.\d+)?$/

export interface IParam {
  type: string
  , name?: string
  , params?: IParam[]
  , value?: string|number
}

export function parse(string:string, result:IParam[] = []) {

  let indent = 0
  let start = 0
  let name = ''

  for (let index = 0, length = string.length; index < length; index++) {

    const character = string[index]
    const isParen1 = character === paren1
    const isParen0 = character === paren0
    const isComma = character === comma
    const isSpace = character === space
    const isDelimiter = isParen0 || isComma || isSpace
    const isLastIndex = index === length - 1

    const wasIndentZero = indent === 0

    if (isParen1 && wasIndentZero) {
      name = string.substring(start, index).trim()
      start = index + 1
    }

    isParen1 && indent++
    isParen0 && indent--

    const isIndentZero = indent === 0

    if (isIndentZero) {
      if (name && isParen0) {
        const value = string.substring(start, index).trim()
        const params:IParam[] = parse(value.substr(0, value.length).trim(), [])
        result.push({
          type: type.FUNCTION
          , name
          , params
        })
        name = ''
        start = index
      } else if (!name && (isDelimiter || isLastIndex) && start !== index) {
        const substring = string.substring(start, index + (isLastIndex ? 1 : 0)).trim()
        const isValid = substring !== comma && substring !== paren0
        const isNumeric = regexNumeric.test(substring)
        substring && isValid && result.push({
          type: isNumeric ? type.NUMBER : type.STRING
          , value: isNumeric ? parseFloat(substring) : substring
        })
        start = index + 1
      }
    }
  }
  return result
}
```

You may notice that this is recursive. When a left- or right-paren is encountered `indent` will change. When the `indent` is back to zero we should have a result.
Then the parameters are fed into the same parse function. The parser then may encounter another function; which turns our resulting object into a happy little tree.

Once we have that AST-like tree we have something we can work with. All that is left now is to traverse the tree and apply any of the functions we encounter. 

```TypeScript
function getFunction(name:string):Function{
  return {
    var: (name:string) => cssVars[name].computed
    , lighten: (clr:string, value:number) => tinycolor(clr).lighten(value)
    , darken: (clr:string, value:number) => tinycolor(clr).darken(value)
    , desaturate: (clr:string, value:number) => tinycolor(clr).desaturate(value)
    , adjust: (clr:string, value:number) => tinycolor(clr).spin(value)
    , alpha: (clr:string, value:number) => tinycolor(clr).setAlpha(value)
  }[name] || ((...arg:any)=>arg.join('-'))
}

function parseTree(tree:IParam):string{
  const {name, params, value} = tree
  return value!==undefined
    &&value
    ||getFunction(name)(...params.map(o=>o.value||parseTree(o)))
}

function resetVars(){
  indexVars()
  Object.values(cssVarFunctions).forEach((cssVar:ICSSVar)=>{
    const {name, value} = cssVar
    const tree = parse(value)
    const newValue = parseTree(tree[0])
    setVar(name, newValue)
    cssVars[name].computed = newValue
  })
} 
```

## A working example

The original project I used this for is in TypeScript. For the demo below I did a quick port to JavaScript (turned interfaces into JSDoc type definitions).
The `input[type=color]` below only sets `--color-main` onto the `documentElement` style. The derived colors are computed through the above `resetVars` method.

For the actual color conversion [a third party package](https://github.com/bgrins/TinyColor) is used. The only reason I choose this one is that it is used by [this online Sass color calculator](http://razorltd.github.io/sasscolourfunctioncalculator/), which I used to get the derived color values.

```html 
<!--example-->

<style>
  :root {
    --color-main: #af510e;
    --color-light: lighten(desaturate(var(--color-main), 50), 30);
    --color-dark: darken(adjust(var(--color-main), 3), 10);
  }
  .box {
    display: inline-block;
    width: 2rem;
    height: 2rem;
  }
  .box--main { background-color: var(--color-main); }
  .box--light { background-color: var(--color-light); }
  .box--dark { background-color: var(--color-dark); }
</style>
<main>
  <p><span class="box box--main"></span> main color</p>
  <p><span class="box box--light"></span> <code>lighten(desaturate(var(--color-main), 50), 30)</code></p>
  <p><span class="box box--dark"></span> <code>darken(adjust(var(--color-main), 3), 10)</code></p>
  <label>input[type=color] for changing main color: <input type="color" value="#af510e"/></label>
</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/tinycolor/1.4.2/tinycolor.min.js"></script>
<script>

const documentElement = document.documentElement
const input = document.querySelector('input')
input.addEventListener('change', ()=>{
  documentElement.style.setProperty('--color-main', input.value)
  resetVars()
})

//###############################################

const type = {
  FUNCTION: 'FUNCTION'
  , STRING: 'STRING'
  , NUMBER: 'NUMBER'
}

const paren1 = '('
const paren0 = ')'
const comma = ','
const space = ' '

const regexNumeric = /^\d+(\.\d+)?$/

/**
 * @typedef {Object} IParam
 * @property {string} type
 * @property {string} [name]
 * @property {string|number} [value]
 * @property {IParam[]} params
 */

/**
 * @param {string} string
 * @param {IParam[]} result=[]
 * @return {IParam[]}
 */
function parse(string, result = []) {

  let indent = 0
  let start = 0
  let name = ''

  for (let index = 0, length = string.length; index < length; index++) {

    const character = string[index]
    const isParen1 = character === paren1
    const isParen0 = character === paren0
    const isComma = character === comma
    const isSpace = character === space
    const isDelimiter = isParen0 || isComma || isSpace
    const isLastIndex = index === length - 1

    const wasIndentZero = indent === 0

    if (isParen1 && wasIndentZero) {
      name = string.substring(start, index).trim()
      start = index + 1
    }

    isParen1 && indent++
    isParen0 && indent--

    const isIndentZero = indent === 0

    if (isIndentZero) {
      if (name && isParen0) {
        const value = string.substring(start, index).trim()
        const params = parse(value.substr(0, value.length).trim(), [])
        result.push({
          type: type.FUNCTION
          , name
          , params
        })
        name = ''
        start = index
      } else if (!name && (isDelimiter || isLastIndex) && start !== index) {
        const substring = string.substring(start, index + (isLastIndex ? 1 : 0)).trim()
        const isValid = substring !== comma && substring !== paren0
        const isNumeric = regexNumeric.test(substring)
        substring && isValid && result.push({
          type: isNumeric ? type.NUMBER : type.STRING
          , value: isNumeric ? parseFloat(substring) : substring
        })
        start = index + 1
      }
    }
  }
  return result
}


//###############################################

// import tinycolor from 'tinycolor2'
// import {IParam, parse} from '../util/functionParser'

/**
 * @typedef {Object} ICSSVar
 * @property {string} name
 * @property {string} value
 * @property {string} computed
 */

const cssVars = {}
const cssVarFunctions = {}

const colorFunctionsRegex = /^\s*(lighten|darken|desaturate|adjust|alpha)\(/

function indexVars(){
  const computedStyle = getComputedStyle(document.body)
  Array.from(document.styleSheets).forEach(sheet=>{
    const rules = []
    try { rules.push(...Array.from(sheet.rules)) } catch (err) {}
    Array.from(rules)
      .filter((rule)=>rule.selectorText===':root')
      .forEach((rule)=>{
        const {style} = rule
        for (let i = 0, l = style.length; i < l; i++) {
          const name = style[i]
          const value = style.getPropertyValue(name).trim()
          const computed = computedStyle.getPropertyValue(name).trim()
          /** @type {ICSSVar} */
          const cssVar = {name, value, computed}
          const isFnc = colorFunctionsRegex.test(computed)
          cssVars[name] = cssVar
          isFnc&&(cssVarFunctions[name] = cssVar)
        }
      })
  })
}
indexVars()

/** @type {CSSStyleDeclaration} */
const customStyle = (()=>{
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.sheet.insertRule('body{}', 0)
  /** @type {CSSStyleRule} */
  const rule = style.sheet.rules[0]
  return rule.style
})()

/**
 * @param {string} name
 * @param {string} value
 * @returns {CSSStyleDeclaration}
 */
const setVar = (name, value)=>{
  customStyle.setProperty(name, value)
  return customStyle
}

/**
 * @param {string} name
 * @returns {Function}
 */
function getFunction(name){
  return {
    var: (name) => cssVars[name].computed
    , lighten: (clr, value) => tinycolor(clr).lighten(value)
    , darken: (clr, value) => tinycolor(clr).darken(value)
    , desaturate: (clr, value) => tinycolor(clr).desaturate(value)
    , adjust: (clr, value) => tinycolor(clr).spin(value)
    , alpha: (clr, value) => tinycolor(clr).setAlpha(value)
  }[name] || ((...arg)=>arg.join('-'))
}

/**
 * @param {IParam} tree
 * @returns {string}
 */
function parseTree(tree){
  const {name, params, value} = tree
  return value!==undefined
    &&value
    ||getFunction(name)(...params.map(o=>o.value||parseTree(o)))
}

function resetVars(){
  indexVars()
  Object.values(cssVarFunctions).forEach(cssVar=>{
    const {name, value} = cssVar
    const tree = parse(value)
    const newValue = parseTree(tree[0])
    setVar(name, newValue)
    cssVars[name].computed = newValue
  })
}

resetVars()
</script>
``` 


### NPM?

I might one day put this on NPM. But having a working example is one thing, open-sourcing it is an entirely different thing. So for now just checkout the code on JSFiddle and do whatever you like.
