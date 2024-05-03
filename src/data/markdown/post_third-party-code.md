<!--
  slug: wrap-third-party-code
  date: 9999-99-99
  modified: 9999-99-99
  type: post
  header: adi-goldstein-Hli3R6LKibo-unsplash.jpg
  headerColofon: photo by [Adi Goldstein](https://unsplash.com/@adigold1)
  headerClassName: no-blur darken
  category: code
  tag: code
-->

# Wrap third party code

I don't like other peoples code.
No I'm kidding; I learnt everything I know from other people so who am I to judge. But they say every joke is half the truth.

## searching

Good code is indeed hard to come by. When I search for some new dependency (to prevent reinventing the wheel), it takes quite some time to find something that:

- has all the features I need
- doesn't have a ton of features I don't need
- is manageable through an adequate API
- has readable code and documentation
- is under (semi) active development

A stale project is not that big of a deal. But if there's an issue, I'd rather contribute through a pull request, than having to fork the repo and use that as a dependency. 

The time it takes to find third party code that more-or-less meets all these requirements is often enough to build the feature yourself.

<!--
Because when you build it yourself all requirements are met automatically.
Except maybe documentation; I don't know if you've ever open-sourced something; it takes a lot of documentation proza to push your perfectly written code into the world. But for personal code some plain JSDoc wil do just fine.
-->

## Too difficult

Some things *are* too big or too complex or too difficult to build yourself.
The site you are reading this on has four of these:

- [@emmetio/expand-abbreviation](https://github.com/emmetio/emmet) used for templating
- [GSAP](https://greensock.com/gsap/) for animation
- [Prism](https://prismjs.com/) for code display
- [Signals](https://github.com/millermedeiros/js-signals) as event system

I've used others in other projects: calendars are one, [HammerJS](http://hammerjs.github.io/), [Marked](https://marked.js.org), [PeerJS](https://peerjs.com/).

## A design pattern

Some third party code will be used only at one specific point in your application, some will be used everywhere. One thing I strongly recommend for for the latter is to wrap it into a facade-pattern.

A facade is similar to a proxy but with a simplified API. One advantage of wrapping dependecies this way is that you can easily use your own default configuration.
An even bigger advantage is that you don't have references littered all over the place: if you decide to swap one third party code for another you'll only have to do so in one place. So it is a form of loose coupling.
Also, the simplification through a facade will enhance the readability of your code, so long as you name your methods wisely (which is the most difficult part of coding).

## For example

Sometimes all it takes is a simple utility method. Take [Marked](https://marked.js.org) for example. I can imagine a possible future where I'd need to swap it for a different compiler due to plugins or something.
So it is smart to use it like this:

```JavaScript
import { marked } from 'marked'

marked.use({gfm: true})

/**
 * Parse markdown string to HTML
 * @param markdown {string}
 * @returns {string}
 */
function md2html(markdown){
  return marked.parse(markdown)
}
```

Component based dependencies are even easier to handle because we can simply wrap them in our own component. Here's the calendar I mentioned in React:

```JavaScript
```

And here's one in Angular:

```JavaScript
```


## Conclusion

Wrapping third party code with a facade pattern is really easy and has great benefits. Chances are you are already doing it for your own code, you just haven't noticed yet.


