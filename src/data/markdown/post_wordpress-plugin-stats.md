<!--
  date: 2007-01-23
  modified: 2007-01-23
  slug: wordpress-plugin-stats
  type: post
-->

# Stats plugin

<p class="notice">You might have noticed: this plugin has been discontinued.</p>
<p>The plugin saves server side data: REMOTE_ADDR (ip), REMOTE_HOST, REQUEST_URI, SCRIPT_NAME, HTTP_USER_AGENT, HTTP_REFERER and of course datetime.</p>
<p>It is then displayed in an admin stats page:</p>
<ul>
<li>daily raw data in a table</li>
<li>
	</li>
<li>four images depicting
<ul>
<li>unique ip&#8217;s over a period of time</li>
<li>hits per hour</li>
<li>browser types</li>
<li>operating systems</li>
</ul>
</li>
<li>a list of pages sorted by number of hits</li>
<li>a list of referrers sorted by number of hits</li>
<li>a list of keywords and search engines</li>
</ul>
<p>You can alter some options:</p>
<ul>
<li>toggle the display of certain ip adresses (like your own)</li>
<li>add identiefier strings for bots</li>
<li>add identiefier strings for search engines</li>
</ul>
<p>
Here is a screenshot:<br />
<br />
As you can see there are a couple of lines with an extremely small font size, those are the bot and spider hits. The font sizes return to normal when you rollover them.<br />
The page also retrieves the &#8216;exact&#8217; location of the ip, displayed by a flag and an abreviation. The ip2location database table is quite large (an extra 3.66MB) so activating the plugin wil take a few more seconds than usual.<br />
The list of search engines will first display the url of the engine, followed by a number of keywords searched for with that engine (so in this screenshots unclear case some idiot searched for &#8216;www&#8217; and found my site).</p>
<h3>download</h3>
<table cellpadding="0" cellspacing="0" class="download">
<tr>
<th>version</th>
<th>size</th>
<th>date</th>
<th>download</th>
</tr>
<tr>
<td>0.2</td>
<td>539KB</td>
<td>2007 02 12</td>
<td><del>download</del></td>
</tr>
</table>
<h3>changelog</h3>
<table width="300">
<tr>
<th>version</th>
<th>date</th>
<th>changes</th>
</tr>
<tr>
<td>0.2</td>
<td>2007 02 12</td>
<td>
<ul>
<li>added seperate keyword listing</li>
<li>bot displayed in tiny font-size</li>
<li>removed self from referers</li>
</ul>
</td>
</tr>
</table>
<p />
