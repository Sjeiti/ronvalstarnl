---
date: 2026-09-26
modified: 2026-09-26
slug: subtle-dark-patterns
type: post
header: 
headerClassName: [no-blur,darken]
categories: [code,technique]
description: Netlify using subtle dark patterns to get you to upgrade.
---

# Subtle dark patterns

Over the years I've heard disturbing news about Netlify, the service that builds and publishes this site after I merge to master on Github.
Scary stories about [large bills](https://www.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/), or [canceled accounts](https://www.reddit.com/r/webdev/comments/1jbcxyk/netlify_cancelled_my_account_over_me_not_paying/). This always happens to other people of course, but fear of a [hug of death](https://en.wikipedia.org/wiki/Slashdot_effect) is always in the back of my mind.

So I was not really surprised when I received a Netlify email september 13 that all my projects are suspended; meaning all sites hosted are taken down. Well, I was somewhat surprised because september 1st they had already sent me an email that my builds had been paused, and if I'd be so kind to upgrade my account. It seems I had spent all my credits: "your published sites will be suspended until credits are restored or your billing cycle resets on September 26".
Which is fine by me, I don't publish that often so I'll just wait.

But now they've taken everything offline.

Strangely I've never run into these credit limits before. I don't publish that often and my site is static, with a separate CDN for larger static assets.

I am totally fine with Netlify taking my projects offline and not charging me money. I'm on the free tier so I am not going to look a gift horse in the mouth.

It's just this sneaky way they try to get me to upgrade is what rubs me the wrong way.

What happened was this: on august 27 I was trying to publish something but the build kept minifying example files it was not meant to minify. Of course the build was perfectly fine locally, so I blamed Netlify. I was on the Netlify admin trying to fix this when I noticed a little AI button.

I had already scoured the internet for a solution without success, but the almighty Netlify AI overlord might just know what the issue is.

And it did! I asked one question and it said the issue was really my Webpack config and: "if you like I can push a fix and create a PR". So I responded: "eeeh, sure (?)". And [here is the PR](https://github.com/Sjeiti/ronvalstarnl/pull/156), it works.

That interaction felt magical in the sense of Arthur C. Clarkes third law "any sufficiently advanced technology is indistinguishable from magic". This magic had just cost me 206 credits of the 300 one gets in the free tier.

That little AI button was the carrot that choked my gift horse. It is a subtle dark pattern imho.

By the time you read this it will be september 26 because I'll probably be too lazy to switch services or go back to good old FTP.

