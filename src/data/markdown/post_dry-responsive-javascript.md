<!--
  id: 2477
  description: A DRY responsive Javascript solution that searches the document.styleSheets for CSSMediaRule. So breakpoints are only defined in CSS!
  date: 2014-05-26T10:34:38
  modified: 2014-08-14T09:25:59
  slug: dry-responsive-javascript
  type: post
  excerpt: <p>My last post got me thinking when I was implementing responsive Javascript events (well, signals really). I never liked it when similar things are defined or implemented multiple times. That is the reason why I tend to put classNames added through Javascript inside a value object, or why I wrote something to parse Less variables [&hellip;]</p> 
  content: <p>My <a href="/change-css-styles-at-the-root/">last post</a> got me thinking when I was implementing responsive Javascript events (well, <a href="http://millermedeiros.github.io/js-signals/" target="signals">signals</a> really). I never liked it when similar things are defined or implemented multiple times. That is the reason why I tend to put classNames added through Javascript inside a value object, or why I wrote something to parse Less variables to Javascript. Long live DRY!</p> <p><!--more--></p> <p>So why define your responsive breakpoints in Javascript when they are already defined in your CSS? You&#8217;ll have to search a little since they are neatly tucked away inside your document.styleSheets object, but they are right there!</p> <p>The document.styleSheets object is structured like this:</p> <pre>document.styleSheets {StyleSheetList}   |-[0] {CSSStyleSheet}   |  |-cssRules {CSSRuleList}   |  |  |-[0] {CSSRule}</pre> <p>CSSRule is an interface, so inside that CSSRuleList we can also find the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSMediaRule" target="_blank">CSSMediaRule</a> (its type is CSSRule.MEDIA_RULE).</p> <p>The actual media queries are in CSSMediaRule.media{MediaList}.<br /> Unless your name is IE, then you&#8217;ll say you put stuff in your list but it&#8217;s really empty.</p> <p>The only tricky part is how to interpret this media query data correctly since the notation can vary quite a lot (although in practice only a limited amount of variations is used).<br /> I&#8217;ve checked the possibilities described at <a href="http://www.w3.org/TR/css3-mediaqueries/">at W3C</a> and decided that (for now) it&#8217;s safe enough to check on min- and max-width.</p> <p>This responsive Javascript is really nothing more than a proof of concept. I haven&#8217;t done any exhaustive testing other than see it working on the four most common browsers.</p> <p>A small sidenote about when the script should kick in. In practise DOMContentLoaded fires when the stylesheets are loaded, provided the script tag is after the link tag (for Webkit and Mozilla). In theory however, it shouldn&#8217;t. So we&#8217;re safer to use the good old Window load event here.</p> <pre><code data-language="javascript" data-src="https://api.github.com/gists/23b99c384173a5bfc90a"></code></pre> 
  categories: uncategorized,code,Javascript
  tags: CSS,Javascript
-->

# DRY responsive Javascript

<p>My <a href="/change-css-styles-at-the-root/">last post</a> got me thinking when I was implementing responsive Javascript events (well, <a href="http://millermedeiros.github.io/js-signals/" target="signals">signals</a> really). I never liked it when similar things are defined or implemented multiple times. That is the reason why I tend to put classNames added through Javascript inside a value object, or why I wrote something to parse Less variables to Javascript. Long live DRY!</p>
<p><!--more--></p>
<p>So why define your responsive breakpoints in Javascript when they are already defined in your CSS? You&#8217;ll have to search a little since they are neatly tucked away inside your document.styleSheets object, but they are right there!</p>
<p>The document.styleSheets object is structured like this:</p>
<pre>document.styleSheets {StyleSheetList}
 |-[0] {CSSStyleSheet}
 |  |-cssRules {CSSRuleList}
 |  |  |-[0] {CSSRule}</pre>
<p>CSSRule is an interface, so inside that CSSRuleList we can also find the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSMediaRule" target="_blank">CSSMediaRule</a> (its type is CSSRule.MEDIA_RULE).</p>
<p>The actual media queries are in CSSMediaRule.media{MediaList}.<br />
Unless your name is IE, then you&#8217;ll say you put stuff in your list but it&#8217;s really empty.</p>
<p>The only tricky part is how to interpret this media query data correctly since the notation can vary quite a lot (although in practice only a limited amount of variations is used).<br />
I&#8217;ve checked the possibilities described at <a href="http://www.w3.org/TR/css3-mediaqueries/">at W3C</a> and decided that (for now) it&#8217;s safe enough to check on min- and max-width.</p>
<p>This responsive Javascript is really nothing more than a proof of concept. I haven&#8217;t done any exhaustive testing other than see it working on the four most common browsers.</p>
<p>A small sidenote about when the script should kick in. In practise DOMContentLoaded fires when the stylesheets are loaded, provided the script tag is after the link tag (for Webkit and Mozilla). In theory however, it shouldn&#8217;t. So we&#8217;re safer to use the good old Window load event here.</p>
<pre><code data-language="javascript" data-src="https://api.github.com/gists/23b99c384173a5bfc90a"></code></pre>

