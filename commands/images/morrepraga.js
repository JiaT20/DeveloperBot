const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'morrepraga',
  aliases: ['praga',],
  description: "gera uma imagem 'morre praga' com o usuário informado ",

  async execute(client, message, args) {
  
    if(!args[0]) return;
    const template = await Canvas.loadImage('https://feijoadasimulator.top/br/templates/1814.png');

    const canvas = Canvas.createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    if(args[0].startsWith('https://i.imgur.com/') && (args[0].endsWith('.png') || args[0].endsWith('.jpg')) ) {

      let image = await Canvas.loadImage(args[0]);

      let widthProportion = image.width * (canvas.width / image.width);
      let heightProportion = image.height * (canvas.height / image.height);

      console.log('proporção entre largura da imagem e largura do canvas: ' + widthProportion);
      console.log('valor teste: ' + (image.width/canvas.width) * (image.width*canvas.width))

      ctx.drawImage(image, canvas.width/4, canvas.height/2, widthProportion / 3, heightProportion /3 );

    } else {

      let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
      const avatar = await Canvas.loadImage(user.displayAvatarURL({dynamic: false, format: 'jpg'}));
      ctx.drawImage(avatar, canvas.width/4 - 50, 150, 200, 200);

    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `morrepraga.png`);
    message.channel.send(attachment);

  }
}