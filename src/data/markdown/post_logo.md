<!--
  id: 1652
  slug: logo
  description: I really just wanted to update my Wordpress core. But I got a little overexcited and redesigned my site: a logo made of one HTML element and pure CSS.
  date: 2012-07-06
  modified: 2012-07-24
  type: post
  categories: CSS, graphic design
  tags: 
  metaKeyword: logo
  metaDescription: I really just wanted to update my Wordpress core. But I got a little overexcited and redesigned my site: a logo made of one HTML element and pure CSS.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Logo

<p>I really just wanted to update my WordPress core.</p>
<p><!--more--></p>
<p>But I got a little overexcited and redesigned my site. One thing let to another and I decided to redesign my logo. Then I thought: you know what would be freaking cool, a logo made of one HTML element and pure CSS.</p>
<p>Which worked out just fine if I may say so myself:</p>
<pre><code data-language="css" data-line="-1">#logo {
	width: 67px;
	height: 108px;
}
#logo:before, #logo:after {
	content: '';
	position: relative;
	top: 14px;
	left: 4px;
	display: block;
	width:56px;
	height:28px;
	background-color: #000;
	border-radius: 0 28px 0 28px;
	transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
}
#logo:after {
	top: 29px;
	left: -6px;
	width:80px;
	height:32px;
	transform:rotate(46deg) skewx(-9deg) skewy(-9deg);
}</code></pre>
<div id="logo">
<style>#logo {
	width: 67px;
	height: 108px;
	margin: 10px auto;
	zoom: 3;
}
#logo:before, #logo:after {
	content: '';
	position: relative;
	top: 14px;
	left: 4px;
	display: block;
	width:56px;
	height:28px;
	background-color: #000;
	border-radius: 0 28px 0 28px;
	-moz-transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
	-webkit-transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
	-o-transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
	-ms-transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
	transform: rotate(40deg) skewx(-3deg) skewy(-3deg);
}
#logo:after {
	top: 29px;
	left: -6px;
	width:80px;
	height:32px;
	-moz-transform: rotate(46deg) skewx(-9deg) skewy(-9deg);
	-webkit-transform: rotate(46deg) skewx(-9deg) skewy(-9deg);
	-o-transform: rotate(46deg) skewx(-9deg) skewy(-9deg);
	-ms-transform: rotate(46deg) skewx(-9deg) skewy(-9deg);
	transform: rotate(46deg) skewx(-9deg) skewy(-9deg);
}</style>
</div>
<p>Now the only problem is: how the hell do I turn this into vector?</p>
