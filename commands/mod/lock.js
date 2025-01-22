const Discord = require("discord.js");

module.exports = {
  name: 'lock',
  aliases: ['fechar', 'travar', 'block', 'bloquear'],
  description: 'retira a permissão de "@everyone" (ou o membro/cargo mencionado) enviar mensagens no chat',
  userPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],

  async execute(client, message, args) {

    var target;

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (user) target = user;

    const role = message.guild.roles.cache.get(args[0])

    if (role) target = role;

    if(target) {
      message.channel.updateOverwrite(target, { SEND_MESSAGES: false });
    } else {
      message.channel.updateOverwrite(message.guild.roles.everyone, { SEND_MESSAGES: false });
      target = '@everyone'
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ffff00')
      .setTitle('Canal Bloqueado com sucesso!')
      .setDescription(`agora ${target} não pode(m) mais enviar mensagens nesse canal`);

    message.channel.send(embed);

  }
}