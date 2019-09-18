<!--
  id: 1958
  description: Here's a bookmarklet that strips everything on Google Maps but the map itself.
  date: 2013-04-07T11:08:55
  modified: 2014-05-06T07:37:17
  slug: bookmarklet-for-fullscreen-google-maps
  type: post
  excerpt: <p>Here&#8217;s a bookmarklet that strips everything on Google Maps but the map itself. Put the  browser fullscreen and you&#8217;ve got the whole world to printscreen desktop images from. Siberia has some pretty awesome landscapes.</p>
  categories: code, Javascript, open source
  tags: bookmarklet, Javascript
  metaKeyword: google maps
  metaTitle: Google Maps bookmarklet
  metaDescription: Here's a bookmarklet that strips everything on Google Maps but the map itself.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Bookmarklet for fullscreen Google Maps

<p>As a developer I use bookmarklets all the time. For those of you who don&#8217;t know: a bookmarklet is similar to a bookmark but instead of a hyperlink it points to: &#8220;javascript:console.log(&#8216;&#8230;do some Javacript to alter the page you&#8217;re currently viewing&#8217;);&#8221;.<br />
So when developing I tend to use it for lots of stuff: quick login into a secure part, automatically fill forms with random data, altering data I get from some site&#8230; I even used it to load and initialize the level editor for a game I recently built.</p>
<p><!--more--></p>
<p>Here&#8217;s one I just made that strips everything on Google Maps but the map itself. Put the browser fullscreen and you&#8217;ve got the whole world to printscreen desktop images from. Siberia has some pretty awesome landscapes.</p>
<p><img src="/wordpress/wp-content/uploads/gm1.jpg" alt="gm1" /></p>
<p>I first tried it the easy way, by injecting jQuery and taking it from there. Worked fine on maps.google.nl but curiously maps.google.com wasn&#8217;t too keen on script injection (even threw a warning). So I rolled up my sleeves and rewrote it to pure js.</p>
<p><a>Here it is.</a></p>
<p>Drag the above link to your bookmarks bar and head out to <a href="http://maps.google.com">Google Maps</a> to test it.</p>