<!--
  id: 230
  date: 2005-12-27
  modified: 2012-07-03
  slug: sparklines
  type: post
  excerpt: <p>This infostetics article pointed me to sparkline.org. Sparklines are &#8220;intense, simple, wordlike graphics&#8221;, invented(?) by Edward Tufte. You can download a gd sparkline-library at sparkline.org. My first sparkline (no use of that library though) is to the right showing the unique visitors on top and the spiders/bots on the bottom, clearly showing the spider/bot harrassment [&hellip;]</p>
  categories: admin, backend
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# sparklines

<p>This <a href="http://infosthetics.com/archives/2005/09/sparklines.html" target="_blank">infostetics article</a> pointed me to <a href="http://sparkline.org/" target="_blank">sparkline.org</a>. Sparklines are &#8220;intense, simple, wordlike graphics&#8221;, invented(?) by <a href="http://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001OR&#038;topic_id=1" target="_blank">Edward Tufte</a>. You can download a gd sparkline-library at <a href="http://sparkline.org/" target="_blank">sparkline.org</a>.<br />
My first sparkline (no use of that library though) is to the right showing the unique visitors on top and the spiders/bots on the bottom, clearly showing the spider/bot harrassment of the past two months. Since I don&#8217;t have privilige to do cron jobs I faked it: on every spider or bot acces to my site it checks the age of the sparkline image, if the image is too old it is recreated. I haven&#8217;t really tested yet how long before a time out (creating multiple or more complex images).<br />
<img src="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/sl_unb.png" /></p>
