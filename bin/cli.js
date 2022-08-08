#!/usr/bin/env node
import minimist from 'minimist'
import { createRequire } from 'module'
import path, { join as joinPath } from 'path'
import { fileURLToPath } from 'url'
import webpack from 'webpack'

const require = createRequire(import.meta.url)

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
  const path = paths.shift()
  if (path != null) {
    pluginEntryPath = path[0] === '/' ? path : joinPath(process.cwd(), path)
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
      path: path.join(
        path.dirname(fileURLToPath(import.meta.url)),
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
        path: require.resolve('path-browserify')
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
