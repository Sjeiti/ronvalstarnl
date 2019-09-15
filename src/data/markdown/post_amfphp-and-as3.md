<!--
  id: 296
  date: 2007-04-15T21:07:43
  modified: 2014-03-11T08:47:30
  slug: amfphp-and-as3
  type: post
  excerpt: <p>Keeping myself very busy rewriting cubejunky to a Flash (=papervision3d) equivalent I got a bit stuck on wanting to implement amfphp in as3. I did find some good examples here and here that got me going again. I never quite understood why amfphp generates as2 classes that can have more than one instance. A singleton [&hellip;]</p> 
  content: <p>Keeping myself very busy rewriting <a href="javascript:Sjeiti.showIFrame('coderef.php?id=611',800,600,'Cubejunky',this)" title="Remember Sokoban?... sort of like that but then in 3D">cubejunky</a> to a Flash (=<a href="http://www.papervision3d.org" target="pv3d">papervision3d</a>) equivalent I got a bit stuck on wanting to implement <a href="http://www.amfphp.org/" target="ap">amfphp</a> in as3.<br /> I did find some good examples <a href="http://www.oscartrelles.com/archives/as3_flash_remoting_example" target="ot">here</a> and <a href="http://t8design.com/weblogs/?p=14" target="t8d">here</a> that got me going again. I never quite understood why amfphp generates as2 classes that can have more than one instance. A singleton would be more suitable in my humble opinion.<br /> So I rewrote the t8 Flex download (I don&#8217;t do Flex) to something I could use. I also put in some trace code you might find usefull. I usually extend this class and override the handles (and put a gatewayUrl switch in the constructor) so amfphp can easily overwrite the original when you change the php service.<br /> Anyway&#8230; here&#8217;s the <a href="/wordpress/wp-content/uploads/amfphp_as3.zip">stuff</a>, dump it in your amfphp/browser/templates folder (except for the as file of course).</p> 
  categories: code,backend,work,Actionscript
  tags: amfphp
-->

# amfphp and as3

<p>Keeping myself very busy rewriting <a href="javascript:Sjeiti.showIFrame('coderef.php?id=611',800,600,'Cubejunky',this)" title="Remember Sokoban?... sort of like that but then in 3D">cubejunky</a> to a Flash (=<a href="http://www.papervision3d.org" target="pv3d">papervision3d</a>) equivalent I got a bit stuck on wanting to implement <a href="http://www.amfphp.org/" target="ap">amfphp</a> in as3.<br />
I did find some good examples <a href="http://www.oscartrelles.com/archives/as3_flash_remoting_example" target="ot">here</a> and <a href="http://t8design.com/weblogs/?p=14" target="t8d">here</a> that got me going again. I never quite understood why amfphp generates as2 classes that can have more than one instance. A singleton would be more suitable in my humble opinion.<br />
So I rewrote the t8 Flex download (I don&#8217;t do Flex) to something I could use. I also put in some trace code you might find usefull. I usually extend this class and override the handles (and put a gatewayUrl switch in the constructor) so amfphp can easily overwrite the original when you change the php service.<br />
Anyway&#8230; here&#8217;s the <a href="/wordpress/wp-content/uploads/amfphp_as3.zip">stuff</a>, dump it in your amfphp/browser/templates folder (except for the as file of course).</p>

