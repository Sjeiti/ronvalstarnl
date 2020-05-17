<!--
  date: 9999-99-99
  modified: 9999-99-99
  slug: useful-custom-cypress-commands
  type: post
  header: julian-scholl-hlHq4Qezjr8-unsplash.jpg
  headerColofon: photo by [Julian Schöll](https://unsplash.com/@js90)
  headerClassName: no-blur darken
  excerpt: 
  categories: Javascript
  tags: CSS, transitions
-->

# Useful custom Cypress commands

Cypress is still one of the easiest testing frameworks out there. It is so ridiculously user-friendly that writing tests is no longer a chore, but fun.

## getting ahead

After using it a while you might stumble upon *[custom commands](https://docs.cypress.io/api/cypress-api/custom-commands.html)*. Most testing frameworks have similar implementations. They are functions you write for repeating patterns.

A lot of these will be very project specific. But some are generic enough to use in different projects. One of these I wrote about a year back is for [updating an alias](https://docs.cypress.io/api/cypress-api/custom-commands.html) (a custom command plus some overrides).

Here are a few others that are useful:


## `expectPathname` for checking the uri

Here's a simple one: check the uri pathname. When testing a SPA you'll have to check a lot of times if your route has changed after an event. This is really just a shortcut for a oneliner, but it makes it a lot more readable: `cy.expectPathname('/about')`

```javascript
Cypress.Commands.add('expectPathname', pathname => cy
  .location().should(location => expect(location.pathname).to.eq(pathname))
)
```


## `asAll` for aliasing all `data-cy` attributes

This one depends on your environment and implementation. The Cypress recommendation is for selectors to use a variant of the following signature: `<div data-cy="box"></div>` to be used as `cy.get('[data-cy=box]')`.
But mostly you will have to do this more than once at which point you should create an alias for it: `cy.get('[data-cy=box]').as('box')` and use `cy.get('box')`.

The following command does all that aliasing for you if you call it in your `beforeEach(() => cy.asAll())`.

```javascriptCypress.Commands.add('asAll', () => cy
    .get('[data-cy]')
    .then(list=>{
      list.each((i, {dataset: {cy: name}})=>
          cy.get(`[data-cy=${name}]`).as(name)
      )
    })
)
```

Needless to say this command only aliases nodes that exist in the DOM. If a new node is created by an event you must reassign the alias, manually or by calling `asAll` again (or use the previously mentioned [updateAlias](https://docs.cypress.io/api/cypress-api/custom-commands.html)).

<small>The reason not to use the returned element in `list.each` with `cy.wrap` is to be able to have a collection, not a single result</small>


## `visitPage` to set session-, localStorage and/or cookies

With `cy.visit` you open an url. You can set a `location.host` as prefix in your settings (baseUrl) so you only have to call the pathname (`cy.visit('./about')`). But there are no settings for the state of your browser in terms of sessionStorage, localStorage and/or cookies.
This command wraps `visit` and assigns an `onBeforeLoad` to the options where, in this case, the localStorage is populated from a fixture file but you can rewrite it to set sessionStorage or cookies.
The `visitPage` command works similar to `visit`: you can pass `onBeforeLoad` to your options and it is still executed.

```javascript
const fixtureLsData = 'cypress/fixtures/localStorageData.json'

Cypress.Commands.add('visitPage', (path = '', options={}) => cy.readFile(fixtureLsData).then(json => cy
  .wrap(path).then(url => cy
    .visit(url, Object.assign({}, options, {
      onBeforeLoad: win => {
        win.localStorage.setItem('data', JSON.stringify(json))
        options.onBeforeLoad&&options.onBeforeLoad(win)
      }
    }))
  )
))
```
