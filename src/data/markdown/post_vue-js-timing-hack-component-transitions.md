<!--
  id: 3319
  date: 2017-01-28
  modified: 2019-09-27
  slug: vue-js-timing-hack-component-transitions
  type: post
  header: studio04.jpg
  categories: code, CSS, JavaScript
  tags: CSS, Vue, transition
  metaKeyword: transition
-->

# A Vue.js timing hack in component transitions

Here’s a small hack for Vue transitions on child elements.

Vue transitions are easy as pie: in your HTML element you set the v-transition directive to the name of your transition. And in your CSS you write selectors like `.[transitionName]-[enter|leave][-active]`. And that’s it.

It feels like magic but it’s actually quite simple.  
Vue searches your CSS for the selector `.[transitionName]-[enter|leave]`. From these selectors it will read the values of `transition-time` and `transition-delay`.  
Vue now knows how long your transition will last. When the transition occurs it will add the classname `.[transitionName]-[enter|leave]`. On the n  
next frame this classname is removed and the classname `.[transitionName]-[enter|leave]-active` is added. After the transition duration this last one is removed and our transition is done.

There’s just one problem. Vue only reads the main classname. So if you are also animating the div in `.foo-enter div` it has to be within the duration specified in `.foo-enter`.

To fix that you can apply a small hack. Simply add a transition to a property that doesn’t change with the desired time.  
For instance:

    .foo-enter {
      transition: left 1000ms ease, cursor 2000ms linear;
    }
    .foo-enter div {
      transition: opacity 1000ms linear 1000ms;
    }

That transition on cursor ensures Vue knows the transition lasts 2000ms. We’re not really animating cursor. So now the div can fade after the main transition has completed.

Here’s [a fiddle](https://jsfiddle.net/Sjeiti/sqyoxs8d/).