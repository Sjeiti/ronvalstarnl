<!--
  date: 2021-01-27
  modified: 2021-01-27
  slug: cypress-device-width
  type: post
  header: photo-1454496522488-7a8e488e8606.webp
  headerColofon: photo by [Rohit Tandon](https://unsplash.com/@rohittandon)
  headerClassName: no-blur
  excerpt: A crude fix for Cypress inability to test `device-width`
  categories: Javascript, HTML, CSS
  tags: CSS, speed, test, responsive, media queries
  related: useful-custom-cypress-commands
-->

# Cypress and `device-width`

This is one of those issues where it's easier for Muhammed go to the mountain.

Websites tend to use `min-width` for their media queries even though mostly `min-device-width` is better. But testing `device-width` with Cypress is [quite the challenge](https://github.com/cypress-io/cypress/issues/970).

In most cases people use either / or. So why not swap out `min-device-width` for `min-width` for the mobile tests to pass. Not in the compiled sources of course, in runtime: right before the test.

```typescript
Cypress.Commands.add('swapDeviceWidth', () => {  
  cy.document().then(doc=>{  
    let replaced = 0  
    Array.from(doc.styleSheets).forEach(sheet => {  
      try {  
        Array.from(sheet.cssRules).forEach((rule:CSSRule, index) => {  
          const {cssText} = rule  
          const regexQuery = /(\(\s*)(min|max)-device-(width|height)(\s*:)/  
          const hasDeviceWidth = cssText.match(regexQuery)  
          if (hasDeviceWidth) {  
            const newRule = cssText.replace(regexQuery, '$1$2-$3$4')  
            sheet.removeRule(index)  
            sheet.insertRule(newRule, index)  
            replaced++  
          }  
        })  
      }catch(err){/* prevent InvalidAccessError on external sources*/}  
    })  
    cy.log(`Replaced ${replaced} -device- rules`)  
  })  
})
```

It might not be the best solution but at least it works.
