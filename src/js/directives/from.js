import {numberToWords} from '../utils/string'

export const from = (elm, content)=>{
  const from = new Date(content).getTime()
  const to = Date.now()
  const elapsed = Math.round((to - from)/(1000*60*60*24*365))
  elm.innerText = numberToWords(elapsed)
}
