const {run, spawnTask} = require('./util/utils.js')

const port = 1231
const serveTask = `node task/serve dist ${port} -s`
const renderTask = `node task/preRender --entry http://localhost:${port} --target dist`

const serving = spawnTask(serveTask)
run(renderTask).then(()=>serving.kill())
