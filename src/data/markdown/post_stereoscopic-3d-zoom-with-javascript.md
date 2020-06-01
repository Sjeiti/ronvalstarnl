<!--
  id: 632
  description: Too bad you can't zoom in with stereoscopic 3D. But with a little JavaScript you can...
  date: 2010-09-17
  modified: 2020-06-01
  slug: stereoscopic-3d-zoom-with-javascript
  type: post
  excerpt: <p>Last year I got a microscope for my birthday. As with most toys, you play around with them for a while but eventually they end up on a shelf somewhere.</p>
  categories: code, image, JavaScript, nature, graphic design
  tags: stereoscopic
  metaKeyword: stereoscopic 3D
  metaTitle: Stereoscopic 3D zoom with JavaScript - Sjeiti
  metaDescription: Too bad you can't zoom in with stereoscopic 3D. But with a little JavaScript you can...
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Stereoscopic 3D zoom with JavaScript

Last year I got a microscope for my birthday. As with most toys, you play around with them for a while but eventually they end up on a shelf somewhere.

This year I wanted to get a good camera for macro photography. I didn’t get one yet (still have to pick one out). But I did find some good use for my microscope putting my simple Panasonic onto the eyepiece (I got the idea after doing something similar this vacation with some binoculars).

![leaf](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/microleaf.jpg)

And since I have a stereo microscope (and photoshop) I thought I’d try to make some stereoscopic photos. To my surprise it works out really well. It takes some trial and error since I have little control over the focus of my camera, and I have to color-correct each side when putting the two fotos together.

Too bad you can’t zoom in with stereoscopic 3D.  
Oh wait…. of course you can… (mousewheel)

