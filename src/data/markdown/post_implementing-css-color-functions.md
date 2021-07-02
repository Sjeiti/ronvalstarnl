<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: implementing-css-color-functions
  type: post
  header: sincerely-media-IKzmglo7JLk-unsplash.jpg
  headerColofon: photo by [Sincerely Media](https://unsplash.com/@sincerelymedia)
  headerClassName: no-blur darken
  excerpt: 
  categories: Javascript
  tags: CSS
-->

# Implementing CSS color functions

It is unfortunate that CSS evolves a lot slower than JavaScript. One of the reasons is that JavaScript is standardised by [Ecma](https://www.ecma-international.org/) while CSS is being worked on by the W3C [CSS Working Group](http://www.w3.org/Style/CSS/).

Lately color functions have been postponed: removed from [Color Module lvl 4](https://www.w3.org/TR/css-color-4/) and included in [Color Module lvl 5](https://www.w3.org/TR/css-color-5/#intro). For those who don't know: while JavaScript is based on the premise of stages where higher is better, CSS is based on snapshots and modules where [higher does not mean better](https://www.w3.org/Style/CSS/current-work.en.html).

So even though logic in CSS is becoming more sophisticated (calc, max etc...) we still have to rely on preprocessors to deal with color calculations.


## Unless we write it ourselves

We could just loop the stylesheets with JavaScript in search for unresolved calculations and apply them.

We can go a long way here, and we might if we ever decide to turn this into an NPM module. But for now I'm going to set some clear boundaries. The functions are only applied to variables (or custom properties) in the CSS `:root` node. The calculations will be triggered manually: we're not going to use watchers or change listeners.

We also need to decide on an API. Not to reïnvent the wheel I'll think I'll stick with the Sass implementation for now.


## So let's get to it

The idea is:
 - loop the stylesheets and index variables that use color function
 - create a new rule and overwrite the variables with the applied color functions

Looping the stylesheets is easy enough but we'll have to use try..catch in case we access external stylesheets.
To weed out any valid functions we can use `getComputedStyle`. So for each definition we end up with an initial value and a computed value. We'll store all variable definitions in an object because we might need their values if they are used in a function.
We'll also store all color functions in a separate object because we'll need to loop them.

```TypeScript
interface ICSSVar {
  name: string
  , value: string
  , computed: string
}

const cssVars:{[key:string]:ICSSVar} = {}
const cssVarFunctions:{[key:string]:ICSSVar} = {}

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
I'm afraid we're going to have to write... (imagine spooky sound effects here),,, a parser.

I'm a very visual programmer and I imagine a lot of front-end developers are. I've always steered clear of lexers, parsers and AST thinking it was for smart people, with thick glasses.

But it's really not all that hard once you getinto it: just really verbose and meticulous.
Besides, we'll only be parsing some functions and we can cut a few corners implementing it.

If you want to read up on parsing ###
For our corner cutting: we'll just lexe our function string right into an AST (of sorts).
The following is crude and simple but gets us the tree we want.

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

You may notice that this is recursive. When a left- or right-paren is encountered `indent` will change
