const Discord = require("discord.js");


module.exports = {
  name: 'dado',
  aliases: ['dice', 'd'],
  description: "rola um dado com o número de lados especificado",

  /**
   * @param {Discord.Client} client 
   * @param {Discord.Message} message 
   * @param {String[]} args 
   */

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('BLURPLE')
      .setTitle('🎲 DADOS 🎲')

    let totalResult = 0;

    if (!args[0]) {
      let d1 = Math.random() * 6;
      let result = Math.ceil(d1);
      embed.setDescription(`resultado: ${result}`);
    }
    else if (args[0] && !args[1]) {
      let d1 = Math.random() * parseInt(args[0], 10);
      let result = Math.ceil(d1);
      embed.setDescription(`resultado: ${result}`);
    }
    else if (args.length > 25) {
      return message.reply({ content: `A quantidade máxima de dados para rolar é de 25 dados simultâneos\nO Tamanho máximo possível de todos os dados é 1×10³² ou 1e32 ou 100.000.000.000.000.000.000.000.000.000.000` });
    }
    else {

      let i = 1;
      for (let arg of args) {

        let dado = parseInt(arg, 10);
        if (dado == NaN || arg.length > 31) return message.reply({ content: `O valor "${arg}" do dado N° ${a} é inválido` });

        let result = Math.ceil(Math.random() * dado);

        totalResult += result;

        if (totalResult > 1e32)
          return message.reply({ content: `A quantidade máxima de dados para rolar é de 25 dados simultâneos\nO Tamanho máximo possível de todos os dados é 1×10³² ou 1e32 ou 100.000.000.000.000.000.000.000.000.000.000` });

        embed.addField(`Dado n°${i}`, result.toString(), false);

        i++
      }

      embed.setDescription(`TOTAL: ${totalResult}`)

    }
    
    message.reply({ embeds: [embed] })

  }
}