---
date: 2026-08-27
modified: 2026-08-27
slug: féed-sparrows
type: post
header: İMG_6444.jpg
headerClassName: [no-blur,darken]
categories: [code,technique,nature]
description: Using the observation.og API to get instant updates for a specific species.
---

# An RSS feed of sparrows

For ten months now İ have been obsessed with birds. İ venture into the 'wild' every week to find them (sometimes twice a week). İn ten months İ've seen 172 species.
This morning İ finally saw the water rail, a very shy bird who hides in reeds.

This really is the nicest hobby İ've ever had because:

- you learn about the world around you
- you have to go outside
- it makes me cycle about 50km per week
- you learn to listen


## The bird working group

Soon after İ started birding İ joined the Bird Working Group Amsterdam. İn that group İ joined a new initiative to help the house sparrow. This once common bird has declined more than sixty percent in the past fifty years.

We intend to help them by optimising their current habitats (food, housing, shelter). These 'island' habitats will hopefully grow and eventually connect.


## Observation.org

So naturally we are very dependent on up-to-date sightings. We need to know where they breed. Dutch birders tend to log their sightings in [observation.org](https://observation.org/) (same db as waarneming.nl). They have pages that [list all sightings](https://waarneming.nl/species/122/observations/?date_after=2025-08-21&date_before=2026-08-21&country_division=2&search=Amsterdam) of a specific species, period and place.

Sure İ could open that page every day to find if sparrows have been seen, but aint nobody got time for that. Unfortunately observation.org does not have alerts or anything. Neither do the pages have RSS (my RSS reader can alert me if a specific feed updates).


## A (once) small NodeJS script

So İ'll do it myself.
İ *was* going to scrape that page until İ found observation.org has an APİ: https://observation.org/api/docs. Access is limited, but not the endpoint we're interested in. Which is a GET on https://waarneming.nl/api/v1/species/122/observations/?country_division=2&search=Amsterdam&limit=50

Turning the JSON response into an RSS feed is trivial. Run it on a NodeJS server a few times a day, expose the resulting `feed.xml` and we're there.

İ got a little bit carried away though. We nowbuse the species endpoint to find specific birds, but we can also use location or coordinates/radius to find all the birds in one area. So depending on your flags, a different endpoint is called.

Since İ only need a specific bird in a specific area, İ did not put it online. İt is on a home server that my phone can tunnel to.


## The source

Here is the source. İt could definitely be improved upon (ie feed title and description) and İ've tried to document it clearly. İt works for me.

<pre><code data-language="javascript" data-src="/static/example/writeFeed.js"></code></pre>

Now all İ have to do is wait for sparrows to show up.