```html
<!--example-->
<div id="stereozoom"></div>
<script>
function addChild(p,s) {
  var m = document.createElement(s)
  p.appendChild(m)
  return m
}

function mousePos(e) {
  var posx = 0
  var posy = 0
  if (!e) var e = window.event
  if (e.pageX || e.pageY) {
    posx = e.pageX
    posy = e.pageY
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
  }
  return {x: posx,y: posy}
}

function elementPos(obj) {
  var curleft = curtop = 0
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    } while (obj = obj.offsetParent)
  }
  return {x: curleft,y: curtop}
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

var stereoZoomer = (function () {
  console.log('Stereoviewer 0.1')
  var o = {
    PLAY: 'play'
    ,PAUSE: 'pause'
    ,toString: function () {
      return '[object stereoZoomer]'
    }
    ,constructor: null
  }

  var fScl = .26
  var fInvScl = 1 / fScl
  var iXoff = -.5
  var iYoff = -.5

  var iW = 800
  var iH = 600
  var mBody
  var mPage

  var mCanvas
  var oContext
  var oImgData

  var mImg = new Image()
  var iWi
  var iHi

  var mCanvasLo
  var oContextLo
  var mCanvasRo
  var oContextRo

  var mCanvasL
  var oContextL
  var mCanvasR
  var mContextR

  var fMx

  o.init = function (parentId,w,h,photo) {

    iW = w
    iH = h

    mCanvasL = document.createElement('canvas')
    mCanvasL.width = iW / 2
    mCanvasL.height = iH
    oContextL = mCanvasL.getContext('2d')

    mCanvasR = document.createElement('canvas')
    mCanvasR.width = iW / 2
    mCanvasR.height = iH
    mContextR = mCanvasR.getContext('2d')

    mBody = document.getElementsByTagName('body')[0]
    mPage = document.getElementById(parentId)
    //
    mCanvas = addChild(mPage,'canvas')
    mCanvas.width = iW
    mCanvas.height = iH
    //
    oContext = mCanvas.getContext('2d')
    oImgData = oContext.getImageData(0,0,iW,iH)
    //
    oContext.fillStyle = 'rgb(66,66,66)'
    oContext.fillRect(0,0,iW / 2,iH)
    oContext.fill()
    oContext.fillStyle = 'rgb(111,111,111)'
    oContext.fillRect(iW / 2,0,iW / 2,iH)
    oContext.fill()
    //
    mImg.onload = imgLoad
    o.loadImg(photo)
  }

  // imgLoad
  o.loadImg = function (photo) {
    console.log('loadImg',photo) // todo: remove log
    mImg.src = photo
  }

  function imgLoad(i) {
    iWi = mImg.width
    iHi = mImg.height
    //
    mCanvasLo = document.createElement('canvas')
    mCanvasLo.width = iWi / 2
    mCanvasLo.height = iHi
    oContextLo = mCanvasLo.getContext('2d')
    oContextLo.drawImage(mImg,0,0,iWi,iHi)
    //
    mCanvasRo = document.createElement('canvas')
    mCanvasRo.width = iWi / 2
    mCanvasRo.height = iHi
    oContextRo = mCanvasRo.getContext('2d')
    oContextRo.drawImage(mImg,-iWi / 2,0,iWi,iHi)
    //
    fMx = Math.max(iW / iWi,iH / iHi)
    //
    draw()
  }

  function draw() {
    drawPhoto()
    drawHud()
  }

  function drawPhoto() {
    var iNw = Math.round(fScl * iWi / 2)
    var iNh = Math.round(fScl * iHi)
    //
    var iNXoff = Math.min(Math.max(Math.round(fScl * iXoff + iW / 4),-(iNw - iW / 2)),0)
    var iNYoff = Math.min(Math.max(Math.round(fScl * iYoff + iH / 2),-(iNh - iH)),0)
    //
    oContextL.drawImage(mCanvasLo,iNXoff,iNYoff,iNw,iNh)
    mContextR.drawImage(mCanvasRo,iNXoff,iNYoff,iNw,iNh)
    //
    oContext.drawImage(mCanvasL,0,0,iW / 2,iH)
    oContext.drawImage(mCanvasR,iW / 2,0,iW / 2,iH)
  }

  function drawHud() {
    var iRds = .02 * iW
    var iHps = iRds + 10
    circle(.25 * iW + 5,iHps,iRds,'#ffffff','#000000',+4)
    circle(.75 * iW - 5,iHps,iRds,'#ffffff','#000000',-4)
  }

  function circle(x,y,r,c1,c2,xo) {
    if (!xo) xo = 0
    var oGrad = oContext.createRadialGradient(x,y,0,x + xo,y,r)
    oGrad.addColorStop(0,c1)
    oGrad.addColorStop(1,c2)
    oContext.fillStyle = oGrad
    oContext.beginPath()
    oContext.arc(x,y,r,0,360,false)
    oContext.fill()
    oContext.closePath()
  }

  function zoom(i) {
    if (i>0) fScl = Math.min(fScl * 1.01,4) 
    else fScl = Math.max(fScl / 1.01,fMx)
    fInvScl = 1 / fScl
    draw()
  }

  // mouseDown
  var oLstM = {x: 0,y: 0}
  var bDown = false
  window.onmousedown = function (e) {
    oLstM = mousePos(e)
    bDown = true
  }
  window.onmouseup = function (e) {
    bDown = false
  }
  window.onmousemove = function (e) {
    if (bDown) {
      var oMps = mousePos(e)
      if (oLstM.x!=oMps.x || oLstM.y!=oMps.y) {
        var iDx = oMps.x - oLstM.x
        var iDy = oMps.y - oLstM.y
        iXoff = Math.min(Math.max(iXoff + fInvScl * iDx,-iWi / 2 + fInvScl * iW / 4),-fInvScl * iW / 4)
        iYoff = Math.min(Math.max(iYoff + fInvScl * iDy,-iHi + fInvScl * iH / 2),-fInvScl * iH / 2)
        draw()
      }
      oLstM = oMps
    }
  }

  // canvasPos
  var oCanvasPos

  function canvasPos() {
    if (!oCanvasPos) oCanvasPos = elementPos(mCanvas)
    return oCanvasPos
  }

  // onMouseWheelSpin
  function onMouseWheelSpin(e) {
    var oCp = canvasPos()
    var oMp = mousePos(e)
    var bInside = oMp.x>oCp.x && oMp.x<(oCp.x + iW) && oMp.y>oCp.y && oMp.y<(oCp.y + iH)
    //trace(bInside+" "+iMx+" "+iMy+" "+oCp.x+" "+oCp.y);
    if (bInside) {
      if (!e) e = window.event
      zoom(e.wheelDelta?((window.opera?-1:1) * e.wheelDelta):-e.detail)
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
    }
  }

  if (window.addEventListener) window.addEventListener('DOMMouseScroll',onMouseWheelSpin,false)
  window.onmousewheel = document.onmousewheel = onMouseWheelSpin
  //
  return o
})()


const uriPrefix = 'https://test.sjeiti.com/stereozoom/data/'
stereoZoomer.init('stereozoom',720,367,`${uriPrefix}mint.jpg`)
var mZoom = document.getElementById('stereozoom')
var mUl = addChild(mZoom,'ul')
var aImgs = [
    'butterfly.jpg'
    ,'chrysalis_head.jpg'
    ,'crystal.jpg'
    ,'flyhead.jpg'
    ,'flyheadside.jpg'
    ,'flyshoulder.jpg' 
    ,'lichen.jpg'
    ,'mint.jpg'
    ,'sandurchin.jpg'
].forEach(fileName => {
  const name = fileName.split('.')[0]
  const mLi = addChild(mUl,'li')
  const mA = addChild(mLi,'button')
  mA.addEventListener('click', ()=>stereoZoomer.loadImg(uriPrefix+fileName))
  mA.appendChild(document.createTextNode(name))
})
</script>
<style type="text/css">
  ul {
    list-style: none;
    padding: 0;
  }
  li { display: inline-block; }
</style>
```

More zoomeable images [are here](https://test.ronvalstar.nl/stereozoom/). Or on my [flickr page](http://www.flickr.com/photos/sjeiti/sets/72157624940839316/).
