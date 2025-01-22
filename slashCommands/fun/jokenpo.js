const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokenpo')
        .setDescription('joga uma partida de pedra papel tesoura')
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
            .setTitle('Pedra 🪨 papel 📃 tesoura ✂')
            .setDescription('Para jogar, clique nos botões abaixo');

        let startButtons = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('pedra')
                    .setLabel('pedra')
                    .setEmoji('🪨')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('papel')
                    .setLabel('papel')
                    .setEmoji('📃')
                    .setStyle('PRIMARY'),
                new Discord.MessageButton()
                    .setCustomId('tesoura')
                    .setLabel('tesoura')
                    .setEmoji('✂')
                    .setStyle('PRIMARY')
            );

        await interaction.editReply({
            embeds: [startEmbed],
            components: [startButtons]
        });

        let gameMessage = await interaction.fetchReply();

        const values = ['pedra', 'papel', 'tesoura'];
        const emojis = ['🪨', '📃', '✂'];

        let rounds = 0;
        let vitorias = 0;
        let derrotas = 0;
        let empates = 0;
        let ganhos = 0;

        let cooldown = false;

        let vitoriaPercent = '';
        let derrotaPercent = '';
        let empatePercent = '';

        client.on('interactionCreate', async buttonInteraction => {

            if (!buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id || buttonInteraction.user.id != interaction.user.id)
                return;

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

            const bot = Math.floor(Math.random() * 3);

            const botValue = values[bot];
            const botEmoji = emojis[bot];

            let resultEmbed = new Discord.MessageEmbed()
                .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

            let description = `Você jogou ${playerValue} ${playerEmoji}\nEu joguei ${botValue} ${botEmoji}\n\n`

            if (playerValue == botValue) {
                empates++
                resultEmbed.setColor('YELLOW');
                description += 'Foi um empate! 🤝';
                if (aposta === true) description += `\nVocê não ganhou nem perdeu seus ${betValue} loops`;

            } else if (
                (playerValue == 'pedra' && botValue == 'tesoura') ||
                (playerValue == 'papel' && botValue == 'pedra') ||
                (playerValue == 'tesoura' && botValue == 'papel')
            ) {
                vitorias++
                ganhos += betValue;
                resultEmbed.setColor('GREEN');
                description += `🎉 Parabéns ${interaction.user}, você venceu!\n\n😭 Infelizmente, eu perdi`;

                if (aposta === true) {
                    description += `\n\nVocê ganhou ${betValue} loops`;

                    let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                        $inc: { coins: betValue }
                    });
                    profileUpdate.save();
                }

            } else {

                derrotas++
                ganhos -= betValue;
                resultEmbed.setColor('RED');
                description += `😭 Sinto muito ${interaction.user}, você perdeu...\n\n🎉 Eba, eu venci!`

                if (aposta === true) {
                    description += `\n\nVocê perdeu ${betValue} loops`;

                    let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                        $inc: { coins: -betValue }
                    });
                    profileUpdate.save();
                }

            }

            vitoriaPercent = ((vitorias * 100) / rounds).toFixed(2);
            derrotaPercent = ((derrotas * 100) / rounds).toFixed(2);
            empatePercent = ((empates * 100) / rounds).toFixed(2);
            while (vitoriaPercent.endsWith('0')) vitoriaPercent = vitoriaPercent.slice(0, -1);
            while (derrotaPercent.endsWith('0')) derrotaPercent = derrotaPercent.slice(0, -1);
            while (empatePercent.endsWith('0')) empatePercent = empatePercent.slice(0, -1);
            if (vitoriaPercent.endsWith('.')) vitoriaPercent = vitoriaPercent.slice(0, -1);
            if (derrotaPercent.endsWith('.')) derrotaPercent = derrotaPercent.slice(0, -1);
            if (empatePercent.endsWith('.')) empatePercent = empatePercent.slice(0, -1);

            resultEmbed
                .setDescription(description)
                .addFields(
                    { name: 'partidas', value: rounds.toString() },
                    { name: 'vitórias', value: `${vitorias} • ${vitoriaPercent}%`, inline: true },
                    { name: 'derrotas', value: `${derrotas} • ${derrotaPercent}%`, inline: true },
                    { name: 'empates', value: `${empates} • ${empatePercent}%`, inline: true }
                );

            if (aposta === true) resultEmbed.addField('lucro / prejuízo', ganhos.toString());

            gameMessage.edit({
                embeds: [resultEmbed],
            });

            buttonInteraction.deleteReply();

        });

    }
}