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

I’ve known about Javascript [generators and iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) for some years but I’ve always ignored them. Partly because it was something new, something you can easily do without, and partly because I never really encountered a clear real life use case.

## speed optimizations

A while back I was working on speed optimizations for a large, somewhat complex form. This came in the form of a list that would usually hold about two hundred rows. But we had edge cases with an excess of three thousand rows. Which would cause the browser to just curl up in a corner and die.

So we made several back- and frontend changes and upped the speed to around thirty thousand rows.  
One of the things we did was divide the rows into blocks with each block containing enough rows to fill a viewport. Then `display:none` all the blocks outside the viewport.  
While scrolling the blocks are turned on and off depending on viewport visibility. So a maximum of two blocks visible at one time.

It can easily be determined whether an element is visible. So we run through an array with blocks until we find the two elements in view, or until we reach the end of the array. A lot of times there will be only one block in view.

This is really inefficient.  
Not only is viewport measurement somewhat costly, half the time the entire array wil be traversed only to come to the conclusion that there is just one block in view.  
For sixty thousand lines and ten lines per block this amounts to six thousand viewport measurements each time the scroll-event is fired. The scroll-event is debounced of course but that is still a lot of useless calculations.

## to illustrate

To make things more efficient we can correlate the scroll position to the index of the block in the array. We can’t be completely certain because there could be some difference in the height of some blocks. But we do know now where to start counting from.  
Here is an illustration:

![counting using generators](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/untitled-2.svg)

Lets say the total height is `4800px`, the viewport height is `700px` and the current scrollTop is `3160px`. That means the scrollbar is currently at `3160 / (4800-700) = 0.77…` (or 77%). The array for the above example contains eight blocks so we’ll need to start counting at index `0.77*8 = 6`.  
We’ll then go back and forth checking the closest blocks. So our original array `[0,1,2,3,4,5,6,7]` starting from the sixth index `5` would become `[5,6,4,7,3,2,1,0]`  
Traverse that array until the first two visible blocks are found -or- until the first found index plus two has been reached (because the visible blocks are always adjacent).

I knew immediately that this was a clear cut case for a generator: why re-order the entire array when I only need the first two entries (if I’m lucky).  
But I never used generators and I had a deadline and it was monday so I simply wrote a method that orders an array into the traversable one.

## generators are easy

Actually, using generators is really very easy. All you have to do is append an asterisk to the function keyword and use `yield` somewhere in there.

    function* countBackwards(from) {
      while(true) yield from--
    }

That `while` might look like a stackoverflow but it really is not since this is where the `yield` resides.  
Next instantiate the method by calling it as you would any other method and call the next iteration when needed:

    const count = countBackwards(99)
    console.log(count.next().value) // 99
    console.log(count.next().value) // 98
    console.log(count.next().value) // 97
    // etcetera

## refactoring

Later when I had time to spare and was cleaning code I saw the todo `// todo turn into generator` and turned it into a generator.

Which was good because I now also had a different method to test it’s performance against.  
And lo and behold: the generator was indeed faster but only for the first few iterations. If the entire array is re-ordered, the generator is slower.

## code

Here is the generator:

    function* reorderFromGenerator(arr, from) {  
      let index = 0  
      const len = arr.length  
      const max = 2*Math.min(from, len-from-1) + 1  
      const high = from>len/2  
      while(true) {  
        let arrayIndex = 0  
        if (index>=max){  
          arrayIndex = high?len-index-1:index  
        } else {  
          const vibrate = Math.round(index/2)*(index%2?1:-1)  
          arrayIndex = from + vibrate  
        }  
        yield arr[arrayIndex]  
        index++  
      }  
    }  

Here the remap that uses the generator (the slowest method):

    function reorderByGenerator(arr, from) {  
        const gen = reorderFromGenerator(arr, from)  
        return arr.map(()=>gen.next().value)  
    }  

And here the same functionality without generator: by slicing and pushing to a new array:

    function reorderFrom(arr, from) {  
        const a1 = arr.slice(0, from).reverse()  
        const a2 = arr.slice(from);  
        const reordered = []  
        for (let i = 0, l = Math.max(a1.length, a2.length); i < l; i++) {  
            const v2 = a2[i]  
            v2 !== undefined && reordered.push(v2)  
            const v1 = a1[i]  
            v1 !== undefined && reordered.push(v1)  
        }  
        return reordered  
    }