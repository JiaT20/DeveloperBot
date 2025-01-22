const Discord = require('discord.js');
module.exports = {
  name: 'reactionrole',
  description: "Sets up a reaction role message!",
  userPermissions: "ADMINISTRATOR",
  
async execute (client, message, args) {

    const channel = '835168243299778600';
    const role1 = message.guild.roles.cache.find(role => role.id === '824436817565712456');
    const role2 = message.guild.roles.cache.find(role => role.id === '824437091760603137');
    const role3 = message.guild.roles.cache.find(role => role.id === '824437131198857267');

    const emoji1 = '💜';
    const emoji2 = '💙';
    const emoji3 = '💛';

    let embed = new Discord.MessageEmbed()
      .setColor('#e42643')
      .setTitle('Registro pronomes')
      .setDescription('reaja aos emojis abaixo de acordo com seus pronomes\n\n'
        + `${emoji1} - ela/dela\n`
        + `${emoji2} - ela/dela\n`
        + `${emoji3} - elu/delu`);

    let messageEmbed = await message.channel.send(embed);
    messageEmbed.react(emoji1);
    messageEmbed.react(emoji2);
    messageEmbed.react(emoji3);

    client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;

      if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === emoji1) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(role1);
        }
        if (reaction.emoji.name === emoji2) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(role2);
        }
        if (reaction.emoji.name === emoji3) {
          await reaction.message.guild.members.cache.get(user.id).roles.add(role3);
        }
      } else {
        return;
      }

    });

    client.on('messageReactionRemove', async (reaction, user) => {

      if (reaction.message.partial) await reaction.message.fetch();
      if (reaction.partial) await reaction.fetch();
      if (user.bot) return;
      if (!reaction.message.guild) return;


      if (reaction.message.channel.id == channel) {
        if (reaction.emoji.name === emoji1) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(role1);
        }
        if (reaction.emoji.name === emoji2) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(role2);
        }
        if (reaction.emoji.name === emoji3) {
          await reaction.message.guild.members.cache.get(user.id).roles.remove(role3);
        }
      } else {
        return;
      }
    });
  }
}