const Discord = require('discord.js');

module.exports = {

  async AvonHello(message, prefix) {

    let AvonHelloEmbed = new Discord.MessageEmbed()
      .setColor('#00a1a1')
      .setTitle('🌙 Hello, Im Avon')
      .setDescription(
        `an experimental bot with mini games, music player and more.
        My default prefix is ​​' (single quote). My prefix on this server is ${prefix}
        for more information use ${prefix}help`);

    message.channel.send(AvonHelloEmbed);
  },

  blockedCommands: new Discord.MessageEmbed()
    .setColor('#ff0000')
    .setDescription('❌ Hey, you cant use Avon commands in this chat'),

  inVoiceChannel: new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setDescription('🔊 you need to be on a voice channel to use this command'),

  diferentVoiceChannel: new Discord.MessageEmbed()
    .setColor('#ffff00')
    .setDescription('🔊 you need to be on the same voice channel as me to use this command'),

  nsfw: new Discord.MessageEmbed()
  .setColor('#ff0000')
  .setTitle('❎ this command can only be used on a channel marked as NSFW')
  .setImage('https://i.kym-cdn.com/entries/icons/original/000/033/758/Screen_Shot_2020-04-28_at_12.21.48_PM.png')
  .setFooter('According to Discord guidelines, messages that contain explicit content, or NSFW (Not Safe For Work), can only be sent on a channel marked as adult content'),

  async userPermission(message, cmd) {
    const userPermissionEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('You are weak, you lack permission to use this command')
      .setThumbnail('https://i.imgur.com/HMbty0g.jpeg')
      .setFooter(`To use this command, permission is required"${cmd.userPermissions}"`);
    message.channel.send(`${message.author}`, userPermissionEmbed);
  },

  async botPermission(client, message, cmd){
    const botPermissionEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('I do not have permission to perform this function.')

    if(message.member.permissions.has('MANAGE_ROLES')){
      botPermission.setDescription(
        'If you want to use this command, edit my permissions in the server role settings')
        .setFooter(`you need to add "${cmd.botPermissions}" to the list of permissions for my role`);
    } else {
      botPermission.setDescription('Please contact the server administrators for more information') }
    message.channel.send(`${message.author}`, botPermissionEmbed);
  },


}