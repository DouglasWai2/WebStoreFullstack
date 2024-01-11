const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve('server-build'),
    filename: 'index.js'
  },
  module: {
    rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
            },
          },
        },
  
        {
          test: /.css$/i,
          include: path.resolve(__dirname, "src"),
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          include: path.resolve(__dirname, "../src"),
          use: [
            'file-loader', 'url-loader'
          ],
        },
        {
          test: /\.(ico)$/,
          include: path.resolve(__dirname, "src"),
          use: 'file-loader?name=assets/[name].[ext]'
        },
      ],
  }
};