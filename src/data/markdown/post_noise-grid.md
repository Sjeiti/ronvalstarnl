<!--
  date: 2007-01-07
  modified: 2007-01-07
  slug: noise-grid
  type: post
-->

# noise grid

<div><applet code="noiseGrid08" archive="code/noiseGrid08.jar" style="width:400px;height:400px;"></applet></div>
<p>Normally you would use <a target="_blank" href="http://freespace.virgin.net/hugo.elias/models/m_perlin.htm">Perlin Noise</a> for surfaces, textures, movements or any other form that is continious and irregular. But what if you want points that are spread irregularly, a forest for instance or a starfield. This can be done with Perlin noise as well. You take a grid, place it over the noise field. Then you use the each points noise value as angle for a translation (multiplied with an insanely large number). The length of the translation would depend on the type and size of your grid, in a triangular grid this would be the distance between two points in that grid.<br />
I used a threshold here to create &#8216;blobs&#8217; of points. Of course the &#8216;thickness&#8217; of the pointclouds will be exactly the same as that of the grid.<br />
Use keyboard or mouse to switch between states.</p>
