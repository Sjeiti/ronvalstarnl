<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug:tdd
  type: post
  categories: code
  tags: 
  header: ian-talmacs-AUlaz_3SLDg-unsplash.jpg
  headerColofon: image by [Ian Talmacs](https://unsplash.com/@iantalmacs)
  headerClassName: no-blur darken
--> 

# Unit testing emails

Sometimes testing is magic

Test-driven-development starts at the bottom with strict linting rules. These should prevent any syntactical mishaps from being pushed.
Them come unit tests, these require a bit more conscious effort.
On the other end of the spectrum we have end-to-end testing.

With unit tests on one end, and end-to-end on the other, you can work your way to the middle, where you could write component tests. And maybe, if you work hard, you'll have an overal coverage of about eighty percent.

The hundred percent coverage seems like an asymptote. A great goal since you're there, but in practice you'll never reach it. 
There are always blind spots, flaky tests and of course a shortage of time and money.

One of my bigger annoyances is always the absence of test users on  `acceptance` or (god forbid) `production` environments. This makes proper e2e testing difficult because without valid users you're just going to have to mock all your endpoints.
There may be valid reasons; old codebases can make it next to impossible to create test users on-the-fly. Plus there could be money involved with user creation: salaries, bank accounts, payment costs.

Recently however I was in the questionable position of complete control. I was able to create a setup and teardown for the tests to create and remove test-users (regardless wether tests were passing or failing).

One big blind spot when testing any website is everything that happens outside that website. You have no control over physical environment for instance. Some flows require email verifictions, or payments.

XXXXXXX
