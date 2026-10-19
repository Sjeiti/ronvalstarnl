## Markdown meta data

 - date: `meta[property="article:published_time`
 - modified: `meta[property="og:updated_time` and `article:modified_time`
 - slug: `{string}`
 - type: `page|post|portfolio`
 - header: image string on Cloudinary
 - headerColofon: header image attribution
 - headerClassName: `''|no-blur|darken`
 - categories
 - tags
 - description: 160 characters description
 - ~~metaKeyword~~
 - ~~id~~
 - ~~excerpt~~
 - ~~metaTitle~~
 - ~~metaDescription~~

### `type=blog` extra properties

 - sticky: `true|false`
 - related: space delimited slugs

### `type=portfolio` extra properties

 - excerpt: `string`
 - excerptNl: `string`
 - clients: `string[]`
 - collaboration: `string[]`
 - prizes: `string[]`
 - thumbnail: `string[]`
 - image: `string`
 - images: `string[]`
 - inCv: `true|false`
 - inPortfolio: `true|false`
 - dateFrom: `/\d{4}-\d\d-\d\d/`
 - dateTo: `/\d{4}-\d\d-\d\d/`


## Search

Search is a local solution that works with a word-index and per-word-JSON files that point to the correct endpoints.
The index and word files are built by running `./task/buildSearch.js`. Each unique word is then saved to a JSON file named `s_[word].json`. The JSON lists the endpoints as keys and the word occurrences as values. So the file `s_foo.json` with contents `{"bar":3,"qux":1}` shows the word 'foo' can be found on two pages, where the page '/bar' has the most occurrences.
The `buildSearch.js` indexes all markdown files for words larger than three characters, and words that are not listed in `task/commonWords.json`. 
All words are also written to the index `data/search/words.json` which is a flat string array for autocompletion.
Also see https://ronvalstar.nl/implementing-search-in-a-static-website/


## Code blocks

### Example rendering

```html
<!--example-->
<span>hello</span>
```

### Direct source

```
<pre><code data-language="javascript" data-src="/static/experiment/blob.js"></code></pre>
```


## License

This project is licensed under the [GNU General Public License v3.0](LICENiSE.txt).

