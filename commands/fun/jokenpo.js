const Discord = require("discord.js");
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    name: 'jokenpo',
    aliases: ['ppt'],
    description: "uma partida de pedra papel tesoura",

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */

    async execute(client, message, args) {

        let aposta = false;
        let betValue = 0;

        const player1 = message.author;
        const player2 = message.mentions.members.first() || client.users.cache.get(args[0]);

        if (args[0] && !player2) return message.reply({ content: 'usuário informado não encontrado' });

        if (player2.id == client.user.id || player1.id == player2.id) return message.reply({ content: 'Para jogar solo (contra mim), utilize /jokenpo' });

        if (player2.bot) return message.reply({
            embeds: [{
                title: '<:bot_tag:861720010283417611> Bip bop',
                description: 'Acho que meus colegas bots não sabem jogar pedra papel tesoura...'
            }]
        });

        if (args[1]) {

            betValue = parseInt(args[1], 10);

            if (!betValue || betValue == NaN) return message.reply({
                embeds: [{
                    title: 'Valor informado inválido',
                    description: `Caso deseje apostar, digite o valor após o nome da pessoa\nExemplo: 'jokenpo @lunaBot`
                }]
            });

            let profile1Data = await profileModel.findOne({ userID: message.author.id });

            if (profile1Data.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profile1Data.coins} loops`
                }]
            });

            let profile2Data = await profileModel.findOne({ userID: message.author.id });

            if (!profile2Data) return message.reply({ content: `usuário informado não encontrado no banco de dados\nUm perfil será criado automaticamente quando ${player2} enviar uma mensagem` });

            if (profile2Data.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `${player2} não possui esse valor em carteira para apostar`
                }]
            });

            aposta = true;

        }

        let startEmbed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Pedra 🪨 papel 📃 tesoura ✂')
            .setDescription('Para jogar, clique nos botões abaixo');

        if (aposta === true) startEmbed.addField('valendo', betValue.toString() + ' loops');

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

        let gameMessage = await message.reply({
            content: `Olá ${player2}\n${player1} deseja jogar uma partida de jogo da velha com você.?`,
            embeds: [startEmbed],
            components: [startButtons]
        })

        const values = ['pedra', 'papel', 'tesoura'];
        const emojis = ['🪨', '📃', '✂'];

        let partidas = 1;
        let vitoriasP1 = 0;
        let vitoriasP2 = 0;
        let empates = 0;

        let playersMap = new Discord.Collection();

        client.on('interactionCreate', async interaction => {

            if (
                !interaction.inGuild() || !interaction.isButton() || interaction.message.id != gameMessage.id ||
                (interaction.user.id != player1.id && interaction.user.id != player2.id)
            ) return;

            let otherPlayer = player1;
            if (interaction.user.id == player1.id) otherPlayer = player2;

            if (values.includes(interaction.customId) && !playersMap.has(interaction.user.id)) {

                playersMap.set(interaction.user.id, interaction.customId);

                if (playersMap.size == 1) {
                    interaction.reply({ content: `Okay ${interaction.user}. aguardando ${otherPlayer} jogar também` });

                    await setTimeout(() => {
                        interaction.deleteReply()
                    }, 4000);

                    return;
                }

                interaction.deferReply();

                let p1Jogada = playersMap.get(player1.id);
                let p2Jogada = playersMap.get(player2.id);

                let p1Emoji = emojis[values.indexOf(p1Jogada)];
                let p2Emoji = emojis[values.indexOf(p2Jogada)];

                let resultEmbed = new Discord.MessageEmbed()
                    .setColor('#00ffff')
                    .setTitle('Pedra 🪨 papel 📃 tesoura ✂');

                let description = `${player1} jogou ${p1Jogada} ${p1Emoji}\n${player2} jogou ${p2Jogada} ${p2Emoji}\n\n`

                if (p1Jogada == p2Jogada) {

                    empates++
                    resultEmbed.setColor('YELLOW');
                    description += 'Foi um empate! 🤝';
                    if (aposta === true) description += `\nNinguém ganhou ou perdeu seus ${betValue} loops`;

                } else if (
                    (p1Jogada == 'pedra' && p2Jogada == 'tesoura') ||
                    (p1Jogada == 'papel' && p2Jogada == 'pedra') ||
                    (p1Jogada == 'tesoura' && p2Jogada == 'papel')
                ) {
                    vitoriasP1++
                    description += `🎉 Parabéns ${player1}, você venceu!\n\n😭 Sinto muito ${player2}, você perdeu`;

                    if (aposta === true) {
                        description += `\n${player1} ganhou ${betValue} loops\n${player2} perdeu ${betValue} loops`;

                        try {
                            let profile1Update = await profileModel.findOneAndUpdate({ userID: player1.id }, {
                                $inc: { coins: betValue }
                            });
                            profile1Update.save();
                            let profile2Update = await profileModel.findOneAndUpdate({ userID: player2.id }, {
                                $inc: { coins: -betValue }
                            });
                            profile2Update.save();
                        } catch (error) {
                            interaction.editReply({ content: 'Desculpe, houve um erro de comunicação no banco de dados\nAs alterações de saldo não puderam ser confirmadas' })
                        }
                    }

                }
                else {
                    vitoriasP2++

                    description += `🎉 Parabéns ${player2}, você venceu!\n\n😭 Sinto muito ${player1}, você perdeu`;

                    if (aposta === true) {
                        description += `\n${player2} ganhou ${betValue} loops\n${player1} perdeu ${betValue} loops`;

                        try {
                            let profile1Update = await profileModel.findOneAndUpdate({ userID: player1.id }, {
                                $inc: { coins: -betValue }
                            });
                            profile1Update.save();
                            let profile2Update = await profileModel.findOneAndUpdate({ userID: player2.id }, {
                                $inc: { coins: betValue }
                            });
                            profile2Update.save();
                        } catch (error) {
                            interaction.editReply({ content: 'Desculpe, houve um erro de comunicação no banco de dados\nAs alterações de saldo não puderam ser confirmadas' })
                        }
                    }

                }

                let vitoriaP1Percent = Math.round((vitoriasP1 * 100) / partidas);
                let vitoriaP2Percent = Math.round((vitoriasP2 * 100) / partidas);
                let empatePercent = Math.round((empates * 100) / partidas);

                resultEmbed
                    .setDescription(description)
                    .addFields(
                        { name: 'partidas', value: partidas.toString(), inline: true },
                        { name: 'vitórias de ' + player1.tag, value: `${vitoriasP1} • ${vitoriaP1Percent}%`, inline: true },
                        { name: 'vitórias de ' + player2.user.tag, value: `${vitoriasP2} • ${vitoriaP2Percent}%`, inline: true },
                        { name: 'empates', value: `${empates} • ${empatePercent}%`, inline: true },
                    )

                let playAgain = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId('again')
                            .setLabel('jogar novamente')
                            .setEmoji('🔁')
                            .setStyle('SUCCESS')
                    );


                gameMessage.edit({
                    content: `Resultado da partida de ${player1} e ${player2}`,
                    embeds: [resultEmbed],
                    components: [playAgain]
                });

                partidas++

                playersMap.delete(player1.id);
                playersMap.delete(player2.id);

                interaction.deleteReply();

            }
            else if (values.includes(interaction.customId) && playersMap.has(interaction.user.id)) {
                playersMap.delete(interaction.user.id);
                playersMap.set(interaction.user.id, interaction.customId);
                interaction.reply({ content: `Okay ${interaction.user}. você alterou sua escolha para "${interaction.customId}"\nAguardando ${otherPlayer} jogar também`, ephemeral: true });
            }
            else if (interaction.customId == 'again') {

                if (playersMap.has(interaction.user.id)) return interaction.reply({ content: `Ei ${interaction.user}, você já votou por jogar novamente! Aguardando ${otherPlayer} decidir se quer jogar outra partida também`, ephemeral: true });
                playersMap.set(interaction.user.id, 'again');

                await interaction.deferReply()

                if (playersMap.size == 1) {
                    interaction.editReply({ content: `Okay ${interaction.user}. você votou por jogar novamente. Aguardando ${otherPlayer} decidir se quer jogar outra partida também` });

                    await setTimeout(() => {
                        interaction.deleteReply()
                    }, 4000);

                    return;
                }
                playersMap.delete(player1.id);
                playersMap.delete(player2.id);

                interaction.deleteReply()

                gameMessage.edit({
                    content: `Partida de ${player1} e ${player2}`,
                    embeds: [{
                        color: '#00ffff',
                        title: 'Pedra 🪨 papel 📃 tesoura ✂',
                        description: 'Para jogar, clique nos botões abaixo'
                    }],
                    components: [startButtons]
                })

            }


        })

    }
}