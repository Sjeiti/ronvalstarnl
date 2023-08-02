<!--
  date: 2016-06-26
  modified: 2020-10-23
  slug: angular-two-versus-vue
  type: post
  header: vangular.png
  categories: code, JavaScript, rant
  tags: JavaScript, frameworks, Angular, Vue
  description: My site right now is Wordpress with a REST API coupled to a Angular 1 front-end. So naturally I thought of migrating to Angular 2. Then I found Vue.
-->

# Angular 2 or Vue

My site <del>right now is</del> was WordPress with a REST API coupled to a Angular 1 front-end. So naturally I thought of migrating to Angular 2, just to keep my skills up. Then I found Vue….

[Angular 2](https://angularjs.org/) was totally rewritten and using Typescript. I had never used Typescript so I was very curious. I have been using more and more ES6 over to last year plus I used to be very well versed in another typed form of Ecmascript called ActionScript. So that’s my point of reference. For _your_ point of reference: I am no stranger to frameworks. Over the last 15 years I’ve used frameworks in PHP, Java, ActionScript and JavaScript.

## migrating to Angular 2

My site had a few quirky things like routes from a REST API, template injection and DOM node swapping. But I wasn’t too worried; if it worked in v1, why would it not work in v2?  
At first I read numerous articles on how to migrate from Angular v1 to v2\. Tried it, and decided it would be easier to simply start over. Then I tried to get started using the docs on the Angular site. While still trying to get my tutorial stuff compiled I found [angular-cli](https://github.com/angular/angular-cli), which simply creates a working scaffold (after downloading +200MB of NPM scripts).

## So far so good

HTML5 mode… check. Routes working… check. Alright, let’s do a REST call and inject some more routes. Eehr, wait… no caching? Okay, I guess I could write that. Oh, where do I inject routes? No? [resetConfig](https://angular.io/docs/ts/latest/api/router/index/Router-class.html#!#resetConfig-anchor) are you sure? (wtf?). Okay fine. Now, let’s make some configuration files so I can inject constants (like we did in ng 1). Angular says I should use _OpaqueToken_, then define the interface and after that create a constant then both the constant together with the OpaqueToken instance should be registered as a provider and – then – I can inject it somewhere and use it. What’s with all the incantations? I just need a frozen object module! Alright, let’s see, next: adjust page title and meta tags according to routes. No? Eeeeehm, wait, this is getting a bit ridiculous. Why does everything I want to do feel like a hack. (ng-include? runtime template injection?… ah, thought so).

### aaargh

![blackjack](https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/blackjack.jpg)

You see, I was expecting big changes. I don’t mind Typescript, love the ability to interface (not so fond of the amount of **this**, or the way private is not really private). I just thought the changes would be syntactical and architectural changes. But these are all very functional changes I’m running into. This is not Angular 2, this is version 1 of something completely different. Did I say 1? I mean lower.

For a framework Angular 2 is really very unintuitive. It feels overengineered in a sense that it makes trivial stuff harder. I’m sure everything will be a breeze once I get over that steep learning curve but I’m not so sure I’m willing to invest the time.

Especially when there might be better options. For instance: what is this [Vue](https://vuejs.org/) I keep reading about? Hey, there is a [vue-cli](https://github.com/vuejs/vue-cli) (and it only needs about a 100MB of NPM installs).

## Awesome

Okay, here we go again. HTML5 mode… check. Routes working… check. Alright, let’s do a REST call and inject some more routes. Eehr, wait… no http module. I’ll use this one. Injecting routes hmmm, ah wait, this works. Then a module with a frozen object for configuration. Change header data; simple DOM manipulation. No template injection, okay… (sound of keyboard tapping)… model module… bind this for scope… ah no scratch the bind, inlining is easier (but uglier). Hocus pocus Webstack… holy shit look at that speed compared to my ng1 site!

### Yeah I think I’ll stick with Vue

The thing with Vue is that it has a specific purpose and it does it well. All other problems can be solved by pure Es6\. Ng2 is capable of way more (and is advocated as such) but requires you to code in a rigid structured way. I’m not talking about Typescript here. Having coded ActionScript for years I love typed languages, and I loved the classical way ActionScript worked without having to resolve to this. Unfortunately I never liked classical objects in JavaScript or Typescript. The former because it offered no value against prototypal, the latter because of all the this.

## So forget Angular 2?

Would I use Vue for larger projects with multiple coders? I don’t know… probably not. Rigid structures like Angular 2 dictates are very helpful when coding in teams. I’ve done enough code reviews to know that freedom mostly goes hand in hand with a big fucking mess. I’m sure Vue would work in a team of senior devs adhering to strict coding guidelines. But first we’d have to get all those senior devs to agree on the coding guidelines, so that would never work.  
So I guess I should give Angular 2 one more go. Even if it’s just to satisfy my curiosity.

But for now I’m sticking with Vue.
