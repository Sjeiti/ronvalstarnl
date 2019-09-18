<!--
  id: 317
  date: 2008-02-13T20:08:50
  modified: 2008-02-13T20:08:50
  slug: strange-attractors
  type: post
  excerpt: <p>To view this content, you need to install Java from java.com Here you see a mathematical phenomenon known as strange attractors. The basic principle is to have a point in space and use it&#8217;s coordinates as input to a relatively simple formula to compute the new point. This means an attractor is deterministic: it’s state [&hellip;]</p>
  categories: uncategorized
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Protected: Strange attractors

<div id="applet">
	<applet name="PApplet"
	 code="Attractors"
	 archive="code/Strange_attractors.jar,code/core.jar,code/javascript.jar,code/video.jar,code/xml.jar"
	 width="580" height="435"
	 mayscript="true">
	<param name="image" value="style/loading.gif">
	</param><param name="boxmessage" value="Loading Processing software...">
	</param><param name="boxbgcolor" value="#FFFFFF">
	</param><param name="progressbar" value="true">
	</param><param name="subapplet.classname" value="Attractors">
	</param><param name="subapplet.displayname" value="Strange_attractors">
	<param name="baseuri" value="/" />
	To view this content, you need to install Java from <a href="http://java.com">java.com</a>
	</param></applet>
</div>
<p>Here you see a mathematical phenomenon known as <a href="http://en.wikipedia.org/wiki/Attractor#Strange_attractor" target="wikipedia">strange attractors</a>. The basic principle is to have a point in space and use it&#8217;s coordinates as input to a relatively simple formula to compute the new point. This means an attractor is deterministic: it’s state at a certain point (in time) can only be calculated by iterating toward that point.<br />
Mostly the attractor will converge to one or more singular points, or diverge to infinity. But sometimes strange patterns can emerge.<br />
Each attractor has one or more constants (phace space). The attractor changes</p>
<ul id="howto">
	<lh>How to use</lh></p>
<li>Pick an attractor from the dropdown list.</li>
<li>Adjust the camera viewpoint by dragging: left mouse drag rotates, right mouse drag pans, middle mouse drag zooms.</li>
<li>Drag the sliders to move through the dimensions. The sliders can be dragged at different speeds: left mouse drag is the slowest, middle mouse drag average, and right mouse drag is fast.</li>
<li>The random button randomizes these dimensions but you might have to hit it a couple of times <small>(I haven&#8217;t yet implemented the Lyapunov exponent to discard the converging and diverging attractors)</small>.</li>
<li>Hit render.</li>
<li>The gamma value only affects the way the attractor is displayed, not the attractor itself. A lower gamma value will intensify the vague areas.</li>
<li>When you are satisfied with the attractor you can try for a higher resolution and more iterations.</li>
<li>After rendering you can save the image to your desktop.</li>
<li>You can also store the attractor data for later use (save/load).</li>
</ul>
<p>This is a work in progress. If you have any ideas for improvement, find any bugs, or just want to drop a note, feel free to use the comment field below.</p>
<ul id="colofon">
	<lh>Built with:</lh></p>
<li><a href="http://processing.org/">Processing</a></li>
<li><a href="http://www.andrewberman.org/">P5Barebones</a></li>
<li><a href="http://processing.org/discourse/yabb_beta/YaBB.cgi?board=Syntax;action=display;num=1138221586">JPGMakerUploader</a></li>
<li><a href="http://glenmurphy.com">FastText</a></li>
<li>NanoXML</li>
</ul>