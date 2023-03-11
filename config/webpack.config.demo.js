const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'cheap-module-source-map',
  entry: './src/demo/index.js',
  output: {
    filename: 'index.js'
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    open: true,
    hot: true,
    host: "localhost",
    port: 9001
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
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
              sourceMap: true,
            }
          },
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
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
    new HtmlWebpackPlugin({
      title: 'Tree View Navigation',
      template: './src/demo/index.ejs',
      favicon: './src/assets/favicon.ico',
      minify: false
    })
  ]
};
