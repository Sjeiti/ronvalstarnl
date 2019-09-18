<!--
  id: 1826
  description: Multiple properties as variables can take up a lot of space. Here's a way to store them in a single variable using bitwise operations.
  date: 2013-01-22T14:37:43
  modified: 2014-05-06T16:24:03
  slug: multiple-properties-in-one-variable
  type: post
  excerpt: <p>Objects with multiple properties with each their own variable can get a bit messy. Here&#8217;s a nice solution to store multiple properties in a single variable.</p>
  categories: code, Java, Javascript, Actionscript
  tags: 
  metaKeyword: properties
  metaTitle: Storing multiple properties in a single integer using bitwise AND
  metaDescription: Multiple properties as variables can take up a lot of space. Here's a way to store them in a single variable using bitwise operations.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Storing multiple properties in one integer using bitwise AND

<p>Objects with multiple properties with each their own variable can get a bit messy. Here&#8217;s a nice solution to store multiple properties in a single variable.</p>
<p><!--more--> </p>
<p>Watch:<code data-language="javascript"></p>
<pre>var ability = {
	WALK:1
	,CRAWL:2
	,RUN:4
	,FLY:8
	,SWIM:16
};

function creature(name,abilities){
	return {
		toString: function(){return '[object creature "'+name+'"]'}
		,name: name
		,can: function(ability){return !!(ability&abilities)}
	};
}

var humans = creature('humans',ability.WALK|ability.RUN|ability.CRAWL|ability.SWIM);
var fishes = creature('fishes',ability.SWIM);
var turtles = creature('turtles',ability.SWIM|ability.CRAWL);
var pigs = creature('pigs',ability.WALK|ability.SWIM);

humans.can(ability.WALK); // returns true
fishes.can(ability.WALK); // returns false
turtles.can(ability.RUN); // returns false
pigs.can(ability.FLY); // returns false</pre>
<p></code></p>
<p>So the abilities itself are stored in a single private variable, but we can easily test any ability with the creature.can method. Nice huh?</p>
<h2>Spoiler alert</h2>
<p>But let me take some of the magic away by explaining what really happens.<br />
As you might have noticed the abilities are powers of two (1,2,4,8,16&#8230;). This corresponds to the binary equivalent of the decimal power of ten. The same sequence in binary is: 1,10,100,1000,10000.<br />
So adding any of the properties will always result in a unique number: ie the decimal 2 and 8 result in the binary 1010 (the properties are not really added but we&#8217;ll come to that).</p>
<h2>Bitwise AND</h2>
<p>The trick lies in the &#038; operator, or bitwise AND. <a href="http://en.wikipedia.org/wiki/Bitwise_operation">Bitwise operations</a> are extremely fast calculations because they are handled directly by the processor.<br />
Bitwise AND compares the binary equivalent of two numbers and returns a new number where the 1&#8217;s coincide. Like this:<br />
<code data-language="javascript" data-line="-1"></p>
<pre style="font: 24px/30px Inconsolata,courier,monospace;">0101 & // 5
0011 = // 3
0001   // 1</pre>
<p></code></p>
<p>In the example a pig is able walk and swim, so that&#8217;s 1|16=17, which is 10001 in binary. So to test if pigs can fly you&#8217;d do 17&#038;8, which is zero because:<br />
<code data-language="javascript" data-line="-1"></p>
<pre style="font: 24px/30px Inconsolata,courier,monospace;">10001 & // 17
01000 = // 8
00000   // 0</pre>
<p></code></p>
<h2>Bitwise OR</h2>
<p>You might also notice that the abilities are added by means of another bitwise operator: the bitwise OR, represented by the pipe sign: |. Bitwise OR is not the same as adding, but we are dealing with powers of two, so in this case it is. Bitwise OR really works like this:<br />
<code data-language="javascript" data-line="-1"></p>
<pre style="font: 24px/30px Inconsolata,courier,monospace;">0101 & // 5
0011 = // 3
0111   // 7</pre>
<p></code></p>
<h2>Impress your friends</h2>
<p>So that&#8217;s basically how it works. Fast. Practical in numerous cases (for storing a bunch of checkboxes in a database for instance). Very useful to keep your code clean and minimal (assuming you know how to read bitwise operators, but now you do). Plus looking at the variable &#8216;ability&#8217; alone immediately tells you a great deal about the rest of the code:</p>
<ul>
<li>capital properties tells you they are constant, so they don&#8217;t change</li>
<li>binary sequence tells you the properties are stored as a single variable</li>
<li>binary sequence also tells you an object can have multiple properties, but only one of each</li>
</ul>
<p>There is however a maximum to all this. Bitwise operations in Javascript are done on 32 bit numbers. But that should be more than enough for most.</p>