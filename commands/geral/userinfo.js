const Discord = require("discord.js");

module.exports = {
  name: 'userinfo',
  aliases: ['user'],
  description: "exibe informações sobre sua conta, ou do usuário mencionado",

  async execute(client, message, args) {

    let user = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!user && args[0]) return message.reply({ content: `Usuário "${args[0]}" não encontrado` });

    if (!user) user = message.author;

    let member = await message.guild.members.cache.get(user.id);

    let avatar = user.avatarURL({ dynamic: true, format: "png" });

    let dateOptions = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hourCycle: 'h23',
      hour: '2-digit',
      minute: '2-digit',
    };

    const userCreatedFormated =
      `${user.createdAt.getDate()}/${user.createdAt.getMonth()}/${user.createdAt.getFullYear()} - ${user.createdAt.getHours()}:${user.createdAt.getMinutes()}`;

    const dateNow = new Date();
    const userCreated = new Date(user.createdAt).toLocaleDateString('pt-BR', dateOptions);
    const userTime = new Date(dateNow - user.createdAt);

    var userTimeFormated = '';

    if (userTime.getFullYear() - 1970 != 0) { userTimeFormated += `a ${userTime.getFullYear() - 1970} ano(s) ` }
    if (userTime.getMonth() != 0) { userTimeFormated += `${userTime.getMonth()} mes(es) ` }
    if (userTime.getDate() - 1 != 0) { userTimeFormated += `${userTime.getDate() - 1} dia(as) ` }
    if (userTime.getHours() != 0) { userTimeFormated += `${userTime.getHours()} hora(s) ` }
    if (userTime.getMinutes() != 0) { userTimeFormated += `${userTime.getMinutes()} minuto(s)` }

    let embed = new Discord.MessageEmbed()
      .setColor('#008f81')
      .setTitle(`${user.tag}`)
      .setDescription(`${user}`)
      .setThumbnail(avatar)
      .setFooter('(Data e hora em GMT-3 | Horário de Brasilia)')
      .addFields(
        { name: '🆔 Discord ID', value: `${user.id}`, inline: true },
        {
          name: '🗓️ Conta criada em',
          value: `${userCreated}\n${userTimeFormated}`,
          inline: true
        }
      );

    if (member) {

      const memberTime = new Date(dateNow - member.joinedAt);

      const memberJoined = new Date(member.joinedAt).toLocaleDateString('pt-BR', dateOptions);

      var memberTimeFormated = '';

      if (memberTime.getFullYear() - 1970 != 0) { memberTimeFormated += `a ${memberTime.getFullYear() - 1970} ano(s) ` }
      if (memberTime.getMonth() != 0) { memberTimeFormated += `${memberTime.getMonth()} mes(es) ` }
      if (memberTime.getDate() - 1 != 0) { memberTimeFormated += `${memberTime.getDate() - 1} dia(as) ` }
      if (memberTime.getHours() != 0) { memberTimeFormated += `${memberTime.getHours()} hora(s) ` }
      if (memberTime.getMinutes() != 0) { memberTimeFormated += `${memberTime.getMinutes()} minuto(s)` }

      embed.addFields(
        {
          name: '✨ Entrou no servidor em',
          value: `${memberJoined} \n${memberTimeFormated}`
        })

      if (member.premiumSince) {

        let memberBoosted = new Date(member.premiumSince).toLocaleDateString('pt-BR', dateOptions)

        embed.addFields(
          { name: '<:boost:868983673641381908> Impulsionando o servidor desde', value: `${memberBoosted}` }
        )
      }

      if (member.nickname) {
        embed.addFields(
          {
            name: 'Apelido no servidor', value: member.nickname
          })
      }
    }

    message.reply({ embeds: [embed] });

  }
}
