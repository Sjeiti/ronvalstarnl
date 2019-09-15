<!--
  id: 3122
  date: 2016-12-24T08:49:00
  modified: 2017-01-14T11:32:35
  slug: wordpress-rest-api-using-vue-webpack
  type: post
  excerpt: <p>Two years ago I rewrote my site in Angular 1 and coupled it to WordPress using a REST API. I was going to post something on how to get this done but I never got around to it. Lately I rewrote the front-end to Vue. And since Vue is awesome I&#8217;ll write that post right [&hellip;]</p> 
  content: <p>Two years ago I rewrote my site in Angular 1 and coupled it to WordPress using a REST API. I was going to post something on how to get this done but I never got around to it. Lately <a href="/angular-two-versus-vue">I rewrote the front-end to Vue</a>. And since Vue is awesome I&#8217;ll write that post right now.</p> <h2>Why WordPress and Vue?</h2> <p>WordPress because it&#8217;s probably the most user friendly CMS out there today. And Vue because it uses plain ES6, but you could probably swap it with any of the current Javascript frameworks. Because the difficulty here is not Vue, it&#8217;s getting Webpack and WordPress to cooperate.</p> <p>A dirty job that WordPress handles well by means of Plugins are caching and SEO. A dirty job Webpack handles well is minification, injection and hot reloading (!==live reloading).</p> <h2>The main problem</h2> <p>So there we have a problem. Webpack creates and serves a static html file. WordPress serves dynamic html, but without the stuff Webpack just minified. And we need the best of both worlds.</p> <p>Now I&#8217;ve used Grunt, Gulp and currently more into calling custom js build scripts through npm run. But Webpack is new to me (it came with vue-cli). So correct me if I&#8217;m doing it wrong.</p> <h2>Directory structure</h2> <p>My starting point here is <a href="https://github.com/vuejs/vue-cli">vue-cli</a>.<br /> Previously the src directory would house my entire WordPress installation and I&#8217;d serve src locally for development. For deployment build I&#8217;d copy the changed files to dist together with concatenated/minified/autoprefixed Javascript and CSS.</p> <p>With Es6 we&#8217;re back to compiling (or <a href="https://en.wikipedia.org/wiki/Source-to-source_compiler" target="_blank">transpiling</a>). We cannot serve the source directly. Mostly due to resolvement of dependencies, not to the browser not being able to handle Es6. Webpack serves the processed files using Express. But Express does not serve PHP and SQL, and we do want that hot reload.<br /> Luckily Webpack has an easy solution for development: you can proxy specific paths. The effect is somewhat similar to Apaches mod-rewrite: we can serve stuff from anywhere while giving the impression it&#8217;s on our own host. And this is just fine for development: since all we really need is access to the REST API and to the static uploads. For local development we have no use for SEO, so correct headers and meta tags do not really matter.</p> <p>The easiest location for our WordPress installation is the dist directory. This does feel a bit blasfemous but the PHP sources do not need any compilation, so why not. The Webpack build task will target dist with the transpiled but it does not clean dist in advance.<br /> So we have Apache running a virtual host in dist, and we proxy paths from that virtual host in our Webpack proxy.</p> <pre><code data-language="javascript" data-filename="./config/index.js">(...)  module.exports = {    (...)    dev: {      (...)      proxyTable: {        '/api': {          target: 'http://localhost.wp/api/',          changeOrigin: true,          pathRewrite: {            '^/api': ''          }        }        ,'/wordpress': {          target: 'http://localhost.wp/wordpress/',          changeOrigin: true,          pathRewrite: {            '^/wordpress': ''          }        }      },      (...)    }  }</code></pre> <h2>Deployment</h2> <p>So we can safely develop. But what if we&#8217;re done coding and ready to build?<br /> Webpack writes our stuff to dist using &#8216;npm run build&#8217; but it does so to a static html file. The files Webpack generates are named to the state of the file using a hash (for cache). So we need to write those filenames to PHP. I was about to write my first Webpack Plugin when I thought I&#8217;d just change the configuration for HtmlWebpackPlugin to target header.php. Luckily the HtmlWebpackPlugin  will &#8216;parse&#8217; php just fine. It&#8217;s probably just coincidence but I&#8217;m not complaining.<br /> The only problem is that HtmlWebpackPlugin will always resolve to valid html and our header.php is invalid because of unclosed body and html tags. But we&#8217;re not doing anything dynamic with those includes anyway so we might as well ditch the header and footer includes and target index.php. Since Webpack requires a &#8216;template&#8217; as starting point we&#8217;ll rename it &#8216;_index.php&#8217;.</p> <p>Like this:</p> <pre><code data-language="PHP" data-filename="./dist/wordpress/wp-content/themes/[name]/_index.php">&lt;!DOCTYPE html&gt;  &lt;html lang="en"&gt;  &lt;head&gt;    &lt;meta charset="utf-8"&gt;    &lt;title&gt;A title&lt;/title&gt;    &lt;meta name="viewport" content="width=device-width,initial-scale=1" /&gt;    &lt;?php wp_head(); ?&gt;  &lt;/head&gt;  &lt;body&gt;    &lt;div id="app"&gt;&lt;app&gt;&lt;/app&gt;&lt;/div&gt;  &lt;/body&gt;&lt;/html&gt;</code></pre> <p>Then the build configuration for production becomes:<br /> <small>for clarity I&#8217;ve written out some directories that are better moved to a config file</small></p> <pre><code data-language="javascript" data-filename="./build/webpack.prod.conf.js">(...)  let webpackConfig = merge(baseWebpackConfig, {    (...)    plugins: [      (...)      // see https://github.com/ampedandwired/html-webpack-plugin      new HtmlWebpackPlugin({        filename: path.resolve(__dirname,'/wp-admin/themes/[theme]/index.php'),        template: path.resolve(__dirname,'/wp-admin/themes/[theme]/_index.php'),        (...)      }),      (...)    ]  })  (...)  </code></pre> <pre><code data-language="javascript" data-filename="./config/index.js">(...)  module.exports = {    build: {      env: require('./prod.env'),      index: path.resolve(__dirname,'/dist/wordpress/wp-content/themes/sjeiti/index.php'),      template: path.resolve(__dirname,'/dist/wordpress/wp-content/themes/sjeiti/_index.php'),      assetsRoot: path.resolve(__dirname,'/dist'),      assetsSubDirectory: path.resolve(__dirname,'/wordpress/wp-content/themes/sjeiti/static'),      assetsPublicPath: '/',      (...)    },    (...)  }</code></pre> <p>And that&#8217;s all there is to it: WordPress with Vue and Webpack using minimal configuration.</p> <h2>Some extras</h2> <p>Some other configuration changes you could consider:</p> <h3>I am root</h3> <p>Both vue-cli and angular-cli have the static assets and their index.html outside of src, directly in the root. My personal opinion is that both are sources and belong in src. Having the index.html in the root right next to package.json and eslint looks really weird. Here&#8217;s the adjusted configuration. To move ./index.html to ./scr/index.html:</p> <pre><code data-language="javascript" data-filename="./config/index.js">(...)  module.exports = merge(baseWebpackConfig, {    (...)    plugins: [      (...)      new HtmlWebpackPlugin({        filename: 'index.html',        template: 'src/index.html', // instead of simply index.html        (...)      }),      (...)    ]  })</code></pre> <p>To move ./static/ to ./src/static:</p> <pre><code data-language="javascript" data-filename="./build/dev-server.js">(...)  app.use(staticPath, express.static('./src/static'))  (...)</code></pre> <pre><code data-language="javascript" data-filename="./build/build.js">(...)  cp('-R', 'src/static/*', assetsPath)  (...)</code></pre> <h3>Static</h3> <p>Another configuration change you might want to fix is changing the targets for app specific files to the directory of the current theme. We already targeted the theme index.php with a _index.php template. But we can also change the target for static files.</p> <pre><code data-language="javascript" data-filename="./build/dev-server.js">(...)  app.use(staticPath, express.static('./src/static'))  (...)</code></pre> <h3>Prefetching data</h3> <p>A good way to speed up a site is to minimize xhttp requests. Of course a single page application is all xhttp requests through a REST API. What I did for my site is inject most common request results as JSON into the body. This does bloat the initial page load but you could bring that down with some <a href="https://github.com/pieroxy/lz-string">LZ string compression</a>. My HTML is now around 55KB and, with some server-side caching, loads like a breeze.</p> <h3>Inlining style and code?</h3> <p>You probably know a bit about the way a page loads. You can open your browsers network tab for a visualization. The plain html loads, this contains references to Javascript and stylesheets that are loaded next. In the meantime the user sees nothing (especially on slower mobile connections). To remedy this we can incline small amounts of CSS and Javascript (also per <a href="https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery">Google recommendation</a>).<br /> I have tried to get Webpack to inline a LESS file to the head (including a base64 encoded image), but I really have no idea. So if you know how, please let me know.</p> 
  categories: code,Javascript,backend
  tags: Wordpress,Vue,Webpack
