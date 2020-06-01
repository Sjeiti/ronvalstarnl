<!--
  id: 849
  description: Creating a dynamic bookmarklet with Three.js and WebGL to display Filter Forge filters in 3D.
  date: 2011-06-03
  modified: 2020-06-01
  slug: dynamic-bookmarklets-and-webgl
  type: post
  excerpt: <p>Whenever I&#8217;m up to my neck in work I mostly get utterly bored. So to keep focussed I tend to create these little side projects. Last week I thought I&#8217;d create my first bookmarklet using WebGL rendering with Three.js</p>
  categories: code, HTML, JavaScript
  tags: 3D, bookmarklet, Filter Forge, Threejs
  metaKeyword: bookmarklet
  metaTitle: Dynamic bookmarklets (and WebGL)
  metaDescription: Creating a dynamic bookmarklet with Three.js and WebGL to display Filter Forge filters in 3D.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Dynamic bookmarklets (and WebGL)

Whenever I’m up to my neck in work I mostly get utterly bored. So to keep focussed I tend to create these little side projects. Last week I thought I’d create my first [bookmarklet](http://en.wikipedia.org/wiki/Bookmarklet) using WebGL rendering with [Three.js](https://github.com/mrdoob/three.js/)

![dynamic bookmarklet in action](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/ffpreview_preview1.jpg)

My idea was the following: you might have heard of [WebGL](http://en.wikipedia.org/wiki/WebGL), and you might have seen that cool Photoshop plugin called [Filter Forge](http://filterforge.com/) which also renders bump-, normal- and specular maps and what not. I just wanted to put the two together.

For those of you who don’t know: bookmarklets are bookmarks, but instead of a hyperlink they contain a piece of JavaScript. That means it is bound to a size limit of around 2000 characters.  
That’s not much, but this shouldn’t pose a problem with a little smart programming.

It would be tiresome having to: change some code, reload the page, drag the hyperlink to the bookmarks bar (remove the old bookmarklet), go to a filter page, click the bookmarklet.  
So I first created a test.php file that loads the html whatever page I needed the JavaScript to work on, and fires that JavaScript inmediately.

–[download sources](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/bookmarklet.rar)–

If you’ve already viewed the source you will have seen I keep the JavaScript file externally. When I’m ready to deploy it I use [YUICompressor](http://developer.yahoo.com/yui/compressor/) to make it nice and tiny (you can use any other minifier). Be sure to create closure for your code by using a self invoking function. This is not just good practice (less interference with other code) but it also makes the minifier do it’s work better.  
Then all that is left is to make an anchor and put ‘javascript:[contents of your minified js file]’ in the href. You’ll see this is what I did by jQuery in the index.html page.

Minifiers are a good way to keep things small. But since we’re not in a 4K competition we could just cheat! Why not dynamically load the external libraries we want to use.  
In the following script we’re going to check if certain js libraries are already present in the current page, and if not we’ll load them (no use of loading $ if it’s already there).

```javascript
// the list of scripts we want to load
var aScripts = [
     [function(){try{jQuery;return false;}catch(err){return true;}}(),	'https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js']
    ,[function(){try{jQuery.ui;return false;}catch(err){return true;}}(),	'https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js']
];
// the callback after a script has loaded
var iNumScripts = aScripts.length;
var checkScripts = function checkScripts(){
    iNumScripts--;
    if (iNumScripts===0) init();
}
// dynamically load scripts
var mBody = document.getElementsByTagName('body')[0];
for (var i=0;i<aScripts.length;i++) {
    if (aScripts[i][0]) {
        var mScript = document.createElement('script');
        mScript.setAttribute('type','text/javascript');
        mScript.setAttribute('src',aScripts[i][1]);
        mScript.onload = checkScripts;
        mBody.appendChild(mScript);
    } else {
        checkScripts();
    }
}
```

So once the init method fires we can use jQuery the same way we always do. But we don’t have to stop there. Why not dynamically load the entire bookmarklet functionality. That way people will always have the latest version plus we can make the bookmarklet as big as we want.

I almost forgot about the WebGL part of this post. Oh well, it might look cool but it’s not that interesting really. Just check out [ffPreview](https://ffpreview.sjeiti.com) (you’ll also find the uncompressed source [here](http://ffpreview.sjeiti.com/ffPreview.js)). I’ll be expanding on it while Three.js grows.
