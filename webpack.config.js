const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fileName = '[name]-[hash].[ext]'
module.exports = env => {

  const isProduction = !!env&&env.production
  // const isDevelopment = !!env&&env.development
  // const isStaging = !!env&&env.staging
  const mode = isProduction?'production':'development'

  return {
    mode
    ,entry: './src/js/index.js'
    ,output: {
      filename: 'js/index.js'
      ,path: path.resolve(__dirname,'dist')
    }
    ,devtool: 'source-map'
    ,module: {
      rules: [{
          test: /\.less$/
          ,use: [
              'style-loader' // creates style nodes from JS strings
              ,'css-loader' // translates CSS into CommonJS
              ,'less-loader' // compiles Less to CSS, using Node Sass by default
          ]
      },{
          test: /\.scss$/
          ,use: [
              'style-loader' // creates style nodes from JS strings
              ,'css-loader' // translates CSS into CommonJS
              ,'sass-loader' // compiles Sass to CSS, using Node Sass by default
          ]
      },{
        test: /\.(log|frag|vert|txt|css)/
        ,use: [{
            loader: 'raw-loader'
            ,options: {
                name: `data/${fileName}`
            }
        }]
      },{
        test: /\.(mp3|mp4)$/
        ,use: [{
            loader: 'file-loader'
            ,options: {
                name: `media/${fileName}`
            }
        }]
      },{
        test: /\.(eot|woff|woff2|ttf|png|jp(e*)g|svg)$/
        ,use: [{
            loader: 'url-loader'
            ,options: {
                limit: 8000 // Convert images < 8kb to base64 strings
                ,name: `img/${fileName}`
            }
        }]
      },{
        test: /\.js$/
        ,exclude: /node_modules/
        ,use: {
          loader: 'babel-loader'
          ,options: { babelrc: true }
        }
      }]
    }
    ,plugins: [
      new CopyWebpackPlugin([
          { from: 'src/index.html', to: './'}
          ,{ from: 'src/_redirects', to: './'}

          //,{ from: 'src/style/screen.css', to: './style/'}
          ,{ from: 'src/data', to: './data' }
          ,{ from: 'src/static', to: './static' }
          //,{ from: 'temp/*.json', to: './data', flatten:true }
          ,{ from: 'node_modules/Experiments/src/experiment/', to: './static/experiment' }
          ,{ from: 'node_modules/Experiments/src/experiment/', to: './static/experiment' }
          /*{ from: `${isProduction?'temp':'src'}/index.html`, to: './'}
          ,{ from: 'src/.htaccess', to: './'}
          ,{ from: 'src/_redirects', to: './'}
          ,{ from: 'src/index.xml', to: './'}
          ,{ from: 'src/data/root', to: './data/root', ignore:['*.html','*.txt']}
          ,{ from: 'src/data/audio', to: './data/audio'}
          ,{ from: 'src/test.html', to: './'}*/
      ], {})
      ,new webpack.DefinePlugin({
        _VERSION: JSON.stringify(require('./package.json').version)
        ,_ENV: JSON.stringify(env||{})
      })
    ]
  }
}
