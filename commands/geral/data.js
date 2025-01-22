const Discord = require('discord.js');

module.exports = {
  name: 'data',
  aliases: ['date'],
  description: "exibe a data atual",

  async execute(client, message, args) {

    const option = {
      year: 'numeric',
      month: 'long',
      weekday: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
      //timeZone:
      timeZoneName: 'short'
    }

    let today = new Date().toLocaleDateString( 'pt-br', option);
    /*console.log(today);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;*/

    message.channel.send(today);

  }
}
