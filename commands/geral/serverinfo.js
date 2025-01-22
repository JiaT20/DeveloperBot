const Discord = require("discord.js");
const guildConfig = require('../../mongoSchema/guild');

module.exports = {
  name: 'serverinfo',
  aliases: ['server', 'guild', 'guildinfo'],
  description: "exibe informações sobre um servidor",

  async execute(client, message, args) {

    let guild

    if (args[0]) {
      guild = await client.guilds.fetch(args[0]);
      if (!guild) return message.reply(`Servidor \`${args[0]}\` não encontrado`);
    }
    else {
      guild = message.guild;
    }

    let guildData = await guildConfig.findOne({ guildID: guild.id })
    let prefix

    if (guildData.prefix == "'") prefix = " ' (padrão)"
    else prefix = guildData.prefix

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: '🆔 ID', value: guild.id, inline: true },
        { name: '👑 Dono(a)', value: guild.owner.user.tag, inline: true },
        { name: '🌐 Região', value: guild.region, inline: true },
        { name: '💬 idioma', value: guild.preferredLocale, inline: true },
        { name: '👥 membros', value: guild.memberCount, inline: true },
        { name: '💼 cargos', value: guild.roles.cache.size, inline: true },
        { name: '📅 criado em', value: guild.createdAt.toLocaleDateString('pt-BR'), inline: true },
        { name: '🌙 prefixo da Luna', value: prefix }
      )

    let clientMember = guild.members.cache.get(client.user.id);

    if (clientMember) embed.addField('fui adcionada ao server em', clientMember.joinedAt.toLocaleDateString('pt-BR'))


    message.reply({ embeds: [embed] })

  }
}