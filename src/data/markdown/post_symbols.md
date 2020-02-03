<!--
  slug: symbols
  date: 2020-02-30
  modified: 2020-02-30
  type: post
  header: jason-leung-EXYQt40B3KA-unsplash.jpg
  headerColofon: Jason Leung
  category: JavaScript
  tag: code quality, string
-->

# Use string literals sparingly

Using strings literals for anything else than content is a bad idea. It is prone to errors because string typos do not throw errors.

Programming languages are (mostly) in English so programmers naturally tend to code in that language. If your native language is not English you are more likely to introduce a wrongly spelled variable name. But that is fine because todays IDEs can check your code even before you compile. Plus variables and method names are autocompleted to make sure you'll make the same mistake twice.
But a state or event represented by a string is a liability because it will not throw an error.

Here are the main string issues in front-end development. But this goes for other fields as well.


## CSS classNames

DOM elements have state or style representation in the form of classNames. More often than not people handle these by their string literal instead of a const. So if somebody uses past tense for a tab state like `label.selected` and someone else comes along and inadvertedly types `classList.add('select')` we have an issue.

There is an easy fix which is to *always* use variables for *classNames* and *selectors*. So somewhere should be a declaration like:

```javascript
const className = {
  pending: 'pending'
  ,loaded: 'loaded'
}
const selector = {
  pending: `.${className.pending}`
  ,loaded: `.${className.loaded}`
}
```

And the reason to fully write out that second one instead of `Object.entries(className).map(...)` is simply for autocompletion. Smart oneliners are not always smart.

We can even go further to prevent `className.loaded += 'twice'` by making the entire object immutabke with `Object.freeze(className)`.


## Events

Events are another annoying use of string literals. One reason never to use `CustomEvent` is because
it is based on string identifiers. Of course existing DOM events are pretty much set in stone. But why is the string `addEventListener('mousedown',...)` lowercase and `<a onMouseDown="...">` camelcase? And of course my IDE doesn't see anything wrong with `addEventListener('mousedowm',...)`.

Which is why an object or const based pubsub is much easier to handle than `CustomEvent`. A good stringless pubsub for JavaScript is SignalsJS.


## State

And lastly there is the *state* represented by string. This is present in the existing DOM for instance in `ServiceWorker.state` which can be 'installing' or 'installed' or some other string state. Or have a look at the Fetch API if you want to see some strings.
`XMLHTTPRequest.readyState` is designrd a bit better because they are represented by an unsigned integer (which is handy for chronological states and *greater than*). But it would be more semantic with a constant like `request.readyState>XHR.OPENED`.

### Symbols

One of the best additions to ES6 are symbols. This new type (the seventh) is perfect for defining states `const LOADING = Symbol('LOADING')`.

<style>
.asdf{
width: 16rem;
height: 16rem;
background-image:
linear-gradient(23deg,transparent,red,transparent),
linear-gradient(90deg,red,green,red)
;
background-size:0.1rem,0.5rem;
margin-bottom: 4rem;
</style>
<div class="asdf"></div>

