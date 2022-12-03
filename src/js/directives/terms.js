export const terms = (elm/*, content*/)=>{
  console.log('terms',elm) // todo: remove log
  elm.innerHTML = elm.textContent
    .split(/\s/g)
    .sort(()=>Math.random()<0.5?1:-1)
    .map(s=>{
        const [all, name, term] = s.match(/([^:]*):(.*)|.*/)
        const searchTerm = (term||all).toLowerCase()
        const searchName = (name||all).replace(/_/g, ' ')
        return `<a href="/search/${searchTerm}">${searchName}</a>`
    }).join(' ')
}
