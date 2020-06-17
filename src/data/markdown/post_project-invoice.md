<!--
  id: 2967
  date: 2018-03-03
  modified: 2019-09-27
  slug: project-invoice
  type: post
  header: pi.jpg
  headerClassName: no-blur
  categories: code, CSS, HTML, JavaScript, work, open source
  tags: Angular, accounting, invoicing, Vue
  metaKeyword: invoice
  metaDescription: An invoice application that keeps your data private by simply not storing it in the cloud.
-->

# Project invoice

A few years ago Google silently [disabled a spreadsheets feature](https://code.google.com/p/google-apps-script-issues/issues/detail?id=5174) that could be used to retrieve data from other spreadsheets. So I could no longer [create invoices](http://ronvalstar.nl/using-google-spreadsheets-for-invoicing) automatically and was back to having to make them by hand.

## alternatives

Of course I first had a look at the alternatives out there, albeit a quick one. Most of them are subscription/cloud based services. Some are even free, until you want the useful stuff.  
Pricing varies between a 100 an 150 euro’s per year. Which is not a lot but I tend to get too critical when I have to pay money for things I could easily build myself.

## open source

A quick mockup with Angular 1 and localStorage was easy enough (this was late 2015, hence ng1). And if it works for me it might work for others so I thought I’d throw it online and open source it.  
Which is easier said than done of course. First I ported it to Angular 2+ and made it more user-friendly.  
I had been building and using it for a while when I discovered a severe memory leak. I wasn’t able to fix it because Angular is a bitch to debug. Long story short: two weeks to rewrite everything to Vue. The app is now smaller, runs faster and also compiles faster.

## release

So that’s where it’s at now. The sources are on [Github](https://github.com/Sjeiti/project-invoice) (together with enough todo’s in the issue tracker). Everything is published to a subdomain (I’m still looking for a good domain name, although project-invoice does abbreviate nicely).

I could easily go on for another year of finetuning and adding features, or I could just throw it out there. So all I need now are testers.  
If you are self employed and looking for an easy way to do your invoicing [please give this app a go](https://projectinvoice.nl). And leave any issues you find or ideas you have in the [issue tracker](https://github.com/Sjeiti/project-invoice/issues).

## why you want this?

*   All **private data** remains private. After the initial load of the application itself there is no communication from- or to the server. Your data is stored on your machine or device in localStorage.
*   Invoices are **well designed** and customizable.
*   It’s **easy to use**
*   It’s **open-source**. So if a bug needs fixing or you want a new feature anyone can fix and/or build it. You can even run it on a local server should you want to.
*   Its **free**.
*   You can use the online version or run a local copy

![Project invoice dashboard](https://res.cloudinary.com/dn1rmdjs5/image/upload/c_scale,w_316/v1566568756/rv/Screenshot_2018-03-02-21-24-19.png)![Project invoice settings](https://res.cloudinary.com/dn1rmdjs5/image/upload/c_scale,w_316/v1566568756/rv/Screenshot_2018-03-02-21-25-31.png)
![Project invoice invoice ](https://res.cloudinary.com/dn1rmdjs5/image/upload/c_scale,w_316/v1566568756/rv/Screenshot_2018-03-02-21-30-49.png)![Project invoice layout editor ](https://res.cloudinary.com/dn1rmdjs5/image/upload/c_scale,w_316/v1566568756/rv/Screenshot_2018-03-02-21-27-17.png)

Here’s the link again: [Project invoice](https://projectinvoice.nl)
