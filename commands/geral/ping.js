const Discord = require("discord.js");

module.exports = {
  name: 'ping',
  aliases: ['teste', 'speed'],
  description: "testa a Latência do bot",
  dmAllow: true,

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Client} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {
    const msg = await message.reply({
      embeds: [{
        color: 39423,
        title: "Ping"
      }]
    });

    msg.edit({
      embeds: [{
        title: '🏓 | Pong!',
        color: 39423,
        fields: [
          {
            name: 'Latência do Server:', value: `${msg.createdTimestamp -
              message.createdTimestamp}ms`
          },
          { name: 'Latência da API:', value: `${Math.round(client.ws.ping)}ms` }]
      }]
    });

  }
}