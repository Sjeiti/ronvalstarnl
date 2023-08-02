<!--
  date: 2010-05-10
  modified: 2015-12-24
  slug: perlin-noise-in-javascript-comparisons
  type: post
  categories: code, HTML, JavaScript
  tags: John Resig, Mario Klingemann, Stefan Gustavson, test
  description: After a bit of playing I decided to make a good Perlin noise generator in JavaScript. First I did a quick port from my ActionScript class to JavaScript.
-->

# Perlin noise in JavaScript comparisons

<style type="text/css">
	ul#noises {
		margin: 0px;
		padding: 0px;
		list-style: none;
	}
		ul#noises li {
			width: 160px;
			float: left;
			overflow: hidden;
		}
			ul#noises li * {
				font-size: 12px;
			}
	.clear {
		clear: both;
	}
	img.left {
		float: left;
		margin: 0px 10px 0px 0px;
	}
</style>
<p>What started as a simple excersize to put <a href="http://books.google.com/books?id=PXa2bby0oQ0C&#038;printsec=frontcover&#038;source=gbs_slider_thumb#v=onepage&#038;q&#038;f=false">theory</a> to practice has once again spun out of control. Well I&#8217;ve just come off three months of programming ActionScript 3 so I needed the distraction (frankly I like js better than as). Plus I never really got into the HTML5 canvas thing and I needed to check that out to. And off course those idiots Apple and Adobe (turning into a bad marriage) are making me feel I should focus on HTML5/js a bit more (doesn&#8217;t anybody realize HTML5 isn&#8217;t even ready yet?).</p>
<p><!--more--></p>
<p>After a bit of playing I decided to make a good Perlin noise generator in JavaScript. First I did a quick port from my ActionScript class to JavaScript. But because others had probably preceded me I roamed the web for other implementations. I had to mangle them a bit to get them to work but here they are.</p>
<ul id="noises">
<li>
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-sjeiti.jpg" alt="Perlin sjeiti" /></p>
<div>
<h4>sjeiti</h4>
<p>url: <a href="/?p=305&amp;PORTED2JS" target="_blank">sjeiti</a><br />authors: <a href="/" target="_blank">Ron Valstar</a> and <a href="http://www.quasimondo.com/" target="_blank">Mario Klingeman</a><br />speed: <strong>60 ms</strong></div>
</li>
<li>
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-lonelypinkelephants.jpg" alt="Perlin lonelypinkelephants" /></p>
<div>
<h4>lonelypinkelephants</h4>
<p>url: <a href="view-source:https://web.archive.org/web/20100310133600/http://lonelypinkelephants.com/random/perlin.html" data-old-href="http://lonelypinkelephants.com/random/perlin.html" target="_blank">lonelypinkelephants</a><br />author: <a href="/" target="_blank">Jason LaPorte</a><br />speed: <strong>10 ms</strong></div>
</li>
<li>
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-bankseanClassical.jpg" alt="Perlin bankseanClassical" /></p>
<div>
<h4>bankseanClassical:</h4>
<p>url: <a href="http://gist.github.com/304522" target="_blank">bankseanClassical:</a><br />author: <a href="http://www.dashdashverbose.com/" target="_blank">Sean McCullough</a><br />speed: <strong>33 ms</strong></div>
</li>
<li style="clear:both;">
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-bankseanSimplex.jpg" alt="Perlin bankseanSimplex" /></p>
<div>
<h4>bankseanSimplex:</h4>
<p>url: <a href="http://gist.github.com/304522" target="_blank">bankseanSimplex:</a><br />authors: <a href="http://www.dashdashverbose.com/" target="_blank">Sean McCullough</a> and <a href="http://staffwww.itn.liu.se/~stegu/" target="_blank">Stefan Gustavson</a><br />speed: <strong>22 ms</strong></div>
</li>
<li>
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-slimeland.jpg" alt="Perlin slimeland" /></p>
<div>
<h4>slimeland:</h4>
<p>url: <a href="http://www.slimeland.com/raytrace/help.html" target="_blank">slimeland:</a><br />author: <a href="http://www.slimeland.com/" target="_blank">Slime</a><br />speed: <strong>34 ms</strong></div>
</li>
<li>
		<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-processingJs.jpg" alt="Perlin processingJs" /></p>
<div>
<h4>processingJs:</h4>
<p>url: <a href="http://processingjs.org/" target="_blank">processingJs:</a><br />author: <a href="http://ejohn.org" target="_blank">John Resig</a><br />speed: <strong>270 ms</strong></div>
</li>
</ul>
<p><br class="clear" /></p>
<p>The first thing you&#8217;ll probably notice that these Perlin noises are all only one octave. Because the banksean and slimeland versions did not implement more octaves I set the others to one octave as well (plus my own quick port had weird artifacts dealing with multiple octaves). I also put in a pseudo random number generator into the ones that used Math.random (we do want to seed it).</p>
<p>I&#8217;m a bit disapointed by the one from the one by processingJs. Granted: I did have to hack it a bit to get it to work and from the looks of the comments it&#8217;s not fully implemented yet. But it&#8217;s still very slow and looks a bit squared.</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-lonelypinkelephantsX.jpg" alt="Perlin lonelypinkelephants 6 octaves" class="left" /></p>
<p>But the curious one is lonelypinkelephants: 10 milliseconds! It&#8217;s even worse that that: running for six octaves it is only three milliseconds slower (see image to the left). And only 50 lines of code! What the fuck dude?! Well, actually it&#8217;s a very smart cheat. Where others calculate and store random numbers and then interpolate between these before drawing, the lonelypinkelephants version simply makes a dummy canvas, draws the random numbers and resizes the result onto the final canvas. Letting the interpolation occur somewhere in the native drawImage method. Come to think of it, this may be exactly the reason why Flash&#8217;s native Perlin noise function is so much faster than the <a href="/?p=305">as3 class</a>.
</p>
<p>Unfortunately the lonelypinkelephants version is quite useless for a number of reasons. The first being that the drawImage method is implemented differtly in different browsers. I test all my stuff in Chrome, but I ran the test through Safari just now and the lonelypinkelephants noise looks really different! Secondly, I really want to be able to use x and y offset which is kind of tricky to implement in it&#8217;s current form. Lastly we do want that extra dimension (which was exactly the reason I did that Java to as3 port some years ago).</p>
<p>I think I&#8217;ll fork the bankseanSimplex version with some octaves and falloff to see if its much faster and prettier than my own quick port. I&#8217;ll keep you posted.</p>
<p>To run the tests yourself <a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-perlincomparison.rar">download code here</a> (and sorry for the mess).</p>
<p>&#8212; small update &#8212;</p>
<p>On the other hand&#8230; well see for yourself&#8230; I did the test in four browsers:</p>
<ul style="list-style:none;margin-left:0px;padding-left:0px;">
<li>
<h4>Chrome</h4>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-chrome.jpg" width="100%" /></li>
<li>
<h4>Firefox</h4>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-firefox.jpg" width="100%" /></li>
<li>
<h4>Safari</h4>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-safari.jpg" width="100%" /></li>
<li>
<h4>Opera</h4>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/jsnoise-opera.jpg" width="100%" /></li>
</ul>
<p>Isn&#8217;t that great?! All of them render differently!!! (yes even Chrome and Firefox). Didn&#8217;t I hear something about someone wanting to trade in Flash for HTML5? And look at that (self proclaimed fastest browser) Opera. It looks like it just wraps pixels around the threshold (%). And what&#8217;s that first row of pixels doing in the processingJs version?</p>
<p>It looks like I have to do some more figuring out before I decide which noise to use.</p>
