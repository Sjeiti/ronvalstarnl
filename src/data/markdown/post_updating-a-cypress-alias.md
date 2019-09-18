<!--
  id: 3465
  date: 2018-12-24T15:16:38
  modified: 2018-12-24T15:16:46
  slug: updating-a-cypress-alias
  type: post
  excerpt: <p>TLDR: a Cypress command script to update DOM aliases by traversing up the selector tree. Aliasing DOM selections is a really handy Cypress feature. It not only makes your code dryer, it also makes it easier to read. You set it like this cy.get(&#8216;li&#8217;).as(&#8216;entries&#8217;) and further down your code use it like so cy.get(&#8216;@entries&#8217;). That [&hellip;]</p>
  categories: code, Javascript, jQuery, work, open source
  tags: test, end to end
  metaDescription: To update a Cypress alias on the fly we can create and overwrite Cypress commands to update DOM aliases by traversing up the selector tree.
  inCv: 
  inPortfolio: 
  dateFrom: 
  dateTo: 
-->

# Updating a Cypress alias

<p><small>TLDR: a Cypress command script to update DOM aliases by traversing up the selector tree.</small></p>
<p><a href="https://docs.cypress.io/api/commands/as.html" target="_blank">Aliasing DOM selections</a> is a really handy Cypress feature. It not only makes your code dryer, it also makes it easier to read.<br />
You set it like this <code>cy.get('li').as('entries')</code> and further down your code use it like so <code>cy.get('@entries')</code>.<br />
That might not look like much of an improvement but you could have a selector that looks like this <code>main [data-entries] li</code> or even a cypress <em>get</em> like this <code>cy.get('@main').find('[data-entries] li')</code>.<br />
So you see what I&#8217;m getting at.</p>
<p>There is one small downside though (or an upside depending on you point of view). The alias is a snapshot of the DOM state at the time the alias was created. So if you have an x number of entries and do some testing that would increase the number of entries you are out of luck because the alias still points to the initial result.</p>
<h2>update aliases along the way</h2>
<p>You can easily update the alias though. If you call <code>cy.get('li').as('entries')</code> after your DOM changes the <code>get('@entries')</code> alias wil have updated to the new state. But at that point the alias has become somewhat pointless: it would be easier to just always do <code>cy.get('some very lengthy selector')</code> and forget about aliases. We can always put the selector string into a variable and use that.</p>
<h2>a custom command that updates</h2>
<p>There is a way if you dig a little. When you take a closer look at what <code>cy.get</code> yields you&#8217;ll notice that it is a jQuery object. And a jQuery selector object has two handy properties <code>selector</code> and <code>prevObject</code>.<br />
The <em>selector</em> property is a string with the last (sub) selection. So for <code>cy.get('ul').find('li')</code> that would be &#8216;li&#8217;.<br />
And <em>prevObject</em> is another jQuery object. In the previous example it would contain <em>selector: &#8216;ul&#8217;</em>. PrevObject in fact chains al the way up until the last object that does <em>not</em> contain a prevObject property, which refers to <code>document</code>.</p>
<p>So that chain contains all the data we need to be able to update an alias.<br />
And Cypress makes it quite easy because we can build or own commands.</p>
<pre><code class="language-javascript ">Cypress.Commands.add('updateAlias', domAlias =&gt; {
    // first we retreive the alias name, domAlias without the @
    const aliasName = (domAlias.match(/^@(.*)$/)||[])[1]
    return aliasName&amp;&amp;cy.get(domAlias).then($result =&gt; {
        const tree = [$result] // initial $result is the last branch on the tree
        // we travel up the prevObjects and prepend/unshift to the tree
        while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
        // chain `find` onto documentElement and recreate the alias
        return tree.reduce(((cy,o)=&gt;cy.find(o.selector)),cy.wrap(tree.shift().get(0).documentElement)).as(aliasName)
    })||cy.get(domAlias) // if no alias name exists proceed with normal get
})
</code></pre>
<h2>adding update option by overwriting <code>get</code> command</h2>
<p>But a different command does break the reading flow a bit.<br />
What we could do is overwrite the <code>get</code> method to make it accept an update boolean. Because Cypress comes with a really handy mechanism <code>Cypress.Commands.overwrite(name, callbackFn)</code>.</p>
<pre><code class="language-javascript ">Cypress.Commands.overwrite('get', (orig, selector, options={}) =&gt; {
  const aliasName = (selector.match(/^@(.*)$/)||[])[1]
  return aliasName&amp;&amp;options.update?cy.updateAlias(selector,options):orig(selector, options)
})
</code></pre>
<h2>adding live option by overwriting <code>as</code> command</h2>
<p>Or we could try to overwrite <code>as</code> to accept a boolean that always forces <code>get</code> to update.<br />
This is a bit more difficult than it seems. The <code>as</code> command does not normally accept an options object plus you&#8217;d have to overwrite the <code>get</code> command as well to play nice with the added feature. But there is no obvious way to access aliases from with overwritten command so you&#8217;d have to track the newly added <code>as</code> option yourself by mapping it to the alias.<br />
Then, since the overwritten <code>get</code> will call your new <code>updateAlias</code> command which in turn can call <code>get</code> you risk running a stackoverflow. So we let the <code>updateAlias</code> command always call <code>get</code> with an extra <code>ignoreLive</code> boolean so we will know when <code>get</code> is called from within <code>updateAlias</code> and not call it again (by skipping the <code>isLive</code> check in there).</p>
<pre><code class="language-javascript ">// the array in which we track which aliases are created with the live option
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

Cypress.Commands.add('updateAlias', (domAlias, options) =&gt; {
  const aliasName = getAliasName(domAlias)
  // `cy.get` is called with `ignoreLive` set to true
  return aliasName&amp;&amp;cy.get(domAlias,{ignoreLive:true}).then($result =&gt; {
      const tree = [$result]
      while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
  return tree.reduce(((cy,o)=&gt;cy.find(o.selector)),cy.wrap(getDocumentElement(tree.shift().get(0)))).as(aliasName)
  })||cy.get(domAlias, options)
})

Cypress.Commands.overwrite('get', (orig, selector, options={}) =&gt; {
  const {update, ignoreLive} = options
  const aliasName = getAliasName(selector)
  // only check the `asLive` array for the alias when `ignoreLive` is not set
  const isLive = aliasName &amp;&amp; !ignoreLive &amp;&amp; asLive.includes(aliasName)
  // only update valid alias names when `update` is set or when alias is live
  return aliasName&amp;&amp;(update||isLive)?cy.updateAlias(selector,options):orig(selector, options)
})

Cypress.Commands.overwrite('as', (orig, value, name, options={}) =&gt; {
  // push alias name to `asLive` array (or remove when live===false)
    options&amp;&amp;options.live&amp;&amp;!asLive.includes(name)&amp;&amp;asLive.push(name)||options&amp;&amp;options.live===false&amp;&amp;removeFromArray(asLive,name)
  return orig(value, name)
})
</code></pre>
<h2>A final test script</h2>
<p>That is it.<br />
To see this in action I&#8217;ve prepared a little test script below, you can just save it as a <code>whatever.spec.js</code> in your Cypress integration folder and run it. The test also shows the default &#8216;problem&#8217; as first context and in the second context the not-so-elegant command solutions.</p>
<pre><code class="language-javascript ">const asLive = []
Cypress.Commands.add('getListElements', () =&gt; cy.get('@list').find('li'))
Cypress.Commands.add('updateListElements', () =&gt; cy.get('@list').find('li').as('listElements'))

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
  isInArray&amp;&amp;array.splice(index, 1)
  return isInArray
}

