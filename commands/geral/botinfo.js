const Discord = require("discord.js");
const system = require('systeminformation');

module.exports = {
  name: 'botinfo',
  aliases: ['bot', 'stats', 'botstats', 'botstatus', 'status'],
  description: "exibe informações sobre a LunaBot",

  /**
   * 
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    const readyAt = new Date(client.readyAt.getTime() - 10800000);

    const cpu = await system.cpu();
    const ram = await system.mem();

    const readyAtFormated =
      readyAt.getDate() + '/' + readyAt.getMonth() + '/' + readyAt.getDate() + ' - ' +
      readyAt.getHours() + ':' + readyAt.getMinutes()

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('🌙 LunaBot stats ⚙')
      .setDescription('Status da Luna')
      .addFields(
        { name: '⌛ Online desde', value: readyAtFormated, inline: true },
        { name: '🌐 Servidores', value: client.guilds.cache.size.toString(10), inline: true },
        { name: '👥 usuários', value: client.users.cache.size.toString(10), inline: true },
        { name: '🎶 Reproduzindo música em', value: client.voice.connections.size.toString(10) + ' servidor(es)', inline: true },
        { name: '\u200b', value: '\u200b' },
        { name: 'Sistema', value: '\u200b' },
        { name: 'Versão do NodeJS', value: '.', inline: true },
        { name: 'Versão do Discord.js', value: require('../../package.json').dependencies["discord.js"], inline: true },
        { name: 'CPUs', value: cpu.speed, inline: true },
        { name: 'RAM', value: Math.floor(ram.active / 1024 / 1024) + ' mb', inline: true },
        { name: 'ping', value: Math.round(client.ws.ping) + ' ms', inline: true }
      );

    message.reply({ embeds: [embed] });

  }
}