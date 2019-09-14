const styleEl = document.createElement('style')
document.head.appendChild(styleEl)
const styleSheet = styleEl.sheet

/**
 * Add a rule to the stylesheet
 * @param {string} rule
 */
export function addRule(rule){
  styleSheet.insertRule(rule, styleSheet.cssRules.length)
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
 */
export function select(selector){
  selector
  // todo implement
}