/**
 * Return the element itself if it does not have a documentElement reference * @param {HTMLElement} elm
 * @returns {HTMLElement}
 */
function getDocumentElement(elm) {
  return elm.documentElement||elm
}

Cypress.Commands.add('updateAlias', (domAlias, options) =&gt; {
  const aliasName = getAliasName(domAlias)
  return aliasName&amp;&amp;cy.get(domAlias,{ignoreLive:true}).then($result =&gt; {
      const tree = [$result]
      while (tree[0].prevObject) tree.unshift(tree[0].prevObject)
      return tree.reduce(((cy,o)=&gt;cy.find(o.selector)),cy.wrap(getDocumentElement(tree.shift().get(0)))).as(aliasName)
  })||cy.get(domAlias, options)
})

Cypress.Commands.overwrite('get', (orig, selector, options={}) =&gt; {
  const {update, ignoreLive} = options
  const aliasName = getAliasName(selector)
  const isLive = aliasName &amp;&amp; !ignoreLive &amp;&amp; asLive.includes(aliasName)
  return aliasName&amp;&amp;(update||isLive)?cy.updateAlias(selector,options):orig(selector, options)
})

Cypress.Commands.overwrite('as', (orig, value, name, options={}) =&gt; {
  options&amp;&amp;options.live&amp;&amp;!asLive.includes(name)&amp;&amp;asLive.push(name)||options&amp;&amp;options.live===false&amp;&amp;removeFromArray(asLive,name)
  return orig(value, name)
})

