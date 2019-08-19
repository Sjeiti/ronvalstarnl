//http://ronvalstar.nl/api/wp/v2/media?per_page=100&page=1
const {promisify} = require('util')
const fs = require('fs')
const request = require('request')
const fetch = require('node-fetch')
// const utils = require('./util/utils.js')
// const {read,save} = utils

const perPage = 100
const mediaUri = `http://ronvalstar.nl/api/wp/v2/media?per_page=${perPage}&page=`

getPage()

const downloadp = promisify(download)

function getPage(nr=1){
	return fetch(mediaUri+nr)
      .then(rs=>rs.json())
      .then(list=>{
        return Promise.all(list.map(item=>{
          const {source_url} = item
          const fileName = source_url.split('/').pop()
          return downloadp(source_url, `temp/${fileName}`).then(console.log.bind(console,`downloaded ${source_url}`))
        }))
      })
      // .then(all=>all.length===perPage&&getPage(nr+1))
      .then(all=>all.length&&getPage(nr+1))
}

function download(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type'])
    console.log('content-length:', res.headers['content-length'])
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
}

/*
const example = {
  "id": 3490,
  "date": "2019-06-19T19:26:50",
  "date_gmt": "2019-06-19T19:26:50",
  "guid": {
    "rendered": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches.jpg"
  },
  "modified": "2019-06-19T19:26:50",
  "modified_gmt": "2019-06-19T19:26:50",
  "slug": "06_glitches",
  "status": "inherit",
  "type": "attachment",
  "link": "http://ronvalstar.nl/projects/disconnect/06_glitches",
  "title": {
    "rendered": "06_glitches"
  },
  "author": 2,
  "comment_status": "open",
  "ping_status": "closed",
  "template": "",
  "meta": [],
  "description": {
    "rendered": "<p class=\"attachment\"><a href='http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches.jpg'><img width=\"300\" height=\"169\" src=\"http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-300x169.jpg\" class=\"attachment-medium size-medium\" alt=\"\" srcset=\"http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-300x169.jpg 300w, http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-768x432.jpg 768w, http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-1024x576.jpg 1024w\" sizes=\"(max-width: 300px) 100vw, 300px\" /></a></p>\n"
  },
  "caption": {
    "rendered": ""
  },
  "alt_text": "",
  "media_type": "image",
  "mime_type": "image/jpeg",
  "media_details": {
    "width": 1920,
    "height": 1080,
    "file": "06_glitches.jpg",
    "sizes": {
      "thumbnail": {
        "file": "06_glitches-150x150.jpg",
        "width": 150,
        "height": 150,
        "mime_type": "image/jpeg",
        "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-150x150.jpg"
      },
      "medium": {
        "file": "06_glitches-300x169.jpg",
        "width": 300,
        "height": 169,
        "mime_type": "image/jpeg",
        "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-300x169.jpg"
      },
      "medium_large": {
        "file": "06_glitches-768x432.jpg",
        "width": 768,
        "height": 432,
        "mime_type": "image/jpeg",
        "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-768x432.jpg"
      },
      "large": {
        "file": "06_glitches-1024x576.jpg",
        "width": 1024,
        "height": 576,
        "mime_type": "image/jpeg",
        "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches-1024x576.jpg"
      },
      "full": {
        "file": "06_glitches.jpg",
        "width": 1920,
        "height": 1080,
        "mime_type": "image/jpeg",
        "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches.jpg"
      }
    },
    "image_meta": {
      "aperture": "0",
      "credit": "",
      "camera": "",
      "caption": "",
      "created_timestamp": "0",
      "copyright": "",
      "focal_length": "0",
      "iso": "0",
      "shutter_speed": "0",
      "title": "",
      "orientation": "0",
      "keywords": []
    }
  },
  "post": 3484,
  "source_url": "http://ronvalstar.nl/wordpress/wp-content/uploads/06_glitches.jpg",
  "_links": {
    "self": [
      {
        "href": "http://ronvalstar.nl/api/wp/v2/media/3490"
      }
    ],
    "collection": [
      {
        "href": "http://ronvalstar.nl/api/wp/v2/media"
      }
    ],
    "about": [
      {
        "href": "http://ronvalstar.nl/api/wp/v2/types/attachment"
      }
    ],
    "author": [
      {
        "embeddable": true,
        "href": "http://ronvalstar.nl/api/wp/v2/users/2"
      }
    ],
    "replies": [
      {
        "embeddable": true,
        "href": "http://ronvalstar.nl/api/wp/v2/comments?post=3490"
      }
    ]
  }
}*/
