<!--
  slug: using-string-literals-sparingly
  date: 2020-02-11
  modified: 2020-02-11
  type: post
  header: jason-leung-EXYQt40B3KA-unsplash.jpg
  headerColofon: Jason Leung
  category: JavaScript
  tag: code quality, string
-->

# Using string literals sparingly

Using the same strings literals more than once is mostly a bad idea because typos in strings do not throw errors.

Programming languages are (mostly) in English so programmers naturally tend to code in that language. If your native language is not English you are more likely to introduce a wrongly spelled variable name. But that is fine because todays IDEs can check your code even before you compile. Plus variables and method names are autocompleted to make sure you'll consistently make the same mistake.
But a state or event represented by a string is a liability because it will not throw an error.

Here are the main string issues for Javascript  where you are better off not using string literals.


## CSS classNames

DOM elements have state or style representation in the form of classNames. More often than not people handle these by their string literal instead of a const. So if somebody uses past tense for a tab state like `label.selected` and someone else comes along and inadvertedly types `classList.add('select')` we have a bug without an error.

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

The reason to fully write out that second one instead of `Object.entries(className).map(...)` is simply for autocompletion. Smart oneliners are not always smart.

We can even go one step further by making the entire object immutable with `Object.freeze(className)`.


## Events

Events are another not-so-smart use of string literals. One reason never to use `CustomEvent` is because it is based on string identifiers. Of course existing DOM events are pretty much set in stone and replacing those with constants would be overdoing it a bit. But why is the convention for the string in `addEventListener('mousedown',...)` lowercase and `<a onMouseDown="...">` camelcase? And of course my IDE doesn't see anything wrong with `addEventListener('mousedowm',...)`.

An object or symbol based pubsub is much easier to handle than `CustomEvent` and much more foolproof. It even pay to proxy common DOM events with a pubsub. A good stringless pubsub for JavaScript is [SignalsJS](https://millermedeiros.github.io/js-signals/).


## State

And lastly there is the *state* represented by string. This is present in the existing DOM for instance in `ServiceWorker.state` which can be 'installing' or 'installed' or some other string state. Or have a look at the Fetch API if you want to see some strings.
`XMLHTTPRequest.readyState` is designed a bit better because these states are represented by an unsigned integer (which is handy for chronological states and *greater than*). But it would be more semantic with a constant like `request.readyState>XHR.OPENED`.

If you ever create a module and want a clear API: expose states as symbol constants. These are easier to figure out by autocompletion than having to read the documentation in search of the correct string value.

So for example write:

```javascript
export const state = {
  IDLE: Symbol('IDLE')
  ,LOADING: Symbol('LOADING')
  ,LOADED: Symbol('LOADED')
}
```

### State managers

Replacing states with symbols can also be easily aplied to the actions in state managers like Redux.


## Conclusion / TLDR

Put repeating strings in constant variables or frozen objects and use symbols where applicable because:

- it is DRY
- it is semantic
- it autocompletes
- it throws errors when misspelled
- it is easier to refactor
