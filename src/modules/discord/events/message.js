// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
module.exports = async (client, message) => {
  client.logger.log(`author: ${message.author}, bot: ${message.author.bot}, content: ${message.content}`);
  // Grab the settings for this slack from Enmap.
  // If there is no guild, get default conf (DMs)
  // const settings = message.settings = client.getSettings(message.guild.id);
  const settings = (message.settings = client.config.defaultSettings);
  client.logger.log(`settings.prefix: ${settings.prefix}`);

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // ignore message from bot
  if (message.author.bot) return;

  // Checks if the bot was mentioned, with no message after it, returns the prefix.
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.reply(`My prefix on this guild is \`${settings.prefix}\``);
  }

  if (message.content.indexOf(settings.prefix) !== 0) return;
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/\s+/g);
  const command = args.shift().toLowerCase();

  // If the member on a guild is invisible or not cached, fetch them.
  if (message.guild && !message.member) {
    await message.guild.fetchMember(message.author);
  }

  // Check whether the command, or alias, exist in the collections defined
  // in app.js.
  const cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));
  // using this const varName = thing OR otherthign; is a pretty efficient
  // and clean way to grab one of 2 values!
  client.logger.log(`command: ${command}, cmd: ${cmd}`);
  if (!cmd) return;

  // Some commands may not be useable in DMs. This check prevents those commands from running
  // and return a friendly error message.

  if (cmd && !message.guild && cmd.conf.guildOnly) {
    return message.channel.send(
      "This command is unavailable via private message. Please run this command in a guild."
    );
  }

  // Get the user or member's permission level from the elevation
  const level = client.permlevel(message);
  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel
        .send(`You do not have permission to use this command.
  Your permission level is ${level} (${
        client.config.permLevels.find(l => l.level === level).name
      })
  This command requires level ${client.levelCache[cmd.conf.permLevel]} (${
        cmd.conf.permLevel
      })`);
    } else {
      return;
    }
  }

  // To simplify message arguments, the author's level is now put on level (not member so it is supported in DMs)
  // The "level" command module argument will be deprecated in the future.
  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  // If the command exists, **AND** the user has permission, run it.
  client.logger.cmd(
    `[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${
      message.author.username
    } (${message.author.id}) ran command ${cmd.help.name}, args: ${args}, level: ${level}`
  );
  cmd.run(client, message, args, level);
};
