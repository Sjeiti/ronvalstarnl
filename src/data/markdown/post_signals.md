<!--
  date: 2023-05-17
  modified: 2023-05-17
  slug: signals
  type: post
  header: takahiro-sakamoto-wcWvku7gqHc-unsplash.jpg
  headerColofon: photo by [Takahiro Sakamoto](https://unsplash.com/@takahiro)
  headerClassName: no-blur darken
  categories: code, CSS, HTML, JavaScript, work, open source
  tags: Angular, accounting, invoicing, Vue
  metaDescription: Thoughts about signals
-->

I've been using signals since the latter days of Flash, so since before 2010. Loved it in AS3, so kept using it in JavaScript in the form of [js-signals](https://millermedeiros.github.io/js-signals/). This was modeled after [AS3 signals](https://github.com/robertpenner/as3-signals) which in turn was in turn inspired by [C# events](http://en.wikipedia.org/wiki/C_Sharp_syntax#Events) and [signals/slots](http://en.wikipedia.org/wiki/Signals_and_slots) in Qt.

<small>Small sidenote: there is also a [port of AS3 signals](https://github.com/RobotlegsJS/SignalsJS) in the RobotlegsJS repository.</small>

As a concept, signals are very simple, and very powerful. It is basically a pub/sub, an event emitter, without the ugly string identifier implementation.

So really nothing more than this...

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

// Usage

// Create signal
const somethingHappened = createSignal()

// Do something when something happens
somethingHappened.add(console.log.bind(console, 'Something happened'))

// So when something really happens a while later
somethingHappened.dispatch('yesterday', 'evening')

// This is the result in the console:
// > Something happened yesterday evening
```

The above was really quick and dirty. An actual implementation would have the `add` method return a `slot` that can be used to remove the 'listener', as well as some other useful methods.
But I hope this illustrates the basic simplicity.


## Signals is all the rage

When I read in [JavaScript Weekly](https://javascriptweekly.com/issues/626) about Angular implementing signals I initially ignored it. I thought they dreamt up something different with the same name. After all, Angular already has an event emitter, and RxJs.

I missed the [JSW september memo](https://javascriptweekly.com/issues/605) about PReact introducing signals.

Also didn't know about signals being at the core of [SolidJS](https://www.solidjs.com/) <small>(frankly I knew SolidJS only by name)</small>.


## Almost but not quite

What is a bit different about these latest signals is that they solve a slightly different problem: reactivity. So it is more about state management than it is about events.

The [SolidJS implementation](https://www.solidjs.com/tutorial/introduction_signals) even looks remarkably similar to the [React `useState`](https://legacy.reactjs.org/docs/hooks-state.html): `const [count, setCount] = createSignal(0)`. But they both work quite differently.

Be it reactivity or event dispatching, it all really boils down to the same thing. Some solutions just focus on state, others on change. We have event dispatching, publish/subscribe, signals, observables, streams, promises, async/await, etcetera. They all try to solve this:

 - state exists
 - something happens
 - and causes change
 
If you want a more detailed explanation read [A General Theory of Reactivity](https://github.com/kriskowal/gtor).


## While we're at it

So, for shits and giggles, let's make our minimal example a bit more realistic. We'll implement state, slots and some extra methods. What I like about the Angular implementation is that the signal itself is both the instance, as wel as the get-method for the current value. This does require a bit of trickery...

```JavaScript
/**
 * A signal
 * @name Signal
 * @function
 */
const signalPrototype = {
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param callback {Function}
   * @returns {Slot}
   */
  add(callback){
    const slot = createSlot(callback, this)
    this._slots.push(slot)
    return slot
  },
  /**
   * Add listener to signal
   * @memberof Signal#
   * @param callback {Function}
   * @returns {Slot}
   */
  addOnce(callback){
    const slot = createSlot(r, this)
    function r(...values){
      callback(...values)
      slot.remove()
    }
    this._slots.push(slot)
    return slot
  },
  /**
   * Remove all signal listeners
   * @memberof Signal#
   * @returns {Signal}
   */
  clear(){
    this._slots.forEach(slot=>slot._signal = null)
    this._slots.splice(0, Number.MAX_SAFE_INTEGER)
    return this
  },
  /**
   * Dispatch the signal
   * @memberof Signal#
   * @param values {any[]}
   * @returns {Signal}
   */
  dispatch(...values){
    this._values.splice(0, Number.MAX_SAFE_INTEGER, ...values)
    this._slots.forEach(slot=>slot._callback(...values))
    return this
  }
}

/**
 * Factory method to create a signal
 * @param values {any[]}
 * @return {Signal}
 */
function createSignal(...values){
  const signalProperties = {
    /**
     * @memberof Signal#
     * @type {any}
     */
    _values: {
      writable: false,
      value: values
    },
    /**
     * @memberof Signal#
     * @type {Slot[]}
     */
    _slots: {
      writable: false,
      value: []
    }
  }
  const inst = Object.create(signalPrototype, signalProperties)
  return Object.defineProperties( ()=>{
    const {_values} = inst
    return _values.length===1?_values[0]:_values
  }, Object.keys({...signalPrototype, ...signalProperties}).reduce((acc, key)=>{
    acc[key] = { get: ()=>inst[key] }
    return acc
  }, {}))
}

/**
 * @typedef Slot {object}
 */
const slotPrototype = {
  /**
   * Remove signal listener
   * @memberof Slot#
   */
  remove(){
    const {_slots} = this._signal
    const slotIndex = _slots.indexOf(this)
    if (slotIndex!==-1) _slots.splice(slotIndex, 1)
  }
}

/**
 * Factory method to create a slot
 * @param callback {Function}
 * @return {Slot}
 */
function createSlot(callback, signal){
  return Object.create(slotPrototype, {
      /**
       * @memberof Slot#
       * @type {Function}
       */
      _callback: {
        writable: false,
        value: callback
      },
      /**
       * @memberof Slot#
       * @type {Signal}
       */
      _signal: {
        writable: true,
        value: signal
      }
    }
  )
}

// Usage

const somethingHappened = createSignal('tomorrow')
console.log('somethingHappened', somethingHappened, somethingHappened())

// Do something when something happens
const slotLog = somethingHappened.add(console.log)
somethingHappened.add(console.log.bind(console, 'Something happened'))
slotLog.remove()

// So when something really happens
somethingHappened.dispatch('yesterday', 'evening')
console.log('somethingHappened',somethingHappened())

//////////////////////////////////////////////////////////////////

const earned = createSignal(0)
const spent = createSignal(0)
const totals = createSignal(0)

earned.add(n=>totals.dispatch(totals()+n))
spent.add(n=>totals.dispatch(totals()-n))
totals.add(console.log.bind(console,'totals'))
totals.addOnce(console.log.bind(console,'totals only once'))

earned.dispatch(100) // :   0 + 100 = 100
      .dispatch(50)  // : 100 +  50 = 150
spent.dispatch(120)  // : 150 - 120 =  30
earned.dispatch(20)  // :  30 +  20 =  50
console.log('totals()',totals()) // : 50

console.log('reset',totals.dispatch(200)()) // : 200

earned.clear()
spent.clear().dispatch(5)

console.log('cleared',totals()) // : 200
```

This is still only 111 lines including JSDoc.


### So...

---

Actually, my first React implementation used signals alongside Redux, because I hate boilerplate.


$ observable/observer

finite state machine

