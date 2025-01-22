const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'sonic',
  aliases: ['sonicsays', 'sonicsay'],
  description: "gera um meme 'Sonic Says:' com a frase informada ",
  dmAllow: true,

  async execute(client, message, args) {

    if (!args[0]) return message.reply({
      embeds: [{
        color: '#0000ff', title: 'Sonic Says...', description: 'escreva a frase para o Sonic falar junto com o comando\nMáximo de 500 caracteres'
      }]
    });

    var txt = args.join(' ');

    const template = await Canvas.loadImage('https://i.imgflip.com/4uc0qt.png');

    const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = `25px sans-serif`;

    printAtWordWrap(ctx, txt, 40, 100, 25, 350);


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


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `sonicsays.png`);
    message.reply({ files: [attachment] });

  }
}