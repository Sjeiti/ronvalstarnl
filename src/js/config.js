export const VERSION = _VERSION||''

export const ENV = _ENV||{}
export const ENV_DEVELOPMENT = ENV['development']||false

export const MEDIA_URI = 'https://res.cloudinary.com/dn1rmdjs5/image/upload/v1597739261/rv/'
export const MEDIA_URI_HEADER = MEDIA_URI.replace('upload/', 'upload/c_scale,w_768/c_crop,w_768,h_200/')
export const MEDIA_URI_THUMB = MEDIA_URI.replace('upload/', 'upload/c_scale,w_316/')
export const MEDIA_URI_PROJECT = MEDIA_URI.replace('upload/', 'upload/c_scale,w_768/')
export const MEDIA_URI_VIDEO = MEDIA_URI.replace('image/', 'video/')

export const NS_SVG = 'http://www.w3.org/2000/svg'
export const NS_XLINK = 'http://www.w3.org/1999/xlink'

export const TODAY = new Date

export const PROBABLY_MOBILE = matchMedia?.('screen and (max-device-width:480px)').matches
