const Discord = require('discord.js');
const embeds = require('../embeds.js');
const profileModel = require('../mongoSchema/profile');
const guildModel = require('../mongoSchema/guild');

let cooldownCommands = new Discord.Collection();
let cooldownXP = new Discord.Collection();

let prefix = "'";
let guildLang = '';

/**
 * @param {Discord.Client} client 
 * @param {Discord.Message} message
 * @param {Discord.Collection} commands
 */

module.exports = async (client, message, commands) => {

    if (message.author.bot) return;

    let dateNow = new Date();

    if (message.guild) {

        if (!message.guild.available) return;

        if (!cooldownXP.has(message.author.id)) {

            //---- CRIAR PERFIL ----//

            try {
                let profileData = await profileModel.findOne({ userID: message.author.id });

                if (!profileData) {
                    let profileNew = await profileModel.create({
                        userID: message.author.id,
                        chatXP: 1,
                        voiceXP: 1,
                        coins: 100,
                        bank: 200,
                        lastEditXP: dateNow,
                        lastEditMoney: dateNow,
                        lastDaily: dateNow,
                        created: dateNow
                    });
                    profileNew.save();

                    // ----AUMENTAR XP ----//

                } else {

                    let randomXP = Math.floor((Math.random() * 2) + 1)

                    let xpToAdd = await profileModel.findOneAndUpdate(
                        {
                            userID: message.author.id,
                        }, {
                        $inc: { chatXP: randomXP },
                        lastEditXP: dateNow
                    }
                    );
                    xpToAdd.save()

                }
            } catch (erro) {
                console.error(erro)
            }


        } else {

            cooldownXP.set(message.author.id, dateNow);

            setTimeout(() => {
                cooldownXP.delete(message.author.id);
            }, 1000 * 15);

        }

        //---- VERIFICAR / CRIAR GUILD CONFIG ----//

        try {
            let guildData = await guildModel.findOne({ guildID: message.guild.id });

            if (!guildData) {
                guildData = await guildModel.create({
                    guildID: message.guild.id,
                    prefix: "'",
                    lang: message.guild.preferredLocale,
                    added: dateNow,
                    lastEdit: dateNow
                });
                guildData.save();
            }

            prefix = guildData.prefix;

            if (guildData.lang == 'pt-BR') {
                guildLang = 'pt-BR';
                console.log('guild Language: ' + guildLang)
            }

            //module.exports = { guildLang }

        } catch (erro) {
            console.log(erro)
        }

        //---- VERIFICAÇÃO COMANDO E PERMISSIONS ----//


        let clientMember = message.guild.me;

        let msgContent = message.content.toLowerCase();

        if (!message.channel.permissionsFor(clientMember).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return;

        if ([`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(msgContent)) {
            //message.channel.send('servidor em: ' + guildLang)
            try {
                embeds.lunaHello(message, prefix, guildLang)
            } catch (erro) {
                console.log(erro);
            }
        }

    }

    if (!message.content.startsWith(prefix)) return;

    let args = message.content.slice(prefix.length).split(/ +/);
    let cmdName = args.shift().toLowerCase();

    if (cmdName.length == 0) {
        cmdName = args[0];
        args.shift();
    }

    const cmd = commands.get(cmdName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    if (!cmd) return message.reply({content: `\`${cmdName}\` não é um comando válido.`});

    if (cooldownCommands.has(message.author.id)) {
        let lastCmd = cooldownCommands.get(message.author.id)
        let timeLeft = new Date(new Date().getTime() - lastCmd.getTime())
        message.reply({content: `Ei, você está mandando comandos rápido demais!\nVocê precisa esperar 4 segundos entre um comando e outro\nTente novamente em ${timeLeft.getSeconds()} segundos`});
    }
    else {

        cooldownCommands.set(message.author.id, dateNow);

        setTimeout(() => {
            cooldownCommands.delete(message.author.id);
        }, 4000);
    }


    if (message.guild) {

        if (cmd.userPermissions && !message.member.permissions.has(cmd.userPermissions))
            return embeds.userPermission(client, message, cmd);

        const clientMember = message.guild.me;
        if (cmd.botPermissions && !clientMember.permissions.has(cmd.botPermissions))
            return embeds.botPermission(message, cmd);

        if (cmd.nsfw && !message.channel.nsfw)
            return message.channel.send(embeds.nsfw);

        if (cmd.inVoiceChannel && !message.member.voice.channel)
            return message.channel.send(embeds.inVoiceChannel);
        if (clientMember.voice.channel) {
            if (cmd.inVoiceChannel && message.member.voice.channel.id != clientMember.voice.channel.id)
                return;
        }

    }

    if (message.channel.type == 'DM' && !cmd.dmAllow) return;

    //---- EXCECUTAR COMANDO ----//

    try {
        cmd.execute(client, message, args);
    } catch (err) {
        message.reply({content: `houve um erro ao executar esse comando`});
        console.error(err);
    }

}