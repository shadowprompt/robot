const dictionaryCtrl = require('../modules/dictionary/control');
const translateCtrl = require('../modules/translate/control');

exports.run = (client, message, args, level) => {
  // If no specific command is called, show all filtered commands.
  console.log('args', args.join());
  if (!args[0]) {
    const isSingleWord = args.length === 1;
    if(isSingleWord){
      dictionaryCtrl.discord(message)(args.join(' '));
    }else{
      translateCtrl(message)(args.join(' '));
    }
  } else {
    // Show individual command's help.
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}\naliases:: ${command.conf.aliases.join(", ")}\n= ${command.help.name} =`, {code:"asciidoc"});
    }
  }
};

exports.help = {
  name: 'dictionary',
  description: 'dictionary the word',
  usage: '-t love',
};

exports.conf = {
  aliases: ['translate']
}