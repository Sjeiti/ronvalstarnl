<!--
  id: 448
  description: ...so after some hours of playing around I've got two nice noise implementations, one Perlin and one Simplex noise. Apart from the obvious speed increase the comparison is rather striking.
  date: 2010-05-12T14:05:05
  modified: 2014-05-08T06:01:26
  slug: perlin-noise-versus-simplex-noise-in-javascript-final-comparison
  type: post
  excerpt: <p>&#8230;so after some hours of coding, debugging, testing, refactoring playing around I&#8217;ve got two nice noise implementations. Apart from the obvious speed increase the comparison is rather striking.</p>
  categories: code, HTML, Javascript
  tags: math, cool shit, noise
  metaKeyword: Simplex noise
  metaTitle: Perlin noise versus Simplex noise in Javascript (final comparison)
  metaDescription: ...so after some hours of playing around I've got two nice noise implementations, one Perlin and one Simplex noise. Apart from the obvious speed increase the comparison is rather striking.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Perlin noise versus Simplex noise in Javascript (final comparison)

<br />
<style type="text/css">
			.post canvas {
				border: 1px solid black;
				width: 200px;
				height: 200px;
			}
			ul#noisess {
				margin: 0px;
				padding: 0px;
				list-style: none;
			}
				ul#noisess li {
					float: left;
					overflow: hidden;
					width: 210px;
				}
			.clear {
				clear: both;
			}
		</style>
<p>&#8230;so after some hours of <del>coding, debugging, testing, refactoring</del> playing around I&#8217;ve got two nice <a href="/perlin-noise-in-javascript-comparisons/" title="Perlin noise comparisons">noise implementations</a>. Apart from the obvious speed increase the comparison is rather striking.</p>
<p><!--more--><br />
<iframe width="100%" height="600px" src="http://test.ronvalstar.nl/perlinAndSimplex/"></iframe></p>
<p>If you&#8217;re really interested, the first thing you should read (or skim through) is <a href="http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf" rel="external">this pdf</a>. What you don&#8217;t see in the example is that the simplex noise is a bit denser, which is probably caused by the triangulating way the noise is calculated. I&#8217;ve corrected this in the canvas output by multiplying it by 1.5 (that number is nothing more but a wild guess, it looks ok though).</p>
<p>Also very obvious is the range of the noise. The simplex noise low and high values approach 0 and 1 more often. I&#8217;ve run some tests between the two types to find the lowest and highest values with different octave and falloff values. The classical Perlin noise does go near 0 and 1 but it just seems more mediated, or the simplex one is more evenly spread. Altogether, the simplex version seems more chaotic than the classic. So in theory you&#8217;d need less octaves for a similar visual effect.</p>
<p><a href="https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/perlinAndSimplex.rar">Click here</a> to download the example, and feel free to comment or mail if you have any ideas for improvement.</p>
<p>Well, I guess I&#8217;ll go and port the simplex to as3 now.</p>