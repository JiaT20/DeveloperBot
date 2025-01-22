const guildModel = require('../mongoSchema/guild');

module.exports = {

  name: 'guildCreate',

  async eventTrigger(guild) {

    try {

      let guildConfigData = await guildModel.findOne({ guildID: guild.id });

      if (!guildConfigData) {
        let guildConfig = await guildModel.create(
          {
            guildID: guild.id,
            prefix: "'",
            added: Date.now()
          }
        )
      }
      else if (guildConfigData) {
        let guildConfig = await guildModel.findOneAndUpdate(
          { guildID: guild.id },
          {
            added: Date.now()
          }
        )
      }
      guildConfig.save();

    } catch (erro) {
      console.log(erro);
    }
  }
};