const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    name: 'velha',
    aliases: ['tictactoe', 'jogodavelha', 'jogovelha'],
    description: "uma partida de jogo da velha por reações com emojis",

    /**
     * @param {Discord.Client} client
     * @param {Discord.Message} message
     * @param {String[]} args
     */

    async execute(client, message, args) {

        let player1 = message.author;
        let player2 = message.mentions.users.first() || client.users.cache.get(args[0]);

        if (!args[0] || !player2) return message.reply({
            embeds: [{
                title: 'Usuário informado não encontrado',
                description: 'Você precisa mencionar alguém para jogar jogo da velha'
            }]
        });

        if (player2.id == client.user.id) return message.reply({
            embeds: [{
                title: 'Desculpa, eu não sei jogar jogo da velha, ainda',
                description: 'Quem sabe na próxima atualização a Louie me ensine a jogar 😊'
            }]
        });

        if (player2.bot) return message.reply({
            embeds: [{
                title: '<:bot_tag:861720010283417611> Bip bop',
                description: 'Acho que meus colegas bots não sabem jogar jogo da velha...'
            }]
        });

        if (player1.id == player2.id) return message.reply({ content: 'Ei, você não pode se auto desafiar no jogo da velha!' });

        let aposta = false;
        const betValue = parseInt(args[1]);

        let profileData1;
        let profileData2;
        if (args[1] && betValue != NaN && betValue > 0) {

            profileData1 = await profileModel.findOne({ userID: player1.id });

            if (profileData1.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `Seu saldo em carteira atual é de ${profileData1.coins} loops`
                }]
            });

            profileData2 = await profileModel.findOne({ userID: player2.id });

            if (!profileData2) return message.reply({
                embeds: [{
                    title: 'Usuário não encontrado no banco de dados',
                    description: `Um perfil será criado na Luna assim que o usuário enviar a primeira mensagem`
                }]
            });

            if (profileData2.coins < betValue) return message.reply({
                embeds: [{
                    title: 'Saldo insuficiente para essa aposta',
                    description: `${player2} não tem saldo em carteira para essa aposta`
                }]
            });

            aposta = true;

        }

        const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

        const empty = '⬜';

        let emojis = new Discord.Collection();

        let line1 = new Discord.MessageActionRow();
        let line2 = new Discord.MessageActionRow();
        let line3 = new Discord.MessageActionRow();

        let i = 1;
        numbers.forEach(number => {
            let line;
            if (i <= 3) line = line1
            else if (i >= 4 && i <= 6) line = line2
            else line = line3;
            line.addComponents(
                new Discord.MessageButton()
                    .setCustomId(number)
                    .setLabel(empty)
                    .setStyle('PRIMARY')
            );
            emojis.set(number, empty);
            i++
        });

        let playAgainButton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('again')
                    .setLabel('jogar novamente')
                    .setEmoji('🔁')
                    .setStyle('SUCCESS')
            );

        let startEmbed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('⭕ Jogo da Velha ❎')
            .setDescription('Para jogar, clique nos botões abaixo')
            .addField('vez de', player1.toString());

        if (aposta === true) startEmbed.addField('valor da aposta', betValue.toString());

        let gameMessage = await message.reply({
            content: `Partida de ${player1} e ${player2}`,
            embeds: [startEmbed],
            components: [line1, line2, line3]
        });

        let partidas = 1;
        let vitoriasP1 = 0;
        let vitoriasP2 = 0;
        let lucroP1 = 0;
        let lucroP2 = 0;
        let empates = 0;

        let playAgain = [];

        let round = 1;
        let roundPlayer = player1;

        let playerEmoji = '';

        //--BUTTON EVENT--//
        client.on('interactionCreate', async buttonInteraction => {
            if (
                !buttonInteraction.inGuild() || !buttonInteraction.isButton() || buttonInteraction.message.id != gameMessage.id ||
                (buttonInteraction.user.id == player1.id && buttonInteraction.user.id == player2.id)
            ) return;
            if (buttonInteraction.user.id != roundPlayer.id && numbers.includes(buttonInteraction.customId))
                return buttonInteraction.reply({ content: 'Ei, não é sua vez de jogar!', ephemeral: true });

            await buttonInteraction.deferReply({ ephemeral: false });

            const otherPlayer = buttonInteraction.user.id == player1.id ? player2 : player1

            if (numbers.includes(buttonInteraction.customId) && roundPlayer.id == buttonInteraction.user.id) {

                playerEmoji = (round % 2 == 0) ? '⭕' : '❎'

                emojis.set(buttonInteraction.customId, playerEmoji);

                let roundEmbed = new Discord.MessageEmbed()
                    .setColor('#00ffff')
                    .setTitle('⭕ Jogo da Velha ❎')
                    .setDescription('Para jogar, clique nos botões abaixo')
                    .addField('vez de', otherPlayer.toString());

                if (aposta === true) roundEmbed.addField('valor da aposta', betValue.toString());

                let newLine1 = new Discord.MessageActionRow();
                let newLine2 = new Discord.MessageActionRow();
                let newLine3 = new Discord.MessageActionRow();

                let n = 1;
                numbers.forEach(number => {
                    let line;
                    if (n <= 3) line = newLine1;
                    else if (n >= 4 && n <= 6) line = newLine2;
                    else line = newLine3;

                    const label = emojis.get(number);
                    const disabled = label != empty;

                    line.addComponents(
                        new Discord.MessageButton()
                            .setCustomId(number)
                            .setLabel(label)
                            .setDisabled(disabled)
                            .setStyle('PRIMARY')
                    );
                    n++
                });

                gameMessage.edit({
                    content: `Vez de ${otherPlayer}`,
                    embeds: [roundEmbed],
                    components: [newLine1, newLine2, newLine3]
                });

                //--VERIFICAR SE A PARTIDA ACABOU--//

                if (
                    isWin(1, 2, 3) || isWin(4, 5, 6) || isWin(7, 8, 9) ||  // horizontal
                    isWin(1, 4, 7) || isWin(2, 5, 8) || isWin(3, 6, 9) || // vertical
                    isWin(1, 5, 9) || isWin(3, 5, 7)                     // diagonal
                ) {

                    (roundPlayer.id == player1.id) ? vitoriasP1++ : vitoriasP2++

                    let resultEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffff')
                        .setTitle('⭕ Fim de jogo ❎')
                        .setDescription(`🎉 Parabéns ${roundPlayer}. Você ganhou!\n😭 Sinto muito ${otherPlayer}. você perdeu!`)
                        .addFields(
                            { name: 'partidas', value: `${partidas}` },
                            { name: `vitórias de ${player1.username}`, value: `${vitoriasP1}` },
                            { name: `vitórias de ${player2.username}`, value: `${vitoriasP2}` },
                            { name: 'empates', value: `${empates}` }
                        );

                    if (aposta === true && betValue != NaN && betValue > 0) {
                        roundPlayer.id == player1.id ? lucroP1 += betValue : lucroP2 += betValue;

                        let profileUpdate1 = await profileModel.findOneAndUpdate({ userID: roundPlayer.id },
                            {
                                $inc: { coins: betValue },
                                lastEditMoney: Date.now()
                            }
                        );
                        profileUpdate1.save();

                        let profileUpdate2 = await profileModel.findOneAndUpdate({ userID: otherPlayer.id },
                            {
                                $inc: { coins: -betValue },
                                lastEditMoney: Date.now()
                            }
                        );
                        profileUpdate2.save();

                    }

                    //desabilitar todos os botões pra ninguém alterar a partida finalizada
                    newLine1.components.forEach(component => component.setDisabled(true));
                    newLine2.components.forEach(component => component.setDisabled(true));
                    newLine3.components.forEach(component => component.setDisabled(true));

                    gameMessage.edit({
                        embeds: [resultEmbed],
                        components: [newLine1, newLine2, newLine3, playAgainButton]
                    });

                    //--VERIFICAR SE DEU VELHA--//
                } else if (round == 9) {
                    empates++
                    let resultEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffff')
                        .setTitle('⭕ Fim de jogo ❎')
                        .setDescription(`Deu velha! empate 🤝`)
                        .addFields(
                            { name: 'partidas', value: partidas.toString() },
                            { name: `vitórias de ${player1.tag}`, value: `${vitoriasP1}` },
                            { name: `vitórias de ${player2.tag}`, value: `${vitoriasP2}` },
                            { name: 'empates', value: `${empates}` }
                        );

                    gameMessage.edit({
                        embeds: [resultEmbed],
                        components: [newLine1, newLine2, newLine3, playAgainButton]
                    });
                }

                round++

                roundPlayer = (roundPlayer.id == player2.id) ? player1 : player2

                buttonInteraction.deleteReply();

            }
            else if (buttonInteraction.customId == 'again' && !playAgain.includes(buttonInteraction.user.id)) {

                playAgain.push(buttonInteraction.user.id);

                if (aposta === true) {

                    let profileData;
                    if (buttonInteraction.user.id == player1.id) profileData = profileData1;
                    else profileData = profileData2;

                    if ((roundPlayer.id == player1.id && profileData.coins < lucroP2) || (roundPlayer.id == player2.id && profileData.coins < lucroP1))
                        return buttonInteraction.editReply({
                            content: `${buttonInteraction.user}, Você não possui mais saldo suficiente para continuar essa aposta`
                        });
                }

                if (playAgain.length == 1) {
                    await buttonInteraction.editReply({
                        content: `Okay ${buttonInteraction.user}, você votou para jogar mais uma partida. esperando ${otherPlayer} votar`,
                        fetchReply: true
                    });

                    setTimeout(() => {
                        try { buttonInteraction.deleteReply() }
                        catch (err) { }
                    }, 5000);
                    return;
                }

                //resetar valores da partida
                playAgain = [];
                round = 1;
                numbers.forEach(number => emojis.set(number, empty));

                partidas++

                let newEmbed = new Discord.MessageEmbed(startEmbed).setFields(
                    { name: 'Vez de', value: `${roundPlayer}` }
                )

                //começar outra emocionante partida
                gameMessage.edit({
                    embeds: [newEmbed],
                    components: [line1, line2, line3]
                });
                buttonInteraction.deleteReply();
            } else buttonInteraction.deleteReply();

        }); //ButtonInteraction event end


        // --- FUNCTIONS --- //

        /**
         * @param {Number} a
         * @param {Number} b
         * @param {Number} c
         */
        function isWin(a, b, c) {
            const aValue = emojis.get(`${numbers[a - 1]}`);
            const bValue = emojis.get(`${numbers[b - 1]}`);
            const cValue = emojis.get(`${numbers[c - 1]}`);
            return aValue != empty && aValue == bValue && bValue == cValue
        }

    }
}