const Discord = require('discord.js');

module.exports = {
  name: 'hug',
  aliases: ['abraçar', 'abraço', 'abracar', 'abraco'],
  description: "dá um abraço na pessoa mencionada",

  async execute(client, message, args) {
    var emojis = [
      '<:hug0:870012069779472415>',
      '<a:hug1:838853921106952202>',
      '<a:hug2:870011641306181633>'
    ];

    var gifs = [
      'https://64.media.tumblr.com/15df7207a5649059bead3d6a56c7a0a7/tumblr_nn2sc3XbHg1tyujpzo1_540.gif | Rebecca Sugar / Cartoon Network', //Rubi e Safira
      'https://i.imgur.com/7VsEllT.gif | _ _', // não sei. neko kawai
      'https://i.imgur.com/to301zX.gif | _ _', // não sei. fofo
      'https://i.giphy.com/media/16bJmyPvRbCDu/source.gif | Disney', // Jude e Nick
      'https://64.media.tumblr.com/tumblr_m0sudr4KLk1rrdywqo1_500.gif | Universal Studio / Illumination', // Minions
      'https://media1.tenor.com/images/a71b123666e08bb6ad336cd1625c0cdb/tenor.gif | Walt Disney', // Tigrão e Pooh
      'https://media1.tenor.com/images/8a4db61a1017d08731713cb112288926/tenor.gif | The Pokémon Company', // Pikachu e Piplup
      'https://media1.tenor.com/images/11b756289eec236b3cd8522986bc23dd/tenor.gif | Disney / Pixar', // Sully e Boo
      'https://media1.tenor.com/images/d7529f6003b20f3b21f1c992dffb8617/tenor.gif | Disney / Marvel', // Baymax e Hiro
      'https://media1.tenor.com/images/95b41ae72f201a5389a78ccfdf2e6657/tenor.gif | Disney',  // Elsa e Anna
      'https://media1.tenor.com/images/3881659d9537b73c8ee950ca3b074e13/tenor.gif | Studio Ghibli' //Ponyo e Saske
    ];

    var emojiRand = emojis[Math.floor(Math.random() * emojis.length)];
    var gifRand = gifs[Math.floor(Math.random() * gifs.length)];
    let gifAndCopyright = gifRand.split('|')
    let mentioned = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!mentioned) return message.reply({ content: 'você precisa mencionar alguém para abraçar' });

    message.react(emojiRand);

    const embed = new Discord.MessageEmbed()
      .setColor('#5BCEFA')
      .setDescription(` ${emojiRand} ${message.author} abraçou ${mentioned}`)
      .setImage(gifAndCopyright[0])
      .setFooter('©' + gifAndCopyright[1]);

    if (mentioned.id == client.user.id) embed.addFields({ name: '\u200b', value: 'obrigada pelo abraço 🥰' })

    message.reply({ embeds: [embed] });
  }
}