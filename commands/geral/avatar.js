const Discord = require("discord.js");

module.exports = {
  name: 'avatar',
  aliases: ['icon', 'foto'],
  description: "mostra o avatar de um usuário",

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0])

    if (args[0] && !user) return message.reply({ content: 'usuário informado não encontrado' });
    if (!user) user = message.author;

    let avatar = user.avatarURL({ dynamic: true, format: "png", size: 1024 });

    let embed = new Discord.MessageEmbed()
      .setColor(`#efefef`)
      .setTitle(`Avatar de ${user.username}`)
      .setImage(avatar);

    message.reply({ embeds: [embed] });

  }
}