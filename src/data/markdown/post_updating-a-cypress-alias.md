<!--
  id: 3465
  date: 2018-12-24
  modified: 2020-03-16
  slug: updating-a-cypress-alias
  type: post
  header: Vincent_van_Gogh_-_Green_Field_-_Google_Art_Project.jpg
  headerColofon: painting by Vincent van Gogh
  headerClassName: no-blur
  categories: code, JavaScript, jQuery, work, open source
  tags: test, end to end, e2e, end-to-end
  metaDescription: To update a Cypress alias on the fly we can create and overwrite Cypress commands to update DOM aliases by traversing up the selector tree.
-->

# Updating a Cypress alias

<small>TLDR: a Cypress command script to update DOM aliases by traversing up the selector tree.</small>

[Aliasing DOM selections](https://docs.cypress.io/api/commands/as.html) is a really handy Cypress feature. It not only makes your code dryer, it also makes it easier to read.  
You set it like this `cy.get('li').as('entries')` and further down your code use it like so `cy.get('@entries')`.
That might not look like much of an improvement but you could have a selector that looks like this `main [data-entries] li` or even a cypress _get_ like this `cy.get('@main').find('[data-entries] li')`.  
So you see what I’m getting at.

There is one small downside though (or an upside depending on you point of view). The alias is a snapshot of the DOM state at the time the alias was created. So if you have an x number of entries and do some testing that would increase the number of entries you are out of luck because the alias still points to the initial result.

## update aliases along the way

You can easily update the alias though. If you call `cy.get('li').as('entries')` after your DOM changes the `get('@entries')` alias wil have updated to the new state. But at that point the alias has become somewhat pointless: it would be easier to just always do `cy.get('some very lengthy selector')` and forget about aliases. We can always put the selector string into a variable and use that.

## a custom command that updates

There is a way if you dig a little. When you take a closer look at what `cy.get` yields you’ll notice that it is a jQuery object. And a jQuery selector object has two handy properties `selector` and `prevObject`.<br>  
The _selector_ property is a string with the last (sub) selection. So for `cy.get('ul').find('li')` that would be ‘li’.<br>
And _prevObject_ is another jQuery object. In the previous example it would contain _selector: ‘ul’_. PrevObject in fact chains al the way up until the last object that does _not_ contain a prevObject property, which refers to `document`.

So that chain contains all the data we need to be able to update an alias.<br>  
And Cypress makes it quite easy because we can build or own commands.

```javascript
Cypress.Commands.add('updateAlias', domAlias => {
    // first we retreive the alias name, domAlias without the @
    const aliasName = (domAlias.match(/^@(.*)$/)||[])[1]
    return aliasName&&cy.get(domAlias).then($result => {
        const tree = [$result] // initial $result is the last branch on the tree
        // we travel up the prevObjects and prepend/unshift to the tree
        while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
        // chain `find` onto documentElement and recreate the alias
        return tree.reduce(((cy,o)=>cy.find(o.selector)),cy.wrap(tree.shift().get(0).documentElement)).as(aliasName)
    })||cy.get(domAlias) // if no alias name exists proceed with normal get
})
```

## adding update option by overwriting `get` command

But a different command does break the reading flow a bit.<br>  
What we could do is overwrite the `get` method to make it accept an update boolean. Because Cypress comes with a really handy mechanism `Cypress.Commands.overwrite(name, callbackFn)`.

```javascript
Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const aliasName = (selector.match(/^@(.*)$/)||[])[1]
  return aliasName&&options.update?cy.updateAlias(selector,options):orig(selector, options)
})
```

## adding live option by overwriting `as` command

Or we could try to overwrite `as` to accept a boolean that always forces `get` to update.<br>  
This is a bit more difficult than it seems. The `as` command does not normally accept an options object plus you’d have to overwrite the `get` command as well to play nice with the added feature. But there is no obvious way to access aliases from with overwritten command so you’d have to track the newly added `as` option yourself by mapping it to the alias.<br>  
Then, since the overwritten `get` will call your new `updateAlias` command which in turn can call `get` you risk running a stackoverflow. So we let the `updateAlias` command always call `get` with an extra `ignoreLive` boolean so we will know when `get` is called from within `updateAlias` and not call it again (by skipping the `isLive` check in there).

```javascript
// the array in which we track which aliases are created with the live option
const asLive = []

/**
 * Use regex to find alias name * @param {string} selector
 * @returns {string}
 */
function getAliasName(selector){
  return (selector.match(/^@(.*)$/)||[])[1]
}

/**
 * Return the element itself if it does not have a documentElement reference * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
function getDocumentElement(elm) {
  return elm.documentElement||elm
}

Cypress.Commands.add('updateAlias', (domAlias, options) => {
  const aliasName = getAliasName(domAlias)
  // `cy.get` is called with `ignoreLive` set to true
  return aliasName&&cy.get(domAlias,{ignoreLive:true}).then($result => {
      const tree = [$result]
      while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
  return tree.reduce(((cy,o)=>cy.find(o.selector)),cy.wrap(getDocumentElement(tree.shift().get(0)))).as(aliasName)
  })||cy.get(domAlias, options)
})

Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const {update, ignoreLive} = options
  const aliasName = getAliasName(selector)
  // only check the `asLive` array for the alias when `ignoreLive` is not set
  const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
  // only update valid alias names when `update` is set or when alias is live
  return aliasName&&(update||isLive)?cy.updateAlias(selector,options):orig(selector, options)
})

Cypress.Commands.overwrite('as', (orig, value, name, options={}) => {
  // push alias name to `asLive` array (or remove when live===false)
    options&&options.live&&!asLive.includes(name)&&asLive.push(name)||options&&options.live===false&&removeFromArray(asLive,name)
  return orig(value, name)
})
```

## A final test script

That is it.<br>  
To see this in action I’ve prepared a little test script below, you can just save it as a `whatever.spec.js` in your Cypress integration folder and run it. The test also shows the default ‘problem’ as first context and in the second context the not-so-elegant command solutions.

```javascript
const asLive = []
Cypress.Commands.add('getListElements', () => cy.get('@list').find('li'))
Cypress.Commands.add('updateListElements', () => cy.get('@list').find('li').as('listElements'))

/**
 * Use regex to find alias name * @param {string} selector
 * @returns {string}
 */
function getAliasName(selector){
  return (selector.match(/^@(.*)$/)||[])[1]
}

/**
 * Remove an item from an array * @param {array} array
 * @param {object} item
 * @returns {boolean}
 */
function removeFromArray(array,item){
  const index = array.indexOf(item)
  const isInArray = index!==-1
  isInArray&&array.splice(index, 1)
  return isInArray
}

/**
 * Return the element itself if it does not have a documentElement reference * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
function getDocumentElement(elm) {
  return elm.documentElement||elm
}

Cypress.Commands.add('updateAlias', (domAlias, options) => {
  const aliasName = getAliasName(domAlias)
  return aliasName&&cy.get(domAlias,{ignoreLive:true}).then($result => {
      const tree = [$result]
      while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
      return tree.reduce(((cy,o)=>cy.find(o.selector)),cy.wrap(getDocumentElement(tree.shift().get(0)))).as(aliasName)
  })||cy.get(domAlias, options)
})

Cypress.Commands.overwrite('get', (orig, selector, options={}) => {
  const {update, ignoreLive} = options
  const aliasName = getAliasName(selector)
  const isLive = aliasName && !ignoreLive && asLive.includes(aliasName)
  return aliasName&&(update||isLive)?cy.updateAlias(selector,options):orig(selector, options)
})

Cypress.Commands.overwrite('as', (orig, value, name, options={}) => {
  options&&options.live&&!asLive.includes(name)&&asLive.push(name)||options&&options.live===false&&removeFromArray(asLive,name)
  return orig(value, name)
})

describe('TestAlias', () => {
  beforeEach(() => cy
    .get('body').then($body=>$body.get(0).innerHTML=`<main>
 <ul data-list><li></li><li></li></ul> <ul>${'<li></li>'.repeat(99)}</ul>
 <button onClick="document.querySelector('[data-list]').appendChild(document.createElement('li'))">add</button>
</main>`)
    .get('[data-list]').as('list')
    .get('@list').find('li').as('listElements')
    .get('@list').find('li').as('listElementsLive', {live: true})
    .get('button').as('addElement')
      .log(Cypress)
  )
  context('Default implementation', () => {
    it('should not get correct amount of elements by alias',() => cy
        .get('@listElements').should('have.length',2)
        .get('@addElement').click()
        .get('@listElements').should('have.length',2)
    )
  })
  context('Too specific custom commands', () => {
    it('should get correct amount of elements by custom command',() => cy
        .getListElements().should('have.length',2)
        .get('@addElement').click()
        .getListElements().should('have.length',3)
    )
    it('should get correct amount of elements by custom command that updates alias',() => cy
        .get('@listElements').should('have.length',2)
        .get('@addElement').click()
        .updateListElements().should('have.length',3)
        .get('@listElements').should('have.length',3)
    )
  })
  context('Non specific custom `updateAlias` command', () => {
    it('should get correct amount of elements by generic alias update command',() => cy
        .get('@addElement').click()
        .updateAlias('@listElements').should('have.length',3)
        .get('@listElements').should('have.length',3)
    )
  })
  context('Overwriting `get` and `as` commands', () => {
    it('should get correct amount of elements by alias when option.update', () => cy
      .get('@listElements').should('have.length', 2)
      .get('@addElement').click()
      .get('@listElements',{update:true}).should('have.length', 3)
    )
    it('should get correct amount when alias is live', () => cy
      .get('@listElementsLive').should('have.length', 2)
      .get('@addElement').click()
      .get('@listElementsLive').should('have.length', 3)
    )
    it('should not get correct amount when alias-live is disabled along the way', () => cy
      .get('@listElementsLive').should('have.length', 2).as('listElementsLive', {live: false})
      .get('@addElement').click()
      .get('@listElementsLive').should('have.length', 2)
    )
  })
})
```
