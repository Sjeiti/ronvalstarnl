<!--
  id: 3355
  date: 2017-07-12T19:40:59
  modified: 2017-07-12T19:40:59
  slug: pixel-perfect-bookmarklet
  type: post
  excerpt: <p>Here&#8217;s a little bookmarklet I wrote to check designs against implementation for pixel perfect development. It&#8217;s really just a quick thing I made for work. It&#8217;s also on Github if you want it.</p>
  categories: code, CSS, HTML, Javascript, graphic design
  tags: bookmarklet, Javascript, graphic design
  metaKeyword: pixel perfect
  metaDescription: A bookmarklet to check designs against implementation for pixel perfect development. It's really just a quick thing I made for work. It's also on Github.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Pixel perfect bookmarklet

<p>Here&#8217;s <a href="http://pixel-perfect-bookmarklet.ronvalstar.nl" target="_blank">a little bookmarklet</a> I wrote to check designs against implementation for pixel perfect development. It&#8217;s really just a quick thing I made for work. It&#8217;s also on <a href="https://github.com/Sjeiti/pixel-perfect-bookmarklet" target="_blank">Github</a> if you want it.<br />
<!--more--></p>
<p>When you click the bookmarklet it adds a green ball in the lower left corner. If you drag images onto the ball they will be saved in LocalStorage per url / per image width (breakpoint).<br />
It will then resize your viewport to the image width and overlay that image with a transparency.<br />
You can then use sliders to control the transparency and/or the image width and height (cropped, not resized).<br />
Arrow keys can be used for more granular width and height control.</p>
<p><img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/pp.png" alt="screenshot" width="1022" height="987" class="alignnone size-full" srcset="https://ronvalstar.nlhttps://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/pp.png 1022w, https://ronvalstar.nlhttps://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/pp-300x290.png 300w, https://ronvalstar.nlhttps://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/pp-768x742.png 768w" sizes="(max-width: 1022px) 100vw, 1022px" /></p>
<p>To get the breakpoints working properly it wasn&#8217;t enough to simply resize the html node because the viewport will still be what it was. So instead the entire body is wiped and an iframe is added with the original url as src.</p>
<p>I had something implemented so that this would work for SPA&#8217;s as well but when I implemented the iframe solution this broke (of course). I started reimplementing this but only got as far as copying the iframe url to the parent window with history.popState. Which was tricky enough because pushState-events don&#8217;t exist.</p>
<p>So have a go if you think it&#8217;s useful. And if you like I&#8217;ll implement SPA a little better, handle LocalStorage a little better, add an easier way to delete images&#8230; etc&#8230;</p>
<p>ps: note that this is a quick solution that was written in a couple of hours</p>