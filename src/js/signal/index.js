import {createSignal} from 'state-signals'

/**
 * De-classify signal instantiation
 * @return {Signal}
 * @todo remove in favor of createSignal
 */
export function signal(){
  return createSignal()
}
