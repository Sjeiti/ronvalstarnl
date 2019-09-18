<!--
  id: 305
  date: 2007-10-04T00:06:33
  modified: 2012-07-25T21:45:50
  slug: perlin-noise-in-as3
  type: post
  excerpt: <p>When I started doing processing I fell in love with the Perlin noise function. A little while later Flash 8 came out including noise. But I was a bit disappointed in their noise implementation, since it was only (and still is) a BitmapData function (without falloff). Perlin noise can be used for much than just [&hellip;]</p>
  categories: Flash, Actionscript
  tags: APE, Mario Klingemann
  metaKeyword: perlin noise
  metaTitle: Perlin noise in as3
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Perlin noise in as3

<p>When I started doing <a href="http://processing.org/">processing</a> I fell in love with the Perlin noise function. A little while later Flash 8 came out including noise. But I was a bit disappointed in their noise implementation, since it was only (and still is) a <a href="http://livedocs.adobe.com/flash/9.0/ActionScriptLangRefV3/flash/display/BitmapData.html#noise()">BitmapData function</a> (without falloff). Perlin noise can be used for much than just bitmaps. Of course you could just getpixel the generated noise data but that only gives you integer noise values.<br />
So I did what I always wanted to do but never did (because I thought it would be too difficult): wrote a Perlin noise class. Actually I just ported the main part from <a href="http://mrl.nyu.edu/~perlin/noise/">Ken Perlin&#8217;s improved noise</a>. But I still had to implement octaves, falloff and seed. The function now looks like Perlin.noise(x:Number,y:Number,z:Number):Number. I&#8217;d also like to insert a fourth dimension in there. So we would have three spacial- and one time dimension.</p>
<p>Flash does calculate it&#8217;s noise about a hundred times faster than this class does. So if you&#8217;re ok with integer input values for noise you might be better off getpixeling the noise data than using this class. But I don&#8217;t claim to be the god of code either; there is probably a lot that could be done to optimize this class. So if you have any suggestions please comment.</p>
<p>In the next example the bitmaps are created with the new noise function and setpixel. I&#8217;ve set the octaves horizontally and the falloff vertically. The first row has the same falloff as the second but a different seed for each bitmap. The x and y positions of the little ball are also controlled by Perlin noise with an octave of two and a falloff of one half. <a href="javascript:Sjeiti.showCode('wp-content/uploads/swf/perlinnoise.swf',400,400,'perlinnoise')">Click to view example</a><br />
Here&#8217;s <a href="/wordpress/wp-content/uploads/perlinnoise.zip">the download</a> containing the above example. Things should become clear from the source code. If you still have any questions feel free to comment.<br />
<a href="javascript:Sjeiti.showCode('wp-content/uploads/swf/flowfield.swf',400,400,'perlinnoise')">Here&#8217;s another example</a> with multiple balls. Each cycle the balls gravity is calculated by feeding it&#8217;s position into the noise function. The collision in this example is managed by <a href="http://www.cove.org/ape/">APE</a></p>
<p>-update-<br />
There was a slight error in the falloff calculation. I&#8217;ve updated the download (version 1.2).</p>
<p>-another update-<br />
<a href="http://www.quasimondo.com/archives/000672.php">Mario Klingemann</a> made some optimizations. The class is now almost twice as fast! I haven&#8217;t had time to update my downloads yet so in the meantime <a href="http://www.quasimondo.com/archives/000672.php">get the optimized version here</a></p>