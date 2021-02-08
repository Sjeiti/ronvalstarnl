const {promisify} = require('util')
const glob = promisify(require('glob'))
const utils = require('./util/utils.js')
const {save, read} = utils

const globLess = './src/style/glob.less'

glob('src/js/**/*.less')
  .then(list=>{
    save(globLess, '//generated\n'+list
      .map(p=>p.replace(/^src\//,'@import \'../')+'\';')
      .join('\n')
    )
  })

