<!--
  date: 2020-05-20
  modified: 2020-05-20
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

Cypress is still one of the easiest testing frameworks out there. It is so ridiculously user-friendly that writing tests is no longer a chore, but *almost* fun.

## custom commands

After using it for a while you might stumble upon *[custom commands](https://docs.cypress.io/api/cypress-api/custom-commands.html)*. Most testing frameworks have similar implementations. They are functions you write for repeating patterns (ie: logging into a certain part of a site).

A lot of these will be very project specific. But some are generic enough to use in different projects. One of these I wrote about a year back is for [updating an alias](https://docs.cypress.io/api/cypress-api/custom-commands.html) (a custom command plus some overrides).

Here are a few others that are generic enough to be useful:


## **expectPathname** for checking the uri

This is a simple one: check the uri pathname. When testing a SPA you're bound to check if the route has changed after an event. This is really just a shortcut for a oneliner, but it makes it a lot more readable: `cy.expectPathname('/about')`

```javascript
Cypress.Commands.add('expectPathname', pathname => cy
  .location().should(location => expect(location.pathname).to.eq(pathname))
)
```


## **asAll** for aliasing all *data-cy* attributes

This custom command depends on your environment and implementation. The Cypress recommendation is for selectors to use a variant of the following: `<div data-cy="box"></div>` to be used in tetst as `cy.get('[data-cy=box]')`.
Mostly you will have to do this more than once at which point you should create an alias for it: `cy.get('[data-cy=box]').as('box')` and use `cy.get('@box')`.

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

<small>The reason not to use the returned element in `list.each` with `cy.wrap` is to be able to have a collection, not a single result</small>

Needless to say this command only aliases nodes that exist in the DOM. If a new node is created by an event you must reassign the alias. You can do this manually or by calling `asAll` again (or use the previously mentioned [updateAlias](https://docs.cypress.io/api/cypress-api/custom-commands.html)).
At the end of this article we'll revisit this command for an alternative.


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

## upload a file

Cypress does not yet support native (OS) events but we can fake the upload by setting the file date programmatically. The following command should only be applied to an `input[type=file]`.
Due to [a Cypress bug](https://github.com/cypress-io/cypress/issues/7412) the upload fixture cannot be a JSON file, but if you rename the extension to `.notjson` (or whatever) it will work just fine.
Also notice that the change event is triggered by force; a common implementation applies styling to the label and hides the input (`.visuallyhidden`) and Cypress accounts for invisible elements.

```javascript
Cypress.Commands.add('upload', {prevSubject: 'element'}, (subject, fileName, type) => cy
  .fixture(fileName, 'hex').then(fileHex => {
    if (typeof fileHex!=='string') throw('When uploading json rename your filetype to \'notjson\'. See Cypress issue #7412')
    const bytes = hexStringToByteArray(fileHex)
    const file = new File([bytes], fileName, {type})
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    subject.get(0).files = dataTransfer.files
    return subject
  })
  .trigger('change', {force:true})
)

function hexStringToByteArray(str) {
    return new Uint8Array(str.match(/.{2}|./g).map(s=>parseInt(s, 16)));
}
```

With the above as command and a test along the lines of:

```javascript
cy.get('input[type=file]').upload('upload.json_', 'text/json')
```


## override an override

This could be an edge case but sometimes you want to override an existing command. But in the rare case you want to do that twice you'll be out of luck because Cypress only remembers you last override.
Here's an implementation with which you can chain overrides.

```javascript
Object.entries(overrides).forEach(([key, list])=>{
  Cypress.Commands.overwrite(key, (orig, selector, options={}) => {
    const [fn, ...arg] = list.reduce((acc, fn) => fn(...acc), [orig, selector, options])
    return fn(...arg)
  })
})
```

The overrides object could be something like:
<small>(only implemented for `get` but you get the idea)</small>
 
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

## override **get** to find and alias **data-cy** automatically

The `asAll` command I showed you is nice, but I told you we'd revisit it.
Normally I am not so fond of overwriting existing methods. Overwriting JavaScript prototypes is generally frowned upon. But with Cypress it can be helpful, and they made a method for it.
I also mentioned [updating an alias](https://docs.cypress.io/api/cypress-api/custom-commands.html) briefly, this overwrites the `get` command as well, which is why I first wanted to show you how to override overrides, or chain them or whatever.
What bugs me about `asAll` is that it requires a `beforeEach` (won't work in `before`), which will alias *all* those `[data-cy]` instances. I know that was the whole idea, but in a test with ten `it.should`s (each using some aliases), an average of 90% of the aliases will not be used. This is not only inefficient but it also pollutes the test results.

When you don't want to overwrite a simple solution could be this 

```javascript
Cypress.Commands.add('getAs', name => Cypress
  .state('aliases').hasOwnProperty(name)
    ?cy.get('@' + name)
    :cy.get(`[data-cy=${name}]`).as(name)
)
```

But you'd have to call `cy.getAs('button')` prior to using `cy.get('@button')`. It is still properly chainable like this `cy.getAs('button').should('not.be.disabled')` but it breaks the vertical flow of your test a bit.

But we can overwrite `get`. Normally if we do `cy.get('@button')` and the alias does not exist we'll get an error. We'll make it so that instead of an error, we'll search for `[data-cy=button]` and alias that.
Thing is, we cannot use `cy.get('@button')` to check if the alias exists because the Cypress error halts the test. What we can use is `Cypress.state`. It is not documented but `Cypress.state('aliases')` returns an object which keys correspond with the alias names (when no aliases exist the object will not exist either so we have to account for that too). 

```javascript
Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  if (selector.substr(0, 1)==='@') {
    const name = selector.substr(1)
    const aliasExists = (Cypress.state('aliases')||{}).hasOwnProperty(name)
    orig = aliasExists?orig:(()=>cy.get(`[data-cy=${name}]`).as(name))
  }
  return orig(selector, options)
})
```

Now, if you want to combine this with another override you'll have to change it a bit. For instance, here is the overrides object for both the alias update and the data-cy-alias. 
With both of these in place your test will become a lot simpler and easier to read.

```javascript
const overrides = {
  get: [
    // (...arg) => [...arg]
    (orig, selector, options={}) => {
      if (selector.substr(0, 1)==='@') {
        const name = selector.substr(1)
        const aliasExists = (Cypress.state('aliases')||{}).hasOwnProperty(name)
        orig = aliasExists?orig:(()=>cy.get(`[data-cy=${name}]`).as(name))
      }
      return [orig, selector, options]
    }
    , (orig, selector, options={}) => {
      const {update, ignoreLive} = options
      const aliasName = getAliasName(selector)
      const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
      return [aliasName&&(update||isLive)?cy.updateAlias:orig, selector, options]
    }
  ]
}
```


## Well

I hope you find these examples useful. They sure make my test files a little easier. [Let me know](mailto:ron@ronvalstar.nl) if you have any cool additions of your own.
