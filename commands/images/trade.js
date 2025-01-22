const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'trade',
  aliases: ['oferta', 'trading', 'trader'],
  description: "gera um meme \"trade offer\" com as frases informadas",
  dmAllow: true,

  async execute(client, message, args) {

    let helpEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('trade offer')
      .setDescription('escreva as frases para o formar o meme junto com o comando\nsepare as frases usando | (barra vertical)')
      .addFields(
        { name: 'primeira frase', value: 'frase da esquerda, "i receive"' },
        { name: 'segunda frase', value: 'frase da direita, "you receive"' },
        { name: 'terceira frase (opcional)', value: 'o nome do trader' }
      )

    if (!args[1]) return message.reply({ embeds: [helpEmbed] });

    var txt = args.join(' ').split('|');

    const template = await Canvas.loadImage('https://i.imgflip.com/54hjww.jpg');

    const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.font = `bold 18px sans-serif`;
    ctx.textAlign = "center";

    //           context | text |      X       |           Y          | espaçamento |   largura

    //  frase esquerda  //
    printAtWordWrap(ctx, txt[0], canvas.width / 4, 130, 20, (canvas.height / 2) - 60);

    //  frase direita //
    printAtWordWrap(ctx, txt[1], (canvas.width / 4) * 3, 130, 20, (canvas.height / 2) - 60);

    //  Trader Name  //
    if (txt[2]) {
      printAtWordWrap(ctx, txt[2], canvas.width / 2, canvas.height - 50, 20, (canvas.height / 2) - 70);
    }

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


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `trade.png`);
    message.reply({ files: [attachment] });

  }
}