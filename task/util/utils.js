import glob from 'glob'
import fs from 'fs'
import mkdirp from 'mkdirp'
import child_process from 'child_process'
import http from 'http'
import util from 'util'

/**
 * Promise glob
 * @param {string} globstring
 * @returns {Promise}
 */
export function glomise(globstring) {
  return new Promise(function (resolve) {
    glob(globstring,function(err,result){
      resolve(result);
    });
  });
}

/**
 * Promise to read a file
 * @param {string} file
 * @returns {Promise}
 */
export function read(file){
  return new Promise((resolve,reject)=>
    fs.readFile(file,(err,data)=>
      err?reject(err):resolve(data.toString())
    )
  );
}

/**
 * Promise to save a file
 * @param {string} file
 * @param {string} data
 * @param {boolean} [silent=false]
 * @returns {Promise}
 */
export function save(file,data,silent=false) {
  !silent&&console.log('saving',file,formatBytes(data.length));
  return mkdirp(getDirName(file))
      .then(()=>new Promise(function(resolve,reject){
        fs.writeFile(file, data, err=>err&&reject(err)||resolve());
      }),console.warn.bind(console));
}

/**
 * Extend an object
 * @name extend
 * @method
 * @param {Object} base Subject.
 * @param {Object} extension Property object.
 * @param {boolean} [overwrite=false] Overwrite properties.
 * @returns {Object} Subject.
 */
export function extend(base,extension,overwrite){
  for (var s in extension) {
    if (overwrite||base[s]===undefined) {
      base[s] = extension[s];
    }
  }
  return base;
}

/**
 * Promise to copy a file to somewhere
 * @param {string} source
 * @param {string} target
 * @returns {Promise}
 */
export function copy(source, target) {
  console.log('copying',source,'to',target);
  return mkdirp(getDirName(target))
      .then(()=>new Promise(function(resolve,reject){
        var cbCalled = false
            ,readStream = fs.createReadStream(source)
            ,writeStream = fs.createWriteStream(target);
        readStream.on('error', done);
        writeStream.on('error', done);
        writeStream.on('close',()=>done());
        readStream.pipe(writeStream);
        function done(err) {
          if (!cbCalled) {
            err&&reject(err)||resolve();
            cbCalled = true;
          }
        }
      }),console.warn.bind(console));
}

/**
 * Get the directory path from a file path
 * @param {string} file
 * @returns {string}
 */
export function getDirName(file){
  return file.replace(/[^\/\\]*\.\w{0,8}$/,'');
}

/**
 * A promised child_process exec
 * @param {string} cmd
 * @param {object} opts
 * @returns {Promise}
 */
export function exec(cmd, opts) {
  opts || (opts = {});
  return new Promise((resolve,reject)=>{
    const child = child_process.exec(cmd,opts,(err,stdout,stderr)=>err?reject(err):resolve({
        stdout: stdout
        ,stderr: stderr
    }));
    child.on('close',resolve);
    child.on('error',reject);
    opts.stdout&&child.stdout.pipe(opts.stdout);
    opts.stderr&&child.stderr.pipe(opts.stderr);
  });
}

/**
 * Replaces the block between comments.
 * @param {string} source
 * @param {string|RegExp} start
 * @param {string|RegExp} end
 * @param {string} replacement
 * @returns {string}
 */
export function blockReplace(source,start,end,replacement){
  var sourceSplit = source.split(/\r\n|\n|\r/)
      ,hasStarted = false
      ,indexNew = 0
      ,indexStart = -1
      ,string = 'string'
      ,newline = '\r\n'
      ,rxStringComment = '<!--\\s?#\\s?-->'
      ,getRegex = (base,commentContents)=>new RegExp(base.replace('#',commentContents.replace(/\//g,'\\/')))
      ,replacements = []
      ,sourceNew
  ;
  if (typeof start===string) start = getRegex(rxStringComment,start);
  if (typeof end===string) end = getRegex(rxStringComment,end);
  sourceNew = sourceSplit.filter(function(line,i){
      var doReturn = true;
      if ((hasStarted?end:start).test(line)) {
        hasStarted = !hasStarted;
        if (hasStarted) {
          indexStart = i;
          replacements[indexNew] = typeof replacement===string&&replacement||replacement(line);
        }
      } else if (hasStarted) {
        doReturn = false;
      }
      doReturn&&indexNew++;
      return doReturn;
    })
  ;
  replacements.forEach((s,i)=>sourceNew[i]=sourceNew[i]+newline+s);
  return sourceNew.join(newline);
}

/**
 * Format bytes to human readable string
 * @param {number} bytes
 * @param {number} decimals
 * @returns {string}
 */
export function formatBytes(bytes,decimals) {
   if (bytes===0) return '0 Byte';
   var k = 1000
       ,dm = decimals + 1 || 3
       ,sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
       ,i = Math.floor(Math.log(bytes) / Math.log(k));
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function promiseRestJSON(host,port,endpoint){
  return new Promise((resolve,reject)=>{
    http.get({host,port,path:endpoint,method:'GET'},res=>{
      res.setEncoding('utf8');
      var body = '';
      res.on('data',d=>body+=d);
      res.on('end', function() {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          error('Failed to parse json:', body);
          return reject(err);
        }
      });
    }).on('error', function(err) {
      error('Error with the request:', err.message);
      reject(err);
    });
  });
}

/**
 * Run a cli task by exec
 * @param {string} task
 */
export async function run(task){
  const {promisify} = util
  const {exec} = child_process
  const pexec = promisify(exec)
  const {stdout,stderr} = await pexec(task)
  // stdout.on('data',console.log)
  stdout && console.log(stdout)
  stderr && console.warn(stderr)
}

/**
 * Spawn a task and pipe output to current process
 * @param {string} task
 */
export function spawnTask(task){
  const {spawn} = child_process
  const args = typeof task==='string'?task.split(/\s+/g):task
  const proc = spawn(args.shift(),args)
  const {stdout,stderr} = proc
  stdout.pipe(process.stdout)
  stderr.pipe(process.stderr)
  proc.on('error',console.error)
  // error.pipe(process.error)
  // stdout.on('data',data=>console.log(data.toString()))
  // stderr.on('data',data=>console.warn(data.toString()))
  // stderr.on('exit',data=>console.log(data.toString()))
  return proc
}

/*module.exports = {
  glomise
  ,read
  ,save
  ,copy
  ,exec
  ,blockReplace
  ,extend
  ,get logElapsed(){
    var t = Date.now();
    return ()=>console.log(require('chalk').bold.warning.inverse('elapsed: '+(Date.now()-t)/1000+'s'));
  }
  ,formatBytes
  ,promiseRestJSON
  ,run
  ,spawnTask
  ,log: console.log.bind(console)
  ,warn: console.warn.bind(console)
  ,error: console.error.bind(console)
};*/
