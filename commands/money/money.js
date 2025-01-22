const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'money',
  aliases: ['saldo', 'dinheiro', 'valor', 'balance', 'bal'],
  description: "mostra informações sobre a quantia em LunaBits de um usuário",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (args[0] && !user)
      return message.channel.send({embed: {color: '#b3c20c', title: 'usuário informado não encontrado'}})

    if(!user) user = message.author;

    if (user.bot)
      return message.channel.send({
        embed: {
          title: `${user.tag} <:bot_tag:861720010283417611>` , description: 'Bip Bop | Bots não possuem perfil na Luna ou LunaBits' }
      });

    let profileData = await profileModel.findOne({userID: user.id});

    if (!profileData) return message.channel.send({embed: {color: '#009999', title: 'Esse usuário ainda não possui um perfil na Luna', description: 'um perfil será criado automaticamente após o usuário enviar uma mensagem pela primeira vez'}});

    let lastEdit = new Date(profileData.lastEditMoney);
    let dateOptions = {
      year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit'
    };

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle(`Saldo em LunaBits de ${user.username}`);

      if(profileData.userID == message.author.id) {

        embed.addFields(
          {name: 'carteira', value: profileData.coins},
          {name: 'banco', value: profileData.bank},
          {name: 'última alteração de saldo', value: lastEdit.toLocaleDateString('pt-BR', dateOptions) }
        )
      } else {
        embed.addFields(
          {name: 'saldo total', value: profileData.coins + profileData.bank}
        )
      }
        

    message.channel.send(embed);

  }
}