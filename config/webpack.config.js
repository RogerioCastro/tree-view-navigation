
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('../scripts/getPackageJson');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const {
  version,
  name,
  license,
  author,
} = getPackageJson('version', 'name', 'license', 'author');

const banner = `
  ${name} v${version}

  Copyright (c) ${author.replace(/ *<[^)]*> */g, " ")} and project contributors.

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'tree-view-navigation.min.js',
    path: path.resolve(__dirname, '..', 'build'),
    library: 'TreeViewNavigation',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
    clean: true
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false}),
      new CssMinimizerPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          {
            loader: "css-loader",
            options: {
              sourceMap: false,
            }
          },
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: false,
            }
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  ["autoprefixer"]
                ]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
};
