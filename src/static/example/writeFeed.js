/**
 * @version 1.2.0
 * @file: A CLI script to create an RSS feed from either species, or a location.
 * @see: https://observation.org/api/docs
 *
 * @description:
 * Calls GET on waarneming.nl (observation.org) REST API:
 *
 * Observations for a specific species
 *   web page: https://waarneming.nl/api/v1/species/122/observations/?country_division=2&limit=100&search=Amsterdam
 *   API call: https://waarneming.nl/species/122/observations/?country_division=2&amp;search=Amsterdam
 *   CLI:      node writeFeed.js --species 122 --province 2 --search Amsterdam --rss feed.xml
 *
 * Observations around a point:
 *   web page: https://waarneming.nl/fieldwork/observations/explore/?end_date=2026-08-25&exclude_own=true&point=POINT(5.011396408081055%2052.38090678895783)&distance=1#search=&species_group=1&rarity=0
 *   API call: https://waarneming.nl/api/v1/observations/around-point/?coordinates=52.38090678895783,5.011396408081055&radius=1000m&species_group=1&end_date=2026-08-26&days=7
 *   CLI:      node writeFeed.js --coordinates 52.38090678895783,5.011396408081055 --radius 500 --rss around.xml
 *
 * Observations for a named location:
 *   web page: https://waarneming.nl/fieldwork/observations/explore/?end_date=2026-08-26&exclude_own=true&location=108900#search=&species_group=1&rarity=0
 *   API call: https://waarneming.nl/api/v1/locations/108900/observations/?species_group=1&date_after=2026-08-19&date_before=2026-08-26
 *   CLI:      node writeFeed.js --location 108900 --rss location.xml
 *
 *
 * ## Flags
 *
 * | Flag          | Type    | Default      | Description                |
 * |---------------|---------|--------------|----------------------------|
 * | rss           | string  | /feed.xml    | target rss.xml file        |
 * | title         | string  |              | rss title                  |
 * | description   | string  |              | rss description            |
 * |               |         |              |                            |
 * | search        | string  |              | location based search      |
 * | province      | int     |              | province id                |
 * |               |         |              |                            |
 * | species       | int     |              | species id                 |
 * | species_group | int     |              | species group id           |
 * |               |         |              |                            |
 * | coordinates   | string  |              | comma separated lat,long   |
 * | radius        | int     | 500          | meters from coordinates    |
 * |               |         |              |                            |
 * | location      | int     |              | location id                |
 *
 * Check observation.org for specific ids.
 *
 */

const https = require('https')
const fs = require('fs')

const args = getProcessArguments()

const BASE = 'https://waarneming.nl/api/v1/'

const SPECIES = args.species // 122 = Passer domesticus
const SPECIES_GROUP = args.species_group // 1 = birds

const COUNTRY_DIVISION = args.province // 2 = province Noord-Holland
const SEARCH = args.search && encodeURIComponent(args.search) // Amsterdam

const COORDINATES = args.coordinates && encodeURIComponent(args.coordinates) // 52.38090678895783,5.011396408081055
const DISTANCE = args.radius || args.distance // 500

const LOCATION = args.location // 108900

const LIMIT = 100
const DAYSBACK = 7
const [DATE_AFTER] = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')
const [DATE_BEFORE] = new Date().toISOString().split('T')

const OUTFILE = __dirname + '/output.json'
const RSSFILE = args.rss || (__dirname + '/feed.xml')

const params = Object.entries({
  species_group: SPECIES_GROUP,
  country_division: COUNTRY_DIVISION,
  limit: LIMIT,
  search: SEARCH,
  coordinates: COORDINATES,
  radius: DISTANCE,
  date_after: DATE_AFTER,
  date_before: DATE_BEFORE
})
    .filter(([,v])=>v!==undefined&&v!==null)
    .reduce((acc,[k,v])=>(acc[k]=v,acc),{})

const XML_LINK = getUri(params)
console.info('uri',XML_LINK)

const SPECIES_NAME = 'huismus'
const SPECIES_NAME_PLURAL = 'huismussen'

const LANG = {
      user: 'Waarnemer',
      location: 'Locatie',
      number: 'Aantal',
      date: 'Datum',
      coords: 'Coördinaten'
    }

// async IIFE
;(async () => {
  try {
    const data = await getData()
    /** @type Observation[] */
    const observations = data.results || []

    const daysAgo = new Date(Date.now() - DAYSBACK * 24 * 60 * 60 * 1000)
    const recent = observations.filter(observation => new Date(observation.date) >= daysAgo)

    //fs.writeFileSync(OUTFILE, JSON.stringify(recent, null, 2))
    fs.writeFileSync(RSSFILE, toRSS(recent))
    fs.writeFileSync(RSSFILE.replace(/\.xml$/,'.json'), JSON.stringify(recent, null, 2))

    console.info(`${recent.length} sightings (past ${DAYSBACK} days)`)
    recent.slice(0, 5).forEach(o => console.info(`  ${o.date} ${o.time} | ${o.number} ${o.species_detail?.name} | ${o.location_detail.name} | ${o.user_detail?.name}`))
  } catch (e) {
    console.error('Error:', e.message)
  }
})()

