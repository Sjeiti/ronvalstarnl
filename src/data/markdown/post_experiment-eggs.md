<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: experiment-eggs
  type: post
  categories: code, JavaScript
  tags: cool shit
  thumbnail: experiments/eggs_screenshot_2025-04-11_212339_cpmdsn.jpg
  description: Single element eggs
  related: experiment-*
-->

# Experiment: eggs

Here is another single element CSS doodle I cooked up (well, fried really).
The highlighting is done in a similar way as in [the ladybugs example](/experiment-ladybugs) and [the pinkcheese example](/experiment-pinkcheese).

If you just want the source; [look below](#sourcecode).


## Arrangement

For CSS gradients and box-shadow trigonometry explanations, check those other examples. This time I just want to tell you something about the placement of the eggs.

Initially I had them in rows with alternating offsets to form a triangular grid. Nice, but very regular.

So why not place them spiralling outwards with a **golden angle**, which is 137.5 degrees. This gives each point a more-or-less even distance without any horizontal and vertical regularity. Especially with a square root distance.   


## 137.5

[The golden mean](https://en.m.wikipedia.org/wiki/Golden_ratio) describes the optimal ratio between larger and smaller objects as `φ = (1 + √5) / 2 ≈ 1.618...`. Translated to a circle using the inverse square you get 137.5°.


## Number sequence

This ratio might seem like far fetched theoretical mathematics. But it is everywhere around you. It is abundant in nature. But it is even hidden in the most basic number sequence [named after Fibonacci](https://en.m.wikipedia.org/wiki/Fibonacci_sequence).

All the Fibonaci sequence does is add numbers, starting with 0 and 1. Then add the outcome with the last number, etc:

```
0+1=1
  1+1=2
    1+2=3
      2+3=5
        3+5=8
          5+8=13
```

Resulting in the sequence

```
0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 597 ... 
```

The bizarre thing is the relation between each consequtive number in this sequence that converges to the golden ratio.

We can easily calculate this in JavaScript with a simple for-loop:

```
const a = []
for (let i=0;i<45;i++){
  a[i] = i<=1?i:a[i-1]+a[i-2]
}

console.log('The Fibonacci sequence: '+a.join(' '))
console.log('The golden ratio:',a.map((n,i,a)=>n/a[i-1]).pop())
console.log('The golden angle:',a.map((n,i,a)=>a[i-2]*360/n).pop())

// The Fibonacci sequence: 0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765 10946 17711 28657 46368 75025 121393 196418 317811 514229 832040 1346269 2178309 3524578 5702887 9227465 14930352 24157817 39088169 63245986 102334155 165580141 267914296 433494437 701408733
// The golden ratio: 1.618033988749895
// The golden angle: 137.50776405003785
```

The angle gives us the following radial structure:

![radial structure](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1744926739/rv/Screenshot_20250417-234441_Edited.jpg)

But it can also be used in non-radial structures. Like ordering these icons on [totaltimeline](https://totaltimeline.org/-793.97Ma/2025) that had to be dispersed evenly, without cluttering.

![totaltimeline icons](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1744928215/rv/Screenshot_20250417-235608_Edited.jpg?f)


## Easy to remember

Unless you are positioning thousands of elements you don't even have to be *that* accurate. For a few hundred elements all you need to remember is 137.5 degrees, or 2.4 radians. Or simply ~~Google~~ use a good search engine to search for [golden angle](https://kagi.com/search?q=golden+angle).


## Sourcecode

<pre><code data-language="html" data-src="/static/html/eggs.html"></code></pre>


