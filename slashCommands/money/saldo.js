const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saldo')
        .setDescription('exibe o saldo de loops de um usuário')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('o usuário para ver o saldo')
                .setRequired(false)
        ),



    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        let user = await interaction.options.getUser('usuário', false);

        if (!user || user == undefined) user = interaction.user;
        
        if (user.id == interaction.user.id) await interaction.deferReply({ ephemeral: true })
        else await interaction.deferReply({ ephemeral: false });

        let profileData = await profileModel.findOne({ userID: user.id });

        if (!profileData) return interaction.editReply({ content: 'Usuário informado não possui um perfil na LunaBot, ou perfil não foi encontrado no banco de dados' });

        let embed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('Saldo de ' + user.tag);

        if (user.id == interaction.user.id) {

            const lastEdit = new Date(profileData.lastEditMoney.getTime() - 10800000);
            const lastEditString = `${lastEdit.getDate()}/${lastEdit.getMonth() + 1}/${lastEdit.getFullYear()} - ${lastEdit.getHours()}:${lastEdit.getMinutes()}`

            embed.addFields(
                { name: 'carteira', value: profileData.coins.toString() },
                { name: 'banco', value: profileData.bank.toString() },
                { name: 'última alteração de saldo', value: lastEditString }
            )
        }
        else {
            embed.addField('saldo total', (profileData.coins + profileData.bank).toString())
        }

        interaction.editReply({ embeds: [embed] });

    }
}