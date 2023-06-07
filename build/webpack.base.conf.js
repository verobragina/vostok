const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  static: path.join(__dirname, '../static'),
  assets: 'assets/'
}

const PAGES_DIR = `${ PATHS.src }/pages/`

function generateJadePlugins(templateDir) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
  return templateFiles.map((item) => {
    const parts = item.split('.');
    const name = parts[0];
    return new HtmlWebpackPlugin({
      filename: `${ name }.html`,
      template: path.resolve(__dirname, `${ templateDir }/${ item }/${ name }.pug`),
    });
  });
}

const jadePlugins = generateJadePlugins(PAGES_DIR);

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    app: PATHS.src
    // module: `${PATHS.src}/your-module.js`,
  },
  output: {
    filename: `${ PATHS.assets }js/[name].js`,
    path: path.resolve(PATHS.dist),
    /*
      publicPath: '/' - relative path for dist folder (js,css etc)
      publicPath: './' (dot before /) - absolute path for dist folder (js,css etc)
    */
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [{
      test: /\.pug$/,
      oneOf: [
        // this applies to <template lang="pug"> in Vue components
        {
          resourceQuery: /^\?vue/,
          use: ['pug-plain-loader']
        },
        // this applies to pug imports inside JavaScript
        {
          use: ['pug-loader']
        }
      ]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        loader: {
          scss: 'vue-style-loader!css-loader!sass-loader'
        }
      }
    }, {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.(png|jpg|gif)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }, {
          loader: 'sass-loader',
          options: { sourceMap: true }
        }
      ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: { sourceMap: true }
        }, {
          loader: 'postcss-loader',
          options: { sourceMap: true, config: { path: `./postcss.config.js` } }
        }
      ]
    },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader',
          'svgo-loader'
        ]
      }]
  },
  resolve: {
    alias: {
      '~': PATHS.static, // Example: import Dog from "~/static/img/dog.jpg"
      '@': `${ PATHS.src }`, // Example: import Sort from "@/utils/sort.js"
      '@components': `${ PATHS.src }/components`, // Example: import Sort from "@/utils/sort.js"
      vue$: 'vue/dist/vue.js'
    }
  },
  plugins: [
    // Vue loader
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: `${ PATHS.assets }css/[name].css`
    }),
    new SpriteLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        // Images:
        {
          from: `${ PATHS.static }/img`,
          to: `${ PATHS.assets }img`
        },
        // Fonts:
        {
          from: `${ PATHS.static }/fonts`,
          to: `${ PATHS.assets }fonts`
        },
      ]
    }),
  ].concat(jadePlugins)
}
