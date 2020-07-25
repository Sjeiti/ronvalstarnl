<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: project-invoice-now-has-peer-to-peer-synchronisation
  type: post
  header: sincerely-media-IKzmglo7JLk-unsplash.jpg
  headerColofon: photo by [Sincerely Media](https://unsplash.com/@sincerelymedia)
  headerClassName: no-blur darken
  excerpt: 
  categories: Javascript
  tags: CSS, transitions
-->

# Project Invoice with peer-to-peer synchronisation through WebRTC

Project invoice as always been a useful sideproject for me. It is a good outlet to learn and try new techniques. Plus I do projects and send invoices myself but I've never really liked invoicing cloud solutions.

So Project Invoice is a web application that does not send data. All is stored locally on the device or machine you work on. And you only load the app once, after that it is loaded from cache.
Which is all reasonably secure but not handy when you switch devices. Which is why I added cloud synchronisation but that brings us back to square one. Only now it's your explicit choice.

For some time now I wanted to improve this. Since WebRTC was added in 2018 it is possible to transfer data with peer-to-peer. With p2p data transfer is direct from machine to device. With WebRTC a special server called TURN/STUN is only involved for the initial handshake.
TURN and STUN are protocols to deal with NAT (network address translation), a term you might recognize from your router or firewall.
This is where my head starts spinning a bit. Which is why it took me a while to even get started because I had no idea how to setup such a server locally let alone online.

After trying several tutorials and packages I tried [peer.js](https://peerjs.com/). Which lets you use their own TURN/STUN for free (?). It's a bit confusing because their documentation is a bit behind. But it works.

The inner workings are somewhat complex so it pays to wrap it in a proxy. 
