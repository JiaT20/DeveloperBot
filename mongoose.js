const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {

  init: () => {

    mongoose.connect(process.env['mongodb_login'], {
      useNewUrlParser: true,
      useUnifiedTopology: true
      //useFindAndModify: false,
      //useCreateIndex: true
    })

    mongoose.connection.on('connected', () => {
      console.log('\x1b[4m%s\x1b[0m', '| Conectado ao 🏧 de 🎲 | ');
    });

    mongoose.connection.on('disconnected', () => {
      console.log('❌ 🎲 | Desconectado do banco de dados | ❌ 🎲 ');
    });

    mongoose.connection.on('err', (err) => {
      console.log('❌ 🎲 Erro ao conectar ao banco de dados: ' + err);
    });

  }
}