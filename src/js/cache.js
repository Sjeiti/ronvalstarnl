/* eslint-disable no-console */

import {register} from 'register-service-worker'
import {signal} from './signal'
import {ENV} from './config'

export const appReady = signal()
export const appCached = signal()
export const appUpdated = signal()
export const appOffline = signal()
export const appError = signal()

if (ENV.production){
  register('/service-worker.js', {
    // App is being served from cache by a service worker
    ready(){
      appReady.dispatch()
    }
    // Content has been cached for offline use
    , cached(){
      appCached.dispatch()
    }
    // New content is available; please refresh
    , updated(){
      appUpdated.dispatch()
    }
    // No internet connection found. App is running in offline mode.
    , offline(){
      appOffline.dispatch()
    }
    // Error during service worker registration
    , error(error){
      appError.dispatch(error)
    }
  })
}

