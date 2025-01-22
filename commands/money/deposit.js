const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
  name: 'deposit',
  aliases: ['dep', 'depositar', 'depósito', 'deposito'],
  description: "deposita o valor informado, transferindo da sua carteira para o banco",

  async execute(client, message, args) {

    let profileData = await profileModel.findOne({userID: message.author.id});

    let allNames = ['all', 'tudo', 'total'];

    let valor = 0;

    if(allNames.includes(args[0]) ) {
      valor = profileData.coins;
    } else if(!allNames.includes(args[0])) {
      valor = parseInt(args[0]);
    }

    if(!valor || valor < 1) return message.channel.send({embed: {
      color: '#f0f000',
      title: 'informe um valor para depositar no banco',
      description: 'o valor precisa ser um número inteiro (sem virgula) e positivo'
    }});

    let failEmbed = new Discord.MessageEmbed()
      .setColor('#b3c20c')
      .setTitle('Você não possui esse valor na carteira para depositar')
      .setDescription(`Você atualmente tem ${profileData.coins} na carteira, e ${profileData.bank} no banco`);

    if( profileData.coins < valor ) return message.channel.send(failEmbed);

    let profileUpdate = await profileModel.findOneAndUpdate(
      {
        userID: message.author.id,
      }, {
          $inc:{
            bank: valor,
            coins: -valor
          },
          lastEditMoney: Date.now()
        }
    );
    profileUpdate.save();

    let embed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('Valor depositado com sucesso')
      .addFields(
        {name: 'valor', value: valor,},
        {name: 'valor atual na carteira', value: (profileData.coins - valor)},
        {name: 'saldo atual no banco', value: (profileData.bank + valor)}
      );

    message.channel.send(embed);

  }
}