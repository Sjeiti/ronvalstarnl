<!--
  id: 2606
  date: 2015-10-22
  modified: 2016-12-14
  slug: how-to-structure-javascript-code-within-a-closure-in-a-logical-way
  type: post
  excerpt: <p>Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file. This post handles about the latter: structuring within a closure. A closure being a revealing-object, IIFE, module or whatever floats your boat.</p>
  categories: code, JavaScript
  tags: JavaScript
  metaKeyword: structure
  metaDescription: Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file.
  metaTitle: How to logically structure JavaScript code within closures
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# How to structure JavaScript code within a closure in a logical way

Having a good coding structure increases maintainability. This is true for the structure of files as well as the structure within a file. This post handles about the latter: structuring within a closure. A closure being a [revealing-object](https://www.google.com/search?q=javascript+%22revealing+object+pattern%22), [IIFE](https://www.google.com/search?q=javascript+IIFE), [module](https://www.google.com/search?q=javascript+modules) or whatever floats your boat.

### Revealing object

As a basis I’ll use the revealing object pattern (or revealing module pattern if you will). It looks like this:

```javascript
var window.globalObject = (function(){
    var privateVar = 254;
    function privateFunction() {
        return 2*privateVar;
    }
    function exposedFunction() {
        return 3*privateFunction();
    }
    return {
        exposedFunction: exposedFunction
    };
})();
```

The returned object literal exposes a private function.

You might argue a shorter way would be to write ‘exposedFunction’ as an anonymous one right inside the returned object literal but this could lead to messy code. Suppose some of the exposed functions are used by private functions and some are not, then your return object would be a mix of anonymous functions and function references… not very clean. Also: checkout object literals in es6!

### Variable declaration

It’s good practise to always declare all the variables at the start of your script. You should know why but if you don’t: [the reason is hoisting](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html).  
A common way of declaration is a single var statement with comma separated variables. A lesser common style is prefixing your commas. I know most people don’t like this but we’re not writing literature and prefixing commas has very valid advantages. Watch:

```javascript
var greatMethod = someNamespace.greatMethod
    ,boringCamelCasedInteger = 1
    ,happyString = 'happy' // 'unhappy'
    ,somethingUndefined
;
```

Code changes, and most changes occur at the end of the variable statement (or array or object declaration). If you suffix your commas and add lines or swap some around you will always have to check that last line (which is why there are so many sloppy arrays with trailing commas out there in the wild).  
Prefixed commas also form a neat vertical column, making it very easy to spot if you missed one.  
Having no comma at the end of the line makes it easier to comment a value.

I also always cache methods from other namespaces first. Es5 is missing the import declaration other languages have. So the top of the variable declaration is a good substitute (at least it beats the hell out of parsing them as parameters in your IIFE).

### Structuring functions

We covered the beginning and the end, now for the in between. Most of the in between stuff will be functions. If it is not a function add it right after the variable declaration and before the first function definition.

We can distuinguish a couple of function types that will make it easier to order them. A logical order is chronological, but that is just the way humans think, not how a machine runs through code. The order I try to keep is:

*   initialisation
*   event handlers
*   other functions

Some also split the last category into public and private methods but you can easily see what is exposed in the return object (so I tend not to).  
Within this order I try to be chronological. I’ll often do this for instance:

```javascript
function init(){
    initVariables();
    initSomething();
    initEvents();
    initView();
}
```

The methods are all prefixed ‘init’ and appear in chronological order. The method above, being the first function declared, will read like the index of a book: a glance will give you some idea of what is happening within our closure.  
Similarly all the event handlers are prefixed ‘handle’. Prefixing this way makes your code readable because it reflects the purpose of the function. For instance: a click handler for a submit button would be called ‘handleSubmitButtonClick’, which reads like an imperative sentence.

### Know when to split

One of the biggest issues that can make code hard to read is the size of it: 50 methods is harder to grasp than 20 methods. Similarly 2000 lines are harder to grasp than 300.  
So when functions get too big they should be split up. When modules (or classes) get too big they should be split up.

Without thinking I always split event handlers to separate (named) functions. The biggest reason being they are deferred calls.  
I do not always split up array handlers (forEach, map,.. etc) unless they are larger.

When to split a function is a bit arbitrary. Some adhere fervently to the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle): a function or method should only do one thing. Good intent but then: a module with one method doing thirty things is just as hard to read as a module with thirty methods doing one thing. So its better to stick to the not-too-much-responsibility rule (I just made that up).

Another thing to watch for is repeated patterns: if two methods do something very similar extract the similarity to a third method. This principle is known as [don’t repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself).

Then there’s the arbitrary point you reach where you have to refactor your module (or class) into several smaller ones. Mostly (but now always) you can see in advance how many modules you need (single responsibility). I mostly start scratching behing my ears when I reach the 400 line mark (or 20 methods).

### Documentation

Another very important part is documentation. I try to use jsdoc syntax for all functions. This serves two purposes. Function names cannot convey everything, sometimes it requires some elaboration. This is not only for others to understand your code but also for yourself. I don’t know about you but sometimes when I revisit old code it’s as if I’m reading someone else’s.  
The other advantage of documentation is that modern IDE’s pick up on it and use it for autocompletion and redirection.  
And with that comes another great advantage: [type definitions](http://usejsdoc.org/tags-typedef.html). This is especially useful when dealing with JSON callbacks from REST API’s.  
Well there’s also the fact that you can render project documentation from it.

### Naming conventions

We all know the regular naming conventions: functions start lowercase, class names start uppercase, constants are capitalised, etc.  
I used to write systems Hungarian notation but I’ve relented to a sparse app notation. Hungarian notation is prefixing variables to reflect the type or intended use ([see system versus apps notation](https://en.m.wikipedia.org/wiki/Hungarian_notation)).  
A boolean is prefixed with ‘has’ or ‘is’, an HTMLElement is prefixed ‘elm’.  
When dealing with multiple variables for a single subject it is also clearer to prefix the subject than it is to suffix it (think of imageWidth, imageName, imageUri etc…).  
And don’t be sparse with characters, we have minifiers for that. Be descriptive in your naming, especially for functions.

### Conclusion

Above views of course have a somewhat personal flavor, so take from it what you feel is right for you.  
The most important thing is to be consistent… and to refactor… and to have fun.

Oh yeah… here’s everything in one file:

<pre><code data-language="javascript" data-src="/static/example/structure.js"></code></pre>