describe('TestAlias', () =&gt; {
  beforeEach(() =&gt; cy
    .get('body').then($body=&gt;$body.get(0).innerHTML=`&lt;main&gt;
 &lt;ul data-list&gt;&lt;li&gt;&lt;/li&gt;&lt;li&gt;&lt;/li&gt;&lt;/ul&gt; &lt;ul&gt;${'&lt;li&gt;&lt;/li&gt;'.repeat(99)}&lt;/ul&gt;
 &lt;button onClick="document.querySelector('[data-list]').appendChild(document.createElement('li'))"&gt;add&lt;/button&gt;
&lt;/main&gt;`)
    .get('[data-list]').as('list')
    .get('@list').find('li').as('listElements')
    .get('@list').find('li').as('listElementsLive', {live: true})
    .get('button').as('addElement')
      .log(Cypress)
  )
  context('Default implementation', () =&gt; {
    it('should not get correct amount of elements by alias',() =&gt; cy
        .get('@listElements').should('have.length',2)
        .get('@addElement').click()
        .get('@listElements').should('have.length',2)
    )
  })
  context('Too specific custom commands', () =&gt; {
    it('should get correct amount of elements by custom command',() =&gt; cy
        .getListElements().should('have.length',2)
        .get('@addElement').click()
        .getListElements().should('have.length',3)
    )
    it('should get correct amount of elements by custom command that updates alias',() =&gt; cy
        .get('@listElements').should('have.length',2)
        .get('@addElement').click()
        .updateListElements().should('have.length',3)
        .get('@listElements').should('have.length',3)
    )
  })
  context('Non specific custom `updateAlias` command', () =&gt; {
    it('should get correct amount of elements by generic alias update command',() =&gt; cy
        .get('@addElement').click()
        .updateAlias('@listElements').should('have.length',3)
        .get('@listElements').should('have.length',3)
    )
  })
  context('Overwriting `get` and `as` commands', () =&gt; {
    it('should get correct amount of elements by alias when option.update', () =&gt; cy
      .get('@listElements').should('have.length', 2)
      .get('@addElement').click()
      .get('@listElements',{update:true}).should('have.length', 3)
    )
    it('should get correct amount when alias is live', () =&gt; cy
      .get('@listElementsLive').should('have.length', 2)
      .get('@addElement').click()
      .get('@listElementsLive').should('have.length', 3)
    )
    it('should not get correct amount when alias-live is disabled along the way', () =&gt; cy
      .get('@listElementsLive').should('have.length', 2).as('listElementsLive', {live: false})
      .get('@addElement').click()
      .get('@listElementsLive').should('have.length', 2)
    )
  })
})
</code></pre>