-->

# WordPress with a REST API using Vue and Webpack

<p>Two years ago I rewrote my site in Angular 1 and coupled it to WordPress using a REST API. I was going to post something on how to get this done but I never got around to it. Lately <a href="/angular-two-versus-vue">I rewrote the front-end to Vue</a>. And since Vue is awesome I&#8217;ll write that post right now.</p>
<h2>Why WordPress and Vue?</h2>
<p>WordPress because it&#8217;s probably the most user friendly CMS out there today. And Vue because it uses plain ES6, but you could probably swap it with any of the current Javascript frameworks. Because the difficulty here is not Vue, it&#8217;s getting Webpack and WordPress to cooperate.</p>
<p>A dirty job that WordPress handles well by means of Plugins are caching and SEO. A dirty job Webpack handles well is minification, injection and hot reloading (!==live reloading).</p>
<h2>The main problem</h2>
<p>So there we have a problem. Webpack creates and serves a static html file. WordPress serves dynamic html, but without the stuff Webpack just minified. And we need the best of both worlds.</p>
<p>Now I&#8217;ve used Grunt, Gulp and currently more into calling custom js build scripts through npm run. But Webpack is new to me (it came with vue-cli). So correct me if I&#8217;m doing it wrong.</p>
<h2>Directory structure</h2>
<p>My starting point here is <a href="https://github.com/vuejs/vue-cli">vue-cli</a>.<br />
Previously the src directory would house my entire WordPress installation and I&#8217;d serve src locally for development. For deployment build I&#8217;d copy the changed files to dist together with concatenated/minified/autoprefixed Javascript and CSS.</p>
<p>With Es6 we&#8217;re back to compiling (or <a href="https://en.wikipedia.org/wiki/Source-to-source_compiler" target="_blank">transpiling</a>). We cannot serve the source directly. Mostly due to resolvement of dependencies, not to the browser not being able to handle Es6. Webpack serves the processed files using Express. But Express does not serve PHP and SQL, and we do want that hot reload.<br />
Luckily Webpack has an easy solution for development: you can proxy specific paths. The effect is somewhat similar to Apaches mod-rewrite: we can serve stuff from anywhere while giving the impression it&#8217;s on our own host. And this is just fine for development: since all we really need is access to the REST API and to the static uploads. For local development we have no use for SEO, so correct headers and meta tags do not really matter.</p>
<p>The easiest location for our WordPress installation is the dist directory. This does feel a bit blasfemous but the PHP sources do not need any compilation, so why not. The Webpack build task will target dist with the transpiled but it does not clean dist in advance.<br />
So we have Apache running a virtual host in dist, and we proxy paths from that virtual host in our Webpack proxy.</p>
<pre><code data-language="javascript" data-filename="./config/index.js">(...)
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
}</code></pre>
<h2>Deployment</h2>
<p>So we can safely develop. But what if we&#8217;re done coding and ready to build?<br />
Webpack writes our stuff to dist using &#8216;npm run build&#8217; but it does so to a static html file. The files Webpack generates are named to the state of the file using a hash (for cache). So we need to write those filenames to PHP. I was about to write my first Webpack Plugin when I thought I&#8217;d just change the configuration for HtmlWebpackPlugin to target header.php. Luckily the HtmlWebpackPlugin  will &#8216;parse&#8217; php just fine. It&#8217;s probably just coincidence but I&#8217;m not complaining.<br />
The only problem is that HtmlWebpackPlugin will always resolve to valid html and our header.php is invalid because of unclosed body and html tags. But we&#8217;re not doing anything dynamic with those includes anyway so we might as well ditch the header and footer includes and target index.php. Since Webpack requires a &#8216;template&#8217; as starting point we&#8217;ll rename it &#8216;_index.php&#8217;.</p>
<p>Like this:</p>
<pre><code data-language="PHP" data-filename="./dist/wordpress/wp-content/themes/[name]/_index.php">&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="utf-8"&gt;
  &lt;title&gt;A title&lt;/title&gt;
  &lt;meta name="viewport" content="width=device-width,initial-scale=1" /&gt;
  &lt;?php wp_head(); ?&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;&lt;app&gt;&lt;/app&gt;&lt;/div&gt;
