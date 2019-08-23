/**
 * Extend an object
 * @name extend
 * @method
 * @param {Object} obj Subject.
 * @param {Object} fns Property object.
 * @param {boolean} [overwrite=false]  Overwrite properties.
 * @returns {Object} Subject.
 */
function extend(obj, fns, overwrite){
  for (let s in fns){
    if (overwrite||obj[s]===undefined){
      obj[s] = fns[s]
    }
  }
  return obj
}

/**
 * Create namespaces.
 * @name ns
 * @method
 * @param {String} namespace The namespace we're creating or expanding
 * @param {Object|function} [object] The object with which to extend the namespace
 * @param {boolean} [isSingleton] The object with which to extend the namespace
 * @returns {Object} The namespace 'endpoint'.
 */
function ns(namespace, object, isSingleton){
  let space = window
    , namespaces = namespace.split('.')
    , name
    , doGetter = isSingleton&&typeof object==='function'

  // traverse namespaces from left to right
  while(name=namespaces.shift()){
    let isLast = namespaces.length===0
    if (isLast){
      let existingNamespace = space.hasOwnProperty(name)?space[name]:null
      if (doGetter){
        // object is function and should be applied as singleton
        Object.defineProperty(space, name, {get:function getter(){
          function getExpose(){
            if (!getter.expose) getter.expose = object()
            return getter.expose
          }
          return getter.expose||getExpose()
        }})
      } else {
        space[name] = object||{}
      }
      if (existingNamespace){
        // if the namespace we just added already exists we extend it with the original
        extend(space[name], existingNamespace)
      }
    } else if (!space.hasOwnProperty(name)){
      space[name] = {}
    }
    // when namespace is getter don't return it (for speed and memory)
    if (!(doGetter&&isLast)) space = space[name]
  }
  return space
}
