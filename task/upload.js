import Client from 'ssh2-sftp-client'
import { loadEnvFile } from 'node:process'

loadEnvFile()

const {HOST:host,PORT:port,USERNAME:username,PASSWORD:password} = process.env

const params = getProcessArguments()


;(()=>{

  const sftp = new Client()
 
  sftp
    .connect({host,port,username,password})
    .then(() => {
      return sftp.list('/nfs/vsp/dds.nl/s/sjeiti/public_html')
    })
    .then(data => {
      console.log(data, 'the data info')
    })
    .then(() => {
      sftp.end()
    })
    .catch(err => {
      console.log(err, 'catch error')
    })

})()


/**
 * Turn process arguments (`process.argv`) into key/value map.
 * @returns {Object}
 */
function getProcessArguments(){
  return (process.argv.slice(2).join(' ').match(/--?[^\s]+(?:\s+(?!--?)[^\s]+)*/g)||[])
      .reduce((acc, arg)=>{
        const [, key] = arg.match(/^--([^\s|=]+)/)||[]
        const [, value=true] = arg.match(/^--[^\s|=]+(.*)/)||[]
        if (key) acc[key] = value.trim()||true
        return acc
      }, {})
}
