<!--
  date: 2023-05-11
  modified: 2023-05-11
  slug: dont-put-your-emailaddress-in-source-files
  type: post
  categories: code
  tags: spam
  header: possessed-photography-oIMXkEuiXpc-unsplash.jpg
  headerColofon: image by [Possessed Photography](https://unsplash.com/@possessedphotography)
  headerClassName: no-blur darken
--> 

# Don't put your email address in source files

tldr: don't put your email address in source files

I should have figured it out sooner. But sometimes things take years to seep through.

I own a couple of domains, four to be exact. Two of these I use for email and these have a catch-all set up. This means that anything before the @ of that domain will be received. This is useful because every account can have a unique email address. So for an account at `foobar.com` I'd use `foobar@ronvalstar.nl`. That way: if I'd ever receive spam on that account, I'd know exactly whos security has been breached. This happened several times.
Another great advantage is that I never run out of test email addresses when developing.

The downside of a catch-all is that it is also more addresses to send your spam to. I get a lot of spam. Spamfilters sift out the bulk luckily, but there are always a few that slip through.
And the more spam you get, the longer it takes to weed out the false positives.

Because of this chore I've gotten somewhat familiar with the kind of spam I'm getting. Some pretend to be from well known companies, some try to sell me web development or SEO, some are in Polish, some are in Japanese. I seldom get a million dollar heritage though :-( 
Some spam shows a striking pattern: they'd be referring to the same websites or have placeholder text that made me suspect these emails were written using similar software or service. I've responded to some of these to get to the source. The spammers never respond back. Only once somebody told me he got my email from a service by searching business categories, but didn't (want to) say what service this was.
So I resigned to live with it and train the spamfilter.

Then I received spam in Dutch. Not a surprise in itself, but the sender was Dutch, where usually adresses and links are foreign and only the contents is translated (in the Netherlands spam is prohibited by law).
So I sent a polite inquiring email: the website the spammer was offering his SEO services to was not mine, and what made him think it was?

He said it said so in the source code!
Then it dawned on me; I've made open-source code in the past, one of which is a small script called TinySort. And there it was in plain sight, inlined in the `index.html`. So I quickly searched my spambox for these other website related services and as I suspected they all had TinySort inlined.

I don't know what bothers me more,
the fact that some developer inlined unminified sources (the minified versions I provided have no documentation mentioning the author),
the fact that SEO 'experts' don't know how to read source code,
or the fact that it took me all these years to figure out where a large portion of my spam was coming from.

So I removed my email address from the JSDoc sources. A bit late, but at least now I know.

And that's also the lesson for you boys and girls: don't put your email address in source files!
