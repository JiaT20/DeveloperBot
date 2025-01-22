const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userID: {type: String},
    chatXP: {type: Number},
    voiceXP: {type: Number},
    coins: {type: Number},
    bank: {type: Number},
    lastEditXP: {type: Date},
    lastEditMoney: {type: Date},
    lastDaily: {type: Date},
    created: {type: Date}
  }
);

const profileModel = mongoose.model('Profiles', profileSchema);

module.exports = profileModel;