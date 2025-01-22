const Discord = require('discord.js');

module.exports = {
  name: 'say',
  aliases: ['falar', 'dizer', 'enviar'],
  description: "o bot repete o que você escreveu",

  async execute(client, message, args) {

    if(!args[0] || args[0] == ' ') return message.reply("escreva a mensagem a ser enviada após o comando. \n`exemplo: 'say olá mundo`");

    const sayMessage = args.join(' ');
    message.delete().catch(O_o => { });
    if(message.author.id == '466673774142685195' || message.author.id == '829513988550164490') {
      message.channel.send(sayMessage);
    } else {
      message.channel.send(sayMessage + `\`\nMensagem enviada por: ${message.author.id}\``);
    }
  }
}