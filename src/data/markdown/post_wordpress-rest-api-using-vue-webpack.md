<!--
  date: 2016-12-24
  modified: 2020-03-16
  slug: wordpress-rest-api-using-vue-webpack
  header: studio02.jpg
  type: post
  categories: code, JavaScript, backend
  tags: Wordpress, Vue, Webpack
  description: Two years ago I rewrote my site to Angular. I was going to post how but I never got around to it. Lately I rewrote it to Vue. So here's that post.
-->

# WordPress with a REST API using Vue and Webpack

Two years ago I rewrote my site in Angular 1 and coupled it to WordPress using a REST API. I was going to post something on how to get this done but I never got around to it. Lately [I rewrote the front-end to Vue](/angular-two-versus-vue). And since Vue is awesome I’ll write that post right now.

## Why WordPress and Vue?

WordPress because it’s probably the most user friendly CMS out there today. And Vue because it uses plain ES6, but you could probably swap it with any of the current JavaScript frameworks. Because the difficulty here is not Vue, it’s getting Webpack and WordPress to cooperate.

A dirty job that WordPress handles well by means of Plugins are caching and SEO. A dirty job Webpack handles well is minification, injection and hot reloading (!==live reloading).

## The main problem

So there we have a problem. Webpack creates and serves a static html file. WordPress serves dynamic html, but without the stuff Webpack just minified. And we need the best of both worlds.

Now I’ve used Grunt, Gulp and currently more into calling custom js build scripts through npm run. But Webpack is new to me (it came with vue-cli). So correct me if I’m doing it wrong.

## Directory structure

My starting point here is [vue-cli](https://github.com/vuejs/vue-cli).  
Previously the src directory would house my entire WordPress installation and I’d serve src locally for development. For deployment build I’d copy the changed files to dist together with concatenated/minified/autoprefixed JavaScript and CSS.

With Es6 we’re back to compiling (or [transpiling](https://en.wikipedia.org/wiki/Source-to-source_compiler)). We cannot serve the source directly. Mostly due to resolvement of dependencies, not to the browser not being able to handle Es6\. Webpack serves the processed files using Express. But Express does not serve PHP and SQL, and we do want that hot reload.  
Luckily Webpack has an easy solution for development: you can proxy specific paths. The effect is somewhat similar to Apaches mod-rewrite: we can serve stuff from anywhere while giving the impression it’s on our own host. And this is just fine for development: since all we really need is access to the REST API and to the static uploads. For local development we have no use for SEO, so correct headers and meta tags do not really matter.

The easiest location for our WordPress installation is the dist directory. This does feel a bit blasfemous but the PHP sources do not need any compilation, so why not. The Webpack build task will target dist with the transpiled but it does not clean dist in advance.  
So we have Apache running a virtual host in dist, and we proxy paths from that virtual host in our Webpack proxy.

```javascript
(...)
module.exports = {
  (...)
  dev: {
    (...)
    proxyTable: {
      '/api': {
        target: 'http://localhost.wp/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
      ,'/wordpress': {
        target: 'http://localhost.wp/wordpress/',
        changeOrigin: true,
        pathRewrite: {
          '^/wordpress': ''
        }
      }
    },
    (...)
  }
}
```

## Deployment

So we can safely develop. But what if we’re done coding and ready to build?  
Webpack writes our stuff to dist using ‘npm run build’ but it does so to a static html file. The files Webpack generates are named to the state of the file using a hash (for cache). So we need to write those filenames to PHP. I was about to write my first Webpack Plugin when I thought I’d just change the configuration for HtmlWebpackPlugin to target header.php. Luckily the HtmlWebpackPlugin will ‘parse’ php just fine. It’s probably just coincidence but I’m not complaining.  
The only problem is that HtmlWebpackPlugin will always resolve to valid html and our header.php is invalid because of unclosed body and html tags. But we’re not doing anything dynamic with those includes anyway so we might as well ditch the header and footer includes and target index.php. Since Webpack requires a ‘template’ as starting point we’ll rename it ‘_index.php’.

Like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>A title</title>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <?php wp_head(); ?>
</head>
<body>
  <div id="app"><app></app></div>
</body></html>
```

Then the build configuration for production becomes:  
<small>for clarity I’ve written out some directories that are better moved to a config file</small>

```javascript
(...)
let webpackConfig = merge(baseWebpackConfig, {
  (...)
  plugins: [
    (...)
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname,'/wp-admin/themes/[theme]/index.php'),
      template: path.resolve(__dirname,'/wp-admin/themes/[theme]/_index.php'),
      (...)
    }),
    (...)
  ]
})
(...)

(...)
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname,'/dist/index.php'),
    template: path.resolve(__dirname,'/dist/_index.php'),
    assetsRoot: path.resolve(__dirname,'/dist'),
    assetsSubDirectory: path.resolve(__dirname,'/static'),
    assetsPublicPath: '/',
    (...)
  },
  (...)
}
```

And that’s all there is to it: WordPress with Vue and Webpack using minimal configuration.

## Some extras

Some other configuration changes you could consider:

### I am root

Both vue-cli and angular-cli have the static assets and their index.html outside of src, directly in the root. My personal opinion is that both are sources and belong in src. Having the index.html in the root right next to package.json and eslint looks really weird. Here’s the adjusted configuration. To move ./index.html to ./scr/index.html:

```javascript
(...)
module.exports = merge(baseWebpackConfig, {
  (...)
  plugins: [
    (...)
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html', // instead of simply index.html
      (...)
    }),
    (...)
  ]
})
```

To move ./static/ to ./src/static:

```javascript
(...)
app.use(staticPath, express.static('./src/static'))
(...)

(...)
cp('-R', 'src/static/*', assetsPath)
(...)
```

### Static

Another configuration change you might want to fix is changing the targets for app specific files to the directory of the current theme. We already targeted the theme index.php with a _index.php template. But we can also change the target for static files.

```javascript
(...)
app.use(staticPath, express.static('./src/static'))
(...)
```

### Prefetching data

A good way to speed up a site is to minimize xhttp requests. Of course a single page application is all xhttp requests through a REST API. What I did for my site is inject most common request results as JSON into the body. This does bloat the initial page load but you could bring that down with some [LZ string compression](https://github.com/pieroxy/lz-string). My HTML is now around 55KB and, with some server-side caching, loads like a breeze.

### Inlining style and code?

You probably know a bit about the way a page loads. You can open your browsers network tab for a visualization. The plain html loads, this contains references to JavaScript and stylesheets that are loaded next. In the meantime the user sees nothing (especially on slower mobile connections). To remedy this we can incline small amounts of CSS and JavaScript (also per [Google recommendation](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)).  
I have tried to get Webpack to inline a LESS file to the head (including a base64 encoded image), but I really have no idea. So if you know how, please let me know.
