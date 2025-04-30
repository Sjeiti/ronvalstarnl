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


## License

This project is licensed under the [GNU General Public License v3.0](LICENiSE.txt).

