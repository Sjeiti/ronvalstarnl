<!--
  id: 3355
  date: 2017-07-12
  modified: 2019-09-27
  slug: pixel-perfect-bookmarklet
  type: post
  header: Sus_scrofa_piglet.jpg
  categories: code, CSS, HTML, JavaScript, graphic design
  tags: bookmarklet, JavaScript, graphic design
  metaKeyword: pixel perfect
  metaDescription: A bookmarklet to check designs against implementation for pixel perfect development. It's really just a quick thing I made for work. It's also on Github.
-->

# Pixel perfect bookmarklet

Here’s [a little bookmarklet](http://pixel-perfect-bookmarklet.ronvalstar.nl) I wrote to check designs against implementation for pixel perfect development. It’s really just a quick thing I made for work. It’s also on [Github](https://github.com/Sjeiti/pixel-perfect-bookmarklet) if you want it.  

When you click the bookmarklet it adds a green ball in the lower left corner. If you drag images onto the ball they will be saved in LocalStorage per url / per image width (breakpoint).  
It will then resize your viewport to the image width and overlay that image with a transparency.  
You can then use sliders to control the transparency and/or the image width and height (cropped, not resized).  
Arrow keys can be used for more granular width and height control.

![screenshot](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/pp.png)

To get the breakpoints working properly it wasn’t enough to simply resize the html node because the viewport will still be what it was. So instead the entire body is wiped and an iframe is added with the original url as src.

I had something implemented so that this would work for SPA’s as well but when I implemented the iframe solution this broke (of course). I started reimplementing this but only got as far as copying the iframe url to the parent window with history.popState. Which was tricky enough because pushState-events don’t exist.

So have a go if you think it’s useful. And if you like I’ll implement SPA a little better, handle LocalStorage a little better, add an easier way to delete images… etc…

ps: note that this is a quick solution that was written in a couple of hours