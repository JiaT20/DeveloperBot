const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Testa o delay do bot'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.reply({ content: '🏓 Pong', ephemeral: true });

        let dateNow = new Date()

        interaction.editReply({ content: `🏓 Pong | Delay do Discord: ${dateNow.getTime() - interaction.createdAt.getTime()} ms\nDelay do bot: ${client.ws.ping} ms` })

    }
}