&lt;/body&gt;&lt;/html&gt;</code></pre>
<p>Then the build configuration for production becomes:<br />
<small>for clarity I&#8217;ve written out some directories that are better moved to a config file</small></p>
<pre><code data-language="javascript" data-filename="./build/webpack.prod.conf.js">(...)
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
</code></pre>
<pre><code data-language="javascript" data-filename="./config/index.js">(...)
module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname,'/dist/wordpress/wp-content/themes/sjeiti/index.php'),
    template: path.resolve(__dirname,'/dist/wordpress/wp-content/themes/sjeiti/_index.php'),
    assetsRoot: path.resolve(__dirname,'/dist'),
    assetsSubDirectory: path.resolve(__dirname,'/wordpress/wp-content/themes/sjeiti/static'),
    assetsPublicPath: '/',
    (...)
  },
  (...)
}</code></pre>
<p>And that&#8217;s all there is to it: WordPress with Vue and Webpack using minimal configuration.</p>
<h2>Some extras</h2>
<p>Some other configuration changes you could consider:</p>
<h3>I am root</h3>
<p>Both vue-cli and angular-cli have the static assets and their index.html outside of src, directly in the root. My personal opinion is that both are sources and belong in src. Having the index.html in the root right next to package.json and eslint looks really weird. Here&#8217;s the adjusted configuration. To move ./index.html to ./scr/index.html:</p>
<pre><code data-language="javascript" data-filename="./config/index.js">(...)
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
})</code></pre>
<p>To move ./static/ to ./src/static:</p>
<pre><code data-language="javascript" data-filename="./build/dev-server.js">(...)
app.use(staticPath, express.static('./src/static'))
(...)</code></pre>
<pre><code data-language="javascript" data-filename="./build/build.js">(...)
cp('-R', 'src/static/*', assetsPath)
(...)</code></pre>
<h3>Static</h3>
<p>Another configuration change you might want to fix is changing the targets for app specific files to the directory of the current theme. We already targeted the theme index.php with a _index.php template. But we can also change the target for static files.</p>
<pre><code data-language="javascript" data-filename="./build/dev-server.js">(...)
app.use(staticPath, express.static('./src/static'))
(...)</code></pre>
<h3>Prefetching data</h3>
<p>A good way to speed up a site is to minimize xhttp requests. Of course a single page application is all xhttp requests through a REST API. What I did for my site is inject most common request results as JSON into the body. This does bloat the initial page load but you could bring that down with some <a href="https://github.com/pieroxy/lz-string">LZ string compression</a>. My HTML is now around 55KB and, with some server-side caching, loads like a breeze.</p>
<h3>Inlining style and code?</h3>
<p>You probably know a bit about the way a page loads. You can open your browsers network tab for a visualization. The plain html loads, this contains references to Javascript and stylesheets that are loaded next. In the meantime the user sees nothing (especially on slower mobile connections). To remedy this we can incline small amounts of CSS and Javascript (also per <a href="https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery">Google recommendation</a>).<br />
I have tried to get Webpack to inline a LESS file to the head (including a base64 encoded image), but I really have no idea. So if you know how, please let me know.</p>

