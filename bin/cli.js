#!/usr/bin/env node

const minimist = require('minimist')
const path = require('path')
const join = path.join
const webpack = require('webpack')
// Constants:

const defaultPaths = [
  'pluginEntry.ts',
  'pluginEntry.js',
  'src/pluginEntry.ts',
  'src/pluginEntry.js'
]

// Args:

const argv = minimist(process.argv.slice(2))
const pathArg = argv._[0]

// Read Config:
let pluginEntryPath = null
const paths = pathArg == null ? defaultPaths : [pathArg]

if (pluginEntryPath == null) {
  const defaultPath = paths.shift()
  if (defaultPath != null) {
    pluginEntryPath =
      defaultPath[0] === '/' ? defaultPath : join(process.cwd(), defaultPath)
  }
}
console.log(`Plugin Entry Path: ${pluginEntryPath}`)

const babelOptions = {
  cacheDirectory: true,
  babelrc: false,
  configFile: false
}

webpack(
  {
    // Configuration Object
    devtool: 'source-map',
    mode: 'development',
    entry: pluginEntryPath,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(@babel\/runtime|babel-runtime)/,
          use: { loader: 'babel-loader', options: babelOptions }
        }
      ]
    },
    output: {
      filename: 'plugin-bundle.js',
      path: join(
        path.dirname(__dirname),
        '..',
        '..',
        'android/app/src/main/assets/edge-core'
      )
    },
    performance: { hints: false },
    plugins: [
      new webpack.IgnorePlugin({ resourceRegExp: /^(https-proxy-agent)$/ }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.ProvidePlugin({
        process: path.resolve('node_modules/process/browser.js')
      })
    ],
    resolve: {
      aliasFields: ['browser'],
      extensions: ['.js'],
      fallback: {
        fs: false,
        vm: require.resolve('vm-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        os: require.resolve('os-browserify/browser'),
        string_decoder: require.resolve('string_decoder'),
        path: require.resolve('path-browserify'),
        util: require.resolve('util')
      },
      mainFields: ['browser', 'module', 'main']
    }
  },
  (err, stats) => {
    if (err || stats.hasErrors()) {
      // Handle errors here
      console.log(err)
      console.log(stats)
    }
    // Done processing
  }
)
