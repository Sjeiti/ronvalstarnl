<!--
  date: 2020-05-24
  modified: 2020-05-24
  slug: useful-custom-cypress-commands
  type: post
  header: julian-scholl-hlHq4Qezjr8-unsplash.jpg
  headerColofon: photo by [Julian Schöll](https://unsplash.com/@js90)
  headerClassName: no-blur darken
  categories: Javascript
  tags: CSS, transitions
  metaKeyword: Cypress
  metaDescription: Some useful Cypress custom commands
-->

# Useful custom Cypress commands

Cypress is still one of the easiest testing frameworks out there. It is so ridiculously user-friendly that writing tests is no longer a chore, but fun.

## custom commands

After using it for a while you might stumble upon *[custom commands](https://docs.cypress.io/api/cypress-api/custom-commands.html)*. Most testing frameworks have similar implementations. They are functions you write for repeating patterns. For instance: logging into a certain part of a site.

A lot of these will be very project specific. But some are generic enough to use in different projects. One of these I wrote about a year back is for [updating an alias](https://docs.cypress.io/api/cypress-api/custom-commands.html) (a custom command plus some overrides).

Here are a few others that are useful:


## **expectPathname** for checking the uri

This is a simple one: check the uri pathname. When testing a SPA you're bound to check if the route has changed after an event. This is really just a shortcut for a oneliner, but it makes it a lot more readable: `cy.expectPathname('/about')`

```javascript
Cypress.Commands.add('expectPathname', pathname => cy
  .location().should(location => expect(location.pathname).to.eq(pathname))
)
```


## **asAll** for aliasing all *data-cy* attributes

This one depends on your environment and implementation. The Cypress recommendation is for selectors to use a variant of the following signature: `<div data-cy="box"></div>` to be used as `cy.get('[data-cy=box]')`.
But mostly you will have to do this more than once at which point you should create an alias for it: `cy.get('[data-cy=box]').as('box')` and use `cy.get('@box')`.

The following command does all that aliasing for you if you call it in your `beforeEach(() => cy.asAll())`.

```javascript
Cypress.Commands.add('asAll', () => cy
    .get('[data-cy]')
    .then(list=>{
      list.each((i, {dataset: {cy: name}})=>
          cy.get(`[data-cy=${name}]`).as(name)
      )
    })
)
```

Needless to say this command only aliases nodes that exist in the DOM. If a new node is created by an event you must reassign the alias. You can do this manually or by calling `asAll` again (or use the previously mentioned [updateAlias](https://docs.cypress.io/api/cypress-api/custom-commands.html)).

<small>The reason not to use the returned element in `list.each` with `cy.wrap` is to be able to have a collection, not a single result</small>


## **visitPage** to set session-, localStorage and/or cookies

With `cy.visit` you open an url. You can set a `location.host` as prefix in your settings (`baseUrl`) so you only have to call the pathname (`cy.visit('/about')`). But there are no settings for the state of your browser in terms of sessionStorage, localStorage and/or cookies.

This command wraps `visit` and assigns an `onBeforeLoad` to the options where localStorage, sessionStorage or cookies are populated from fixture files.
The `visitPage` command works similar to `visit`: you can pass `onBeforeLoad` to your options and it is still executed.

The nice thing about Cypress is that it's internals are pretty transparent.
You can just make up properties in the config file `./cypress.json` and they remain readable from within your commands. We can use that to create default settings that we can override from the options object in our command.

Note that, even though we do three async `cy.readFile` calls we do not wrap them in a `Promise.all`. Although promise-like, Cypress defers these calls to a later point that would resolve the `Promise.all` to `[undefined,undefined,undefined]`. Instead we simply use scope lookup with the object literal `const data = {}`.

```javascript
Cypress.Commands.add('visitPage', (path = '', options={}) => {
  const data = {}
  return cy.then(()=>
        ['sessionStorage', 'localStorage', 'cookies'].forEach(type => {
          const file = options[type]||Cypress.config(type)
          file&&cy.readFile(file).then(json=>data[type]=json)
        })
      )
      .wrap(path).then(url => cy
      .visit(url, Object.assign({}, options, {
        onBeforeLoad: win => {
          const {sessionStorage, localStorage, document} = win
          const {sessionStorage:ss, localStorage:ls, cookies} = data
          ss&&Object.entries(ss).forEach(([key, value]) => sessionStorage.setItem(key, JSON.stringify(value)))
          ls&&Object.entries(ls).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)))
          cookies&&(document.cookie = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join(';'))
          options.onBeforeLoad&&options.onBeforeLoad(win)
        }
      }))
  )
})
```

So you can use this in your `before` like so:

```javascript
before(() => cy.visitPage('/about', {localStorage: 'cypress/fixtures/localStorageData.json'}))
```

Or if you set that `localStorage` key/value in your config file `./cypress.json` it will be the default and you can just do `cy.visitPage('/about')`.

The JSON fixture files act as key/value pairs. So a fixture with the contents `{"color":"red","theme":"dark"}` creates two entries.


## override an override

This could be an edge case but sometimes you want to override an existing command. But in the rare case you want to do that twice you'll be out of luck because Cypress only remembers you last override.
Here's an implementation with which you can chain overrides. <small>(only implemented for `get` but you get the idea)</small>

```javascript
overrides.get&&overrides.get.length&&Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const [fn, ...arg] = overrides.get.reduce((acc, fn) => fn(...acc), [orig, selector, options])
  return fn(...arg)
})
```

The overrides object could be something like:

```javascript
const overrides = {
  get: [
    (orig, selector, options={}) => {
      console.log('get override no 1:', {orig, selector, options})
      return [orig, selector, options]
    }
    ,(orig, selector, options={}) => {
      console.log('get override no 2:', {orig, selector, options})
      return [orig, selector, options]
    }
  ]
}
```

## Well

I hope you find these examples useful. They sure make my test files a lot easier to read. Also: let me know if you have any cool additions.