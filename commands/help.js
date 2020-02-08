exports.run = (client, message, args, level) => {
  const command = this.help && this.help.name;
  if (client.commands.has(command)) {
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (level < client.levelCache[cmd.conf.permLevel]) return;
    message.channel.send(
      `= ${cmd.help.name} = 
      ${cmd.help.description}
      usage:: ${cmd.help.usage}
      aliases:: ${cmd.conf.aliases.join(", ")}
      = ${cmd.help.name} =`,
      { code: "asciidoc" }
    );
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["h", "halp"],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Displays all the available commands for your permission level.",
  usage: `-help: show this message; \n
  -v [word]: show the translation of the [word]
  `
};
