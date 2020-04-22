const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist'
  },
  module: {
    rules: [
      //js
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      },
      //css
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {loader:'css-loader',  options: {sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {sourceMap: true, config: {path: './postcss.config.js'}}
          },
        ]
      },
      //scss
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {loader:'css-loader',  options: {sourceMap: true}},
          {
            loader: 'postcss-loader',
            options: {sourceMap: true, config: {path: './postcss.config.js'}}
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true}
          }

        ]
      }
    ]
  },
  devServer: {
    overlay: true
  },
  plugins: [
    new MiniCssExtractPlugin({
     filename: "[name].css",
     chunkFilename: "[id].css"
    })
  ]
}
