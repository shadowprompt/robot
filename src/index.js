const path = require("path");
const envPath = path.join(__dirname, "../.env");
require("env2")(envPath);
const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const telegram = require('./robots/telegram');

const server = require("./server"); // load express server

const initServer = () => {
  const port = process.env.PORT || 6060;
  server.listen(port, function (){
    console.log("express server on " + port);
  });
};

const client = new Discord.Client();

// Here we load the config file that contains our token and our prefix values.
client.config = require("./config.js");
// client.config.token contains the bot's token
// client.config.prefix contains the message prefix

// Require our logger
client.logger = require("./modules/Logger");

// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.
require("./modules/functions.js")(client);

// Aliases and commands are put in collections where they can be read from,
// catalogued, listed, etc.
client.commands = new Map();
client.aliases = new Map();
client.settings = new Map();
client.levelCache = {};

const initDiscordRobot = async () => {
  // Here we load **commands** into memory, as a collection, so they're accessible
  // here and everywhere else.
  // also set the aliases
  const cmdFiles = await readdir(path.join(__dirname, "./commands/"));
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    response && console.log(response);
  });

  // Then we load events, which will include our message and ready event.
  const evtFiles = await readdir(path.join(__dirname, "./events/"));
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Loading Event: ${eventName}`);
    const event = require(`./events/${file}`);
    // Bind the client to any event, before the existing arguments
    // provided by the discord.js event.
    // This line is awesome by the way. Just saying'.
    client.on(eventName, event.bind(null, client)); // bind the client as the 1st argument
  });

  // Generate a cache of client permissions for pretty perm names in commands.
  const permLevels = client.config.permLevels || [];
  permLevels.forEach(level => (client.levelCache[level.name] = level.level));

  // Here we login the client.
  return client.login(client.config.token);
  // End top-level async/await function.
};

const initTelegram = () => {
  telegram();
}

initDiscordRobot().then(() => {
  console.log('initial discord success -> ', );
}).catch(err => {
  console.log('initial discord failed -> ', err.message);
});
initServer();
// initTelegram();
