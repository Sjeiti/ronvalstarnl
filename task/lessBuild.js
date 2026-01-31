#!/usr/bin/env node

import {read, save} from './util/utils.js'
import commander from 'commander'
import less from 'less'

const {Command} = commander
const {source, target, names} = new Command()
    .usage('[options] <files ...>')
    .option('--source [source]', 'Source path')
    .option('--target [target]', 'Target path')
    .option('--names [names...]', 'Names', [])
    .parse(process.argv)
    .opts()

console.log('source', source)
console.log('target', target)
console.log('names', names)

names.map(async name=>{
  const path = source +'/'+ name +'.less'
  const targetFile = target +'/'+ name +'.css'
  const srcCode = await read(path)
  //console.log('code', srcCode)

  const output  = await less.render(srcCode, {
    paths: [source],
    //paths: [path.dirname(source)],
    //paths: [path.dirname(srcPath)],
    compress: true
  })

  save(targetFile, output.css)
  //console.log('output', output)
  console.log('output', targetFile)
})

/*

const fs   = require('fs');
const path = require('path');
const less = require('less');

const ENTRIES = [
  { name: 'main',  src: 'src/less/main.less',  dest: 'dist/css/main.css'  },
  { name: 'admin', src: 'src/less/admin.less', dest: 'dist/css/admin.css' },
  { name: 'print', src: 'src/less/print.less', dest: 'dist/css/print.css' }
];

(async () => {
  for (const { name, src, dest } of ENTRIES) {
    try {
      const srcPath  = path.resolve(src);
      const destPath = path.resolve(dest);

      if (!fs.existsSync(srcPath)) {
        console.error(`[${name}] source not found: ${srcPath}`);
        continue;
      }

      const srcCode = fs.readFileSync(srcPath, 'utf8');
      const output  = await less.render(srcCode, {
        paths: [path.dirname(srcPath)],
        compress: true
      });

      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, output.css, 'utf8');
      console.log(`[${name}] built → ${destPath}`);
    } catch (err) {
      console.error(`[${name}] error:`, err.message);
    }
  }
})();

*/
