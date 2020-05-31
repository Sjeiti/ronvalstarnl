<!--
  id: 288
  date: 2007-01-31
  modified: 2012-06-26
  slug: wordpress-plugin-cronfaker
  type: post
  excerpt: <p>You might have noticed: this plugin has been discontinued. Cron jobs are a Unix way executing files at scheduled times. If you don&#8217;t have acces to them there are ways to fake it. I figured out a long time ago that letting certain hits trigger the executions works just as well. It&#8217;s less punctual than [&hellip;]</p>
  categories: uncategorized
  tags: 
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Cronfaker plugin

<p class="notice">You might have noticed: this plugin has been discontinued.</p>
<p>Cron jobs are a Unix way executing files at scheduled times. If you don&#8217;t have acces to them there are ways to fake it. I figured out a long time ago that letting certain hits trigger the executions works just as well. It&#8217;s less punctual than a real cron job but I don&#8217;t care.<br />
The thing to keep in mind is that some jobs, like heavy duty image creation or sql queries, can take up a noticable amount of time (and I&#8217;m not all that when it comes to fast queries). Now I don&#8217;t want to scare of people with a long download time just because I want to execute some fake cron job. And here&#8217;s the good news: humans are not the only ones to visit web sites. The web is teeming with automated programs that roam the web for information. These bots, spiders, crawlers and whateverthingies are not as easily scared away as humans are, so why not let them trigger the cron jobs.</p>
<p class="noend">This plugin I wrote is quite simple.<br />
You can easily invoke it from your own plugins like so:</p>
<pre class="code">register_cronfaker(name:string, interval:integer, function:string);</pre>
<p />
<p>When running the server will detect wether the visiting entity is a bot or not. When it is it will check if your plugin is due for execution by comparing it to a large delimited string in the options table that contains the name and last timestamp of your execution.<br />So the intervals are variable. Functions with identical intervals do not nescesarily execute at the same time. It is possible that different functions execute at the same time but who cares, the&#8217;re bots.</p>
<p class="noend">So, in short, the following:</p>
<pre class="code">register_cronfaker('sparkline', 60*60, 'sjtspkl_create');</pre>
<p>means that the function sjtspkl_create() is executed roughly every 3600 seconds and identified by the name &#8216;sparkline&#8217;. I can&#8217;t make it any easier than that.</p>
<h3>download</h3>
<table cellpadding="0" cellspacing="0" class="download">
<tr>
<th>version</th>
<th>size</th>
<th>date</th>
<th>download</th>
</tr>
<tr>
<td>1.1</td>
<td>2KB</td>
<td>2007 01 31</td>
<td>download</td>
</tr>
</table>
<p />
<h3>changelog</h3>
<table width="300">
<tr>
<th>version</th>
<th>date</th>
<th>changes</th>
</tr>
<tr>
<td>1.1</td>
<td>2007 02 12</td>
<td>
<ul>
<li>made it faster</li>
</ul>
</td>
</tr>
</table>
<p />
<h3>installation</h3>
<p>Unzip and place the folder in your plugins directory. Press &#8216;activate&#8217; from the plugins menu.</p>
