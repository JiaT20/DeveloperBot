const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildID: {type: String},
  prefix: {type: String, default: "'"},
  lang: {type: String},
  added: {type: Date},
  lastEdit: {type: Date}
});

const guildModel = mongoose.model('guildConfig', guildSchema);

module.exports = guildModel;