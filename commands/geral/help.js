const Discord = require('discord.js');
const fs = require('fs');
const guildModel = require('../../mongoSchema/guild');

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'commands', 'comandos', 'cmds', 'info'],
    description: "mostra todos os meus comandos e a descrição deles, ou seja, esse comando 😉 (quebra da 4° parede?)",
    dmAllow: true,

    /**
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */

    async execute(client, message, args) {

        let embed = new Discord.MessageEmbed()
            .setColor('#00eeff')
            .setTitle('🌙 Olá, eu sou a Luna')
            .addFields(
                { name: 'para ver os comandos de cada categoria, clique nos botões abaixo', value: '\u200b' },
                { name: '🌐 Geral', value: 'Comandos diversos e utilidades', inline: true },
                { name: '🎉 Diversão', value: 'Mini jogos da luna, valendo moedas ou não', inline: true },
                { name: '🖼 Imagens', value: 'Geradores de memes, ou interações como "kiss" e "hug"', inline: true },
                { name: '⚙ Moderação', value: 'Comandos para organização e controle do servidor e seus membros', inline: true },
                { name: '💰 Economia', value: 'Comandos de gerenciamento das suas LunaBits, as moedas da Luna', inline: true }
            );

        if (message.channel.type != 'DM') {
            let guildData = await guildModel.findOne({ guildID: message.guild.id });
            embed.setDescription(
                `Um bot experimental com comandos de moderação, player de música, mini jogos, sistema de economia e muito mais
                meu prefixo padrão é ' (aspas simples)\nmeu prefixo nesse servidor é ${guildData.prefix}
                Caso deseje, entre no servidor de suporte e demais interações da Luna: [Luna Lab](https://discord.gg/VFJAqE7Uz6)`);
        } else embed.setDescription(
            `Um bot experimental com comandos de moderação, player de música, mini jogos, sistema de economia e muito mais
            meu prefixo padrão é ' (aspas simples)
            Caso deseje, entre no servidor de suporte e demais interações da Luna: [Luna Lab](https://discord.gg/VFJAqE7Uz6)`)

        const categories = fs.readdirSync('./commands');

        let buttons1 = new Discord.MessageActionRow();
        let buttons2 = new Discord.MessageActionRow();

        for (let i = 1; i < embed.fields.length; i++) {

            let buttons = buttons1;
            if (i > 3) buttons = buttons2;

            const fieldName = embed.fields[i].name

            buttons.addComponents(
                new Discord.MessageButton()
                    .setCustomId(categories[i - 1])
                    .setStyle('PRIMARY')
                    .setEmoji(fieldName.split(' ')[0])
                    .setLabel(fieldName.split(' ')[1])
            );

        }

        let mainMessage = await message.reply({ embeds: [embed], components: [buttons1, buttons2] });

        client.on('interactionCreate', async interaction => {

            if (
                !interaction.isButton() ||
                interaction.user.id != message.author.id ||
                interaction.message.id != mainMessage.id
            ) return;

            await interaction.deferReply();

            let newEmbed = new Discord.MessageEmbed()
                .setColor('#00eeff')

            const categoria = fs.readdirSync(`./commands/${interaction.customId}`);


            newEmbed
                .setTitle('Comandos da Luna - ' + interaction.customId)
                .setDescription('Para ver outras categorias, basta clicar nos botões abaixo');

            categoria.forEach(file => {
                const categoryFile = require(`../${interaction.customId}/${file}`);

                newEmbed
                    .addField(categoryFile.name, `Ou: \`${categoryFile.aliases}\`\n${categoryFile.description}`, true)
            })

            interaction.deleteReply();

            mainMessage.edit({ embeds: [newEmbed] })

        })

    }
}