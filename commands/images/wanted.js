const canvacord = require("canvacord");
const Discord = require('discord.js');

module.exports = {
  name: 'wanted',
  aliases: ['procurado'],
  description: "adciona o avatar de um usuário em um cartaz de procuradp",
  dmAllow: true,

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0])

    if (args[0] && !user) return message.reply({ content: 'usuário informado não encontrado' });
    if (!user) user = message.author;

    let avatar = user.displayAvatarURL({ dynamic: false, format: 'png' });
    let image = await canvacord.Canvas.wanted(avatar);
    
    let attachment = new Discord.MessageAttachment(image, `wanted.png`);
    message.reply({ files: [attachment] });

  }
}