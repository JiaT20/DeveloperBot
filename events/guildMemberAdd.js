const guildModel = require('../mongoSchema/guild');

module.exports = {

    name: 'guildMemberAdd',

    async eventTrigger(member) {

        try {
            let profileData = await profileModel.findOne({ userID: member.user.id });

            if (!profileData) {
                let profileNew = await profileModel.create({
                    userID: member.user.id,
                    chatXP: 1,
                    voiceXP: 1,
                    coins: 100,
                    bank: 200,
                    lastEditXP: Date.now(),
                    lastEditMoney: Date.now(),
                    lastDaily: Date.now(),
                    created: Date.now()
                });
                profileNew.save();
            }
        } catch(erro) {
            console.log(erro);
        }

    }
}