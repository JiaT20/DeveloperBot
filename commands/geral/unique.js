const canvacord = require("canvacord");

module.exports = {
  name: 'unique',
  aliases: ['exclusive'],
  description: "formata uma mensagem retornando apenas caracteres únicos",

  async execute(client, message, args) {

    const msg = args.join(" ");

    function findUnique(str){
        // The variable that contains the unique values
      let uniq = "";
      
      for(let i = 0; i < str.length; i++){
        // Checking if the uniq contains the character
        if(uniq.includes(str[i]) === false){
          // If the character not present in uniq
          // Concatenate the character with uniq
          uniq += str[i]
        }
      }
      return uniq;
    }

    message.channel.send(findUnique(msg));

  }
}

