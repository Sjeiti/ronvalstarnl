/*global someNamespace*/
/**
 * The long description of this example namespace.
 * @summary Example namespace
 * @namespace my.namespace.structure
 * @todo Check functionality with signal equivalent
 */
window.my.namespace.structure = (function(){
  'use strict'

  let greatMethod = someNamespace.greatMethod
    , boringCamelCasedInteger = 1
    , happyString = 'happy' // 'unhappy'
    , somethingUndefined


  /**
   * Initialise all the things
   */
  function init(){
    initVariables()
    initEvents()
  }

  function initVariables(){
    somethingUndefined = 'defined'
  }

  function initEvents(){
    document.body.querySelector('form').addEventListener('change', handleFormChange)
  }

  /**
   * Update stuf when the form changes
   * @param {Event} e
   */
  function handleFormChange(e){
    happyString = e.data.state
  }

  /**
   * Add a camel and tell the greatMethod.
   * @param {number} nr
   * @return {number}
   */
  function addCamels(nr){
    boringCamelCasedInteger += nr
    greatMethod(boringCamelCasedInteger)
    return boringCamelCasedInteger
  }

  return {
    init: init
    , addCamels: addCamels
  }
})()