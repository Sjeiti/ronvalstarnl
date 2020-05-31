<!--
  id: 657
  date: 2010-10-22
  modified: 2010-10-22
  slug: perpetuum-mobile
  type: post
  excerpt: <p>I&#8217;m just about finishing up on the mobile version of ronvalstar.nl and thought I&#8217;d share some things. Especially since a lot of people don&#8217;t seem to have their shit act together.</p>
  categories: code, CSS, HTML, JavaScript, mobile, backend, XML
  tags: CSS, HTML, PC, Windows mobile
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# perpetuum mobile

<p>I&#8217;m just about finishing up on the mobile version of <a href="/">ronvalstar.nl</a> and thought I&#8217;d share some things. Especially since <a href="http://www.narrowdesign.com/future/">a lot of people</a> don&#8217;t seem to have their <del>shit</del> act together.</p>
<p><!--more--><!--img src="wp-content/uploads/img/blog/qrsRonvalstar.png" /--></p>
<p>Of course we&#8217;ve come a long way from the text-only WAP sites we used to have. But even though mobile devices are getting better and better a few things stay the same. People use their phones while walking and the screens are rather small. Designing a mobile website basicly boils down to two things: the user and the device.</p>
<p>Someone visiting your site through a mobile phone is most likely doing other stuff at the same time (driving, walking or talking to someone), and probably looking for a phone number or an address (depending on the nature of the site of course). The bottom line is that the content for a mobile website should be different from that of its desktop equivalent because the mindset of the user visiting that site is different.<br />
The same goes for the amount of content. The screen resolution of mobile phones will increase but not the size of our pockets. So the amount of information you can inmediately show is very limited (at least it will be untill we have phones that project right onto our retina&#8217;s or into our brains). This also means that solely relying on a mobile stylesheet is not the way to go. It is best to use server side scripting to check where you&#8217;re at (<a href="http://www.google.com/search?q=HTTP_USER_AGENT" rel="external">HTTP_USER_AGENT</a>).<br />
Scrolling pages is also more of a hassle. This means the content has to be differently structured, often over multiple pages. And the use of the old #hash for internal page links come in very handy here.</p>
<p>Then there&#8217;s bandwidth, little of it. So it&#8217;s important to keep things small. Resizing images to a minimum and <a href="http://en.wikipedia.org/wiki/Minify" rel="external">minifyimg all ASCII files</a> is a good start.<br />
A server request is a time consuming matter. You can check this yourself with Firebug for Firefox or the resource tracker in Chrome. A simple check on the Google website shows that receiving the actual HTML only takes up about 5% of the time. Mobile networks are even slower. What you can do instead of requesting several files is combine these files into one big one and cache that on the server. This goes for CSS files and JavaScript files but you can even <a href="http://www.alistapart.com/articles/sprites" rel="external">do this with images</a>.<br />
If an external resource is unique for that page you can also choose to embed it into the HTML. This is easy for CSS and JavaScript but it is also possible for images (like so &lt;img src=&#8221;data:image/png;base64gibberish&#8230;&#8221; /&gt;), and also for images linked from within CSS (regexp: /(?< =url()(.[^)]*)(?=))/g). But only do this if the file is not used in any other place, otherwise caching is your friend.<br />
Caching is important. Don&#8217;t let your user wait for a time consuming server side calculation especially if you&#8217;re doing the same calculation over and over again.<br />
A trick I hacked into my own site is not to load any content images first but embed a binary placeholder of a tiny resized image. Then when the load event has fired JavaScript comes in and replaces them with the normal-sized ones.</p>
<p>But the worst of all&#8230; we used to complain about IE vs Firefox and PC vs Mac. Well, we&#8217;ve seen nothing yet. There are numerous mobile browsers and even more devices that run them. So a mobile website has to be so liquid it practically drips off your screen.<br />
This also means <a href="http://blogs.walkerart.org/newmedia/2010/04/23/setting-up-smartphone-emulators-for-testing-mobile-websites/" rel="external">installing numerous emulators</a> (well the big four are currently Blackberry, iPhone, Windows Mobile and Android).</p>
<p>&#8230; so have fun</p>
<p>ps: <a href="http://jquerymobile.com/2010/10/jquery-mobile-alpha-1-released/">jQuery mobile beta</a> just got released</p>
