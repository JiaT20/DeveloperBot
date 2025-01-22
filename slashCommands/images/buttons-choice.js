const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const Canvas = require("canvas");
const textFormatter = require('../../extra/canvasTextFormatter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buttons-choice')
        .setDescription('gera um meme de escolher os botões')
        .addStringOption(input => input
            .setName('botão-1')
            .setDescription('a frase do botão 1')
            .setRequired(true)
        ).addStringOption(input => input
            .setName('botão-2')
            .setDescription('a frase do botão 2')
            .setRequired(true)
        )
        .addStringOption(input => input
            .setName('pessoa-text')
            .setDescription('a frase na pessoa escolhendo os botões')
            .setRequired(false)
        )
        .addUserOption(input => input
            .setName('pessoa-menção')
            .setDescription('o usuário para colocar o avatar na imagem')
            .setRequired(false)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {
        await interaction.deferReply({ ephemeral: false });

        const button1 = interaction.options.getString('botão-1', true);
        const button2 = interaction.options.getString('botão-2', true);

        const pessoaText = interaction.options.getString('pessoa', false);
        const pessoaMention = interaction.options.getUser('pessoa-menção', false);

        const template = await Canvas.loadImage('https://imgflip.com/s/meme/Two-Buttons.jpg');

        const canvas = Canvas.createCanvas(template.width / 2, template.height / 2);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.font = `bold 18px sans-serif`;
        ctx.textAlign = "center";

        //  botão 1  //
        ctx.rotate(6.02);
        textFormatter(ctx, button1, (canvas.width / 4) - 30, 80, 20, 100);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //  botão 2 //
        ctx.rotate(6.02);
        textFormatter(ctx, button2, (canvas.width / 2), 95, 20, 100);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        //  pessoa  //
        if (pessoaMention) {
            const avatar = await Canvas.loadImage(pessoaMention.displayAvatarURL({ dynamic: false, format: 'png' }));
            ctx.drawImage(avatar, canvas.width / 2, canvas.width / 2);
        }
        else if (pessoaText) textFormatter(ctx, pessoaText, canvas.width / 2, canvas.height - 70, 20, (canvas.height / 2) - 30);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), `buttons.png`);
        interaction.editReply({ files: [attachment] });

    }
}