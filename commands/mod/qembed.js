const Discord = require('discord.js');

module.exports = {
  name: 'qembed',
  aliases: ['quickembed'],
  description: "cria uma mensagem embed rápida",

  async execute(client, message, args) {
    const sayMessage = args.join(' ');

    const title = sayMessage

    let embed = new Discord.MessageEmbed()
      .setColor(`#4cd8b2`)
      .setDescription(sayMessage)
      .setFooter(`mensagem enviada por: ${message.author.tag}`)
    

    message.channel.send(embed);
  }
}