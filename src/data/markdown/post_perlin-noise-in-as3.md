<!--
  date: 2007-10-04
  modified: 2020-06-01
  slug: perlin-noise-in-as3
  type: post
  categories: Flash, ActionScript
  tags: APE, Mario Klingemann
-->

# Perlin noise in as3

When I started doing [processing](http://processing.org/) I fell in love with the Perlin noise function. A little while later Flash 8 came out including noise. But I was a bit disappointed in their noise implementation, since it was only (and still is) a [BitmapData function](http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/flash/display/BitmapData.html#noise()) (without falloff). Perlin noise can be used for much than just bitmaps. Of course you could just getpixel the generated noise data but that only gives you integer noise values.  
So I did what I always wanted to do but never did (because I thought it would be too difficult): wrote a Perlin noise class. Actually I just ported the main part from [Ken Perlin’s improved noise](http://mrl.nyu.edu/~perlin/noise/). But I still had to implement octaves, falloff and seed. The function now looks like Perlin.noise(x:Number,y:Number,z:Number):Number. I’d also like to insert a fourth dimension in there. So we would have three spacial- and one time dimension.

Flash does calculate it’s noise about a hundred times faster than this class does. So if you’re ok with integer input values for noise you might be better off getpixeling the noise data than using this class. But I don’t claim to be the god of code either; there is probably a lot that could be done to optimize this class. So if you have any suggestions please comment.

In the next example the bitmaps are created with the new noise function and setpixel. I’ve set the octaves horizontally and the falloff vertically. The first row has the same falloff as the second but a different seed for each bitmap. The x and y positions of the little ball are also controlled by Perlin noise with an octave of two and a falloff of one half. <del>Click to view example</del> 
Here’s [the download](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/perlinnoise.zip) containing the above example. Things should become clear from the source code. If you still have any questions feel free to comment.  
<del>Here’s another example</del> with multiple balls. Each cycle the balls gravity is calculated by feeding it’s position into the noise function. The collision in this example is managed by <del data-href="http://www.cove.org/ape/">APE</del>

-update-  
There was a slight error in the falloff calculation. I’ve updated the download (version 1.2).

-another update-  
[Mario Klingemann](http://www.quasimondo.com/archives/000672.php) made some optimizations. The class is now almost twice as fast! I haven’t had time to update my downloads yet so in the meantime [get the optimized version here](http://www.quasimondo.com/archives/000672.php)
