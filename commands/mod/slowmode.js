const Discord = require("discord.js");

module.exports = {
  name: 'slowmode',
  aliases: ['modolento', 'slow', 'ratelimit'],
  description: 'define um intervalo de tempo que os membros precisam esperar para enviar novas mensagens',
  userPermissions: 'MANAGE_CHANNELS',
  botPermissions: ['MANAGE_CHANNELS'],

  async execute(client, message, args) {

    let embed = new Discord.MessageEmbed()
      .setColor('para definir o modo lento nesse canal')
      .setTitle('use a.slowmode <segundos> <motivo>')
      .setDescription(`exemplo: l.slowmode 5 muitas mensagens
        use 0 para desativar o modo lento`)
      .setFooter('(motivo é opcional)');

    if(!args[0]) return message.channel.send(embed)

    const time = args[0];

    const mensagem = args.join(' ').split(time);
    const reason = mensagem[1];

    console.log(`Mensagem inteira: ${mensagem}`);
    console.log(`parte 1: ${mensagem[0]}`);
    console.log(`parte 2: ${mensagem[1]}`);

    if (reason) {
      message.channel.setRateLimitPerUser(time)
    } else {
      message.channel.setRateLimitPerUser(time, `${reason}`);
    }

    message.channel.send({embed: {description: `modo lento do canal ativado \ntempo: **${time}s**`}})

  }
}