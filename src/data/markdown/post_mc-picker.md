<!--
  date: 2020-03-16
  modified: 2020-03-18
  slug: mc-picker
  type: post
  header: colorbox.jpg
  categories: Javascript
  tags: color, CSS, 3D
-->

# MC Picker

I had a React project that needed [a color picker](https://sjeiti.github.io/clr/). Actually I already use `input[type=color]` but the native implementations really suck (both on Windows and OSX). So I set out to find a minimal implementation. After about fifteen minutes I gave up. Most were setup too complex and I am pedantic when it comes to front-end code.

## One element

That coloured panel for saturation and lightness that you see used everywhere (combined with one for hue) can be done with a single element (including circle selector). And the same goes for the hue panel.

```illustration
    <style>
    html,body{padding:0;margin:0;}

    .layers {
      display: flex;
    }
    
    .layered {
      position: relative;
      width: 16rem;
      height: 16rem;
      background: #EEE;
    }
    .layered:before, .layered:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      box-shadow: 0 0 0 1px #333;
    }
    .layered:before {
      transform: scale(0.9) scale(0.7, 0.35) translateY(4rem) rotate(-45deg);
      background-image: linear-gradient(90deg, white, red);
    }
    .layered:after {
      transform: scale(0.9) scale(0.7, 0.35) translateY(-4rem) rotate(-45deg);
      background-image: linear-gradient(0deg, black, transparent);
    }
    
    .layered2 {
      width: 16rem;
      height: 16rem;
      background-image: linear-gradient(0deg, black, transparent), linear-gradient(90deg, white, red);
    }
    </style>
    <div class="layers">
      <div class="layered"></div>
      <div class="layered2"></div>
    </div>
```


## Stacking gradients

The trick is layered CSS gradients. Some CSS properties like `background` and `box-shadow` can have multiple, comma-separates values. It is quite amazing what you can do with a single HTMLElement if you style it smartly.
We could even add the hue gradient into the saturation/lightness but it's easier with event listeners to let each have its own element.

So the gradient looks something like this:

```scss
.panel {
  background:
    linear-gradient(to top, black, rgba(0,0,0,0)
    ,linear-gradient(to left, red, white)
  ;
}
```

And with Javascript we can easily adjust any CSSRule especially if we add them ourselves:

```javascript
document.body.appendChild(document.createElement('style'))
const sheet = document.styleSheets[document.styleSheets.length-1]
sheet.insertRule('.foo { color: red; }', 0)
const rule = sheet.rules[0]
```


## Pseudo before and after

For quite some time now we can have two fake elements per real element controlled by the CSS pseudo selecors `:before` and `:after`. This is as close as we can currently get to shadow DOM.
Mind you these fake elements are *inside* the real element so you can never place them behind the real element because they are children, not siblings.
Since we only need event listeners on the main element the pseudo after is perfect for just reflecting the saturation/lightness position.


## Altogether now

With that we can have a color picker that looks like this

```html
<div class="mcpicker">
  <div></div>
  <div></div>
  <input>
  <input type="number">
  <input type="number">
  <input type="number">
</div>
```

...ehr, I mean this

```illustration
<style type="text/css">.mcpicker {
  position: relative;
  width: 14rem;
  height: 8rem;
  margin-bottom: 0.5rem;
  z-index: 99;
  background-color: #631ACF;
  box-shadow: 0 0 0 1px white, 0 2px 4px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3);
}
.mcpicker { margin: 1rem; }
.mcpicker > div:first-child {
  position: relative;
  width: 100%;
  height: calc(100% - 2rem);
  user-select: none;
  background: linear-gradient(to top, black, rgba(0, 0, 0, 0)), linear-gradient(to left, rgb(103, 0, 255), white);
}
.mcpicker > div:first-child:after {
  content: '';
  display: block;
  position: absolute;
  left: 87.69%;
  bottom: 81.27%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
  transform: translate(-50%, 50%);
  pointer-events: none;
}
.mcpicker > div:first-child + div {
  position: relative;
  height: 1rem;
  user-select: none;
  background: linear-gradient(to right, #F00, #FF0, #0F0, #0FF, #00F, #F0F, #F00);
}
.mcpicker > div:first-child + div:after {
  content: '';
  display: block;
  position: absolute;
  left: 73.41%;
  top: 0;
  width: 3px;
  transform: translateX(-2px);
  height: inherit;
  box-shadow: 0 0 0 1px black inset, 0 0 0 2px white inset;
  pointer-events: none;
}
.mcpicker input {
  width: 40%;
  height: 1rem;
  display: block;
  float: left;
  margin: 0;
  padding: 0.125rem 0.25rem;
  border: 0;
  border-radius: 0;
  box-sizing: border-box;
  outline: none;
  box-shadow: none;
  background-color: transparent;
  font-size: 1rem;
  line-height: 1rem;
  font-family: monospace;
  font-weight: 600;
  text-align: center;
  color: white;
}
.mcpicker input::-webkit-outer-spin-button,
.mcpicker input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.mcpicker input[type=number] {
  -moz-appearance: textfield;
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.5) inset;
}
.mcpicker input + input,
.mcpicker input + input + input,
.mcpicker input + input + input,
.mcpicker input + input + input + input {
  width: 20%;
}
</style>
<div class="mcpicker">
  <div></div>
  <div></div>
  <input value="#631ACF">
  <input type="number" value="99">
  <input type="number" value="26">
  <input type="number" value="207">
</div>
```

Note that the `box-shadow` on the main element is also stacked, you can make your shadows look a lot more realistic that way.


## Smaller and smaller and smaller

This makes the entire source of HTML/CSS/JS about 23KB (minified).
Which kind of bugged me because my unminified source was about 13KB. I was using a third party library called [color-js](https://github.com/brehaut/color-js) for the actual color calculations. The library works perfectly but it's a bit large, and not only because it contains the entire list of CSS color strings. This is a pity if you only use a tiny portion, and the sources are setup in such a way that tree shaking fails.

## Three dimensions

Rewriting the color calculations requires some understanding of the color models at play. The screen you are watching now uses the additive RGB model. The red, green and blue are actually teeny tiny light bulbs that, together, can display any color depending on the amount of light emitted.
This is straightforward enough but rather difficult and unintuïtive when it comes to visual representation in a user interface. If you put each color on it's own axis you get a simple three dimensional cube like this:

```illustration
<style>

html,body{padding:0;margin:0;}

:root {
  --size: 16rem;
  --sizeh: calc(0.5*var(--size));
  --sceneSize: calc(1.6*var(--size));
  --sizep: calc(0.259*1.11803*var(--size));
  --translate-x: calc(0.3*var(--size));
  --translate-y: calc(0.25*var(--size));
  --translate-z: calc(-0.5*var(--size));
  --rotate-x: -25deg;
  --rotate-y: 45deg;
  --perspective: 600px;
}

@media (max-width: 600px) {
  body {
    --size: 12rem;
    --sizeh: calc(0.5*var(--size));
    --sceneSize: calc(1.6*var(--size));
    --sizep: calc(0.259*1.11803*var(--size));
    --translate-x: calc(0.3*var(--size));
    --translate-y: calc(0.25*var(--size));
    --translate-z: calc(-0.5*var(--size));
  }
} 

.face {
  position: absolute;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  transition: opacity 300ms linear;
}
.face:before, .face:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(90deg, white, transparent);
}
.face:after {
  mask-image: linear-gradient(-90deg, white, transparent);
}
.face:hover { opacity: 0; }
.wyrm { background-color: #FF8080; }
.wyrm:before { background-image: linear-gradient(white, yellow); }
.wyrm:after { background-image: linear-gradient(magenta, red); }

.wcgy { background-color: #80FF80; }
.wcgy:before { background-image: linear-gradient(cyan, lime); }
.wcgy:after { background-image: linear-gradient(white, yellow); }

.wmbc { background-color: #8080FF; }
.wmbc:before { background-image: linear-gradient(cyan, white); }
.wmbc:after { background-image: linear-gradient(blue, magenta); }

.kryg { background-color: #808000; }
.kryg:before { background-image: linear-gradient(yellow, lime); }
.kryg:after { background-image: linear-gradient(red, black); }

.kgcb { background-color: #008080; }
.kgcb:before { background-image: linear-gradient(blue, black); }
.kgcb:after { background-image: linear-gradient(cyan, lime); }

.kbmr { background-color: #800080; }
.kbmr:before { background-image: linear-gradient(magenta, red); }
.kbmr:after { background-image: linear-gradient(blue, black); }

.scene {
  width: var(--sceneSize);
  height: var(--sceneSize);
  perspective: var(--perspective);
  //overflow: hidden;
}
.cube {
  width: var(--size);
  height: var(--size);
  position: relative;
  transform-style: preserve-3d;
  transform: translate3d(var(--translate-x),var(--translate-y),var(--translate-z)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y));
}
.l {
  position: absolute;
  width: var(--size);
  height: var(--size);
  float: left;
  transform-style: preserve-3d;
  transition: opacity 300ms linear;
}

.f { transform: rotateY(  0deg) translateZ(var(--sizeh)); }
.r { transform: rotateY( 90deg) translateZ(var(--sizeh)); }
.b { transform: rotateY(180deg) translateZ(var(--sizeh)); }
.l { transform: rotateY(270deg) translateZ(var(--sizeh)); }

.t { transform: rotateX( 90deg) translateZ(var(--sizeh)); }
.g { transform: rotateX(-90deg) translateZ(var(--sizeh)); }
</style>
<div class="scene">
  <div class="cube">
    <div class="face f wyrm"></div>
    <div class="face r kbmr"></div>
    <div class="face b kgcb"></div>
    <div class="face l wcgy"></div>
    <div class="face t wmbc"></div>
    <div class="face g kryg"></div>
  </div>
</div>
<script>
const {documentElement:{style}} = document
function run(){
  style.setProperty('--rotate-y', `${(0.02*Date.now())%360}deg`)
  requestAnimationFrame(run)
}
run()
</script>
```

A 3D cube looks nice but what if you need a color from somewhere inside.
Which is why some people, a long long time ago devised a cunning plan to display this differently.

If we rotate the cube so that its black tip is at the bottom and its white tip is at the top we get this view.

```illustration
<style>

html,body{padding:0;margin:0;}

:root {
  --size: 16rem;
  --sizeh: calc(0.5*var(--size));
  --sceneSize: calc(1.6*var(--size));
  --sizep: calc(0.259*1.11803*var(--size));
  --translate-x: calc(0.3*var(--size));
  --translate-y: calc(0.25*var(--size));
  --translate-z: calc(-0.5*var(--size));
  --rotate-x: -10deg;
  --rotate-y: 5deg;
  --perspective: 600px;
}

@media (max-width: 600px) {
  body {
    --size: 12rem;
    --sizeh: calc(0.5*var(--size));
    --sceneSize: calc(1.6*var(--size));
    --sizep: calc(0.259*1.11803*var(--size));
    --translate-x: calc(0.3*var(--size));
    --translate-y: calc(0.3*var(--size));
    --translate-z: calc(-0.5*var(--size));
  }
} 

.face {
  position: absolute;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  transition: opacity 300ms linear;
}
.face:before, .face:after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(90deg, white, transparent);
}
.face:after {
  mask-image: linear-gradient(-90deg, white, transparent);
}
.face:hover { opacity: 0; }
.wyrm { background-color: #FF8080; }
.wyrm:before { background-image: linear-gradient(white, yellow); }
.wyrm:after { background-image: linear-gradient(magenta, red); }

.wcgy { background-color: #80FF80; }
.wcgy:before { background-image: linear-gradient(cyan, lime); }
.wcgy:after { background-image: linear-gradient(white, yellow); }

.wmbc { background-color: #8080FF; }
.wmbc:before { background-image: linear-gradient(cyan, white); }
.wmbc:after { background-image: linear-gradient(blue, magenta); }

.kryg { background-color: #808000; }
.kryg:before { background-image: linear-gradient(yellow, lime); }
.kryg:after { background-image: linear-gradient(red, black); }

.kgcb { background-color: #008080; }
.kgcb:before { background-image: linear-gradient(blue, black); }
.kgcb:after { background-image: linear-gradient(cyan, lime); }

.kbmr { background-color: #800080; }
.kbmr:before { background-image: linear-gradient(magenta, red); }
.kbmr:after { background-image: linear-gradient(blue, black); }

.scene {
  width: var(--sceneSize);
  height: var(--sceneSize);
  perspective: var(--perspective);
}
.cube {
  width: var(--size);
  height: var(--size);
  position: relative;
  transform-style: preserve-3d;
  transform: translate3d(var(--translate-x),var(--translate-y),var(--translate-z)) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))
    rotateX(calc(90deg - 35.264deg)) rotateY(45deg);
}
.l {
  position: absolute;
  width: var(--size);
  height: var(--size);
  float: left;
  transform-style: preserve-3d;
  transition: opacity 300ms linear;
}

.f { transform: rotateY(  0deg) translateZ(var(--sizeh)); }
.r { transform: rotateY( 90deg) translateZ(var(--sizeh)); }
.b { transform: rotateY(180deg) translateZ(var(--sizeh)); }
.l { transform: rotateY(270deg) translateZ(var(--sizeh)); }

.t { transform: rotateX( 90deg) translateZ(var(--sizeh)); }
.g { transform: rotateX(-90deg) translateZ(var(--sizeh)); }
</style>
<div class="scene">
  <div class="cube">
    <div class="face f wyrm"></div>
    <div class="face r kbmr"></div>
    <div class="face b kgcb"></div>
    <div class="face l wcgy"></div>
    <div class="face t wmbc"></div>
    <div class="face g kryg"></div>
  </div>
</div>
<script>
const {documentElement:{style}} = document
function run(){
  style.setProperty('--rotate-y', `${(0.02*Date.now())%360}deg`)
  requestAnimationFrame(run)
}
run()
</script>
```

Then we can force all the coloured vertices into the plane in between the black and white vertice, creating two hexagonal pyramids. 

Instead of a red green and blue scale, we use color, intensity and lightness. Lightness is easy, it's the diagonal line from black to white in the cube. The color scale (or hue) is a bit more tricky: apart from rgb you also see the subtractive colors cyan, magenta and yellow (cmy). So the hue range is cbmryg, zigzagging along the cube. We can slant the cube so that black is on the bottom and white at the top, and pull all the hue colors into the same plane in between. Now the hue range has become a radial one and the intensity (or saturation or chroma) the distance of the radius to the vertical center.

```illustration
<style>
    html, body { margin: 0; padding: 0; }
    body {
        background-color: #fff;
        color: #444;
    }
</style>
<div id="container" style="height:500px;width:400px;"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.2.4/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.min.js"></script>
<script>
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _window = window,
    gsap = _window.gsap,
    THREE = _window.THREE;
var container;
var camera, scene, renderer;
var cubeWrapper;
var cubeWropper;
var cube;
var PI = Math.PI;
var clrV = {
  k: [0, 0, 0],
  r: [1, 0, 0],
  g: [0, 1, 0],
  b: [0, 0, 1],
  c: [0, 1, 1],
  m: [1, 0, 1],
  y: [1, 1, 0],
  w: [1, 1, 1]
};
var clr = Object.entries(clrV).reduce(function (acc, _ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      _ref2$ = _slicedToArray(_ref2[1], 3),
      r = _ref2$[0],
      g = _ref2$[1],
      b = _ref2$[2];

  acc[k] = new THREE.Color(r, g, b);
  return acc;
}, {});
var cubeData = [{
  vertex: new THREE.Vector3(1, 1, 1),
  color: clr.w
} // 0 w
, {
  vertex: new THREE.Vector3(1, -1, -1),
  color: clr.r
} // 1 r
, {
  vertex: new THREE.Vector3(1, 1, -1),
  color: clr.m
} // 2 m
, {
  vertex: new THREE.Vector3(-1, 1, -1),
  color: clr.b
} // 3 b
, {
  vertex: new THREE.Vector3(-1, 1, 1),
  color: clr.c
} // 4 c
, {
  vertex: new THREE.Vector3(-1, -1, 1),
  color: clr.g
} // 5 g
, {
  vertex: new THREE.Vector3(1, -1, 1),
  color: clr.y
} // 6 y
, {
  vertex: new THREE.Vector3(-1, -1, -1),
  color: clr.k
} // 7 k
];
cubeData.forEach(function (data, i) {
  if (i === 0) {
    data.vertexT = new THREE.Vector3(0, 2, 0);
  } else if (i === 7) {
    data.vertexT = new THREE.Vector3(0, -2, 0);
  } else {
    var rad = i / 6 * 2 * PI + 0.2 * PI;
    data.vertexT = new THREE.Vector3(1.5 * Math.sin(rad), 0, 1.5 * Math.cos(rad));
  }
});
var pointDeg = 35.2644;
init();
animate();

function init() {
  initScene();
  initCube();
  initRenderer();
  onDocumentClick();
}

function initScene() {
  container = document.getElementById('container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFFFF);
  camera = new THREE.PerspectiveCamera(20, container.offsetWidth / container.offsetHeight, 1, 10000);
  camera.position.z = 800;
  camera.position.y = 300;
  camera.lookAt(scene.position);
  var light = new THREE.AmbientLight(0xFFFFFF);
  scene.add(light);
}

function initCube() {
  var _geometry$vertices;

  var wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0,
    wireframe: true,
    transparent: true,
    opacity: 0.01
  });
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    vertexColors: true,
    shininess: 0
  }); /////////////////////////////////////////////////

  var mapVert = cubeData.map(function (d) {
    return d.color;
  });
  var geometry = new THREE.Geometry();
  geometry.dynamic = true;

  (_geometry$vertices = geometry.vertices).push.apply(_geometry$vertices, _toConsumableArray(cubeData.map(function (d) {
    return d.vertex.clone();
  })));

  geometry.faces.push(new THREE.Face3(0, 4, 5), new THREE.Face3(0, 5, 6) // front
  , new THREE.Face3(0, 6, 1), new THREE.Face3(0, 1, 2) // right
  , new THREE.Face3(0, 2, 3), new THREE.Face3(0, 3, 4) // top
  , new THREE.Face3(7, 2, 1), new THREE.Face3(7, 3, 2) // back
  , new THREE.Face3(7, 4, 3), new THREE.Face3(7, 5, 4) // left
  , new THREE.Face3(7, 1, 6), new THREE.Face3(7, 6, 5) // bottom
  );
  geometry.faces.forEach(function (face, ndx) {
    var a = face.a,
        b = face.b,
        c = face.c;
    face.vertexColors = [a, b, c].map(function (n) {
      return mapVert[n];
    });
  });
  cube = new THREE.Mesh(geometry, material);
  cube.add(new THREE.Mesh(geometry, wireframeMaterial));
  cube.scale.set(70, 70, 70);
  cubeWrapper = new THREE.Object3D();
  cubeWropper = new THREE.Object3D();
  cubeWropper.add(cube);
  cubeWrapper.add(cubeWropper);
  scene.add(cubeWrapper);
}

function initRenderer() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);
}

var state = 0;

function onDocumentClick() {
  //
  state = (state + 1) % 5;
  var obj = {
    partRotation: [0, 0, 1, 0, 1][state],
    partSquare: [0, 0, 0, 1, 0][state]
  };
  gsap.to(obj, {
    duration: 1,
    partRotation: [0, 1, 0, 1, 0][state],
    partSquare: [0, 0, 1, 0, 0][state],
    onUpdate: function onUpdate() {
      var partRotation = obj.partRotation,
          partSquare = obj.partSquare; //

      cube.rotation.x = -partRotation * 0.25 * PI;
      cubeWropper.rotation.z = partRotation * (pointDeg / 180) * PI; //

      var vWhite = cube.geometry.vertices[0];
      var vWhiteOrg = cubeData[0].vertex;
      var vWhiteTo = cubeData[0].vertexT;
      var vBlack = cube.geometry.vertices[7];
      var vBlackOrg = cubeData[7].vertex;
      var vBlackTo = cubeData[7].vertexT; //

      vWhite.x = vWhiteOrg.x + partSquare * (vWhiteTo.x - vWhiteOrg.x);
      vWhite.y = vWhiteOrg.y + partSquare * (vWhiteTo.y - vWhiteOrg.y);
      vWhite.z = vWhiteOrg.z + partSquare * (vWhiteTo.z - vWhiteOrg.z);

      for (var i = 0, l = 6; i < l; i++) {
        var vertex = cube.geometry.vertices[i + 1];
        var vertexOrg = cubeData[i + 1].vertex;
        var vertexTo = cubeData[i + 1].vertexT;
        vertex.x = vertexOrg.x + partSquare * (vertexTo.x - vertexOrg.x);
        vertex.y = vertexOrg.y + partSquare * (vertexTo.y - vertexOrg.y);
        vertex.z = vertexOrg.z + partSquare * (vertexTo.z - vertexOrg.z);
      }

      vBlack.x = vBlackOrg.x + partSquare * (vBlackTo.x - vBlackOrg.x);
      vBlack.y = vBlackOrg.y + partSquare * (vBlackTo.y - vBlackOrg.y);
      vBlack.z = vBlackOrg.z + partSquare * (vBlackTo.z - vBlackOrg.z); //

      cube.geometry.verticesNeedUpdate = true;
    }
  });
  setTimeout(onDocumentClick,2000)
}

function animate() {
  render();
  requestAnimationFrame(animate);
}

function render() {
  cubeWrapper.rotation.y += .005;
  renderer.render(scene, camera);
}
</script>
```

You see that by rearranging the vertices we get different color models. But the color calculation is still a simple matter of linear interpolation.
I say simple but I did get the color conversion methods from somewhere, no need to reinvent the wheel for this.

By replacing and rewriting the color functions it is now down to 17KB minified.

## So...

So that is that: [a simple color picker](https://sjeiti.github.io/clr/) implementation that works on any `input[type=color]` without any need to initialise. Just add script.

<!--
https://stackoverflow.com/questions/18452885/building-a-4-corners-colors-css3-gradient
https://www.shadertoy.com/view/wtlSzN
https://www.shadertoy.com/view/4lByzD
https://www.shadertoy.com/view/4tXGDf
https://www.shadertoy.com/user/paniq/sort=popular&from=72&num=8
https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Hsl-and-hsv.svg
-->
