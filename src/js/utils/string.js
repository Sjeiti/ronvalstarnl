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

/**
 * Convert numbers to words
 * @param {number} num
 * @return {string}
 */
export function numberToWords(num) {
  const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
  const tens = ['','','twenty','thirty','fourty','fifty','sixty','seventy','eighty','ninety']
  const sep = ['',' thousand ',' million ',' billion ',' trillion ',' quadrillion ',' quintillion ',' sextillion ']

  const arr = []
  let val = num
  let str = ''
  let i = 0

  while (val){
    arr.push(val % 1000)
    val = parseInt(val / 1000, 10)
  }

  while (arr.length) {
    str = (function (a) {
      const x = Math.floor(a / 100), y = Math.floor(a / 10) % 10, z = a % 10

      return (x>0?ones[x] + ' hundred ':'') + (y>=2?tens[y] + ' ' + ones[z]:ones[10 * y + z])
    })(arr.shift()) + sep[i++] + str
  }

  return str
}
