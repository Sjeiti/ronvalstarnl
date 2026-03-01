// https://ajv.js.org/json-schema.html

const object = { type: 'object' }
const string = { type: 'string' }
const date = { type: 'string', format: 'date' }
const array = { type: 'array' }
const bool = { type: 'boolean' }
const stringArray = {
  ...array,
  items: string
}

export default {
  ...object,
  properties: {
    // generic
    slug: string,
    type: {
      enum: ['page', 'post', 'portfolio', 'fortpolio']
    },
    excerpt: { ...string, max: 160 },
    // header
    // image string on Cloudinary
    header: string,
    // header image attribution
    headerColofon: string,
    headerClassName: { enum: ['no-blur', 'darken']},
    //
    categories: stringArray,
    tags: stringArray,
    //
    // search-engine description
    description: { ...string, max: 160 },
    //
    //
    // BLOG
    date: string,
    modified: string,
    sticky: { ...bool },
    // related slugs
    related: stringArray,
    //
    //
    // PORTFOLIO
    inPortfolio: bool,
    clients: stringArray,
    collaboration: stringArray,
    prizes: stringArray,
    thumbnail: string,
    thumbnailVideo: string,
    image: string,
    images: stringArray,
    //
    //
    // CV
    inCv: bool,
    portfolioType: { enum: ['freelance', 'permanent'] },
    dateFrom: date,
    dateTo: date,
    cv: {
      ...object,
      properties: {
        position: string,
        project: string,
        body: string,
      },
      required: ['position', 'project', 'body']
    },
    cvNl: {
      ...object,
      properties: {
        position: string,
        project: string,
        body: string,
      },
      required: ['body']
    }
  },
  required: ['slug', 'type'],
  additionalProperties: false,
  //
  // conditionals
  allOf: [
    {
      if: { properties: { type: { const: 'page' } } },
      then: { required: ['date', 'modified'] }
    },
    {
      if: { properties: { type: { const: 'post' } } },
      then: { required: ['date', 'modified'] }
    },
    {
      if: { properties: { type: { const: 'fortpolio' } } },
      then: { required: ['clients'] }
    },
    {
      if: {
        properties: { inPortfolio: { const: true } },
        required: ['inPortfolio']
      },
      then: {
        allOf: [
          // { required: ['image'] },
          {
            anyOf: [
              { required: ['thumbnail'] },
              { required: ['thumbnailVideo'] }
            ]
          }
        ]
      }
    },
    {
      if: {
        properties: { inCv: { const: true } },
        required: ['inCv']
      },
      then: { required: ['cv', 'cvNl'] }
    }
  ]
}

