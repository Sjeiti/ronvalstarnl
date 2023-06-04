<!--
  description: Thoughts about signals
  date: 2023-06-04
  modified: 2023-06-04
  slug: signals
  type: post
  header: takahiro-sakamoto-wcWvku7gqHc-unsplash.jpg
  headerColofon: photo by [Takahiro Sakamoto](https://unsplash.com/@takahiro)
  headerClassName: no-blur darken
  categories: code, CSS, HTML, JavaScript, work, open source
  tags: signals
-->

# Signals

I've been using signals since the latter days of Flash, so since before 2010. Loved it in AS3, so kept using it in JavaScript in the form of [js-signals](https://millermedeiros.github.io/js-signals/). This was modeled after [AS3 signals](https://github.com/robertpenner/as3-signals) which in turn was in turn inspired by [C# events](http://en.wikipedia.org/wiki/C_Sharp_syntax#Events) and [signals/slots](http://en.wikipedia.org/wiki/Signals_and_slots) in Qt. (<small>a [port of AS3 signals](https://github.com/RobotlegsJS/SignalsJS) exists in the RobotlegsJS repo</small>)

As a concept, signals are very simple, and very powerful. It is basically a pub/sub, an event emitter, without the ugly string identifier implementation.

So really nothing more than this...

<!--line-numbers-->
```JavaScript
const signalPrototype = {
  add(callback){
    this._slots.push(callback)
  },
  dispatch(...values){
    this._slots.forEach(slot=>slot(...values))
  }
}

function createSignal(){
  return Object.create(signalPrototype, {
    _slots: {
      writable: false,
      value: []
    }
  })
}
```

Which you can use like this:

```JavaScript
// Create signal
const somethingHappened = createSignal()

// Do something when something happens
somethingHappened.add(console.log.bind(console, 'Something happened'))

// So when something really happens a while later
somethingHappened.dispatch('yesterday', 'evening')

// This is the result in the console:
// > Something happened yesterday evening
```

That was really quick and dirty. An actual implementation would have the `add` method return a `slot` that can be used to remove the 'listener', as well as some other useful methods.
But I hope this illustrates the basic simplicity.


## Signals is all the rage

When I read in [JavaScript Weekly](https://javascriptweekly.com/issues/626) about Angular implementing signals I initially ignored it. I thought they dreamt up something different with the same name. After all, Angular already has an event emitter, and RxJs.

I missed the [JSW september memo](https://javascriptweekly.com/issues/605) about PReact introducing signals.

Knowing [SolidJS](https://www.solidjs.com/) only by name, I also didn't know about signals being at the core of it.


## Almost but not quite

What is a bit different about these latter signals is that they solve a slightly different problem: reactivity. So it is more about state management than it is about event dispatching.

The [SolidJS implementation](https://www.solidjs.com/tutorial/introduction_signals) even looks remarkably similar to the [React `useState`](https://legacy.reactjs.org/docs/hooks-state.html): `const [count, setCount] = createSignal(0)`. But they both work quite differently.

Be it reactivity or event dispatching, it all really boils down to the same thing. Some solutions just focus on state, others on change. We have event dispatching, publish/subscribe, signals, observables, streams, promises, async/await, etcetera. What they all try to solve is this:

 - state exists
 - something happens
 - and causes change
 
If you want a more detailed explanation read [A General Theory of Reactivity](https://github.com/kriskowal/gtor).


## While we're at it

Let's make that minimal example a bit more realistic. We'll implement state, slots and some extra methods.
What I like about the Angular implementation is that the signal itself is both the instance, as wel as the get-method for the current value. This does require a bit of cunning.

I've split it into two files. The first is `signal.js`:

<pre line-numbers><code data-language="javascript" data-src="https://raw.githubusercontent.com/Sjeiti/state-signals/master/src/signal.js"></code></pre>

The other is `slot.js`:

<pre line-numbers><code data-language="javascript" data-src="https://raw.githubusercontent.com/Sjeiti/state-signals/master/src/slot.js"></code></pre>

This is still only 181 lines including JSDoc, or 1.24 KB minified.

I've gone ahead and [published it to NPM](https://www.npmjs.com/package/state-signals). There's already 468 packages mentioning signals. One more won't hurt.


## Explanation

The code is no rocket science. I'll run you through some of the less obvious points.

### Vanilla

Why Vanilla with a separate dts file, why not TypeScript? Because you do not need TypeScript to write typed JavaScript. Simply adding JSDoc accomplishes the same with the added benefit of being able to generate documentation.
For code as simple as this, TypeScript would just be an extra abstraction layer without real benefits.

### Prototype

JavaScript is [prototypal](#code-2-9) by nature, but most people will use it in a classical way. That is: class declarations, and instantiation with `new`. Not classical in the historical sense, because that *is* prototypal.
Let's just say the prototypal approach can give you a more fine grained control over properties and methods.

### Factories

You might notice that both files consist of a [prototype declaration](#code-3-6) and a [factory method](#code-3-32). The factory creates an instance using `Object.create`. The factory in `slot.js` is how you'd normally go about things.
The [factory in `signal.js`](#code-2-75) is a bit unorthodox. In order to create an instance that is also callable we have to create the instance and the callable function separately, apply all instance properties to the function, and return that.

### Chaining

Chaining is a pattern to call multiple methods in succession. It is easily implemented: whenever a method returns nothing, return the object scope instead (that is `this`).

## Summary

Signals are awesome.
