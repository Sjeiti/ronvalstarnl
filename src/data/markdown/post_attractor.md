<!--
  date: 2007-01-07
  modified: 2020-06-18
  slug: attractor
  type: post
-->

# attractor viewer

This [attractor Viewer](http://test.sjeiti.com/attractors4/) was made with [Processing](http://www.processing.org/).  
The attractor viewer can be used to make movies like these: a [a Lorenz](http://www.youtube.com/user/sjeiti#p/u/12/DuIVQRvriI8), [a Lorenz 84](http://www.youtube.com/user/sjeiti#p/u/8/a82FJjQPs2Q) and the other of a [de Jong attractor](http://www.youtube.com/user/sjeiti#p/u/13/BCblQTvaWY8).  
I’ve also put up some nice wallpaper sized images on [Flickr](http://www.flickr.com/photos/sjeiti/sets/72157603957488195/).

An [attractor](http://en.wikipedia.org/wiki/Strange_attractor) is a set of rules upon a number of variables (dimensions) that, after time, can either converge to a point, diverge to

infinity or follow some strange trajectory. An attractor is deterministic, meaning that it’s state at a certain point in time can only be calculated by iterating toward that point in time.

There is a nice anecdote about this. The University of Stockholm (Sweden) held a contest. He who finds a way to predetermine the position of three planets in any given point in time (the three body problem) would win 2500 crones and a gold medal.  
In January, 1889, the entry that was declared the winner was that of the French mathematician [Jules Henri Poincaré](http://en.wikipedia.org/wiki/Henri_Poincaré). He was invited to Sweden to collect his prize.  
But shortly after (in the middle of the printing for the first publication) Poincarï¿½ found an error in his calculations. The three body problem was unsolvable after all.

This also shows how something seemingly simple as a planet and two moons can actually be a chaotic system.  
Simplicity is also one of the beautifull properties of strange attractors. For example the [Lorenz](http://en.wikipedia.org/wiki/Lorenz) attractor is this:

```
xx = x + e*( (-a*x*d) + (a*y*d) )  
yy = y + e*( ( b*x*d) – (y*d) – (z*x*d) )  
zz = z + e*( (-c*z*d) + (x*y*d) )
```

resulting in this:

![lorenz](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/lorenz.jpg)
