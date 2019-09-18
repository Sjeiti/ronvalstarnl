<!--
  id: 220
  date: 2006-06-18T01:00:06
  modified: 2006-06-18T01:00:06
  slug: librarything
  type: post
  excerpt: <p>Librarything lets you search libraries and Amazon to catalog your books, and see what people with similar collections read. Although it doesn&#8217;t have an API to control or interact with your own collection, it does allow you to add a &#8216;widget&#8217; to your webpage containing your latest entries or a random collection. The downside of [&hellip;]</p>
  categories: book
  tags: API
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# librarything

<p><a href="http://www.librarything.com/" target="_blank">Librarything</a> lets you search libraries and Amazon to catalog your books, and see what people with similar collections read.<br />
Although it doesn&#8217;t have an API to control or interact with your own collection, it does allow you to add a &#8216;widget&#8217; to your webpage containing your latest entries or a random collection. The downside of this widget is that their server is sometimes slow and the widget (an url returning a javascript snippet document writing html) does not return xhtml. But a bit of php and some regular expressions later I managed to download the snippet once (in a while), and randomly pick items from there.</p>