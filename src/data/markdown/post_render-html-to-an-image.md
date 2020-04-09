<!--
  date: 2020-04-03
  modified: 2020-04-05
  slug: render-html-to-an-image
  type: post
  header: jonny-caspari-KuudDjBHIlA-unsplash.jpg
  headerColofon: photo by [Jonny Caspari](https://unsplash.com/@jonnysplsh)
  headerClassName: no-blur darken
  excerpt: Turning HTML into an image at runtime is easy but the implementation is a bit insane.
  categories: Javascript
  tags: HTML, DOM, SVG, image, screenshot
  sticky: true
-->

# Rendering HTML to an image

With HTML/JavaScript trivial things are sometimes quite ... eeh well, not difficult ...  but *weird*. Turning HTML into images is weird..

[MDN](https://developer.mozilla.org) used to have an article about it but it got removed. It's still on the [Waybackmachine](https://web.archive.org/web/20181006205840/https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas) but it might be smart to have it as a blog post on the real interwebs, not the archive.

## The trick

The funny thing is that this is just a weird trick. There really is no existing DOM method to easily turn rendered HTML into a bitmap. It is a bit of a pity for something so fundamental and maybe even a step back if you consider we had this functionality in Flash more than ten years ago. Let's reinvent the wheel in four weird steps:

- create an SVG with a [foreignObject](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) node containing your XHTML
- set the src of an image to [the data url](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) of that SVG
- drawImage onto the [canvas](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement)
- set canvas data to target image.src

That last step is optional, it could also be the href of an anchor with a download attribute.

In Code that would be

```javascript
const {body} = document

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = canvas.height = 100

const tempImg = document.createElement('img')
tempImg.addEventListener('load', onTempImageLoad)
tempImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>em{color:red;}</style><em>I</em> lick <span>cheese</span></div></foreignObject></svg>')

const targetImg = document.createElement('img')
body.appendChild(targetImg)

function onTempImageLoad(e){
  ctx.drawImage(e.target, 0, 0)
  targetImg.src = canvas.toDataURL()
}
```

magic!

```html
<!--example-->
<p>rendered HTML:</p>
<script>const {body} = document

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 100
canvas.height = 30

const tempImg = document.createElement('img')
tempImg.addEventListener('load', onTempImageLoad)
tempImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>em{color:red;}</style><em>I</em> lick <span>cheese</span></div></foreignObject></svg>')

const targetImg = document.createElement('img')
body.appendChild(targetImg)

function onTempImageLoad(e){
  ctx.drawImage(e.target, 0, 0)
  targetImg.src = canvas.toDataURL()
}</script>
```


## a bit better

If you check the above you'll see the it's an image. But you probably want to generate something on the fly, not something predefined. So here:

```html
<!--example-->
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  padding: 1rem;
  height: 12rem;
}
* {
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
}
p:first-letter {
  font-weight: bold;
  font-size: 3rem;
}
a {
  color: blue;
  text-decoration: underline;
}
img {
  box-shadow: 0 0 1rem #ddd;
}
</style>
<link href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<section><p>Dolor sit amet consectetur <a href="#">adipiscing elit</a> curabitur vel hendrerit.</p></section>
<p><button>to img</button></p>
<script>

const {body} = document

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const tempImg = document.createElement('img')
tempImg.addEventListener('load', onTempImageLoad)

const targetImg = document.createElement('img')
body.appendChild(targetImg)

body.querySelector('button').addEventListener('click', onButtonClick)

function onButtonClick(){
  const style = `<style>${document.querySelector('style').innerHTML}</style>`
  const element = body.querySelector('section')
  const {outerHTML, offsetWidth, offsetHeight} = element
  const html = outerHTML.replace(/\n/g,'')
  //
  const svgString = getSVGString(offsetWidth,offsetHeight,style,html)
  //
  tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(svgString)
  canvas.width = offsetWidth
  canvas.height = offsetHeight
}

function onTempImageLoad(e){
  console.log('onTempImageLoad...',tempImg)
  ctx.drawImage(e.target, 0, 0)
  targetImg.src = canvas.toDataURL()
}

function getSVGString(w,h,style,html) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${style}<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${html}</div></foreignObject></svg>`
}
</script>
```

## Oh

Oh, that's not right. The fonts don't load.
You see, the [foreignObject](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject) does not really like foreign stuff after all. The name is about including foreign XML namespaces. But for security reasons it will never load any external files.
This means not only your styles should be inlined, but also images and fonts.

The size is also a bit off. We used the `offsetWidth` and `offsetHeight` of the `<section>` element but the child `<p>` has a margin. Normally this would collapse but not inside the SVG. To make it a bit easier we'll just make two CSS rules that collapse the margins manually so the SVG *can* read it. 

<small>A small detail that is easily overlooked: since we're copying the `HTMLSectionElement.outerHTML` into the SVG, CSS rules assigned to outer elements (like `<body>`) are not applied.</small>


```html
<!--example-->
<link data-font href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  padding: 1rem;
  height: 12rem;
}
* {
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
}
section>*:first-child { margin-top: 0; }
section>*:last-child { margin-bottom: 0; }
p:first-letter {
  font-weight: bold;
  font-size: 3rem;
}
a {
  color: blue;
  text-decoration: underline;
}
img {
  box-shadow: 0 0 1rem #ddd;
}
</style>
<section><p>Dolor sit amet consectetur <a href="#">adipiscing elit</a> curabitur vel hendrerit.</p></section>
<p><button>to img</button></p>
<script>
const {body} = document
const qs = document.querySelector.bind(document)

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const tempImg = document.createElement('img')
tempImg.addEventListener('load', onTempImageLoad)

