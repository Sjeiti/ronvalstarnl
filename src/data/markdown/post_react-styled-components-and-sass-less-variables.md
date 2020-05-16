<!--
  date: 2020-05-17
  modified: 2020-05-17
  slug: react-styled-components-and-sass-less-variables
  type: post
  header: element5-digital-Xf7o2W7qgP0-unsplash.jpg
  headerColofon: photo by [Element5 Digital](https://unsplash.com/@element5digital)
  categories: code, CSS, HTML, JavaScript
  tags: React, CSS, Sass, Less
  metaKeyword: React
  metaDescription: A simple solution on how to use Sass variables in React styled-components.
-->

# React styled-components and SASS/LESS variables

Programming is the art of abstracting complex processes into simpler ones so humans can understand what is really happening.
For a website the basics are crudely divided into content, style and logic in the form of HTML, CSS and JavaScript.

## preprocessors and components

One of the tools of the last decade that help to not make a complete mess of the visual styling are CSS preprocessors (namely Sass and Less). These make your CSS [dryer](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) by using variables, functions and nesting structures for specificity.

To help structure front-end code we make use of libraries and frameworks. The front-end tendency to separate into components is logical; abstractions should be semantically meaningful and the HTML/CSS/JS separation only gets you so far. 

## styled components

With React you can make use of [styled-components](https://styled-components.com/). This blurs the line between styling and code somewhat but we do end up with clearly separated components and a lot less CSS specificity clashes.

But we still have a generic global style to implement. If you decide to change the global padding by one unit you do not want to change forty components.
And there is always that first render that is mostly just plain HTML/CSS, so we *do* want to use a CSS preprocessor as the starting point for our styling.

Styled-components are an awesome solution for creating modular components but it does create problems we thought we already solved with preprocessors: variables and functions.

### live with it

You could forget about preprocessors and create a JavaScript module with your styling variables. Then use these by with ES6 string interpolation.
For instance here's a module called `style.js` and a styled-component:

```js
export const breakpoint = {
  small: 0
  , medium: 768
  , large: 1024
  , extraLarge: 1216
}
export const size = {
  padding: '1rem'
}
export const color = {
  foreground: '#333'
  , background: '#FFF'
  , link: '#44F'
}
```

```js
import styled from 'styled-components'
import {breakpoint, size, color} from '../style.js'

const {medium} = breakpoint
const {padding} = size
const {foreground, background} = color

export const Thing = styled.div`
  padding: ${padding};
  background-color: ${background};
  color: ${foreground};
  @media screen and (min-width: ${medium}px) {
    padding-top: calc(2*${padding});
  } 
`
```

You see what happens in that last declaration. With a preprocessor this would just be `padding-top: 2*$padding;` but you cannot do that with styled components. You can with CSS calc, but not with colors.
So they made [Polished](https://polished.js.org/). 


### Polished

You can bring some of the preprocessor magic back by using [Polished](https://polished.js.org/). Brought to you by the same people who made styled-components. Polished exports functions. Instead of `calc` you can use `math` like this: `padding-top: ${math('2*1rem')};`.
But since we want to use variables it becomes this `padding-top: ${math('2*${padding}')};`, which is getting a bit ridiculous compared to what we had earlier `padding-top: 2*$padding;`.
Polished is useful though, it has color functions, mixins, helper methods and more. 

### styled theming

The people at styled-components also created an easy way the make themes, called [styled theming](https://github.com/styled-components/styled-theming). This has a similar effect to overriding CSS variables created at `:root`. Read [this blogpost](https://jamie.build/styled-theming.html) if you're interested.

### take a step back

I love what styled-components do, it is so good an abstraction that I'll take the steps back for granted. But Polished and styled theming takes it a step too far for my taste. An easier solution that made me revert both Polished and styled-theming is the following.

For first render Sass was still needed. This means a lot of sizes and colors that are used in the components are first used as Sass variable.

At first I tried converting the Sass variables to JavaScript object. A bit similar to [a technique I wrote about](https://ronvalstar.nl/less-variables-to-javascript) in 2012. Only now we use `:root` and CSS variables to extract them.

So we have a `_variables.scss`:

```scss
$padding: 1rem;

:root {
  --padding: $padding;
}
```

Which we use like this:

```javascript
import '../style/_variables.scss'

const cssVars = Array.from(document.styleSheets).reduce((acc, sheet)=>{
  Array.from(sheet.cssRules).forEach(rule=>{
    const {selectorText, style} = rule
    if (selectorText===':root') {
      for (let i=0, l=style.length;i<l;i++) {
      	const key = style[i];
      	acc[key] = style.getPropertyValue(key)
      }
    }
  })
  return acc
}, {})

export const cssVar = Object.keys(cssVars).reduce((acc, key)=>{
  acc[camelCase(key.substr(2))] = `var(${key})`
  return acc
}, {})

export const cssVarValue = Object.entries(cssVars).reduce((acc, [key, value])=>{
  acc[camelCase(key.substr(2))] = value
  return acc
}, {})
```

Where `cssVar` would be `{ padding: 'var(padding)' }` and `cssVarValue` would be `{ padding: '1rem' }`.
Which is a neat clean way to do it but I was overthinking things.

In the end I wrote the CSS declarations inside the styled-component like this:

`padding-top: calc(2*var(padding));`

That's right: I simply used CSS variables everywhere.
 
- it is readable
- there is no need for extra JavaScript because this is already implemented in DOM/CCSOM
- my IDE understands the references
- it takes a single className to change theme

The only downside is the lack color functions ([yet](https://gist.github.com/una/edcfa0d3600e0b89b2ebf266bf549721)?). Which means more CSS variables or stricter color management.
