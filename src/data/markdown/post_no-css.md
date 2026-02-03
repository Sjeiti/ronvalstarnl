<!--
  date: 2026-02-01
  modified: 2026-02-01
  slug: no-css
  type: post
  categories: code, HTML
  tags: cool shit
  thumbnail: experiments/Screenshot_20250807-205419.jpg
  description: HTML
  related: 
-->

# Look ma; no CSS

For those enlightened souls who use Firefox: there is a thing called [reader-view](https://support.mozilla.org/en-US/kb/firefox-reader-view-clutter-free-web-pages). It works on pages with a good semantic HTML structure. You might have accidentally clicked this icon in your address bar and noticed everything disappearing but the basic content. Almost as if we're thirty years in the past when CSS didn't exist yet. Except reader-view does look polished, has styling options, and a screen reader.

## Way back

That got me thinking: once in a while you come upon these sites that lets you change the visual appearance (yeah like darkmode, but different). What would my site look like without styling, in 1995? ([CSS1](https://www.w3.org/TR/CSS1/) came out in 1996)

<a href="javascript:Array.from(document.querySelectorAll('link,style')).forEach(elm=>elm.remove())"><code style="word-break:break-all;">Array.from(document.querySelectorAll('link,style')).forEach(elm=>elm.remove())</code></a>

<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1755547197/rv/screenshot_no-css.png" alt="no CSS wrong" style="width:50%;border:1px solid #888;"/>

Well it looks all wrong and ugly because I was too lazy to add a `width` and `height` to the SVG icons. And some of these icons are useless without CSS. Or rather: they were hidden with CSS and have no current function.


## Dead kittens

Scaling down the SVG's is no sweat. But hiding the SVG's that would have been hidden by CSS takes a bit more effort.
Best would be to remove these from the DOM altogether. Easiest is to hide them with inline styling and override that `display` in the stylesheet. Sad thing is: that override will not work without using `!important`. And everytime you use `!important` a little kitten dies.

![five dead kittens](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1755671956/rv/five_dead_kittens.jpg)


## Theming

The link above removes styling but is not persistent when you reload. For that we need to implement this as a theme: so store the state in `localStorage` and act upon it on page load.

This requires two elements to be manipulated when changing style: set the `href` property of the `HTMLLinkElement` to swap the exteral stylesheet, and add or remove the inline `HTMLStyleElement`. I hope you have the latter because inlining above-the-fold CSS is a major rendering optimisation.

