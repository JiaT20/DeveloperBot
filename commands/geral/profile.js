const Discord = require("discord.js");
const Canvas = require('canvas');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'profile',
  aliases: ['perfil', 'xp'],
  description: "exibe o seu perfil na LunaBot, com seu nível de XP e LunaBits",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (args[0] && !user)
      return message.channel.send({ embed: { color: '#b3c20c', title: 'usuário informado não encontrado' } })

    if (!user) user = message.author

    if (user.bot)
      return message.channel.send(
        { embed: { title: `${user.tag} <:bot_tag:861720010283417611>`, description: 'Bip Bop | Bots não possuem rank de XP ou um perfil na Luna' } }
      );

    var member = message.guild.members.cache.get(user.id);

    profileData = await profileModel.findOne({ userID: user.id });

    if (!profileData) return message.channel.send({ embed: { color: '#009999', title: 'Esse usuário ainda não possui um perfil na Luna', description: 'um perfil será criado automaticamente após o usuário enviar uma mensagem pela primeira vez' } });

    const canvas = Canvas.createCanvas(500, 300);
    const ctx = canvas.getContext("2d");

    const background = await Canvas.loadImage('https://i.imgur.com/c7eGSoG.jpeg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (user.username.length < 13) var fontSize = 35;
    if (user.username.length > 12) var fontSize = 30;
    if (user.username.length > 18) var fontSize = 25;

    var alfabeto = 'AÁÀÂÃBCÇDEÉÈÊFGHIÍÌJKLMNOÓÒÕÔPQRSTUÚÙVWXYZaáàâãbcçdeéèêfghiíìjklmnoóòõôpqrstuúùvwxyz0123456789()[]{}#@*!?$%¨&§ª°.,;:^~<>/+-_\'\\';
    var username = user.username.split('');
    var usernameFormated = '';

    username.forEach(letter => {
      if (alfabeto.includes(letter)) usernameFormated += letter;
      else usernameFormated += ' ';
    })

    // user fundo //
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(130, 25, 400, 80);

    // UserName //
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillText(usernameFormated, 140, 60);

    // User discriminator //
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = `${fontSize - 5}px sans-serif`;
    ctx.fillText(`#${user.discriminator}`, 140, 100);

    // Chat XP fundo //
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(340, 115, 160, 80);

    // "Chat XP" //
    ctx.textAlign = "end";
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = '35px sans-serif';
    ctx.fillText('Chat XP', 490, 150);

    // Chat XP valor //
    ctx.textAlign = "end";
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '25px sans-serif';
    ctx.fillText(`${profileData.chatXP}`, 490, 190);

    // Banco fundo //
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(340, 205, 160, 80);

    // "Banco" //
    ctx.textAlign = "end";
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = '35px sans-serif';
    ctx.fillText('Banco', 490, 240);

    // Banco valor //
    ctx.textAlign = "end";
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '25px sans-serif';
    ctx.fillText(`${profileData.bank}`, 490, 270);

    // voice XP fundo //
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(130, 115, 160, 80);

    // "voice XP" //
    ctx.textAlign = "left";
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.font = '35px sans-serif';
    ctx.fillText('voice XP', 140, 150);

    // voice XP valor //
    ctx.textAlign = "left";
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '25px sans-serif';
    ctx.fillText(`${profileData.voiceXP}`, 140, 190);

    ctx.beginPath();
    ctx.arc(70, 70, 50, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(user.displayAvatarURL({ dynamic: false, format: 'jpg' }));
    ctx.drawImage(avatar, 20, 20, 100, 100);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `LunaProfile.png`);
    message.channel.send({ files: [attachment] });

  }
}