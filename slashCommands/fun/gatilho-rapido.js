const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');
let cooldownAposta = new Discord.Collection();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gatilho-rapido')
        .setDescription('um jogo de atirar e recarregar sua arma')
        .addIntegerOption(input => input
            .setName('valor')
            .setDescription('Caso deseje apostar, informe o valor')
            .setRequired(false)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */
    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: false });

        let betValue = interaction.options.getInteger('valor', false);
        let aposta = false;
        let profileData;

        if (betValue && betValue > 0) {
            if (cooldownAposta.has(interaction.user.id) && cooldownAposta.get(interaction.user.id) == 9) return interaction.editReply({
                content: 'Ops, você já apostou 10 vezes nos últimos 30 minutos. tente novamente mais tarde.\nVocê ainda pode jogar sem apostar'
            });
            if (betValue > 10 * 1000) return interaction.editReply({ content: 'Ops, o valor máximo para apostas nesse jogo é de 10 mil loops' });
            try {
                profileData = await profileModel.findOne({ userID: interaction.user.id });
            } catch (err) {
                return interaction.editReply({ content: 'Ops, houve um erro de comunicação no banco de dados.\nTente novamente mais tarde' });
            }
            if (profileData.coins < betValue) return interaction.editReply({ content: 'Ei, você não possui esse valor em carteira para apostar' });
            aposta = true;
        }

        let startEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔫 Gatilho Rápido')
            .setThumbnail('https://64.media.tumblr.com/7587c2cea0235edbd082b54aa93334c4/df4f8432524595f1-e8/s540x810/3a90cf31314ccffa349fe212617cb6a068829e26.gif')
            .setDescription(`Clique nos botões abaixo para jogar`)
            .addField('Regras', `Você começa com 1 bala.
            você tem 3 opções a cada rodada:
            **1 •** Recarregar: acrescenta 1 bala a sua munição;
            **2 •** Atirar: Dispara contra o inimigo diminuindo uma bala
            **3 •** Defender: Usa seu escudo e bloqueia o tiro do inimigo\n
            O vencedor é aquele que conseguir atingir o inimigo primeiro
            🤠 Boa sorte, forasteiro!`)

        if (aposta === true) startEmbed.addField('Valor da aposta', `${betValue}`);

        let playerBalas = 1;
        let botBalas = 1;
        let round = 1;
        const movimentos = ['recarregar', 'atirar', 'defender'];
        const emojis = ['🔄', '🔫', '🛡'];
        let lucro = 0;
        let partidas = 1;
        let vitorias = 0;
        let derrotas = 0;
        let empates = 0;

        let startButtons = new Discord.MessageActionRow();
        for (let i = 0; i < 3; i++) startButtons.addComponents(
            new Discord.MessageButton()
                .setCustomId(movimentos[i])
                .setLabel(movimentos[i])
                .setStyle('PRIMARY')
                .setEmoji(emojis[i])
        );

        let playAgainButton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('again')
                    .setLabel('Jogar Novamente')
                    .setStyle('SUCCESS')
                    .setEmoji('↩')
            );

        let gameMessage = await interaction.editReply({ embeds: [startEmbed], components: [startButtons], fetchReply: true });

        client.on('interactionCreate', async buttonInteraction => {
            if (!buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id || buttonInteraction.user.id != interaction.user.id) return;

            if (movimentos.includes(buttonInteraction.customId)) {

                await buttonInteraction.deferReply({ ephemeral: false });

                const playerNumber = movimentos.indexOf(buttonInteraction.customId);
                let botNumber = Math.floor(Math.random() * 3);
                while (botBalas == 0 && botNumber == 1) botNumber = Math.floor(Math.random() * 3);

                const playerJogada = movimentos[playerNumber];
                const botJogada = movimentos[botNumber];

                const playerEmoji = emojis[playerNumber];
                const botEmoji = emojis[botNumber];

                let gameOver = false

                let roundEmbed = new Discord.MessageEmbed()
                    .setColor(startEmbed.color)
                    .setTitle(startEmbed.title)
                    .setThumbnail(startEmbed.thumbnail.url);

                if (playerJogada == 'atirar' && playerBalas == 0) {
                    roundEmbed.setDescription('Ei, você está sem balas!\Tente outra ação')
                        .addFields(
                            { name: 'Round', value: `${round}`, inline: true },
                            { name: 'Suas balas', value: `${playerBalas}`, inline: true },
                            { name: 'Minhas balas', value: `${botBalas}`, inline: true },
                        );

                    buttonInteraction.deleteReply();
                    return gameMessage.edit({ embeds: [roundEmbed] });
                }

                round++

                if (playerJogada == 'recarregar') playerBalas++
                else if (playerJogada == 'atirar') playerBalas--

                if (botJogada == 'recarregar') botBalas++
                else if (botJogada == 'atirar') botBalas--

                roundEmbed.addFields(
                    { name: 'Round', value: `${round}`, inline: true },
                    { name: 'Suas balas', value: `${playerBalas}`, inline: true },
                    { name: 'Minhas balas', value: `${botBalas}`, inline: true },
                );

                let description = `Você escolheu **${playerJogada}** ${playerEmoji}\n\nEu escolhi **${botJogada}** ${botEmoji}\n\n`

                // Jogadas que não terminam o jogo
                if (playerJogada == 'defender' || botJogada == 'defender' || (playerJogada == 'recarregar' && botJogada == 'recarregar')) {
                    description += '⏳ Prepare-se para o próximo round e faça sua nova ação';
                    roundEmbed.setDescription(description);
                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [startButtons]
                    });
                }
                // Empate morte dupla - game over
                else if (playerJogada == 'atirar' && botJogada == 'atirar') {
                    empates++
                    gameOver = true;
                    description += '☠ Fogo cruzado! Fim de jogo para nós 2';
                    if (aposta === true) description += `\n\nVocê não ganhou ou perdeu seus ${betValue} loops`

                    roundEmbed.setDescription(description)
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: 'vitorias', value: `${vitorias}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                            { name: 'derrotas', value: `${derrotas}`, inline: true },
                        );
                    if (aposta === true) roundEmbed.addField('Lucro/prejuízo', `${lucro}`, true);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Derrota player
                else if (playerJogada == 'recarregar' && botJogada == 'atirar') {
                    derrotas++;
                    lucro -= betValue;
                    gameOver = true;
                    description += '☠ Você perdeu, forasteiro!';

                    if (aposta === true) {
                        let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                            $inc: { coins: -betValue }
                        });
                        profileUpdate.save();

                        description += `\n\nVocê perdeu ${betValue} loops`
                    }

                    roundEmbed.setDescription(description)
                        .setColor('RED')
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: 'vitorias', value: `${vitorias}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                            { name: 'derrotas', value: `${derrotas}`, inline: true },
                        );
                    if (aposta === true) roundEmbed.addField('Lucro/prejuízo', `${lucro}`, true);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }
                // Vitória player
                else if (playerJogada == 'atirar' && botJogada == 'recarregar') {
                    vitorias++;
                    lucro += betValue;
                    gameOver = true;
                    description += '🎉 Parabéns, você venceu! ';

                    if (aposta === true) {
                        let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
                            $inc: { coins: betValue }
                        });
                        profileUpdate.save();

                        description += `\n\nVocê ganhou ${betValue} loops`
                    }
                    roundEmbed.setDescription(description).setColor('GREEN')
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: 'vitorias', value: `${vitorias}`, inline: true },
                            { name: 'empates', value: `${empates}`, inline: true },
                            { name: 'derrotas', value: `${derrotas}`, inline: true },
                        );;
                    if (aposta === true) roundEmbed.addField('Lucro/prejuízo', `${lucro}`, true);

                    gameMessage.edit({
                        embeds: [roundEmbed],
                        components: [playAgainButton]
                    });

                }

                if (aposta === true && gameOver === true) {
                    if (cooldownAposta.has(interaction.user.id)) {
                        const previous = cooldownAposta.get(interaction.user.id);

                        if (previous == 9) gameMessage.edit({ components: [] });
                        else cooldownAposta.set(interaction.user.id, (previous + 1));
                    }
                    else cooldownAposta.set(interaction.user.id, 1);

                    setTimeout(() => {
                        const previous = cooldownAposta.get(interaction.user.id);
                        previous > 1 ? cooldownAposta.set(interaction.user.id, (previous - 1)) : cooldownAposta.delete(interaction.user.id);
                    }, 2 * 60 * 1000);

                    console.log(cooldownAposta.get(interaction.user.id));
                }

                buttonInteraction.deleteReply();

            } // botões de movimentos end
            else if (buttonInteraction.customId == 'again') {

                if (aposta === true && profileData.coins < betValue)
                    return buttonInteraction.reply({ content: 'Você não possui mais saldo suficiente para continuar essa aposta', ephemeral: true });

                await buttonInteraction.deferReply({ ephemeral: false });

                round = 0;
                playerBalas = 1;
                botBalas = 1;
                partidas++

                gameMessage.edit({
                    embeds: [startEmbed],
                    components: [startButtons]
                });

                buttonInteraction.deleteReply();
            }

        }); // buttonInteraction event end

    }
}