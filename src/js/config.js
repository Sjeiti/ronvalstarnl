export const VERSION = _VERSION
export const ENV = _ENV
export const ENV_DEVELOPMENT = ENV['development']||false
export const MEDIA_URI = 'https://res.cloudinary.com/dn1rmdjs5/image/upload/v1566568756/rv/'
export const MEDIA_URI_HEADER = MEDIA_URI.replace('upload/', 'upload/c_scale,w_768/c_crop,w_768,h_200/')
console.log('VERSION,ENV', VERSION, ENV) // todo: remove log
