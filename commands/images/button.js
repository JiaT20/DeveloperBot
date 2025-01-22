const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: 'button',
  aliases: ['buttons', 'botão', 'botões', 'botao', 'botoes'],
  description: "gera um meme de escolher o botão com as frases informadas",
  dmAllow: true,

  async execute(client, message, args) {

    var txt = args.join(' ').split('|');

    if (!args[1] || !args.includes('|')) return message.reply({
      embeds: [{
        color: '#00ffff',
        title: 'meme - escolha botões',
        description: 'escreva as frases para o formar o meme junto com o comando\nsepare as frases usando | (barra vertical)',
        thumbnail: { url: 'https://imgflip.com/s/meme/Two-Buttons.jpg' },
        fields: [
          { name: 'primeira frase', value: 'primeiro botão' },
          { name: 'segunda frase', value: 'segundo botão' },
          { name: 'terceira frase', value: 'a pessoa escolhendo os botões' },
          { name: '\u200b', value: 'exemplo:' }
        ],
        footer: { text: 'buttons criar comandos de memes | criar comandos importantes | criadora da Luna' }
      }]
    });

    const template = await Canvas.loadImage('https://imgflip.com/s/meme/Two-Buttons.jpg');

    const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.font = `bold 18px sans-serif`;
    ctx.textAlign = "center";

    //           context | text |      X       |           Y          | espaçamento  |  largura

    //  botão 1  //
    ctx.rotate(6.02);
    printAtWordWrap(ctx, txt[0], (canvas.width / 4) - 30, 80, 20, 100);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //  botão 2 //
    ctx.rotate(6.02);
    printAtWordWrap(ctx, txt[1], (canvas.width / 2), 95, 20, 100);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //  pessoa  //
    if (txt[2]) {
      printAtWordWrap(ctx, txt[2], canvas.width / 2, canvas.height - 70, 20, (canvas.height / 2) - 30);
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


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `button.png`);
    message.reply({ files: [attachment] });

  }
}