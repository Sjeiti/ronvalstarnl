<!--
  id: 284
  date: 2007-01-28
  modified: 2007-01-28
  slug: wordpress-plugin-librarything-widget
  type: post
  excerpt: <p>You might have noticed: this plugin has been discontinued.</p>
  categories: uncategorized
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Librarything widget

<p class="notice">You might have noticed: this plugin has been discontinued.</p>
<p><a href="http://www.librarything.com/" target="librarything">Librarything</a> lets you search libraries and <a href="http://www.amazon.com/" target="amazon">Amazon</a> to catalog your books, and see what people with similar collections read.</p>
<p>Although it does&#8217;t have an API to control or interact with your collection, it does allow you to add a widget to your webpage containing your latest entries or a random collection. The downside of this widget is that their server is sometimes slow and the widget (an url returning a JavaScript snippet document writing html) does not return xhtml.</p>
<p>This Worpress plugin solves that. It caches the returned JavaScript, which contains the references to the last 200 books from your collection, and interprets the data. You can choose the number of books to display in your sidebar. If you update your Librarything collection you&#8217;ll also have to update the cached data through the widgets options.<br />
An additional feature is that where the original plugin linked to Amazon (a sponsor thing), these links all go to Librarything. I have nothing against Amazon but I just want to plug Librarything (besides the Librarything website contains enough links to Amazon).<br />
You can see the plugin in action to the right here. Have fun with it, and don&#8217;t forget to leave a note to tell me what you think (there&#8217;s always room for improvement).</p>
<h3>download</h3>
<table cellpadding="0" cellspacing="0" class="download">
<tr>
<th>version</th>
<th>size</th>
<th>date</th>
<th>download</th>
</tr>
<tr>
<td>1.0.1</td>
<td>4KB</td>
<td>2007 01 31</td>
<td>download</td>
</tr>
</table>
<p />
<h3>installation</h3>
<p>Unzip and place the folder in your plugins directory.<br />
This plugin is a widget for the &#8216;<a href="http://automattic.com/code/widgets/" target="sidebar">Sidebar Widgets</a>&#8216; plugin. So install that first before trying to get this to work!<br />
Also don&#8217;t forget to <a href="?page_id=288">download the cronfaker plugin</a> for automatic regular download of the Librarything data (the Librarything plugin works fine without it, it&#8217;s just to make your life a little easier).</p>
<h3>changelog</h3>
<table width="100%">
<tr>
<th>version</th>
<th>date</th>
<th>changes</th>
</tr>
<tr>
<td>1.0.2</td>
<td>2007 02 12</td>
<td>
<ul>
<li>cache by fake cron</li>
<li>interpret data before caching</li>
</ul>
</td>
</tr>
<tr>
<td>1.0.1</td>
<td>2007 02 12</td>
<td>
<ul>
<li>added header parameter</li>
</ul>
</td>
</tr>
</table>
<p />
<h3>todos</h3>
<ul>
<li><strike>cache by fake cron</strike></li>
<li><strike>interpret data before caching (in case of errors)</strike></li>
</ul>
