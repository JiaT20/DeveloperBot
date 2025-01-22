module.exports = {

  name: 'ready',
 
  async eventTrigger(client) {

    console.log('Carregando');
    console.log('_'.repeat(27));
    client.commands.forEach(cmd => {
      console.log('\x1b[4m%s\x1b[0m', '| ' + cmd.name + ' '.repeat(15 - cmd.name.length) + '| ✅  |')
    });
    console.log('\x1b[4m%s\x1b[0m', `|| ${client.user.tag} online! 🌎  ||`);

    let activities = [
      `Utilize 'help para ver uma lista com todos os meus comandos`,
      `Olá, eu sou a Luna. um bot experimental criado pela Louie.`,
      `estou em ${client.guilds.cache.size} servidores.`,
      `${client.users.cache.size} usuários.`
    ],
      i = 0;

    setInterval(() =>
      client.user.setActivity(`${activities[i++ % activities.length]}`, { type: 'PLAYING' }),
      1000 * 15);

  }
};