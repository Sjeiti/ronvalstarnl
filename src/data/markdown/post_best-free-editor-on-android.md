<!--
  id: 3366
  date: 2017-08-09T20:45:25
  modified: 2017-10-07T21:52:13
  slug: best-free-editor-on-android
  type: post
  excerpt: <p>If you are so hooked on programming that you even do it on tablets and phones I have a suggestion for you. A few years back I used Textastic on an iPad. But since that was an iPad one and phones have come a long way I just use Android now (when I have no [&hellip;]</p>
  categories: code, CSS, HTML, Javascript
  tags: CSS, HTML, Javascript, cli, linux, bash, android
  metaKeyword: android
  metaDescription: Apps for programming on an Android are clumsy at best, and full of adds. But the best one is really just a Linux terminal: Termux!
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# The best programming editor on Android is free

<p>If you are so hooked on programming that you even do it on tablets and phones I have a suggestion for you. A few years back I used <a href="https://www.textasticapp.com/">Textastic</a> on an iPad. But since that was an iPad one and phones have come a long way I just use Android now (when I have no pc in sight that is).</p>
<h2 id="android-programming-apps">Android programming apps</h2>
<p>There’s plenty of choice for Android when it comes to programming editors since it is less restricted than IOS. So naturally there is also tons of crap.<br />
Another problem is that for Web programming you will mostly need a web server, mostly an app to install separately.<br />
I have used both <a href="https://play.google.com/store/apps/details?id=com.ansm.anwriter">anWriter</a> and <a href="https://play.google.com/store/apps/details?id=org.kidinov.awd">AWD</a> together with <a href="https://play.google.com/store/apps/details?id=jp.ubi.common.http.server">SimpleHttpServer</a>. <br />
The latter just does what is says. But both AWD and anWriter leave too much room for improvement.<br />
Both are free in the sense that they are so called nagware. If you don’t want to spend a small amount of cash (around €5) you’ll have to learn to live with adds popping up every now and then.</p>
<h2 id="command-line-to-the-rescue">Command line to the rescue</h2>
<p><a href="https://stackoverflow.com/questions/36632649/running-node-js-on-android">Somehow</a> I stumbled upon <a href="https://play.google.com/store/apps/details?id=com.termux">Termux</a>. Which is a Linux terminal wrapped in an app.<br />
Stackoverflow is right: my jaw dropped when I did my first <code>git clone</code> and <code>npm i</code>.</p>
<p>But we were talking about editors weren’t we? Well maybe you’ve heard about <a href="http://www.vim.org">VIM</a>. I once tried it and didn’t really get it. But from within Termux it’s actually just as good (if not better) than the two editors mentioned above. I will definitely give it another try on my pc.</p>
<h2 id="getting-started-with-termux">Getting started with Termux</h2>
<p><a href="https://play.google.com/store/apps/details?id=com.termux">Install Termux</a> and run it. You might also want to throw in <a href="XXXXX">Hacker’s keyboard</a> for better control.</p>
<p>In Termux run <code>apt update &amp;&amp; apt upgrade</code> to get the <a href="https://termux.com/package-management.html">package manager</a> up and running.</p>
<p>(you can have multiple sessions: swipe the left border to the right)</p>
<p>Do <code>apt install coreutils</code> to get <a href="https://termux.com/common-packages.html">better base utilities</a></p>
<p>Next install Nodejs: <code>apt install nodejs</code></p>
<p>Install Vim: <code>apt install vim</code></p>
<p>Git: <code>apt install git</code></p>
<p>And we’re done. Actually you are just getting started but don’t think you need me to clone a repo and get it running.</p>
<h2 id="a-few-more-tips">A few more tips</h2>
<p>I am not a native Linux speaker but I know enough to get by on a pc using Bash. <br />
In Termux things like typing can get a bit tiresome.</p>
<p>So type this: <code>vim $HOME/.bash_profile</code>, <br />
then enter and save this: <code>alias conf="vim ${HOME}/.bash_profile"</code></p>
<p>Next time you start a session and type <code>conf</code> you get this file to add some shortcuts to. Mine looks something like this:</p>
<pre class="prettyprint"><code class=" hljs ruby">export <span class="hljs-constant">HTDOCS</span>=<span class="hljs-variable">${</span><span class="hljs-constant">HOME</span>}/storage/shared/htdocs
<span class="hljs-keyword">alias</span> size=<span class="hljs-string">"du -h --max-depth=1 ."</span>
<span class="hljs-keyword">alias</span> vimrc=<span class="hljs-string">"vim ~/.vimrc"</span>
<span class="hljs-keyword">alias</span> proj=<span class="hljs-string">"cd ${HTDOCS} &amp;&amp; ls"</span>
<span class="hljs-keyword">alias</span> home=<span class="hljs-string">"cd ${HOME} &amp;&amp; ls"</span>
<span class="hljs-keyword">alias</span> conf=<span class="hljs-string">"vim ${HOME}/.bash_profile"</span>
<span class="hljs-comment"># git</span>
<span class="hljs-keyword">alias</span> gitadded=<span class="hljs-string">"git diff --cached --name-only"</span>
<span class="hljs-keyword">alias</span> gitnotadded=<span class="hljs-string">"git clean -dn"</span></code></pre>
<p>Notice that vimrc? I have it setup like this currently:</p>
<pre class="prettyprint"><code class=" hljs bash"><span class="hljs-keyword">set</span> nowrap
<span class="hljs-keyword">set</span> tabstop=<span class="hljs-number">2</span>
<span class="hljs-keyword">set</span> shiftwidth=<span class="hljs-number">2</span>
<span class="hljs-keyword">set</span> expandtab
colorscheme sjeiti</code></pre>
<h2 id="some-small-downsides">Some small downsides</h2>
<h3 id="losing-sessions">Losing sessions</h3>
<p>Termux on my phone has the tendency close (all sessions) when the phone is in sleep mode <em>and</em> Termux was not the last open app. <br />
There is a <a href="https://termux.com/user-interface.html">wake lock</a> functionality butthat solves a different issue.</p>
<h3 id="storage-and-npm-install">Storage and <code>npm install</code></h3>
<p>Termux has <a href="https://termux.com/storage.html">three types of storage</a>. Unfortunately I’ve only been able to <code>npm install</code> from within internal storage. But the internal storage is not accessible from outside (should you want to copy your files from your phone to somewhere else). <br />
As a workaround you can setup aliases in your <code>/.bash_profile</code> to copy stuff from <em>home</em> to <em>shared</em> or <em>external storage</em> (like the <em>node_modules</em> folder). That way you can even use another editor app. <br />
Or you can just work from <code>internal storage</code> and use GIT to sync your data. <br />
I mostly do the latter, unless I have files that are not in VCS.</p>
<p>If you&#8217;ve read this far, I guess you should go <a href="https://play.google.com/store/apps/details?id=com.termux">check it out</a>.</p>