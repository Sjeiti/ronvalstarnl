<!--
  slug: implementing-search-in-a-static-website
  date: 2025-04-19
  modified: 2025-08-06
  type: post
  header: dil-8OECtq8rrNg-unsplash.jpg
  headerColofon: photo by [Dil](https://unsplash.com/@thevisualiza)
  headerClassName: no-blur darken
  category: JavaScript
  tags: SPA, static, build, search
-->

# Implementing search in a static site

The prerendering of single page applications made static websites popular (again). But server-side does have its perks; which is why so many static websites resort to cloud solutions for functionalities like comments and search.

When I [rewrote this site](/refactoring-for-speed) to ditch the WordPress REST API, I implemented a clever search. The downside of cloud is that it eventually updates with breaking changes (I've had stable applications fail because of MongoDB updates). So the only cloud service for me is a CDN for stuff that doesn't fare well under GIT.


## How search works

Searching a website that is rendered server side, mostly involves a SQL query onto specific fields in specific database tables. Search terms might occur in headings, body text, image alt text, etc. To speed things up a bit these queries are cached.

This site has no database, it is static. Many static sites resolve to cloud services for search, to basically use a database without having to maintain it, But you don't really need a database.

With our current static implementation, the equivalent of a database is a large collection of [Markdown](https://www.markdownguide.org/) files. These contain all the content of this site in a human readable way. The markdown is converted to [JSON](https://json.org/) by a build step, to be loaded on-the-fly when you navigate. This page, for instance, is loaded through [this JSON file](/data/json/post_experiment-eggs.json).
But to search these files client-side would mean loading them all into memory with a shitload of requests. So much for client-side searching ... .. .


## Find first, search later

But let's look at searching from another perspective: you might not know what people will search for, but you know exactly what they *can* find.
Keeping things static, we might not have any server-side computing power at our disposal, but we do have enough storage to search all conceivable results and store each as a JSON file.

Say you search for the word "frog". You would load `frog.json` which is simply a list of endpoints containing the word frog: `["where-are-all-the-amfibians"]`. But because we do not want non-existing search terms to timeout, we have to create an index with all the possible words that have a JSON file. This also allows us to autosuggest- or complete any searches. So we end up with one index pointing to several hundred words (the word/endpoint files are prefixed `s_`, so we can also search for the word "word"):

```
search
├─ words.json
├─ s_abandoned.json
├─ s_abbreviate.json
├─ ...
├─ s_zoomable.json
└─ s_zip.json
```

## Too large to load

That index file is a bit of a bottleneck, because it will contain all the unique words from our combined collection of Markdown files. To bring down the filesize, we will only want meaningful words, of three characters or larger.
This is all automated with a build script of course, but there is the tedious manual part of sifting through all the words to see which ones we want to exclude ([dummy text](https://www.lipsum.com/) examples for instance). Although it might help to exclude code snippets with stupid variable names.

When I first implemented this for 250 pages, I extracted 2500 search terms resulting in a 24KB JSON file. Six years later, I'm up to 320 pages with 3500 search terms in a 37KB file. Maybe time for some pruning.

Files are cached, so that index file is only loaded once.
Now when we search for "pink frog", the index file is loaded and finds entries for both "pink" and "frog". Then it loads the two related JSON files and counts the endpoints. If one endpoint is present in both, it will end up higher in the final search result.

You can try it right here (and watch the network tab):

<div data-search="{label:'',submit:'',placeholder:'search',autoSuggest:true}"></div>


## Any downsides?

The downside to this method is that it is quite straightforward: it simply searches for separate words. Word combinations are a lot harder: searching for "pink frog" we may also find a page about "pink elephants" or "dead frogs". Search operators like qoutes, wildcards and plus-signs are hard to implement. But we can match "frog" to "frogs", so that's nice.
I guess it can be improved upon. Maybe by counting words in a file, or adding weight to words in titles or headings. But its current state works and is still simple.

If you want to check out the sources, the build script is [located here](https://github.com/Sjeiti/ronvalstarnl/blob/master/task/buildSearch.js).
