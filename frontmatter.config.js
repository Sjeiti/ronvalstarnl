/*
const schema = {
  type: "object",
  properties: {
    foo: {type: "integer"},
    bar: {type: "string"}
  },
  required: ["foo"],
  additionalProperties: false
}
*/

const required = true
const requiredIfCv = { required: data => data.inCv === true }
const requiredIfBlog = { required: data => data.type === 'blog' }
const object = { type: 'object' }
const string = { type: 'string' }
const date = { type: 'date' }
const array = { type: 'array' }
const bool = { type: 'boolean' }
//const stringArray = { ...array, items: { ...string }}
const stringArray = [{ ...string }]

export default {
  ...object,
  properties: {
    // generic
    slug: { ...string },
    type: {
      enum: ['page', 'post', 'portfolio', 'fortpolio']
    },
    // header
    // image string on Cloudinary
    header: { ...string },
    // header image attribution
    headerColofon: { ...string },
    headerClassName: { enum: ['no-blur', 'darken']},
    // 
    categories: { ...stringArray },
    tags: { ...stringArray },
    //
    // search-engine description
    description: { ...string, max: 160 },
    //
    //
    // BLOG
    date: { 
      //...requiredIfBlog, 
      //...date 
      ...string
    },
    modified: { 
      //...requiredIfBlog, 
      //...date 
      ...string
    },
    sticky: { ...bool },
    // related slugs
    related: { ...stringArray },
    //
    //
    // PORTFOLIO
    inPortfolio: { ...bool },
    clients: { ...stringArray },
    collaboration: { ...stringArray },
    prizes: { ...stringArray },
    thumbnail: { ...stringArray },
    image: { ...string },
    images: { ...stringArray },
    //
    //
    // CV
    inCv: { ...bool },
    portfolioType: { enum: ['freelance', 'permanent'] },
    dateFrom: { 
      //...requiredIfCv, 
      //...date 
      ...string
    },
    dateTo: { 
      //...requiredIfCv, 
      //...date 
      ...string

    },
    cv: {
      ...object,
      //...requiredIfCv,
      properties: {
        position: { ...string },
        project: { ...string },
        body: { ...string },
      },
      required: ['position', 'project', 'body']
    },
    cvNl: {
      ...object,
      //...requiredIfCv,
      properties: {
        position: { ...string },
        project: { ...string },
        body: { ...string },
      },
      required: ['body']
    }
  },
  required: ['slug', 'type'],
  additionalProperties: false
}

