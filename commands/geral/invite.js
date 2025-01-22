const Discord = require("discord.js");

module.exports = {
  name: 'invite',
  aliases: ['convite', 'link', 'support'],
  description: "link para adicionar o bot ao seu servidor",
  dmAllow: true,

  async execute(client, message, args) {

    const oauthLink = 'https://discord.com/api/oauth2/authorize?client_id=832275775645417553&permissions=8&scope=bot';
    const serverInvite = 'https://discord.gg/VFJAqE7Uz6';

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('🌙 Adicione a LunaBot ao seu servidor 🌙')
      .setDescription(`Clique nos botões abaixo para me adicionar em seu servidor, ou para entrar no meu servidor de suporte ou demais interações: LunaLab!`);

    let buttons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setStyle('LINK')
          .setLabel('Adicionar a Luna em seu servidor')
          .setURL(oauthLink),
        new Discord.MessageButton()
          .setStyle('LINK')
          .setLabel('Servidor de suporte e interações')
          .setURL(serverInvite)
      )

    message.reply({ embeds: [embed], components: [buttons] });

  }
}