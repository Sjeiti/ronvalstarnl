<!--
  date: 2007-04-15
  modified: 2020-06-01
  slug: amfphp-and-as3
  type: post
  categories: code, backend, work, ActionScript
  tags: amfphp
-->

# amfphp and as3

<p>Keeping myself very busy rewriting <del>cubejunky</del> to a Flash (=<del data-href="http://www.papervision3d.org" target="pv3d">papervision3d</del>) equivalent I got a bit stuck on wanting to implement <a href="http://www.amfphp.org/" target="ap">amfphp</a> in as3.<br />
I did find some good examples <a href="http://www.oscartrelles.com/archives/as3_flash_remoting_example" target="ot">here</a> and <a href="http://t8design.com/weblogs/?p=14" target="t8d">here</a> that got me going again. I never quite understood why amfphp generates as2 classes that can have more than one instance. A singleton would be more suitable in my humble opinion.<br />
So I rewrote the t8 Flex download (I don&#8217;t do Flex) to something I could use. I also put in some trace code you might find usefull. I usually extend this class and override the handles (and put a gatewayUrl switch in the constructor) so amfphp can easily overwrite the original when you change the php service.<br />
Anyway&#8230; here&#8217;s the <a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/amfphp_as3.zip">stuff</a>, dump it in your amfphp/browser/templates folder (except for the as file of course).</p>
