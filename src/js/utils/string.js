/**
 * Turn a string into a valid slug
 * @param {string} string
 * @return {string}
 */
export function slugify(string){
  const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
  const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

/**
 * Wrap classNames object to have both name and selector
 * @param {object} obj
 * @return {object}
 */
export function makeClassNames(obj){
  Object.entries(obj).forEach(([key, value])=>{
    obj[key] = {
      toString: function(){
        return this.selector
      }
      , get name(){
        return value
      }
      , get selector(){
        return `.${value}`
      }
    }
  })
  return obj
}