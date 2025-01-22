const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('manda um beijo para a pessoa mencionada'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        const mentioned = interaction.options.getUser('usuário', true);

        let button = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('aceitar')
                    .setLabel('aceitar')
                    .setStyle('PRIMARY')
                    .setEmoji('💕')
            );

        let reply = await interaction.reply({
            content: ``,
            components: [button],
            fetchReply: true,
            ephemeral: false
        });

        let collector = reply.createMessageComponentCollector({
            filter: int => int.user.id == mentioned.id && int.isButton(),
            max: 1
        });

        collector.on('collect', async buttonInteraction => {

            if (!buttonInteraction.isButton()) return;

            const gifs = [
                'https://imgur.com/w1TU5mR.gif | .', // não sei
                'https://64.media.tumblr.com/708b2dc3e999b53b39a9e37100ce0454/dac7d7ae41a7f72e-ed/s640x960/922f2c56f2c29ad9c0a51ced4e5b0f446162eb65.gif | Noelle Stevenson / DreamWorks & Netflix', // Netosa e Spinerela
                'https://64.media.tumblr.com/e6fcfe7456a834e50867de1719206591/faad2d5604ddc042-23/s400x600/628a604e591d76aaf19db8819a48a0c1eb99875a.gif | Noelle Stevenson / DreamWorks & Netflix', // Adora e Felina
                'https://static.wikia.nocookie.net/dd6e84a8-4a4a-4aa5-8c79-0a053ac43bca | Noelle Stevenson / DreamWorks & Netflix', //Netosa e Spinerela
                'https://steamuserimages-a.akamaihd.net/ugc/869616926014651303/CCCA817D55A8A75783497DBDDE851ABFCF6C8A61/ | Dontnod / Square Enix', //Max e Chloe
                'https://pa1.narvii.com/6932/6c64c2a01b84f4740b3b495835f0df7583d82173r1-540-303_hq.gif | Rebecca Sugar / Cartoon Network' // Rubi e Safira
            ];

            const gif = gifs[Math.floor(Math.random() * gifs.length)].split('|');

            let replyEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setDescription(`${emoji} • ${interaction.user} e ${mentioned} se beijaram ^-^`)
                .setImage(gif[0])
                .setFooter('©' + gif[1])

            interaction.editReply({
                embeds: [replyEmbed],
                components: []
            });

        });

    }// Main interaction event end
}