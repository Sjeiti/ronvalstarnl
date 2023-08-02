<!--
  date: 2007-01-07
  modified: 2007-01-07
  slug: landscapes
  type: post
-->

# landscapes

<p>This endless landscape project was made to learn <a target="_blank" href="http://processing.org/">processing</a> (and <a target="_blank" href="http://www.java.com">java</a>).<br />
You can move about endlessly and zoom in and zoom out to a great extent. There are ships sailing around, little people, houses and little covered wagons in there.I&#8217;v made it in the processing alpha version and although I&#8217;m still planning to work on it further (implement trees by using my <a href="?page_id=20">gritted noise technique</a>) I haven&#8217;t had time to port it to the processing beta version yet.<br />
There&#8217;s also some code in the source for importing 3d models, which I borowed from <a target="_new" href="http://www.xs4all.nl/%7Eelout">Elout de Kok</a> and adapted into two classes in order to import more than one object and make multiple instances.<br />
The keyboard controls are arrow keys (and sdfe) for movement and +- (and az) for zooming. Click the screen first.</p>
<div style="width:640px;height:600px;overflow:hidden;"><applet code="noise24" archive="code/noise24.jar" style="width:800px;height:600px;position:relative;left:-150px;"></applet></div>
<p>or just watch the video</p>
<p><object width="318" height="344"><param name="movie" value="http://www.youtube.com/v/jIl0IOnmVdw&#038;hl=en&#038;fs=1&#038;"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/jIl0IOnmVdw&#038;hl=en&#038;fs=1&#038;" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="318" height="344"></embed></object></p>
<p>The main technique I used is Perlin noise, which a way to generate a random flow by interpolation of random numbers. This technique was invented by <a target="_blank" href="http://mrl.nyu.edu/%7Eperlin/">Ken Perlin</a>.</p>
<p>Here are some good links:</p>
<ul style="margin-top: 0px">
<li><a target="_blank" href="http://www.noisemachine.com/talk1/">Tutorial/history on the noise function (by Ken Perlin)</a></li>
<li><a target="_blank" href="http://freespace.virgin.net/hugo.elias/models/m_perlin.htm">A very clear explanation by Hugo Elias</a></li>
<li><a target="_blank" href="http://en.wikipedia.org/wiki/Perlin_noise">wikipedia</a></li>
</ul>
