const Discord = require("discord.js");

module.exports = {
  name: 'emoji',
  aliases: ['sendemoji',],
  description: "reenvia um emoji em um tamanho maior",

  async execute(client, message, args) {

    if(!args[0]) return message.channel.send(
      {embed:{description: 'envie o emoji ou o nome do emoji que deseja exibir junto com o comando'}}
    );

    const emoji = message.guild.emojis.cache.get(args[0]);

    if (!emoji) return message.channel.send(
      {embed: {description: 'emoji não encontrado, ou não está em um servidor que eu estou (só consigo enviar emojis de servers no qual eu esteja neles)'}}
    );

    message.channel.send(`${emoji}`)

  }
}