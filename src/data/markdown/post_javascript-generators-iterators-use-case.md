<!--
  id: 3418
  date: 2018-04-25T19:36:08
  modified: 2018-04-25T19:36:08
  slug: javascript-generators-iterators-use-case
  type: post
  excerpt: <p>I’ve known about Javascript generators and iterators for some years but I’ve always ignored them. Partly because it was something new, something you can easily do without, and partly because I never really encountered a clear real life use case. speed optimizations A while back I was working on speed optimizations for a large, somewhat [&hellip;]</p>
  categories: code, Javascript, skills
  tags: 
  metaKeyword: generators
  metaDescription: I’ve always ignored Javascript generators and iterators partly because I never really encountered a clear real life use case.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# A use case for Javascript generators

<p>I’ve known about Javascript <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators">generators and iterators</a> for some years but I’ve always ignored them. Partly because it was something new, something you can easily do without, and partly because I never really encountered a clear real life use case.</p>
<h2>speed optimizations</h2>
<p>A while back I was working on speed optimizations for a large, somewhat complex form. This came in the form of a list that would usually hold about two hundred rows. But we had edge cases with an excess of three thousand rows. Which would cause the browser to just curl up in a corner and die.</p>
<p>So we made several back- and frontend changes and upped the speed to around thirty thousand rows.<br />
One of the things we did was divide the rows into blocks with each block containing enough rows to fill a viewport. Then <code>display:none</code> all the blocks outside the viewport.<br />
While scrolling the blocks are turned on and off depending on viewport visibility. So a maximum of two blocks visible at one time.</p>
<p>It can easily be determined whether an element is visible. So we run through an array with blocks until we find the two elements in view, or until we reach the end of the array. A lot of times there will be only one block in view.</p>
<p>This is really inefficient.<br />
Not only is viewport measurement somewhat costly, half the time the entire array wil be traversed only to come to the conclusion that there is just one block in view.<br />
For sixty thousand lines and ten lines per block this amounts to six thousand viewport measurements each time the scroll-event is fired. The scroll-event is debounced of course but that is still a lot of useless calculations.</p>
<h2>to illustrate</h2>
<p>To make things more efficient we can correlate the scroll position to the index of the block in the array. We can’t be completely certain because there could be some difference in the height of some blocks. But we do know now where to start counting from.<br />
Here is an illustration:</p>
<p><img src="http://ronvalstar.nl/wordpress/wp-content/uploads/untitled-2.svg" alt="counting using generators" class="alignnone size-full wp-image-3420" /></p>
<p>Lets say the total height is <code>4800px</code>, the viewport height is <code>700px</code> and the current scrollTop is <code>3160px</code>. That means the scrollbar is currently at <code>3160 / (4800-700) = 0.77…</code> (or 77%). The array for the above example contains eight blocks so we’ll need to start counting at index <code>0.77*8 = 6</code>.<br />
We’ll then go back and forth checking the closest blocks. So our original array <code>[0,1,2,3,4,5,6,7]</code> starting from the sixth index <code>5</code> would become <code>[5,6,4,7,3,2,1,0]</code><br />
Traverse that array until the first two visible blocks are found -or- until the first found index plus two has been reached (because the visible blocks are always adjacent).</p>
<p>I knew immediately that this was a clear cut case for a generator: why re-order the entire array when I only need the first two entries (if I’m lucky).<br />
But I never used generators and I had a deadline and it was monday so I simply wrote a method that orders an array into the traversable one.</p>
<h2 id="its-so-easy">generators are easy</h2>
<p>Actually, using generators is really very easy. All you have to do is append an asterisk to the function keyword and use <code>yield</code> somewhere in there.</p>
<pre><code>function* countBackwards(from) {
  while(true) yield from--
}
</code></pre>
<p>That <code>while</code> might look like a stackoverflow but it really is not since this is where the <code>yield</code> resides.<br />
Next instantiate the method by calling it as you would any other method and call the next iteration when needed:</p>
<pre><code>const count = countBackwards(99)
console.log(count.next().value) // 99
console.log(count.next().value) // 98
console.log(count.next().value) // 97
// etcetera
</code></pre>
<h2 id="refactoring">refactoring</h2>
<p>Later when I had time to spare and was cleaning code I saw the todo <code>// todo turn into generator</code> and turned it into a generator.</p>
<p>Which was good because I now also had a different method to test it’s performance against.<br />
And lo and behold: the generator was indeed faster but only for the first few iterations. If the entire array is re-ordered, the generator is slower.</p>
<h2 id="code">code</h2>
<p>Here is the generator:</p>
<pre><code>function* reorderFromGenerator(arr, from) {  
  let index = 0  
  const len = arr.length  
  const max = 2*Math.min(from, len-from-1) + 1  
  const high = from&gt;len/2  
  while(true) {  
    let arrayIndex = 0  
    if (index&gt;=max){  
      arrayIndex = high?len-index-1:index  
    } else {  
      const vibrate = Math.round(index/2)*(index%2?1:-1)  
      arrayIndex = from + vibrate  
    }  
    yield arr[arrayIndex]  
    index++  
  }  
}  
</code></pre>
<p>Here the remap that uses the generator (the slowest method):</p>
<pre><code>function reorderByGenerator(arr, from) {  
    const gen = reorderFromGenerator(arr, from)  
    return arr.map(()=&gt;gen.next().value)  
}  
</code></pre>
<p>And here the same functionality without generator: by slicing and pushing to a new array:</p>
<pre><code>function reorderFrom(arr, from) {  
    const a1 = arr.slice(0, from).reverse()  
    const a2 = arr.slice(from);  
    const reordered = []  
    for (let i = 0, l = Math.max(a1.length, a2.length); i &lt; l; i++) {  
        const v2 = a2[i]  
        v2 !== undefined &amp;&amp; reordered.push(v2)  
        const v1 = a1[i]  
        v1 !== undefined &amp;&amp; reordered.push(v1)  
    }  
    return reordered  
}
</code></pre>