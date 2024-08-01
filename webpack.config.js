//Importar agora um módulo do node chamado Path
const path = require("path"); //CommonJS (Sistema de módulos)

//Agora temos que exportar para utilizar
module.exports = {
  //Aqui será a configuração do webpack
  mode: "development", //Tipo do modo
  entry: './renderer/renderer.js', //Arquivo de entrada(Ficará na pasta src(Source))
  output: {
    //output será um objeto
    path: path.resolve(__dirname, "public", "assets", "js"),
    //__dirname (Falar ao node que é para ele pegar os arquivos desta pasta raiz da aula)
    //E depois é so passar o caminho da pasta por string

    filename: "bundle.js", //Dar o nome para o arquivo
  },
  module: {
    //Dizer ao javaScript que queremos criar um arquivo que use o babel, e passe como
    //referência, para navegadores antigos de forma automática
    rules: [
      {
        //exclude(Fazer o webpack excluir a pasta do node, pra ele não ficar lendo a pasta)
        exclude: /node_modules/,
        test: /\.js$/, //Qual arquivo você vai analisar e formar o bundle com a referência dele??
        use: {
          //Oque ele vai usar??
          loader: "babel-loader", //Dependencia do babel
          options: {
            presets: ["@babel/env"], //Setar as presets que vamos utilizar
          },
        },
      },
    ], //Regras usa (Arrays, com objetos dentro)
  },
  devtool: "source-map", //Isso aqui faz o mapeamento do erro, pra gente identificar quando houver um erro no bundle
};