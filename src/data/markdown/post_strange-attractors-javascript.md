<!--
  id: 2995
  date: 2016-04-13
  modified: 2019-09-27
  slug: strange-attractors-javascript
  header: L84.jpg
  type: post
  categories: code, JavaScript, video, open source
  tags: math, strange attractors, chaos
  metaKeyword: Strange attractors
  metaDescription: Strange attractors prove how easily chaos can emerge within a simple system. This attractor viewer is a JavaScript rewrite to front-end JavaScript.
-->

# Strange attractors in JavaScript

Strange attractors show how easily chaos can emerge within a simple system. This concept has always fascinated me because it puts terms like chance and predetermination in a different light. And it also produces pretty cool images.

Over ten years ago I got into [Processing](https://processing.org/). One of the last projects I made was a [strange attractor renderer](/projects/strange-attractors) built in Eclipse (but still using the P55 core).  
Back then Java applets were still the only way to get raw computing power to the client-side of the web. A strange attractor is not complicated, but because it is deterministic it needs a few billion iterations for a proper result. I tested ActionScript, JavaScript and Java and naturally the latter was way faster (and still is).  
September last year [Chrome dropped support](https://java.com/en/download/faq/chrome.xml) for Java applets. Since JavaScript has come a long way I thought I’d try a remake in Nodejs. I compared a rough to a client-side implementation and found the speed difference negligible enough to bring the entire implementation to client-side JavaScript.  
Contrary to the old Java applet this JavaScript version can burp out animated gifs and webm videos (for low memory animations). The old app could only do that when running on local machine (with [cool results](https://www.youtube.com/watch?v=a82FJjQPs2Q&list=PLHBT3Ooxdwag6dHJOZ0mlqOgz9gAfnXDG) nonetheless).  
What really surprised me is that it even works on my old mobile phone (a Samsung S2).

Here are some of the first animated gifs from the new application:

![attractorDeJong](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/attractorDeJong.gif) ![attractorLorenz84_1](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/attractorLorenz84_1.gif) ![attractor](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/attractor.gif) ![attractorLorenz](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/attractorLorenz.gif)

One of the techniques I used that was already in the old version is scattering each iteration into multiple pixels. When you

[search online for attractor images](https://www.google.nl/search?espv=2&biw=1598&bih=815&tbm=isch&q=strange+attractor+3d&revid=709138112&sa=X&ved=0ahUKEwic97y6oJDLAhVIJw4KHZW9B-0Q1QIIHA&dpr=1#tbm=isch&q=strange+attractor) you’ll notice a lot of them will have jagged edges. This is because a point acquired from an iteration is directly translated to a pixel. But an iterated point is never an integer (a pixel is). So a smooth result is reached much faster when the point is scattered over four pixels.  
The same goes for secondary data like iteration distance and Lyapunov exponent which can be used for colouring. Although these two are a bit different because the values are not cumulative but an average. The trick is to use the same scattering and when all iterations are complete divide it by the result of the iteration points.  
A trickier problem is the distance of the nearest point to the camera. It’s trickier because the value is neither cumulative nor averaged. Pixel scattering cannot be applied because a closest distance simply cannot be distributed over four pixels and still hold a meaningful value.

I’ll probably be adding a few more features and speed/memory improvements. For now [enjoy](http://attractors.ronvalstar.nl).

-update-

By default my projects go onto [xp-dev](https://xp-dev.com/). Which I once choose because they support Subversion (which I was still using in 2008), Git, Mercurial and Trac. Lately somebody asked me to see the sources and although xp-dev can do open-source thougth it might be easier to move it to Github (which is [really easy](https://gist.github.com/manakor/8972566#gistcomment-1639106) btw).

Now I know this code is hardly of any use to anyone but it does have nice build tasks. And it does have a nice growing list of attractor source code.