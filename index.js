const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const prefix = "+";

const client = new Discord.Client({
    intents: 8191
});

let skipVote = new Discord.Collection();
let musicMessages = new Discord.Collection();

module.exports = { client }

try {
    require('./mongoose').init();
}
catch (error) {
    console.error(error);
}

let commands = new Discord.Collection();

const mainCommandsFolder = fs.readdirSync('./commands').filter(file => file != 'info.json');

for (const subFolder of mainCommandsFolder) {
    if (subFolder.includes('music')) continue;
    let categoryFolder = fs.readdirSync(`./commands/${subFolder}`).filter(file => file.endsWith('.js'));

    for (const file of categoryFolder) {
        let cmd = require(`./commands/${subFolder}/${file}`);
        commands.set(cmd.name, cmd);
    }
};

let slashCommands = new Discord.Collection();

const slashCommandsFolder = fs.readdirSync('./slashCommands');

for (const subFolder of slashCommandsFolder) {

    let categoryFolder = fs.readdirSync(`./slashCommands/${subFolder}`).filter(file => file.endsWith('.js'));

    for (const file of categoryFolder) {
        let cmd = require(`./slashCommands/${subFolder}/${file}`);
        slashCommands.set(cmd.data.name, cmd);
    }
};

client.on('ready', async () => {

    console.log('|      Comandos      |Status|');
    commands.forEach(cmd => {
        console.log(
            '\x1b[4m%s\x1b[0m', '| ' + cmd.name + (' '.repeat(20 - cmd.name.length)) + '| ✅ |'
        )
    });
    console.log(`\n|| ${client.user.tag} online! ||`);

    const activities = [
        `Olá, eu sou a Avon. um bot experimental criado pela Louie`,
        `para ver uma lista com todas as minhas funcionalidades, digite ${prefix}help ou /`,
        `Você sabia que eu sou Open Source? 👩‍💻 confira meu código em https://github.com/JiaT20`
    ];

    let i = 0;
    setInterval(() => {

        client.user.setActivity(`${activities[i]}`, { type: 'PLAYING' });
        i++;
        if (i == 3) { i = 0 }

    }, 1000 * 20);

    setInterval(
        () =>
            require('./extra/voicexp')(client),
        1000 * 60 * 5
    );

});

client
    .on('messageCreate', async message => {
        try {
            require('./events/messageCreate')(client, message, commands);
        } catch (error) {
            console.error(error)
        }
    })
    .on('interactionCreate', async interaction => {
        try {
            require('./events/interactionCreate')(client, interaction, slashCommands);
        } catch (error) {
            console.error(error)
        }
    })
    .on('guildCreate', async guild => {
        try {
            require('./events/guildCreate')(client, guild);
        } catch (error) {
            console.error(error)
        }
    })
    .on('error', async error => {
        console.error(error)
    });

client.login(process.env['MTMyMTIyNzQ0MTM3NjU5MTg3Mw.GVddU6.pcQhIGJUoE4H60L_dHjuNvquFKwlDqKs0xmvy8']);