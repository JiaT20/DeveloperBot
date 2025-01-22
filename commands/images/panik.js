const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'panik',
  aliases: ['kalm', 'panic', 'calm'],
  description: "gera um meme \"panik/kalm/PANIK\" com as frases informada ",
  dmAllow: true,

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#0000ff', title: 'Panik / Kalm / PANIK', description: 'escreva as frases para formar o meme junto com o comando\nsepare as frases usando |'
      }]
    });

    var txt = args.join(' ').split('|');

    const template = await Canvas.loadImage('https://imgflip.com/s/meme/Panik-Kalm-Panik.png');

    const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = `18px sans-serif`;

    //           context | text | X  |           Y          | espaçamento |   largura
    printAtWordWrap(ctx, txt[0], 20, 40, 20, (canvas.height / 2));
    printAtWordWrap(ctx, txt[1], 20, (canvas.height / 3) + 20, 20, (canvas.height / 2));
    printAtWordWrap(ctx, txt[2], 20, (canvas.height / 3) * 2 + 20, 20, (canvas.height / 2));


    function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {

      fitWidth = fitWidth || 0;

      if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
      }
      var words = text.split(' ');
      var currentLine = 0;
      var idx = 1;
      while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(' ');
        var w = context.measureText(str).width;
        if (w > fitWidth) {
          if (idx == 1) {
            idx = 2;
          }
          context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
          currentLine++;
          words = words.splice(idx - 1);
          idx = 1;
        }
        else { idx++; }
      }
      if (idx > 0) context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
    }


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `panik.png`);
    message.reply({ files: [attachment] });

  }
}