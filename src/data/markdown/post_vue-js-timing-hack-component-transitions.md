<!--
  id: 3319
  date: 2017-01-28T07:58:10
  modified: 2017-01-31T16:02:26
  slug: vue-js-timing-hack-component-transitions
  type: post
  excerpt: <p>Here&#8217;s a small hack for Vue transitions on child elements. Vue transitions are easy as pie: in your HTML element you set the v-transition directive to the name of your transition. And in your CSS you write selectors like .[transitionName]-[enter|leave][-active]. And that&#8217;s it. It feels like magic but it&#8217;s actually quite simple. Vue searches your [&hellip;]</p>
  categories: code, CSS, JavaScript
  tags: CSS, Vue, transition
  metaKeyword: transition
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# A Vue.js timing hack in component transitions

<p>Here&#8217;s a small hack for Vue transitions on child elements.</p>
<p>Vue transitions are easy as pie: in your HTML element you set the v-transition directive to the name of your transition. And in your CSS you write selectors like <code>.[transitionName]-[enter|leave][-active]</code>. And that&#8217;s it.</p>
<p>It feels like magic but it&#8217;s actually quite simple.<br />
Vue searches your CSS for the selector <code>.[transitionName]-[enter|leave]</code>. From these selectors it will read the values of <code>transition-time</code> and <code>transition-delay</code>.<br />
Vue now knows how long your transition will last. When the transition occurs it will add the classname <code>.[transitionName]-[enter|leave]</code>. On the n<br />
next frame this classname is removed and the classname <code>.[transitionName]-[enter|leave]-active</code> is added. After the transition duration this last one is removed and our transition is done.</p>
<p>There&#8217;s just one problem. Vue only reads the main classname. So if you are also animating the div in <code>.foo-enter div</code> it has to be within the duration specified in <code>.foo-enter</code>.</p>
<p>To fix that you can apply a small hack. Simply add a transition to a property that doesn&#8217;t change with the desired time.<br />
For instance:</p>
<pre><code>
.foo-enter {
  transition: left 1000ms ease, cursor 2000ms linear;
}
.foo-enter div {
  transition: opacity 1000ms linear 1000ms;
}
</code></pre>
<p>That transition on cursor ensures Vue knows the transition lasts 2000ms. We&#8217;re not really animating cursor. So now the div can fade after the main transition has completed.</p>
<p>Here&#8217;s <a href="https://jsfiddle.net/Sjeiti/sqyoxs8d/">a fiddle</a>.</p>