const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const profileModel = require('../../mongoSchema/profile');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deposit')
        .setDescription('deposita um valor da sua carteira para o banco')
        .addIntegerOption(option =>
            option.setName('valor')
                .setDescription('o valor para depositar')
                .setRequired(false)
        ),

    /**
     * @param {Discord.Client} client
     * @param {Discord.CommandInteraction} interaction 
     */

    async execute(client, interaction) {

        await interaction.deferReply({ ephemeral: true });

        let profileData = await profileModel.findOne({ userID: interaction.user.id });

        let valor = interaction.options.getInteger('valor', false);

        if (!valor || valor == NaN) valor = profileData.coins;

        if (profileData.coins < valor)
            return interaction.editReply({ content: `Você não possui esse valor para depositar\nVocê atualmente possui ${profileData.coins} loops na carteira` });

        let profileUpdate = await profileModel.findOneAndUpdate({ userID: interaction.user.id }, {
            $inc: {
                coins: -valor,
                bank: valor
            },
            lastEditMoney: Date.now()
        });
        profileUpdate.save();

        let embed = new Discord.MessageEmbed()
            .setColor('#00ffff')
            .setTitle('📥 Depósito efetuado com sucesso')
            .addFields(
                { name: 'valor depositado', value: valor.toString() + ( valor == profileData.coins ? ' loops (total)' : ' loops') },
                { name: 'saldo atual em carteira', value: (profileData.coins - valor).toString(10) },
                { name: 'saldo atual no banco', value: (profileData.bank + valor).toString(10) },
            );

        interaction.editReply({ embeds: [embed] });

    }
}