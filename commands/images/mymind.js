const canvacord = require("canvacord");
const Discord = require('discord.js');

module.exports = {
  name: 'mymind',
  aliases: ['changemymind', 'change'],
  description: "gera um meme 'change my mind' com a frase informada ",
  dmAllow: true,

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#909020', title: 'change my mind', description: 'escreva a frase para gerar o meme junto com o comando'
      }]
    });

    let frase = args.join(' ');

    let image = await canvacord.Canvas.changemymind(frase);
    let attachment = new Discord.MessageAttachment(image, `changemymind.png`);
    message.reply({ files: [attachment] });

  }
}