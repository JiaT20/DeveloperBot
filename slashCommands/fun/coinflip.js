const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('joga cara ou coroa')
        .addIntegerOption(option =>
            option.setName('valor')
                .setDescription('caso deseje apostar, informe o valor')
                .setRequired(false)
        ),


    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false })

        let aposta = false;

        let betValue = interaction.options.getInteger('valor', false);

        let profileData;

        if (betValue && betValue != NaN) {

            profileData = await profileModel.findOne({ userID: interaction.user.id });

            if (profileData.coins < betValue) return interaction.editReply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profileData.coins} loops`
                }]
            });

            aposta = true;

        }

        let startEmbed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Cara ou coroa')
            .setDescription('Para jogar, clique nos botões abaixo');

        let startButtons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('cara')
                    .setLabel('cara')
                    .setEmoji('👤')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('coroa')
                    .setLabel('coroa')
                    .setEmoji('👑')
                    .setStyle('PRIMARY'),
            );

        await interaction.editReply({
            embeds: [startEmbed],
            components: [startButtons]
        });

        let gameMessage = await interaction.fetchReply();

        const values = ['cara', 'coroa'];
        const emojis = ['🪨', '📃', '✂'];

        let rounds = 0;
        let vitorias = 0;
        let derrotas = 0;
        let lucro = 0;

        let cooldown = false;

        let vitoriaPercent = '';
        let derrotaPercent = '';

        let collector = gameMessage.createMessageComponentCollector({
            filter: int => int.user.id === interaction.user.id
        });

        collector.on('collect', async buttonInteraction => {
            if (!buttonInteraction.isButton()) return;

            if (!buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id || buttonInteraction.user.id != interaction.user.id)
                return;

            if (aposta === true && lucro * -1 > profileData.coins)
                return buttonInteraction.reply({ content: 'Você não possui mais saldo suficiente para continuar essa aposta', ephemeral: true });

            await buttonInteraction.deferReply({ ephemeral: false });

            if (aposta === true && cooldown === true) await new Promise(resolve => setTimeout(resolve, 2000));

            else if (aposta === true && cooldown === false) {
                cooldown = true;
                setTimeout(() => {
                    cooldown = false
                }, 4000);
            }

            rounds++

            const player = values.indexOf(buttonInteraction.customId);

            const playerValue = values[player];
            const playerEmoji = emojis[player];

            const bot = Math.round(Math.random());

            const botValue = values[bot];
            const botEmoji = emojis[bot];

            let resultEmbed = new Discord.MessageEmbed()
                .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

            let description = `Você escolheu ${playerValue} ${playerEmoji}\nO resultado foi ${botValue} ${botEmoji}\n\n`

            if (playerValue == botValue) {
                vitorias++
                lucro += betValue;
                resultEmbed.setColor('GREEN');
                description += `🎉 Parabéns ${interaction.user}, você venceu!`;

                if (aposta === true) {
                    description += `\nVocê ganhou ${betValue} loops`;

                    let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                        $inc: { coins: betValue }
                    });
                    profileUpdate.save();
                }

            } else {

                derrotas++
                lucro -= betValue;
                resultEmbed.setColor('RED');
                description += `😭 Sinto muito ${interaction.user}, você perdeu...`;

                if (aposta === true) {
                    description += `\nVocê perdeu ${betValue} loops`;

                    let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                        $inc: { coins: -betValue }
                    });
                    profileUpdate.save();
                }

            }

            vitoriaPercent = ((vitorias * 100) / rounds).toFixed(2);
            derrotaPercent = ((derrotas * 100) / rounds).toFixed(2);
            while (vitoriaPercent.endsWith('0')) vitoriaPercent = vitoriaPercent.slice(0, -1);
            while (derrotaPercent.endsWith('0')) derrotaPercent = derrotaPercent.slice(0, -1);
            if (vitoriaPercent.endsWith('.')) vitoriaPercent = vitoriaPercent.slice(0, -1);
            if (derrotaPercent.endsWith('.')) derrotaPercent = derrotaPercent.slice(0, -1);

            resultEmbed
                .setDescription(description)
                .addFields(
                    { name: 'partidas', value: rounds.toString(), inline: true },
                    { name: 'vitórias', value: `${vitorias} • ${vitoriaPercent}%`, inline: true },
                    { name: 'derrotas', value: `${derrotas} • ${derrotaPercent}%`, inline: true }
                );

            if (aposta === true && betValue != NaN) {
                resultEmbed
                    .addField('lucro / prejuízo', `${lucro} loops`, true)
                    .setFooter('Para mudar o valor da aposta,\né necessário começar outro jogo');
            }

            gameMessage.edit({
                embeds: [resultEmbed]
            })

            buttonInteraction.deleteReply();

        });

    }
}