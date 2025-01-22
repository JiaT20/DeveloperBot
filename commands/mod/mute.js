const Discord = require("discord.js");

module.exports = {
  name: 'mute',
  aliases: ['mutar', 'silenciar', 'silent'],
  description: 'silencia um membro de enviar mensagens nos canais de texto, e de falar nos canais de voz',
  userPermissions: ['MUTE_MEMBERS'],

  async execute(client, message, args) {

    let muteRole = message.guild.roles.cache.get('829903862700834846');
    let muteChannel = message.guild.channels.cache.get('835168243299778600');

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if(!args[0]) return message.channel.send({embed: {color: '#ffff00' , description: 'mencione alguém para mutar'}});
    
    let member = message.guild.member(user);

    if (!member) return message.channel.send({embed: {color: '#ffff00' , description: 'membro não encontrado'}});

    const totalArgs = args.join(' ');
    var reason = totalArgs.split(user.id)[1];

    if (!args[1]) {
      reason = 'não informado';
    }

    member.roles.add(muteRole);
    
    let embed = new Discord.MessageEmbed()
      .setColor('#ffff50')
      .setTitle('Membro mutado')
      .addFields(
        {name: 'membro', value: `${user}`},
        {name: 'motivo', value: `${reason}`},
        {name: 'mutado por', value: `${message.author}`}
      );

    muteChannel.send(embed);

  }
}