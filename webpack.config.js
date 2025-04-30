import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import WatchExternalFilesPlugin from 'webpack-watch-files-plugin'

const __dirname = import.meta.dirname

const pack = JSON.parse(fs.readFileSync('./package.json'))
const fileName = '[name]-[hash].[ext]'
export default env => {

  const isProduction = !!env&&env.production
  const mode = isProduction?'production':'development'

  return {
    mode
    , entry: './src/js/index.js'
    , output: {
      filename: 'js/index.js'
      , path: path.resolve(__dirname, 'dist')
    }
    , devtool: 'source-map'
    , module: {
      rules: [{
        test: /\.(log|frag|vert|txt|css)/
        , use: [{
            loader: 'raw-loader'
            , options: {
                name: `data/${fileName}`
            }
        }]
      }, {
        test: /\.(html)/
        ,loader: 'html-loader'
      },{
        test: /\.(mp3|mp4)$/
        , use: [{
            loader: 'file-loader'
            , options: {
                name: `media/${fileName}`
            }
        }]
      }, {
        test: /\.(eot|woff|woff2|ttf|png|jp(e*)g|svg)$/
        , use: [{
            loader: 'url-loader'
            , options: {
                limit: 8000 // Convert images < 8kb to base64 strings
                , name: `img/${fileName}`
            }
        }]
      }, {
        test: /\.js$/
        , exclude: /node_modules/
        , use: {
          loader: 'babel-loader'
          , options: { babelrc: true }
        }
      }]
    }
    , plugins: [
      new CopyWebpackPlugin({patterns:[
          { from: 'src/index.html', to: './'}
          , { from: 'src/BingSiteAuth.xml', to: './'}
          , { from: 'src/_redirects', to: './'}
          , { from: 'LICENSE.txt', to: './' }
          , { from: 'src/data/json', to: './data/json' }
          , { from: 'src/data/search', to: './data/search' }
          , { from: 'RV_algvw20*.*', to: './data', context: 'src/data/' }
          , { from: 'src/static', to: './static' }
          , { from: 'node_modules/experiments/src/experiment/', to: './static/experiment' }
          , {
            from: 'node_modules/experiments/src/experiment/'
            , to: './static/experiment/[name].[ext]_'
            , toType: 'template',
          }
          , { from: 'node_modules/experiments/src/static/glsl/', to: './static/glsl' }
          , { from: 'node_modules/experiments/src/static/img/', to: './static/img' }
          , { from: 'node_modules/experiments/src/static/html/', to: './static/html' }
          , { from: 'node_modules/experiments/src/math/', to: './math' }
      ]})
      , new webpack.DefinePlugin({
        _VERSION: JSON.stringify(pack.version)
        , _ENV: JSON.stringify(env||{})
      })
      //, new WatchExternalFilesPlugin ({
      //  files: ['src/js/**/*.less'] // see screen.less with glob import (which doesn't work with watcher)
      //})

    ]
  }
}
