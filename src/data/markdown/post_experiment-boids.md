<!--
  id: 2555
  date: 2014-04-22T15:38:25
  modified: 2020-03-17
  slug: experiment-boids
  type: post
  categories: uncategorized
  tags: Perlin Noise, cool shit, experiment, particles
-->

# Experiment: boids
A bunch of fish forming schools by following simple rules. Everything you see is coded.

Boids is the name [Craig Reynolds](http://www.red3d.com/cwr/) came up with to describe [computational flocking behavior](http://www.red3d.com/cwr/boids/). The rules are simple but getting it up to speed requires some smart coding.

Two of the original rules are merged into one. The rules ‘move to the collective center’ and ‘prevent collision with others’ are replaced by ‘keep optimum distance’.

For speed optimisation there are two important techniques (or design patterns if you will).

### Object pooling

The first is object pooling. Extensive object creation can cause strain on your garbage collector when you simply discard them after use. Object pooling counters this by saving the discarded objects and recycling them when new objects are created. There are numerous implementations [to be found online](https://www.google.com/search?q=object+pooling+javascript) but a lot of them are overcomplicated. The one I used is as simple as possible and looks [like this](https://gist.github.com/Sjeiti/6422815#file-objectpool-js) (some added sugar to show where the actual logic might go). The only external interface is the drop method, everything else is handled internally.

### Grid system

The second technique is a particle grid system. To let the fish interact they must know their mutual distance. But it wouldn’t interact with all the fish in the sea so it would be overkill to calculate all these distances. Instead the ‘sea’ is divided into a grid, where the grid size corresponds to the maximum distance for interaction. Before we do anything we sort all the fish into the grid-array. The only fish that we are concerned with now are those of the neighboring grid cells.