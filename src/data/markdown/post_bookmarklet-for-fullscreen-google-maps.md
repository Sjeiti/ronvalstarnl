<!--
  id: 1958
  description: Here's a bookmarklet that strips everything on Google Maps but the map itself.
  date: 2013-04-07
  modified: 2014-05-06
  slug: bookmarklet-for-fullscreen-google-maps
  type: post
  excerpt: <p>Here&#8217;s a bookmarklet that strips everything on Google Maps but the map itself. Put the  browser fullscreen and you&#8217;ve got the whole world to printscreen desktop images from. Siberia has some pretty awesome landscapes.</p>
  categories: code, JavaScript, open source
  tags: bookmarklet, JavaScript
  metaKeyword: google maps
  metaTitle: Google Maps bookmarklet
  metaDescription: Here's a bookmarklet that strips everything on Google Maps but the map itself.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Bookmarklet for fullscreen Google Maps

As a developer I use bookmarklets all the time. For those of you who don’t know: a bookmarklet is similar to a bookmark but instead of a hyperlink it points to: “javascript:console.log(‘…do some JavaScript to alter the page you’re currently viewing’);”.  
So when developing I tend to use it for lots of stuff: quick login into a secure part, automatically fill forms with random data, altering data I get from some site… I even used it to load and initialize the level editor for a game I recently built.

Here’s one I just made that strips everything on Google Maps but the map itself. Put the browser fullscreen and you’ve got the whole world to printscreen desktop images from. Siberia has some pretty awesome landscapes.

![gm1](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/gm1.jpg)

I first tried it the easy way, by injecting jQuery and taking it from there. Worked fine on maps.google.nl but curiously maps.google.com wasn’t too keen on script injection (even threw a warning). So I rolled up my sleeves and rewrote it to pure js.

~~~Here it is.~~~

Drag the above link to your bookmarks bar and head out to [Google Maps](http://maps.google.com) to test it.