const targetImg = document.createElement('img')
body.appendChild(targetImg)

let font = ''
getFontBlobs(qs('[data-font]').href).then(result=>font = result, console.error)

qs('button').addEventListener('click', onButtonClick)

function onButtonClick(){
  const style = `<style>${font}${qs('style').innerHTML}</style>`
  const element = qs('section')
  const {outerHTML, offsetWidth, offsetHeight} = element
  const html = outerHTML.replace(/\n/g,'')
console.log('html',html) // todo: remove log
  //
  const svgString = getSVGString(offsetWidth,offsetHeight,style,html)
  //
  /*const iframe = document.createElement('iframe')
  body.appendChild(iframe)
  const {contentWindow:{document:doc}} = iframe
  doc.open()
  doc.write(svgString)
  doc.close()*/
  //
  tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(svgString)
  canvas.width = offsetWidth
  canvas.height = offsetHeight
}

function onTempImageLoad({target}){
  ctx.drawImage(target, 0, 0)
  targetImg.src = canvas.toDataURL()
  // requestAnimationFrame(()=>{  
  //   ctx.drawImage(target, 0, 0)
  //   targetImg.src = canvas.toDataURL()
  // })
}

function getSVGString(w,h,style,html) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${style}${html}</div></foreignObject></svg>`
}

function getFontBlobs(href) {
  return fetch(href)
    .then(res=>res.text())
    .then(cssText=>Promise.all(cssText.match(/https:\/\/[^)]+/g).map(location=>
        new Promise((resolve, reject)=>
          fetch(location)
            .then(res=>res.blob())
            .then(blob=>{
              const reader = new FileReader()
              reader.addEventListener('load', ({target:{result}})=>resolve([location, result]))
              reader.readAsDataURL(blob)
            })
            .catch(reject)
        )
      ))
      .then(replacements=>replacements.reduce((acc, replacement)=>acc.replace(...replacement), cssText))
    )
}

</script>
```


## Some images

That wasn't so bad was it? So maybe add some images for good measure?
Well this is easier said than done: the HTML having to be XHTML. Because even if you write your document in XHTML syntax, if your doctype is declared like `<!DOCTYPE html>` any `outerHTML` will come out as HTML5. So self-closing tags like `<img src="photo.jpg" />` come out like `<img src="photo.jpg">` which is invalid XHTML and will cause the entire foreignObject to fail.
Luckily there is an easy way to create XML from HTML:

```javascript
const html5 = '<p>Foo<br>here<img src="photo.jpg"></p>'
const doc = new DOMParser().parseFromString(html5, 'text/html');
const xhtml = new XMLSerializer().serializeToString(doc);
// <p>Foo<br />here<img src="photo.jpg" /></p>
```

But we also have to inline both images and CSS backgrounds.
Let's start with traversing the DOM for images. We're doing a `querySelectorAll('img')` that we'll feed into a method that turns an image uri into base64. We'll have to load the uri so it's async and returns a promise.

```javascript
function loadImageBase64(src) {
  return new Promise((resolve,reject)=>{
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')
    img.addEventListener('error', reject)
    img.addEventListener('load', ({target})=>{
      canvas.width = target.naturalWidth
      canvas.height = target.naturalHeight
      ctx.drawImage(target, 0, 0)
      resolve(canvas.toDataURL())
    })
    img.src = src
  })
}
```

It is used in `getOuterHTMLInlined` and `getStyleInlined` which are also promise-based. And since our earlier font-inliner is also a promise we just do a `Promise.all` for the three on the click of the button.

Strangely (contrary to what I said earlier) this example *is* affected by `body` CSS. Even though DOM inspection in the SVG doesn't show it: the moment the SVG is set as img[src] it appears to have a body. To kill this Schrödingers cat we just added `svg body { padding: 0; }`.

