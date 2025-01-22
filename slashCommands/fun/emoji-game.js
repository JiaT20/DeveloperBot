const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
let channelsPlaying = new Discord.Collection()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji-game')
        .setDescription('tente achar o emoji diferente antes do tempo acabar'),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        if (channelsPlaying.has(interaction.channelId)) return interaction.reply({ content: 'Ei, já há uma partida desse jogo acontecendo nesse canal.\nNão é possível jogar 2 partidas no mesmo chat simultaneamente.\nTente em outro canal, ou junte-se ao jogo atual ^-^', ephemeral: true });

        await interaction.deferReply({ ephemeral: false });

        channelsPlaying.set(interaction.channelId, true);

        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

        let boardObj = newBoard();
        let emojis = boardObj.emojis;
        let diferente = boardObj.diferente;
        let board = boardObj.board;

        let startEmbed = new Discord.MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔎 Ache o emoji diferente dos demais 🔍')
            .setDescription(board)
            .addField('Como jogar',
                `Você tem 30 segundos para achar o emoji diferente dos demais\nEnvie as coordenadas do emoji que é diferente\nExemplo: "A1"`
            );

        let gameMessage = await interaction.editReply({ embeds: [startEmbed], fetchReply: true });

        let partidas = 1;

        let isWin = false;
        let timeWarned = false;
        let timeEndingWarn = false;

        let winners = new Discord.Collection();

        let collector = interaction.channel.createMessageCollector({
            filter: msg => msg.content.length === 2 && isCoordinate(msg.content.toLowerCase()) === true
        });

        setInterval(() => {

            if (timeEndingWarn === false && isWin === false && Date.now() - gameMessage.createdTimestamp > (20 * 1000)) {
                timeEndingWarn = true;
                interaction.channel.send({ content: '⏳ Faltam 10 segundos!' });
            }

        }, 200);

        setInterval(async () => {

            if (timeWarned === false && isWin === false && Date.now() - gameMessage.createdTimestamp > (30 * 1000)) {

                timeWarned = true

                let timeOverEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setTitle('🔎 Emoji game 🔍')
                    .setDescription(`⏳ O tempo acabou!\n\nA resposta certa era **"${diferente.toUpperCase()}"**`)
                    .addField(`Partida #${partidas}`, '\u200b')
                    .setFooter('Fim de jogo. Para começar um novo jogo, utilize /emoji-game');

                interaction.channel.send({ embeds: [timeOverEmbed] });

                channelsPlaying.delete(interaction.channelId);

                collector.stop()

            }
        }, 400); // Time check function end

        collector.on('collect', async message => {

            if (isWin === true || timeWarned === true) return;

            const coordenada = coordinate(message.content.toLowerCase());

            if (coordenada != diferente) return;

            isWin = true;
            message.react('🎉');

            if (winners.has(message.author.id)) winners.set(message.author.id, (winners.get(message.author.id) + 1));
            else winners.set(message.author.id, 1);

            let winnersString = ''

            let i = 1;
            let winnersSort = Array.from(winners).sort((a, b) => b[1] - a[1]);
            for (const userCache of winnersSort) {
                if (i > 9) return;
                /*
                let rank = `${i}°`
                if (i == 1) rank = '🥇'
                if (i == 2) rank = '🥈'
                if (i == 3) rank = '🥉'
                */
                const rank = ['🥇', '🥈', '🥉'][i - 1] || `${i}°`

                let user = client.users.cache.get(userCache[0])
                winnersString += `${rank} | ${user.tag} | ${userCache[1]} ponto${userCache[1] > 1 ? 's' : ''}\n`;
                i++
            }

            let endEmbed = new Discord.MessageEmbed()
                .setColor('GREEN')
                .setTitle('🔎 Emoji game 🔍')
                .setDescription(`🎉 Parabéns ${message.author}, você acertou!\nA resposta certa era **${diferente.toUpperCase()}**\n\nComeçando um novo jogo em 5 segundos...`)
                .addField(`Partida #${partidas}`, '\u200b')
                .addField('Placar', winnersString);

            message.channel.send({ embeds: [endEmbed] });

            await sleep(5 * 1000);

            boardObj = newBoard();
            board = boardObj.board;
            diferente = boardObj.diferente;
            emojis = boardObj.emojis;

            let newEmbed = new Discord.MessageEmbed(startEmbed)
                .setDescription(board)
                .addField(`Partida #${partidas + 1}`, '\u200b');

            gameMessage = await message.channel.send({ embeds: [newEmbed] });

            partidas++
            isWin = false;
            timeWarned = false;
            timeEndingWarn = false;

        });// MessageCreate event end

        // --- FUNÇÕES --- //

        function newBoard() {

            const totalEmojis = [
                // Certo    // Diferente
                [':blush:', ':relaxed:'], //
                [':man_office_worker:', ':office_worker:'], //
                [':sleeping_accommodation:', ':bed:'], // 🛌 // 🛏️
                [':motorway:', '🛤️'], // 🛣️ // 🛤️
                [':station:', ':tram:'], // 🚉 // 🚊
                [':house_with_garden:', ':house:'], //🏡 // 🏠
                [':e_mail:', ':envelope:'], //📧 // ✉️
                [':file_folder:', ':open_file_folder:'], // 📁 // 📂
                [':bearded_person:', ':man_beard:'], // 🧔 // 🧔‍♂️
                [':man_office_worker:', ':office_worker:'], //👨‍💼 // 🧑‍💼
                [':smile_cat:', ':smiley_cat:'], // 😸 // 😺
                [':raised_hand:', ':hand_splayed:'], // ✋ // 🖐️
                [':imp:', ':smiling_imp:'], // 👿 // 😈
                [':person_red_hair:', ':man_red_haired:'], // 🧑‍🦰 // 👨‍🦰
                [':hospital:', ':post_office:'], // 🏥 // 🏣
                [':clock430:', ':clock530:'], // 🕟 // 🕠
                [':bookmark_tabs:', ':page_facing_up:'], // 📑 // 📄
                [':woman_surfing:', ':person_surfing:'], // 🏄‍♀️ // 🏄
                [':thunder_cloud_rain:', ':cloud_rain:'], // ⛈️ // 🌧️
            ];

            let board = ':black_large_square: :one: :two: :three: :four: :five: :six: :seven: :eight: :nine:\n';

            const emojis = totalEmojis[Math.floor(Math.random() * totalEmojis.length)];

            const diferente = letters[Math.floor(Math.random() * letters.length)] + numbers[Math.floor(Math.random() * numbers.length)]

            for (const letter of letters) {
                board += `:regional_indicator_${letter}: `;

                for (let num = 1; num <= letters.length; num++) {
                    const position = `${letter}${num.toString()}`;

                    if (position != diferente) board += emojis[0] + ' '
                    else board += emojis[1] + ' '

                    if (num == 9) board += '\n'
                }
            }
            return {
                board: board,
                emojis: emojis,
                diferente: diferente
            }
        }

        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

        /**
        * @param {String} string
        */
        function isCoordinate(string) {
            const letras = string.split('');
            return (
                (letters.includes(letras[0].toLowerCase()) && numbers.includes(letras[1])) ||
                (letters.includes(letras[1].toLowerCase()) && numbers.includes(letras[0]))
            )
        }
        /**  @param {String} string
         */
        function coordinate(string) {
            const letras = string.split('');
            if (letters.includes(letras[0].toLowerCase()) && numbers.includes(letras[1])) return string
            else return letras.reverse().join('')
        }

    }// Main interaction event end
}