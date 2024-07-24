import fs from 'fs'
import commander from 'commander'
const {promises:{readFile, writeFile}} = fs // require('node:fs')

console.log('raw2js')

const {src, target} = commander
        .usage('[options] <files ...>')
        .option('--src [entry...]', 'Sources')
        .option('--target [target]', 'Target path')
        .parse(process.argv)
        .opts()

console.log('cm',src, target)

;(async ()=>{
  const fileNames = src // .split(/\s/)
  const filesRead = await Promise.all(fileNames.map(f=>readFile(f)))
  const files = filesRead.map(b=>b.toString())
  
  const contents = `// auto generated
export const raw = {
  ${files.map((file,i)=>{
    const key = kebabToCamel(fileNames[i].match(/[^/]+(?=\.[^.]+$)/).pop())
    const value = file.replace(/`/g, '\\`')
     
    console.log('  -',key)

    return `${key}: \`${value}\``
  }).join(',\n  ')}
}
`
  
  await writeFile(target, contents)
  console.log('file written')
})()

function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}
 
