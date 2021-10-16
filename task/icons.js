const {Command} = require('commander')
const sharp = require('sharp')
const mkdirp = require('mkdirp')
const commander = new Command()
    .usage('[options] <files ...>')
    .option('--source [source]', 'Source path')
    .option('--target [target]', 'Target path')
    .option('--sizes [sizes]', 'Sizes')
    .parse(process.argv)
const {source, target, sizes} = commander.opts()
const sizeValues = sizes.split(/,/g).map(size=>size.split(/x/).map(parseFloat))

sizeValues.forEach(o=>o.length===1&&o.push(o[0]))

mkdirp(target).then(() =>
    Promise.all(sizeValues.map(([width, height]) => {
      const density = 72 * width / 16
      return sharp(source, {density})
          .resize(width, height)
          .toFile(`${target}/icon-${width}x${height}.png`)
    }))
)
