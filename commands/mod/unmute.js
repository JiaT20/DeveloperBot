const Discord = require("discord.js");

module.exports = {
  name: 'unmute',
  aliases: ['desmutar', 'desmute'],
  description: 'retira o mute do membro permitindo enviar mensagens e de falar nos canais de voz novamente',
  userPermissions: ['MUTE_MEMBERS'],

  async execute(client, message, args) {

    let muteRole = message.guild.roles.cache.get('829903862700834846');
    let muteChannel = message.guild.channels.cache.get('835168243299778600');
    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if(!args[0]) return message.channel.send({embed: {color: '#ffff00' , description: 'mencione alguém para desmutar'}});
    
    let member = message.guild.member(user);

    if (!member) return message.channel.send({embed: {color: '#ffff00' , description: 'membro não encontrado'}});

    const totalArgs = args.join(' ');
    var reason = totalArgs.split(user.id)[1];

    if (!args[1]) {
      reason = 'não informado';
    }

    member.roles.remove(muteRole);

    let embed = new Discord.MessageEmbed()
      .setColor('#ffff50')
      .setTitle('Membro desmutado')
      .addFields(
        {name: 'membro', value: `${user}`},
        {name: 'motivo', value: `${reason}`},
        {name: 'desmutado por', value: `${message.author}`}
      );

    muteChannel.send(embed);

  }
}