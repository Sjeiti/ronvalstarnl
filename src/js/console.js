window.onerror = function(msg, url, line, col, error){
   let extra = !col ? '' : '\ncolumn: ' + col
   extra += !error ? '' : '\nerror: ' + error
   console.error('Error: ' + msg + '\nurl: ' + url + '\nline: ' + line + extra)
}

const pre = document.createElement('pre')
const code = document.createElement('code')
pre.appendChild(code)
document.querySelector('aside').appendChild(pre)

const append = (...args)=>{
  code.textContent += args.join(' ')+'\n'
}

// fake console
for (let s in console){
  if (typeof console[s]==='function'){
    console[s] = append
  }
}
console.clear = ()=>code.innerHTML=''

code.addEventListener('dblclick', console.clear.bind(console))

Promise.onerror = console.error
