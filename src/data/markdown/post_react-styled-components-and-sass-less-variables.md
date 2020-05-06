<!--
  date: 2050-05-16
  modified: 2050-05-16
  slug: react-styled-components-and-sass-less-variables
  type: post
  header: termux.png
  categories: code, CSS, HTML, JavaScript
  tags: CSS, HTML, JavaScript, cli, linux, bash, android
  metaKeyword: android
  metaDescription: Apps for programming on an Android are clumsy at best, and full of adds. But the best one is really just a Linux terminal: Termux!
-->

# React styled components and SASS/LESS variables

Programming is the art of abstracting complex processes into simpler ones so humans can understand what is really happening.
For a website the basics are crudely divided into content, style and code in the form of HTML, CSS and JavaScript.

## preprocessors

One of the tools of the last decade that help to not make a complete mess of the styling are CSS preprocessors (namely Sass and Less). These make your CSS dryer by using variables, functions and nesting structures for specificity.

## components

To help structure front-end code we make use of libraries and frameworks. The front-end tendency to separate into components is logical; abstractions should be semantically meaningful and the HTML/CSS/JS separation only gets you so far. 

## styled components

With React you can make use of styled components. This blurs the line between styling and code somewhat but we do end up with clearly separated components and a lot less CSS clashes.

The thing is, we still have generic style to implement. If you decide to change the global padding by one unit you do not want to change forty components.
And there is always that first render that is mostly just plain HTML/CSS, so we do want to use a CSS preprocessor as the starting point for our styling.

Styled components are an awesome solution for creating modular components but it does create problems we thought we already solved with preprocessors: variables and functions.

### live with it

You could forget about preprocessors and create a JavaScript module with your styling variables. Then use these by with ES6 string interpolation.
For instance here's a module called `style.js` and a styled component:

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

You see what happens in that last declaration. With a preprocessor this would just be `padding-top: 2*$padding;` but you can't with styled components. You can with CSS calc, but no fancy color calculations.

So here is Polished. 


### polished

You can forget about preprocessors but bring some of the magic back by using [Polished](https://polished.js.org/). Brought to you by the same people who made styled components.

### styled theming

You can even use variables like you used to by means of [styled theming](https://github.com/styled-components/styled-theming).

### keep using Sass

You can act like nothing ever happened by adding a module that interprets your Sass variables in the styled component. But it's only Sass (I sometimes use Less depending on the build platform). This solution makes it also a bit harder for your favorite IDE to determine where the variable is set.

