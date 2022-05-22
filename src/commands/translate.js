const utils = require("../utils");
const getTranslation = require("../modules/translate/getTranslation");
const helpCommand = require('./help');
exports.run = (client, message, args, level) => {
  // emit message to other services subscribe
  client.emit('translate', args); // the client is already bind on client listen message

  if (args.length > 0) {
    getTranslation(args).then(response => {
      const resultJson = utils.generateDiscordResult(response.data);
      message.channel.send(resultJson);
    }).catch((err) => {
      console.log('t error => ', err);
      message.reply('something strange');
    });
  } else {
    // Show individual command's help.
    const command = this.help && this.help.name;
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (cmd) {
      if (level < client.levelCache[cmd.conf.permLevel]) return;
      message.channel.send(
        `= ${cmd.help.name} = 
        ${cmd.help.description}
        usage:: ${cmd.help.usage}
        aliases:: ${cmd.conf.aliases.join(", ")}
        = ${cmd.help.name} =`,
        { code: "asciidoc"}
      );
    } else { // otherwise show help command's help
      helpCommand.run(client, message, args, level);
    }
  }
};

exports.help = {
  name: "translate",  // the name of the command
  description: "get the translation of the word",
  usage: "-t love"
};

exports.conf = {
  aliases: ["t", "tr"],
  permLevel: 'User',
};
