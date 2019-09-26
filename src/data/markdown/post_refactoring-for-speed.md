<!--
  slug: refactoring-for-speed
  date: 2019-09-21
  type: post
  category: Javascript
  tag: framework, SPA, speed, build, static
-->

# refactoring for speed

On vacation this year I thought I'd speed up my site (on my phone). This soon got a little out of hand.

In 2006 I implemented Wordpress into my site. Before that I was using a custom built CMS.
Back then Wordpress was not what it is now but through the years it got better and [more popular](https://trends.google.com/trends/explore/TIMESERIES/1569346200?hl=en-AU&tz=-120&date=all&q=wordpress,joomla,drupal,wix,typo3&sni=3), and with that popularity: more prone to get hacked.

To protect it you use plugins that in turn slow down your site. To speed it all up there are caching plugins. All of which need to be updated every time Worpress pushes another minor version.

My site really wasn't that slow: I was using cached REST responses onto a Vue single page application. But every now and then an uncashed call would slow it to a crawl. And it got me wondering why I was using Wordpress in the first place. I had no webshop or anything so the only server side code that would justify it were the comments and the search.
People used to comment in the webs heydays. But the only comment as of late is one last year, by my dad :-)

## Termux

You might think coding something worthwhile on a phone is next to impossible. But because you will never match the speed of coding on a desktop you had better make it count. That slowness of coding leaves you with ample time to really think everything through.

## components

So I fired up [Termux](https://termux.com/) and created an index.html to copy/recreate the original content and style. Because there are some recurring elements I created a component base class. Very minimal but enough to separate things properly and create a life cycle.

It was about this time I decided not to use a framework: the component setup was easy, the rest can't be all that hard.

## routing

Next I wrote a build script that loads and saves all the existing REST endpoints.
You might think that the hardest part about a custom built single page application is the routing. But it is actually quite straightforward. There are really only three events you have to key into:

- read initial url and load content
- load content when local anchors are clicked
- load content when routes change

The details are in the code if you're interested. 

- [/views::open](https://github.com/Sjeiti/ronvalstarnl/blob/586fad2bba84da0382839c856ded20df7e4ba4e4/src/js/views/index.js#L9)
- [/router,js::onClick](https://github.com/Sjeiti/ronvalstarnl/blob/586fad2bba84da0382839c856ded20df7e4ba4e4/src/js/router.js#L27)
- [/router,js::onPopstate](https://github.com/Sjeiti/ronvalstarnl/blob/586fad2bba84da0382839c856ded20df7e4ba4e4/src/js/router.js#L20)

## searching is hard

So if a static site means ditching comments so be it. There are third party options if you really need them.
But search is a bit too basal to ignore. There are third party services for search as well, even free ones. But since my site is relatively small with some 200 posts, 10 pages and 40 portfolio items. I thought of a solution that just might work.

First I created a single json file with all the words that had a meaningfull search result. This is the bottleneck of this solution: more content means more words means larger filesize. For my 250 pages I extracted 2500 search terms resulting in a 24KB JSON file. Then I created a JSON file for each search term containing the endpoints for that term.
All this is automated of course: I'm not building 2500 JSON files by hand. All the hard work is done through a build script resulting in static files.
What I did have to do manually, once, is sift out the common words (ie a, to, the, for etcetera).

So when somebody searches for "dino poo" the controller loads that 24KB word file and tries to match the two words. It might find the words 'dinosaur' and 'pool' and will load the two related JSON files with resulting endpoints. These endpoints are enough for the resulting anchor hrefs but not for text. Luckily I have JSON index files for my content types so I can map the real title to the endpoint.

So that's all there is to creating a search without server side scripting. It's not perfect: you can't do combined searches (words between quotation marks). But it's good enough.

## writing Markdown with metadata

A big advantage of a CMS like Wordpress is the editor. WYSIWYG makes writing really easy but the HTML these editors spew out is often horrible. Understandably, because writing a good editor is not easy.
But this is the main reason I mostly just wrote plain HTML.
But you know what's better than writing plain HTML?... writing in Markdown.

Except that Javascript cannot interpret it by default. So since I wrote a script to leech the old REST API I was going to need a script to turn that JSON into Markdown _and_ back. Write Markdown, read JSON, that's the idea. So eventually only the script for turning Markdown to JSON is kept in the build process.

One problem though: [Commonmark](https://commonmark.org) (the Makdown spec) does not specify metadata and will not anytime soon according to the discussions.
And we _need_ metadata (like type, tags, date etc...) and it should _not_ be kept in a separate file. That leaves us with a [couple of options](https://stackoverflow.com/questions/44215896/markdown-metadata-format). Most of which look clean enough but are rendered when the markdown parser does not recognise the syntax. Which made me choose a simple HTML comment; it looks just as clean and Markdown parsers will never render it.

## speed

Along the way I almost forgot the reason it all started is speed optimisation. Luckily, to put my site life I only changed the DNS because I'm using [Netlify](https://www.netlify.com/) whereas previously it was a plain old hosting provider. So the old version was still accessible after some subdomain and database changes.
The final outcome is significant: from an average 32 to 92 on [Google Pagespeed](https://developers.google.com/speed/pagespeed/insights/) (although I cannot remember my site doing that bad).