/**
 * Build REST URI
 * @returns {string}
 */
function getUri(params) {
  return BASE
      + (
          SPECIES && 'species/' + SPECIES + '/observations/'
          || COORDINATES && 'observations/around-point/'
          || LOCATION && 'locations/'+ LOCATION +'/observations/'
      )
      + '?'
      + Object.entries(params)
          .map(([key, value]) => (key + '=' + value))
          .join('&')


  return BASE
      + 'species/' + SPECIES + '/observations/'
      + '?'
      + Object.entries(params)
          .map(([key, value]) => (key + '=' + value))
          .join('&')
}

/**
 * GET data from endpoint
 * @returns {Promise<{results:Observation[]}>}
 */
function getData() {
  return new Promise((resolve, reject) => {
    https.get(XML_LINK, {headers: {
	    'Accept': 'application/json',
        'Accept-Language': 'nl'
	  }}, (res) => {
      let body = ''
      res.on('data', (chunk) => body += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      })
    }).on('error', reject)
  })
}

/**
 * Turn process arguments (`process.argv`) into key/value map.
 * @returns {Object}
 */
function getProcessArguments(){
  return (process.argv.slice(2).join(' ').match(/--?[^\s]+(?:\s+(?!--?)[^\s]+)*/g)||[])
      .reduce((acc, arg)=>{
        const [, key] = arg.match(/^--([^\s|=]+)/)||[]
        const [, value=true] = arg.match(/^--[^\s|=]+(.*)/)||[]
        if (key) acc[key] = value.trim()||true
        return acc
      }, {})
}

/**
 * Convert observations to RSS XML string
 * @param {Observation[]} observations
 * @returns {string}
 */
function toRSS(observations) {
  const items = observations.map(o => {
    const {number} = o
	const [photo] = o.photos||[]
	const title = `${o.species_detail.name+(photo?' 📷️':'')} — ${o.location_detail.name}`
    const link = o.permalink
    const date = new Date(o.date + 'T' + (o.time || '00:00')).toUTCString()
    const [lon, lat] = o.point.coordinates
    const description = `${LANG.user}: ${o.user_detail?.name}
${LANG.location}: ${o.location_detail.name}
${LANG.number}: ${o.number}
${LANG.date}: ${o.date} ${o.time || ''}
${LANG.coords} ${lat}, ${lon}`
    return `    <item>
      <title>${escapeXML(title)}</title>
      <link>${link}</link>
      <description>
		${escapeXML(description)}
	    ${photo?'<![CDATA[<img src="'+photo+'"/>]]>':''}
	  </description>
      <pubDate>${date}</pubDate>
      <guid>${link}</guid>
    </item>`
  }).join('\n')

  const [item] = items
  const rssTitle = args.title
    ||(SPECIES
      ?item.species_detail?.name
	  :item.location_detail?.name)

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${rssTitle}</title>
    <link>${XML_LINK}</link>
    <description>${args.description}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`
}

/**
 * Escape XML
 * @param {string} s
 * @returns {string}
 */
function escapeXML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * @typedef {Object} Observation
 * @property {number} id
 * @property {number} species
 * @property {string} date
 * @property {string} time
 * @property {number} number
 * @property {string} sex
 * @property {Point} point
 * @property {number} accuracy
 * @property {Object} notes
 * @property {boolean} is_certain
 * @property {boolean} is_escape
 * @property {number} activity
 * @property {number} life_stage
 * @property {number} method
 * @property {Object} substrate
 * @property {number} related_species
 * @property {number} obscurity
 * @property {number} counting_method
 * @property {string} embargo_date
 * @property {string} uuid
 * @property {Object} external_reference
 * @property {Array} links
 * @property {Array} details
 * @property {Object} observer_location
 * @property {Object} transect_uuid
 * @property {Array} photos
 * @property {Array} sounds
 * @property {SpeciesDetail} species_detail
 * @property {number} rarity
 * @property {number} species_status
 * @property {number} user
 * @property {UserDetail} user_detail
 * @property {string} modified
 * @property {number} species_group
 * @property {string} validation_status
 * @property {number} location
 * @property {LocationDetail} location_detail
 * @property {string} permalink
 */

/**
 * @typedef {Object} Point
 * @property {string} type - Point
 * @property {number[]} coordinates
 */

/**
 * @typedef {Object} SpeciesDetail
 * @property {number} id
 * @property {string} scientific_name
 * @property {string} name
 * @property {number} group
 * @property {string} type
 */

/**
 * @typedef {Object} UserDetail
 * @property {number} id
 * @property {string} name
 * @property {string} avatar
 */

/**
 * @typedef {Object} LocationDetail
 * @property {number} id
 * @property {string} name
 * @property {string} country_code
 * @property {string} permalink
 */
