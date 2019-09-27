<!--
  id: 2947
  date: 2015-11-03
  modified: 2019-09-27
  slug: memory-and-speed-performance-of-different-namespace-patterns
  type: post
  header: ill_cova.jpg
  categories: code, JavaScript
  tags: performance, memory, speed
  metaKeyword: namespace
  metaTitle: Memory and performance of different namespace patterns
  metaDescription: Recently I worked on a large codebase with a recurring namespace pattern that was very inefficient. I decided to test memory and speed of the alternatives.
-->

# Memory and speed performance of different namespace patterns

Recently I had to work on a large codebase where multiple people were working on. There was a recurring namespace/module pattern that was very inefficient, either that or nobody really cared about good memory management.  

The pattern was this:

    window.namespace = function(){
    	function foo(){}
    	return {foo:foo};
    };

Which is alright by itself, we’re it not that throughout the code the methods were called like this:

    window.namespace().foo();

This would redeclare all the methods in that namespace each time a method was called. It also somewhat defeats the purpose of having private variables inside the closure. More often than not the methods were exposed by wrapping the declared function in an anonymous function, adding to the overall memory load.  
And in some cases, because this is not a singleton, event listeners were being added continuously causing multiple calls to the same method on a single event.  
So in actuality this is a memory consuming anti-pattern.

For the instances causing multiple event listeners I refactored the namespace to a revealing object singleton, so people could still use the old function approach.  
<small>(A simple revealing module pattern would have been better, but I really didn’t feel like refactoring all the files.)</small>

    window.namespace = (function(){
    	function foo(){}
    	var exposedModule = {foo:foo}
    		,exposedFunction = function(){return exposedModule;};
    	for (var s in exposedModule) {
    		exposedFunction[s] = exposedModule[s];
    	}
    	return exposedFunction;
    })();

But what would have been the reason for this pattern in the first place? Maybe the original author didn’t really think it through and all the others blindly copy pasted. Or maybe it’s a heap stack memory thing I don’t know about.

A nice thing to test out, and a great reason to use the evil eval. What is the difference in memory load to the approaches above?

What I’ve tested is the declaration and exposure of around 100000 functions, a number limited by the callstack size (for brevity I simplified the test names to function, module and singleton).

The function namespace starts out with low heap space but this increases after every call until the garbage collector kicks in. So there is a potential memory leak.

The module namespace starts out higher than the previous but memory stays the same.

So we should use the module namespace pattern. But wait, if you look at speed then the function pattern is way faster than the module one. Although the time you win is lost after the function is called once, it does ensure a faster pageload.

So memory or speed? Or both? We still have the singleton pattern which could be the best of both worlds. Although for this test I used an even better type of singleton.

    Object.defineProperty(window,'namespace',{
    	get:function getter(){
    		function getExpose(){
    			function foo(){}
    			getter.expose = {foo:foo};
    			return getter.expose;
    		}
    		return getter.expose||getExpose();
    	}
    });

The previous singleton would declare functions immediately. Whereas in this implementation (as in the function pattern) declaration is deferred until the first reference.  
This singleton memory starts as low as the function namespace and after one call increases to the size of the module and stays there. The initial speed is also roughly the same as that of the function pattern.

Here is a [jsperf](http://jsperf.com/memory-and-speed-of-different-namespace-patterns) for the three tests. Now obviously these tests only account for speed (not memory). But the differences between the patterns (and browsers) are still quite surprising. But keep in mind that although the module test is the slowest, your app will require the exact amount of processing time once you access the singleton or run the function.

This solution is a bit more complicated and thus more error prone. The beauty of a revealing module is that it’s quite simple. But we can simplify this by throwing the complexity into a helper method.  
Normally I use a method that turns a string into a namespace. I refactored it a bit so it can also handle functions to be turned into a getter.

In real life you will never have a namespace with 100000 methods of course. But it’s good to know how JavaScript really works and I always like to think that every bit helps. Because in the end it might be those few measly microseconds that will prevent your user from leaving or cause Google to index you higher.