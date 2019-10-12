<!--
  id: 309
  date: 2007-11-09T17:01:42
  modified: 2007-11-09T17:01:42
  slug: flash-plugin-bug
  type: post
  excerpt: <p>I don&#8217;t normally talk this type of geek talk but I just spent hours trying to debug the weirdest IE glitch. When I code Flash I mostly always code positions relative to the stage dimensions (stage.stageWidth and stage.stageHeight). This prevents the trouble you go through when your client decides to add another x amount of [&hellip;]</p>
  categories: code, Flash, ActionScript
  tags: IE, OS, XP
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Flash plugin bug

<p>I don&#8217;t normally talk this type of geek talk but I just spent hours trying to debug the weirdest IE glitch.<br />
When I code Flash I mostly always code positions relative to the stage dimensions (stage.stageWidth and stage.stageHeight). This prevents the trouble you go through when your client decides to add another x amount of pixels to the dimensions.<br />
Now I only got this IE glitch online, and only on my Vista OS. XP was working fine for me, but on other machines XP did the same thing. That&#8217;s already quite random behavior but it probably has to do with the Flash plugin version.<br />
The first time the page loads everything is fine. But if you reload, or navigate away and go back, both the stageWidth and the stageHeight are 0 on the first cycle. This is probably due to cashing and initializing but a Flash plugin bug nonetheless. A way to circumvene this problem is to run an enterframe and only startup the lot when the stageWidth and -Height are something else than 0. Or hardcode these values of course, but who would want that?<br />
Hope this helps some desperate souls out there.</p>