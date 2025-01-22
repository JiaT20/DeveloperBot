const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Canvas = require("canvas");
const textFormatter = require('../../extra/canvasTextFormatter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panik-kalm')
        .setDescription('gera um meme de escolher os botões')
        .addStringOption(input => input
            .setName('fase-1')
            .setDescription('a frase do 1° quadro - "panik"')
            .setRequired(true)
        ).addStringOption(input => input
            .setName('frase-2')
            .setDescription('a segunda frase - "kalm"')
            .setRequired(true)
        )
        .addStringOption(input => input
            .setName('frase-3')
            .setDescription('a frase do 3° quadro - "PANIK"')
            .setRequired(true)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const frase1 = interaction.options.getString('frase-1', true);
        const frase2 = interaction.options.getString('frase-2', true);
        const frase3 = interaction.options.getString('frase-3', true);

        const template = await Canvas.loadImage('https://imgflip.com/s/meme/Panik-Kalm-Panik.png');

        const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
    
        ctx.fillStyle = '#000000';
        ctx.font = `18px sans-serif`;

        textFormatter(ctx, txt[0], 20, 40, 20, (canvas.height / 2));
        textFormatter(ctx, txt[1], 20, (canvas.height / 3) + 20, 20, (canvas.height / 2));
        textFormatter(ctx, txt[2], 20, (canvas.height / 3) * 2 + 20, 20, (canvas.height / 2));

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'panik.png');
        interaction.editReply({ files: [attachment] });

    }
}