<!--
  slug: randomness-in-generative-code
  date: 9999-04-30
  modified: 9999-04-30
  type: post
  header: adi-goldstein-Hli3R6LKibo-unsplash.jpg
  category: code
  tag: code
-->

# Randomness in generative code

Recently I wrote an [experiment](/search/experiment) with a single background on a single element using [radial gradients](/experiment/radialgradients). This resulted in a seedable image set in motion by simplex noise.

This made me think of a merge request I made a week back that puzzled my co-worker because it had an linear congruential generator in it. My work isn't usually this exiting but I was adding a skeleton loader to a table component. This has to be random, but seedable, hence the LCG.

## Wait wut?!

Okay, I'll take a few steps back, starting with 'seedable'.

As you may know computers are great at computing. Give it a problem and it will always calculate the same result. Which is fine mostly, but a problem when you do not want the same result. It turns out computers are really bad at random.

Luckily our human pattern matching capabilities fail with large enough numbers. Computers don't mind large numbers. So we came up with something called a pseudo random number generator, or PRNG.
This is a function that turns any number into a seemingly unrelated different number. It seems random, but it will always give the same result for a given input. So pseudo random.
And this input number is what is called 'the seed'.

What makes this very useful is that random seeds allow us to create something that looks chaotic but is in fact very predictable.
You might have used seeds in games or seen it in genrative art. Minecraft has world seeds for instance. The planets in No Mans Sky or Star Citizen are generated this way as well.

# So how does this work?

Terrain generation is a step further where you interpolate random numbers and stack different distributions, a technique called Perlin noise.

So let's start with the random number generator. The linear congruential generator looks like this:

```
seed = ( seed * multiplier + increment ) % modulus
```

This uses just three constant variables. Basically you multiply your seed, add something and check the remainder should you divide by another number (% is the modulo operator).
This is a very simple operation even my ten year old son could do by hand.
Note that the outcome of the operation is often used as the seed input for the next.

For most values of the constants this will produce very regular results.