```html
<!--example-->
<link data-font href="https://fonts.googleapis.com/css?family=Quicksand:300,500" rel="stylesheet">
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}
body {
  padding: 1rem;
  height: 18rem;
}

svg body { padding: 0; }

* {
  font-family: 'Quicksand', sans-serif;
  font-weight: 300;
}
section:after { 
  content: '';
  display: table;
  clear: both;
}
section>*:first-child { margin-top: 0; }
section>*:last-child { margin-bottom: 0; }
section img {
  float: left;
  margin-right: 1rem;
  clip-path: polygon(0 0, 0% 100%, 50% 0);
  shape-outside: polygon(0 0, 0% 100%, 50% 0);
  width: 7rem;
  height: 7rem;
}
p:first-letter {
  font-weight: bold;
  font-size: 3rem;
}
a {
  color: blue;
  text-decoration: underline;
}
del {
  background-image: url('/static/img/del.png');
  text-decoration: none;
  background-size: 100%;
  background-repeat: repeat-x;
}
img {
  box-shadow: 0 0 1rem #ddd;
}
</style>
<section><p>Dolor<img src="/static/img/crystal0.jpg" alt="crystals" /> sit amet consectetur <a href="#">adipiscing elit</a> curabitur vel hendrerit. Atque, doloremque earum enim et eum facilis id ipsam iure laborum nobis obcaecati perspiciatis quidem <del>ratione rem similique</del> sunt vel veniam, vitae.</p></section>
<p><button data-toimg>to img</button></p>
<script>
const {body} = document
const qs = document.querySelector.bind(document)

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')

const tempImg = document.createElement('img')
tempImg.addEventListener('load', onTempImageLoad)

const targetImg = document.createElement('img')
body.appendChild(targetImg)

qs('[data-toimg]').addEventListener('click', onButtonClick)

function onButtonClick(){
  const element = qs('section')
  const {offsetWidth, offsetHeight} = element
  Promise.all([
    getFontBlobs(qs('[data-font]').href)
    ,getStyleInlined(qs('style'))
    ,getXHTMLInlined(element)
  ]).then(([font, style, html])=>{
      const svgString = getSVGString(offsetWidth,offsetHeight,`<style>${font}${style}</style>`,html)
      /*const iframe = document.createElement('iframe')
      body.appendChild(iframe)
      const {contentWindow:{document:doc}} = iframe
      doc.open()
      doc.write(svgString)
      doc.close()*/
      tempImg.src = 'data:image/svg+xml,' + encodeURIComponent(svgString)
      canvas.width = offsetWidth
      canvas.height = offsetHeight
      //body.appendChild(tempImg)
  })
}

function onTempImageLoad({target}){
  ctx.drawImage(target, 0, 0)
  targetImg.src = canvas.toDataURL()
}

function getSVGString(w,h,style,html) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}px" height="${h}px"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${style}${html}</div></foreignObject></svg>`
}

function getStyleInlined(styleElement) {
  const style = styleElement.innerHTML
  const match = style.match(/url\(([^)]+)\)/g)||[]
  return Promise.all(match.map(s=>{
    const uri = s.match(/url\(['"]?([^'")]+)['"]?\)/).pop()
    return loadImageBase64(uri).then(img=>[s, s.replace(uri,img)])
  }))
  .then(replacements=>replacements.reduce((acc,replacement)=>acc.replace(...replacement), style))
}

function getXHTMLInlined(element) {
  return getOuterHTMLInlined(element).then(htmlToXHTML)
}

function getOuterHTMLInlined(element) {
  const clone = element.cloneNode(true)
  const images = clone.querySelectorAll('img')
  return Promise.all(
    Array.from(images)
      .map(image=>loadImageBase64(image.src).then(s=>image.src = s))
  )
  .then(()=>clone.outerHTML)
}

function loadImageBase64(src) {
  return new Promise((resolve,reject)=>{
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = document.createElement('img')
    img.addEventListener('error', reject)
    img.addEventListener('load', ({target})=>{
      canvas.width = target.naturalWidth
      canvas.height = target.naturalHeight
      ctx.drawImage(target, 0, 0)
      resolve(canvas.toDataURL())
    })
    img.src = src
  })
}

function htmlToXHTML(html5) {
  const doc = new DOMParser().parseFromString(html5, 'text/html');
  return new XMLSerializer().serializeToString(doc);
}

function getFontBlobs(href) {
  return fetch(href)
    .then(res=>res.text())
    .then(cssText=>Promise.all(cssText.match(/https:\/\/[^)]+/g).map(location=>
        new Promise((resolve, reject)=>
          fetch(location)
            .then(res=>res.blob())
            .then(blob=>{
              const reader = new FileReader()
              reader.addEventListener('load', ({target:{result}})=>resolve([location, result]))
              reader.readAsDataURL(blob)
            })
            .catch(reject)
        )
      ))
      .then(replacements=>replacements.reduce((acc, replacement)=>acc.replace(...replacement), cssText))
    )
}

</script>
```


## To sum up

Turning HTML into an image at runtime is easy but the implementation is a bit insane.
You need some async code to inline external files into XHTML.

Simply measuring offsetWidth/height will work fine in most cases. But what you measure should be in an isolated CSS scope, so it is better to render the SVG data into an iframe and measure that.

The last example does an adequate job of loading fonts and images but does not account for everything: you could have inlined images already, you could load fonts from within CSS instead of using the `<link>` element etc. Plenty of stuff left for you to do yourself.
