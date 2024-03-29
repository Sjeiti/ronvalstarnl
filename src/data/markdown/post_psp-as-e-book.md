<!--
  date: 2007-11-25
  modified: 2007-11-25
  slug: psp-as-e-book
  type: post
  categories: book, JavaScript, backend, tech
  tags: DOM, PSP
-->

# PSP as e-book

<p class="notice">I removed the obsolete links here. Besides, who wants to read books on a PSP now that we have Kindles, iPads and smartphones.</p>
<p>When I first got my PSP I really dove into the Netfront browser and it&#8217;s DOM. First thing I did is create a better typing pad because the PSP&#8217;s build in typing thingy really sucks. Then I made an e-book reader: php converts txt format e-books to a local directory you can copy to your PSP. I must say the PSP reads remarkably pleasant (for a light emitting electronic device).<br />
I&#8217;m traveling a lot by train again these days, so my reading has also gone up a bit. And since I do not always have a fresh stash of unread books I thought I&#8217;d liven my PSP e-book reader a bit.<br />
There are a few problems with the Netfront browser on a PSP. The most irrating one is that you cannot store cookies on when accessing files locally. Cookies would have been the only way to make the PSP remember what line (page) you are reading. So you&#8217;ll have to remember the line yourself (so there&#8217;s also some free braintraining there).<br />
For that same reason I&#8217;ve put in an input field through which you can go to a particular line. The php also renders a 15&#215;1000 png with the line numbers. I&#8217;ve tried to go up to a height of 10.000 but not even my good old Firefox would take that (even though the image was only 40kb).<br />
Also annoying is the fact that the Netfront browser is missing some events. The only way I found to get the scroll height is by means of a document.body.onmouseup. The onscroll event is missing, and even pageYOffset or scrollTop don&#8217;t work.<br />
The memory also isn&#8217;t all that. Big pages really slow the browser down which you&#8217;ll notice when scrolling. I could of course divide a txt file into multiple pages to correct that, maybe later.<br />
Anyway, if you have a webserver and a PSP and you like to read books, <del><strong>download this</strong></del>. Collect some books, convert them, put em on your PSP and start reading&#8230;.</p>
<p>Here&#8217;s a great place to start your ebook search: <a href="http://www.gutenberg.org/" target="_blank">http://www.gutenberg.org/</a>!!!</p>
<p> &#8211; update &#8211; </p>
<p><a href="?page_id=319">I made it easier, just add books using an online form, download the zipped contents, and unpack it to your PSP.</a></p>
