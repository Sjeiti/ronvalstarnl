import {promisify} from 'util'
import _glob from 'glob'
import {save} from './util/utils.js'

const glob = promisify(_glob)

const globLess = './src/style/glob.less'

glob('src/js/**/*.less')
  .then(list=>{
    save(globLess, '//generated\n'+list
      .map(p=>p.replace(/^src\//,'@import \'../')+'\';')
      .join('\n')
    )
  })

