const profileModel = require('../mongoSchema/profile');
const Discord = require('discord.js');

/**
 * @param {Discord.Client} client
 */

module.exports = async client => {

    let randomVoiceXP = Math.floor(Math.random() * 2) + 2;

    let guilds = client.guilds.cache;

    for (const guild of guilds.values()) {

        if (!guild.available) continue;

        const channels = guild.channels.cache

        for (const channel of channels.values()) {

            if (!channel.isVoice()) continue;

            if (channel.members.size == 0) continue;

            let humans = 0;
            channel.members.forEach(member => {
                if (!member.user.bot) humans++
            });

            if (humans <= 1) continue;

            const members = channel.members;

            for (const member of members.values()) {

                if (member.user.bot || member.voice.mute || member.voice.deaf) continue;


                try {
                    let profileData = await profileModel.findOne({ userID: member.id });

                    if (!profileData) {
                        //---- CRIAR NOVO PERFIL ----//

                        let profileNew = await profileModel.create({
                            userID: member.user.id,
                            chatXP: 1,
                            voiceXP: randomVoiceXP,
                            coins: 100,
                            bank: 200,
                            lastEditXP: Date.now(),
                            lastEditMoney: Date.now(),
                            lastDaily: Date.now(),
                            created: Date.now()
                        });
                        profileNew.save();

                        // ----AUMENTAR XP ----//

                    } else {

                        let profileUpdate = await profileModel.findOneAndUpdate(
                            {
                                userID: member.id,
                            }, {
                            $inc: { voiceXP: randomVoiceXP },
                            lastEditXP: Date.now()
                        }
                        );
                        profileUpdate.save();
                    }


                } catch (erro) {
                    console.log('db editing error: ' + erro);
                }


            }

        }

    }

}