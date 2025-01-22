const Discord = require("discord.js")

module.exports = {
  name: 'moeda',
  aliases: ['coin', 'coinflip', 'caracoroa', 'caraoucoroa', 'cara', 'coroa'],
  description: "joga cara ou coroa (sem apostar LunaBits)",

  async execute(client, message, args) {
    var array1 = ["cara", "coroa"];
    var rand = Math.floor(Math.random() * array1.length);
    var result = array1[rand]
    var player = args[0].toLowerCase()

    if (!args[0] || (args[0].toLowerCase() !== "cara" && args[0].toLowerCase() !== "coroa")) {
      message.reply("insira **cara** ou **coroa** na frente do comando.");
    }
    else if (player == result) {
      var frase = "você ganhou, parabéns!";
      var colorembed = '#00ff00';
    }
    else if (player != result) {
      var frase = "você perdeu dessa vez.";
      var colorembed = '#ff0000';
    }

    const embed = new Discord.MessageEmbed()
      .setColor(colorembed)
      .setTitle('<:coin_cara:838556010805329940> cara ou coroa <:coin_coroa:838555968698056766>')
      .addFields(
        {name: `deu **${result}**`, value: frase }
      );

      message.channel.send(embed);
  }
}