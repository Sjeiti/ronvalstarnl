<!--
  id: 632
  description: Too bad you can't zoom in with stereoscopic 3D. But with a little Javascript you can...
  date: 2010-09-17T14:17:38
  modified: 2012-07-25T07:15:34
  slug: stereoscopic-3d-zoom-with-javascript
  type: post
  excerpt: <p>Last year I got a microscope for my birthday. As with most toys, you play around with them for a while but eventually they end up on a shelf somewhere.</p>
  categories: code, image, Javascript, nature, graphic design
  tags: stereoscopic
  metaKeyword: stereoscopic 3D
  metaTitle: Stereoscopic 3D zoom with Javascript - Sjeiti
  metaDescription: Too bad you can't zoom in with stereoscopic 3D. But with a little Javascript you can...
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Stereoscopic 3D zoom with Javascript

<p>Last year I got a microscope for my birthday. As with most toys, you play around with them for a while but eventually they end up on a shelf somewhere.</p>
<p><!--more--></p>
<p>This year I wanted to get a good camera for macro photography. I didn&#8217;t get one yet (still have to pick one out). But I did find some good use for my microscope putting my simple Panasonic onto the eyepiece (I got the idea after doing something similar this vacation with some binoculars).</p>
<p><img src="/wordpress/wp-content//uploads/img/blog/microleaf.jpg" /></p>
<p>And since I have a stereo microscope (and photoshop) I thought I&#8217;d try to make some stereoscopic photos. To my surprise it works out really well. It takes some trial and error since I have little control over the focus of my camera, and I have to color-correct each side when putting the two fotos together.</p>
<p><!--img src="wp-content//uploads/img/blog/micromint.jpg" /--></p>
<p>Too bad you can&#8217;t zoom in with stereoscopic 3D.<br />Oh wait&#8230;. of course you can&#8230; (mousewheel)</p>
<div id="stereozoom"></div>
<p><script type="text/javascript" src="test/stereozoom/scripts/base.js"></script><br />
<script type="text/javascript" src="test/stereozoom/scripts/drawIcon.js"></script><br />
<script type="text/javascript" src="test/stereozoom/scripts/stereozoomer.js"></script><br />
<script type="text/javascript"><!--
	window.onload = function(){
		stereoZoomer.init("stereozoom",467,367,"test/stereozoom/data/mint.jpg");
					var aImgs = [
						 "butterfly.jpg"
						,"chrysalis_head.jpg"
						,"crystal.jpg"
						,"flyhead.jpg"
						,"flyheadside.jpg"
						,"flyshoulder.jpg"
						,"lichen.jpg"
						,"mint.jpg"
						,"sandurchin.jpg"
					];
					var mZoom = document.getElementById("stereozoom");
					var mUl = addChild(mZoom ,'ul');
					for (var i=0;i<aImgs.length;i++) {
						mLi = addChild(mUl,'li');
						mA = addChild(mLi,'a');
						mA.setAttribute("href","javascript:stereoZoomer.loadImg('test/stereozoom/data/"+aImgs[i]+"')");
						mA.appendChild(document.createTextNode(aImgs[i].split(".")[0]));
					}
	}
--></script></p>
<p>More zoomeable images <a href="http://test.ronvalstar.nl/stereozoom/" rel="external">are here</a>. Or on my <a href="http://www.flickr.com/photos/sjeiti/sets/72157624940839316/" rel="external">flickr page</a>.</p>