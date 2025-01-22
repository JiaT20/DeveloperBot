const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Canvas = require("canvas");
const textFormatter = require('../../extra/canvasTextFormatter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sonic-says')
        .setDescription('gera um meme "Sonic Says:" com a frase informada ')
        .addStringOption(input => input
            .setName('frase')
            .setDescription('a frase para escrever no meme')
            .setRequired(true)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const frase = interaction.options.getString('frase', true);

        const template = await Canvas.loadImage('https://i.imgflip.com/4uc0qt.png');

        const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = `25px sans-serif`;

        textFormatter(ctx, frase, 40, 100, 25, 350);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `sonic-says.png`);
        interaction.editReply({ files: [attachment] });

    }
}