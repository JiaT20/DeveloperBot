const Discord = require("discord.js");

module.exports = {
  name: 'clear',
  aliases: ['clean', 'apagar', 'limpar', 'delete', 'deletar'],
  description: "apaga uma quantidade de mensagens selecionada",
  userPermissions: 'MANAGE_MESSAGES',

  async execute(client, message, args) {

    const deleteCount = parseInt(args[0], 10);

    if (!deleteCount || deleteCount < 1 || deleteCount > 100)
      return message.reply("forneça um número de até **100 mensagens** a serem excluídas");

    const fetched = await message.channel.messages.fetch({
      limit: deleteCount + 1
    });
    message.channel.bulkDelete(fetched)
    .catch(error =>
        message.channel.send(`❌Não foi possível deletar mensagens devido a: ${error}`)
      );

    const msg = message.channel.send(`🗑️ | **${args[0]} mensagens limpas nesse chat!\n  por: ${message.author}**`)
    .then(msg => msg.delete({ timeout: 10000 }))
      
  }
}