const file = '../src/data/json/fortpolio-list.json'
const contents = require(file)
const {save} = require('./util/utils.js')
save('temp/foo.json',JSON.stringify(contents,null,2))

