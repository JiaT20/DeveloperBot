const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Canvacord } = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wasted')
        .setDescription('adiciona o efeito "wasted" de GTA em uma imagem')
        .addStringOption(input => input
            .setName('link')
            .setDescription('link de uma imagem para adicionar o efeito')
            .setRequired(false)
        )
        .addUserOption(input => input
            .setName('usuário')
            .setDescription('um usuário para usar o avatar')
            .setRequired(false)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const link = interaction.options.getString('link', false);
        const user = interaction.options.getUser('usuário', false);

        if (!link && !user) return interaction.editReply({ content: 'Você precisa informar um link de uma imagem, ou um usuário para pegar o avatar' });

        const image = user ? user.displayAvatarURL({ dynamic: false, format: 'png' }) : link

        let buffer = await Canvacord.wasted(image)

        const attachment = new Discord.MessageAttachment(buffer, 'wasted.png');
        interaction.editReply({ files: [attachment] });

    }
}