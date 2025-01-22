const Discord = require("discord.js");

module.exports = {
  name: 'unlock',
  aliases: ['abrir', 'destravar'],
  description: 'restaura a permissão de "@everyone" (ou o membro/cargo informado) enviar mensagens no chat',
  userPermissions: 'MANAGE_CHANNELS',

  async execute(client, message, args) {

    var target;

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (user) target = user;

    const role = message.guild.roles.cache.get(args[0])

    if (role) target = role;

    if(target) {
      message.channel.updateOverwrite(target, { SEND_MESSAGES: null });
    } else {
      message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: null });
      target = '@everyone'
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Canal desbloqueado com sucesso!')
      .setDescription(`agora ${target} voltaram a poder enviar mensagens nesse canal`);

    message.channel.send(embed);

  }
}