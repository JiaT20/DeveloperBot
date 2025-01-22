const Discord = require('discord.js');
const mongoose = require('mongoose');

const guildConfig = require('../../mongoSchema/guild');

module.exports = {
  name: 'prefix',
  aliases: ['setprefix', 'prefixo', 'botprefix'],
  description: "altera o prefixo da Luna, que por padrão é ' (aspas simples)",
  userPermissions: 'ADMINISTRATOR',

  async execute(client, message, args) {

    if(!args[0] || args[0] == ' ' || args[0] == '') return message.channel.send( {embed:
      {
        color: '#00ffff',
        title: 'Alterar o prefixo da Luna',
        description: `para alterar o prefixo da Luna, que por padrão é ' (aspas simples),
        escreva o caractere ou conjunto de caracteres que deseja definir como novo prefixo`,
        fields: [{
        name: "exemplo:",
        value: "'prefix +\n'prefix l."
      }]
      }
    })

    guildData = await guildConfig.findOneAndUpdate(
      {
        guildID: message.guild.id,
      }, {
        prefix: `${args[0]}`,
        lastEdit: Date.now()
      }
    );
    guildData.save();

    let saveEmbed = new Discord.MessageEmbed()
      .setColor('00ff50')
      .setTitle('Prefixo alterado com sucesso')
      .setDescription(`agora o prefixo da Luna nesse servidor é ${args[0]}`)
      .setFooter(`exemplo: ${args[0]}play`);

    message.channel.send(saveEmbed);

  }
}