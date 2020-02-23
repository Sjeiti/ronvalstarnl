const styleEl = document.createElement('style')
document.head.appendChild(styleEl)
const styleSheet = styleEl.sheet
const {cssRules} = styleSheet

/**
 * Add a rule to the stylesheet
 * @param {string} rule
 * @returns {CSSRule}
 */
export function addRule(rule){
  styleSheet.insertRule(rule, cssRules.length)
  return cssRules[cssRules.length-1]
}

/**
 * Remove a rule from the stylesheet
 * @param {string} selector
 */
export function removeRule(selector){
  Array.from(styleSheet.cssRules)
    .forEach((rule, i)=>{
      const {cssText} = rule
      cssText.includes(selector)
        &&styleSheet.deleteRule(i)
    })
}

/**
 * Select a rule from the stylesheet
 * @param {string} selector
 * @return {CSSRule}
 */
export function select(selector){
  let foundRule
  Array.from(document.styleSheets).forEach(sheet=>{
    try{
      !foundRule&&Array.from(sheet.cssRules).forEach(rule=>{
        rule.selectorText===selector&&(foundRule = rule)
      })
    }catch(err){/* prevent InvalidAccessError on external sources*/}
  })
  return foundRule
}
