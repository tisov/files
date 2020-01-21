let path = require('path')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let VueLoaderPlugin = require('vue-loader/lib/plugin')
let autoprefixer = require('autoprefixer')
let htmlWebpackPlugin = require('html-webpack-plugin')
let copyWebpackPlugin = require('copy-webpack-plugin')


module.exports = (env, options) => {
   return {
      entry: ['@babel/polyfill', './src/index.js'],
      output: {
         path: path.resolve(__dirname, './dist'),
         filename: 'js/bundle.js',
         // publicPath: '/dist/',
      },
      devServer: {
         overlay: true,
         contentBase: [
            path.join(__dirname, 'dist/')
         ],
         watchContentBase: true,
         publicPath: '/dist/',
         historyApiFallback: true,
         compress: true
      },
      devtool: options.mode === 'production' ? false : 'eval-sourcemap',
      module: {
         rules: [
            {
               test: /\.vue$/,
               loader: 'vue-loader'
            },
            {
               test: /\.js$/,
               exclude: file => (
                  /node_modules/.test(file) &&
                  !/\.vue\.js/.test(file)
               ),
               use: {
                  loader: 'babel-loader',
                  options: {
                     presets: ['@babel/preset-env'],
                     cacheDirectory: true,
                     cacheCompression: false
                  }
               }
            },
            {
               test: /\.sass$/,
               use: [
                  {
                     loader: options.mode === 'development' ? 'vue-style-loader' : MiniCssExtractPlugin.loader
                  },
                  {
                     loader: 'css-loader',
                     options: {
                        url: false
                     }
                  },
                  // {
                  //    loader: 'postcss-loader',
                  //    options: {
                  //       plugins: [
                  //          require('autoprefixer')({
                  //             'browsers': ['> 1%', 'last 2 versions']
                  //          })
                  //       ]
                  //    }
                  // },
                  {
                     loader: 'sass-loader',
                     options: {
                        indentedSyntax: true
                     }
                  }
               ]
            },
            {
               test: /\.css$/,
               use: [
                  {
                     loader: options.mode === 'development' ? 'vue-style-loader' : MiniCssExtractPlugin.loader
                  },
                  {
                     loader: 'css-loader',
                     options: {
                        url: false
                     }
                  }
               ]
            },
            {
               test: /\.(woff(2)?|ttf|svg)(\?v=\d+\.\d+\.\d+)?$/,
               use: [{
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]',
                     outputPath: '/dist/fonts/'
                  }
               }]
            }
         ]
      },
      plugins: [
         new MiniCssExtractPlugin({
            filename: 'css/[name].css',
         }),
         new VueLoaderPlugin(),
         new copyWebpackPlugin([
            {
               from: './public/fonts',
               to: './fonts'
            },
            {
               from: './public/img',
               to: './img'
            }
         ]),
         new htmlWebpackPlugin({
            inject: true,
            // filename: 'index.html',
            template: 'public/index.html'
         })
      ],
      resolve: {
         alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, 'src/')
         },
         extensions: ['*', '.js', '.vue', '.json']
      },
      optimization: {
         splitChunks: {
            automaticNameDelimiter: '.',
            chunks: 'all',
            cacheGroups: {
               vendors: {
                  filename: 'js/vendors.bundle.js'
               }
            }
         }
      }
   }
}
