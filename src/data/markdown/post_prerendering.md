<!--
  date: 2024-08-09
  modified: 2025-04-18
  slug: prerendering-with-jsdom
  type: post
  header: homa-appliances-5hPe-Tr2wog-unsplash.jpg
  headerColofon: photo by [Homa appliances](https://unsplash.com/@homaappliances/collections)
  headerClassName: darken
  categories: code, work
  tags: seo, rss
  description: You don't need cloud services for prerendering. Using JSDOM you can easily setup a build script that renders HTML for every page.
-->

# Prerendering with JSDOM

Ever since Googlebot could render JavaScript (about ten years ago) I stopped worrying about prerendering content in the SPA that is my site.
I really cannot be bothered with SEO. But one thing that did always bug me was that RSS previews did not show any content, they only showed the initial index. In a real life browser that initial index loads some scripts, the scripts do some XHR for content, and put the content on the screen. Ain't no RSS reader got time for that.

I did make some half hearted attempts to use [Netlify](https://docs.netlify.com/site-deploys/post-processing/prerendering/) and/or [Prerender.io](https://prerender.io/), but I never really got it working properly.


## Doing it myself

Since I sometimes enjoy hour long train rides, and I can develop this site on [Termux](https://termux.dev/en/) using [Vim](https://www.vim.org/); I thought I'd have another go at it using [JSDOM](https://github.com/jsdom/jsdom). My experience with JSDOM is in context of unit-testing. And although I firmly believe DOM related testing should be done in a browser, prerendering might just work perfectly with JSDOM.

### Getting started

Way back before JavaScript, pages were written to the server in the folder represented by [`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname). From that folder the `index.html` would be served.
For prerendering we will just use that old `DirectoryIndex` behaviour and create a shitload of folders with index htmls.

After building the site we'll use JSDOM to fake a browser environment, load a route, and write the changed HTML structure to the filesystem.

To get [a JSDOM instance](https://github.com/jsdom/jsdom?tab=readme-ov-file#basic-usage) requires an HTML string and a location (the latter is optional, but useful in our case).
The HTML is what is initially used as [starting point](https://github.com/Sjeiti/ronvalstarnl/blob/master/src/index.html).

```javascript
import {JSDOM} from 'jsdom'

const dom = new JSDOM(html, { url })
```

Next to figure out is what code to run to render any page. Just running the regular main-js might seem smart but it loads a lot of things we do not really need for a first render. We wouldn't want to remove the `no-js` class in the prerender. We don't need the header experiments to run, we don't need SVG icons. Arguably, we don't even need to render any components yet. We just need to render content.

So we do a dynamic import for all the views, and run the `open` method from [the router](https://github.com/Sjeiti/ronvalstarnl/blob/2c06f47b0e50f0653d29a0c03b64fb42e6b327ae/src/js/router.js#L84).

Mind you, this site is vanilla JavaScript with a simple router. But I guess you'd just have to `createRoot` for React, or `bootstrapApplication` in Angular, and conditionally hide certain functionality by setting `globalThis.prerendering` prior to initialisation. We can then use this `globalThis.prerendering` to conditionally block things from happening in the rest of the code (for SVG icons for instance).

### Errors everywhere

At this point errors started being thrown around. Most of these stemmed from `window` properties not being accessible on `globalThis`. You see; JSDOM is not a mock implementation of the entire [document object model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). Most web API's are left out for brevity. So after JSDOM instantiation some more preparation is required.

For instance; when you do `document.querySelector` you simply assume `document` to be a global.
Simply merging `window` into `globalThis` might seem like a good plan but it fails so often that it is easier to set specific properties one by one.

Then there is the missing `fetch`. Since we're still running on NodeJS, we'll have to write an adapter from [`fs.readFile`](https://nodejs.org/api/fs.html#fsreadfilepath-options-callback) to [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
So this:

```javascript
globalThis.fetch = file=>{
  const path = './dist'+file
  const body = readFileSync(path)
  return Promise.resolve(new Response(body))
}
```

There are also some methods that simply require a ['noop'](https://en.m.wikipedia.org/wiki/NOP_(code)), and we're almost good to go.

### NodeJS doesn't do raw imports

Webpack was still using [`raw-loader`](https://v4.webpack.js.org/loaders/raw-loader/) to import and place SVG symbol definitions. This does not work in NodeJS directly as it does not understand the `!!raw-loader!` syntax. 

This is easily remedied by replacing the raw-loader with a custom build step generating a js file that exports the SVG data as a string.

But more importantly; the amount of SVG data multiplied by the amount of pages is substantial in terms of extra MB's (27.7 to be exact). The SVG data is really not needed in the prerendered HTML.

So we'll do that conditionally by checking the `globalThis.prerendering` boolean we set at the start of our prerendering code.

### Isolation

All this worked for a single route but not for multiple. I had hoped it would work by simply setting the JSDOM URL and calling the router again, or reinitialising JSDOM, but alas.

Luckily the answer is the solution to another problem. Prerendering over 300 pages takes some time. A logical pattern would be to use [workers](https://nodejs.org/api/worker_threads.html), since these can run in parallel. An added benefit is the isolated scope in which to call the dynamic imports.

Now all I had to do is figure out the amount of workers to call and create a dynamic equivalent for `Promise.all`.

### n - 1

So [Stackoverflow says](https://stackoverflow.com/a/66843127/695734) the answer is `n - 1`, so we'll go with that. N being the number of cpu's./ Accounting for the fact that some return an empty array, we'll get something like:

```JavaScript
import {cpus} from 'os'
const maxWorkers = Math.max(4, cpus().length-1)
```

</small>(using [ESM](https://nodejs.org/api/esm.html) syntax here, otherwise use `require`)</small>

### `Promise.all`, but for dynamic arrays

We cannot instantiate all workers at once, so we need to implement something like a dynamic `Promise.all`.

I would have used a real JavaScript generator, but ESM NodeJS seems to have issues with `function* { yield }`. We can achieve the same functionality with nested functions and a bit more code.


```JavaScript
const generator = getWorkerGenerator(pages,html)
await dynamicPromiseAll(generator, maxWorkers)

function getWorkerGenerator(uris,html){
  const _uris = uris.slice(0)
  return function(){
    const uri = _uris.pop()
    return uri&&createWorker(uri,html)
  }
}

function dynamicPromiseAll(generator, max){
  return new Promise((resolve)=>{
    let num = 0
    for(let i=0;i<max;i++) addPromise()
    function resolvePromise(){
      num--
      addPromise()
        ||num<=0
        &&resolve()
    }
    function addPromise(){
      const promise = generator()
      if (promise) {
        promise
          .then(resolvePromise)
          .catch(console.log.bind(console,'Catch err'))
        num++
      }
      return promise
    }
  })
}   
```


## Result

The result is an extra 287 files with a total size of 5.2 MB.

|        | before | after   |
|--------|--------|---------|
| size   | 8.6 MB | 13.8 MB |
| files* | 399    | 686     |

<small>\* not counting the 4854 files generated by [the static search](/refactoring-for-speed#searching-is-hard).</small>


## Too long, didn't read

You don't need cloud services for prerendering (which requires middleware/htaccess routing configuration).
Using JSDOM you can easily setup a build script that renders HTML for every page.
You will need to expand JSDOM somewhat, to handle XHR for instance. You also should be mindfull how you much you render in terms of filesize.

You can checkout my [source here](https://github.com/Sjeiti/ronvalstarnl/blob/master/task/prerender.js).

<!--

5253 total files, 8.6 MB total size of deploy

5540 total files, 41.5 MB total size of deploy

4854 399

     686

328


5540 total files, 13.8 MB total size of deploy

-->
