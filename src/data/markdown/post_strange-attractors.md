<!--
  date: 2008-02-13
  modified: 2025-04-13
  slug: strange-attractors
  type: post
  tags: strange attractors, java, processing
-->

# Strange attractors (in Processing/Java)

<!--<div id="applet">
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
</div>-->

<p class="notice">This space used to be occupied by a <a href="https://en.wikipedia.org/wiki/Java_applet">Java applet</a> but these have been deprecated since 2015.</p>

(There is a newer [working version in JavaScript](/strange-attractors-javascript)).
    
Here you see a mathematical phenomenon known as <a href="http://en.wikipedia.org/wiki/Attractor#Strange_attractor" target="wikipedia">strange attractors</a>. The basic principle is to have a point in space and use it&#8217;s coordinates as input to a relatively simple formula to compute the new point. This means an attractor is deterministic: it’s state at a certain point (in time) can only be calculated by iterating toward that point.
Mostly the attractor will converge to one or more singular points, or diverge to infinity. But sometimes strange patterns can emerge.
Each attractor has one or more constants (phace space). The attractor changes.

## How to use

- Pick an attractor from the dropdown list.
- Adjust the camera viewpoint by dragging: left mouse drag rotates, right mouse drag pans, middle mouse drag zooms.
- Drag the sliders to move through the dimensions. The sliders can be dragged at different speeds: left mouse drag is the slowest, middle mouse drag average, and right mouse drag is fast.
- The random button randomizes these dimensions but you might have to hit it a couple of times <small>(I haven&#8217;t yet implemented the Lyapunov exponent to discard the converging and diverging attractors)</small>.
- Hit render.
- The gamma value only affects the way the attractor is displayed, not the attractor itself. A lower gamma value will intensify the vague areas.
- When you are satisfied with the attractor you can try for a higher resolution and more iterations.
- After rendering you can save the image to your desktop.
- You can also store the attractor data for later use (save/load).

This is a work in progress. If you have any ideas for improvement, find any bugs, or just want to drop a note, feel free to ~~use the comment field below.~~

## Built with:

- <a href="http://processing.org/">Processing</a>
- <a href="http://www.andrewberman.org/">P5Barebones</a>
- <a href="http://processing.org/discourse/yabb_beta/YaBB.cgi?board=Syntax;action=display;num=1138221586">JPGMakerUploader</a>
- <a href="http://glenmurphy.com">FastText</a>
- NanoXML

