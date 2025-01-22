const Discord = require("discord.js");

module.exports = {
  name: 'ask',
  aliases: ['perguntar', 'pergunta', 'gênio', 'genio'],
  description: "faça uma pergunta aleatória, e eu lhe responderei com minha imensa sabedoria de bot",
  dmAllow: true,

  async execute(client, message, args) {

    if (!args[0]) return message.reply({ content: 'escreva sua pergunta após o comando, e eu responderei com minha imensa sabedoria de bot' });

    const rand = Math.floor(Math.random() * 20);

    let embed = new Discord.MessageEmbed()

    if (rand == 0) {
      embed.setColor('#800000')
        .setTitle('NÃO MESMO!')
        .setDescription('de forma alguma');
    }
    else if (rand > 0 && rand < 10) {
      embed.setColor('#ff0000')
        .setTitle('NÃO')
        .setDescription('negativo');
    }
    else if (rand == 10) {
      embed.setColor('#ffff00')
        .setTitle('TALVEZ...')
        .setDescription('essa me deixou em dúvida 🤔');
    }
    else if (rand > 10 && rand < 19) {
      embed.setColor('#00ff00')
        .setTitle('SIM')
        .setDescription('isso mesmo');
    }
    else if (rand == 19) {
      embed.setColor('#00ff00')
        .setTitle('COM CERTEZA!')
        .setDescription('pode apostar que sim');
    }

    message.reply({ embeds: [embed] });

  }
}