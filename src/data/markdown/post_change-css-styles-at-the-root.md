<!--
  id: 2390
  date: 2014-05-06T20:58:18
  modified: 2014-05-19T17:21:08
  slug: change-css-styles-at-the-root
  type: post
  excerpt: <p>When building web applications a lot of times a certain elements style needs to be changed. Mostly you can suffice by using one of the Element.classList methods. But sometimes you have to set an elements style directly (think of non-constant values like width, height, padding etc&#8230;). This is fine for single elements but when dealing [&hellip;]</p> 
  content: <p>When building web applications a lot of times a certain elements style needs to be changed. Mostly you can suffice by using one of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element.classList">Element.classList</a> methods.<br /> But sometimes you have to set an elements style directly (think of non-constant values like width, height, padding etc&#8230;). This is fine for single elements but when dealing with a bunch of them it feels wrong and slow having to loop through each of them.</p> <p><!--more--></p> <p>There is a way to set or alter CSS rules at the core, albeit not a very easy one.<br /> Lately I needed this again and refactored a script I wrote years ago. Here&#8217;s how it works.</p> <p>All stylesheets rules are somewhere inside <a href="https://developer.mozilla.org/en-US/docs/Web/API/document.styleSheets">document.styleSheets</a>, a StyleSheetList of <a href="https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet">StyleSheet</a> objects. The StyleSheetList is an Array-like Object: meaning it does not have Array methods but it does have the length property and numerical properties so you can apply methods from the Array.prototype.</p> <pre>document.styleSheets {StyleSheetList}   |-[0] {CSSStyleSheet}   |  |-cssRules {CSSRuleList}   |  |  |-[0] {CSSRule}   |  |  |-[1](...)   | [1](...)</pre> <p>As you know multiple CSS rules can apply to a single node. And the final value of the set property depends on the order of the rules and how specific they are.</p> <p>The StyleSheet objects refers to an actual CSS file or to an inline style node. Note that it could also point to sheets set by browser extensions.</p> <p>Each StyleSheet has a property called cssRules (check <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet">CSSStyleSheet</a> interface), another array-like collection of <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSRule">CSSRules</a>. The CSSRule is another interface implementation, meaning there are <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants">different types</a>. The type we&#8217;re looking for is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule">CSSStyleRule</a> which we can check by CSSRule.type or CSSRule.constructor.</p> <p>The CSSStyleRule has a property selectorText, a textual representation of our CSS rule. Which finally brings us to something we can work with.<br /> We can use a little regex to check if the rule is the one we whish to change.<br /> IE is a bit weird here: where other browsers write a selector as nodeName#id.className1.className2 IE will do it the other way around: nodeName.className1.className2#id. So we have to do an elaborate feature check (ln 19).</p> <p>Then we use <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration">CSSStyleRule.style</a>.setProperty to alter our style.</p> <p>After a bit of refactoring my script changing CSS is as easy as:</p> <pre><code data-language="javascript">rootStyle.select('p.foo a').set({color:'green'});</code></pre> <p>Here&#8217;s the complete <a href="https://gist.github.com/Sjeiti/11355844">Gist</a>:</p> <pre><code data-language="javascript" data-src="https://api.github.com/gists/11355844"></code></pre> 
  categories: CSS,Javascript
  tags: CSS,Javascript,gist
-->

# Change CSS styles at the root.

<p>When building web applications a lot of times a certain elements style needs to be changed. Mostly you can suffice by using one of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element.classList">Element.classList</a> methods.<br />
But sometimes you have to set an elements style directly (think of non-constant values like width, height, padding etc&#8230;). This is fine for single elements but when dealing with a bunch of them it feels wrong and slow having to loop through each of them.</p>
<p><!--more--></p>
<p>There is a way to set or alter CSS rules at the core, albeit not a very easy one.<br />
Lately I needed this again and refactored a script I wrote years ago. Here&#8217;s how it works.</p>
<p>All stylesheets rules are somewhere inside <a href="https://developer.mozilla.org/en-US/docs/Web/API/document.styleSheets">document.styleSheets</a>, a StyleSheetList of <a href="https://developer.mozilla.org/en-US/docs/Web/API/StyleSheet">StyleSheet</a> objects. The StyleSheetList is an Array-like Object: meaning it does not have Array methods but it does have the length property and numerical properties so you can apply methods from the Array.prototype.</p>
<pre>document.styleSheets {StyleSheetList}
 |-[0] {CSSStyleSheet}
 |  |-cssRules {CSSRuleList}
 |  |  |-[0] {CSSRule}
 |  |  |-[1](...)
 | [1](...)</pre>
<p>As you know multiple CSS rules can apply to a single node. And the final value of the set property depends on the order of the rules and how specific they are.</p>
<p>The StyleSheet objects refers to an actual CSS file or to an inline style node. Note that it could also point to sheets set by browser extensions.</p>
<p>Each StyleSheet has a property called cssRules (check <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet">CSSStyleSheet</a> interface), another array-like collection of <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSRule">CSSRules</a>. The CSSRule is another interface implementation, meaning there are <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSRule#Type_constants">different types</a>. The type we&#8217;re looking for is the <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleRule">CSSStyleRule</a> which we can check by CSSRule.type or CSSRule.constructor.</p>
<p>The CSSStyleRule has a property selectorText, a textual representation of our CSS rule. Which finally brings us to something we can work with.<br />
We can use a little regex to check if the rule is the one we whish to change.<br />
IE is a bit weird here: where other browsers write a selector as nodeName#id.className1.className2 IE will do it the other way around: nodeName.className1.className2#id. So we have to do an elaborate feature check (ln 19).</p>
<p>Then we use <a href="https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration">CSSStyleRule.style</a>.setProperty to alter our style.</p>
<p>After a bit of refactoring my script changing CSS is as easy as:</p>
<pre><code data-language="javascript">rootStyle.select('p.foo a').set({color:'green'});</code></pre>
<p>Here&#8217;s the complete <a href="https://gist.github.com/Sjeiti/11355844">Gist</a>:</p>
<pre><code data-language="javascript" data-src="https://api.github.com/gists/11355844"></code></pre>

