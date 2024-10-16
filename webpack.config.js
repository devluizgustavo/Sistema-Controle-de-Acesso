const path = require("path"); //CommonJS (Sistema de módulos)

module.exports = {
  mode: "development", //Tipo do modo
  entry: './renderer/renderer.js', 
  output: {
    path: path.resolve(__dirname, "public", "assets", "js"),
    filename: "bundle.js", //Dar o nome para o arquivo
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: {
          loader: "babel-loader", 
          options: {
            presets: ["@babel/env"],
          },
        },
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }], 
  },
  devtool: "source-map",
};