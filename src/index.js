const path = require("path");
const envPath = path.join(__dirname, "../.env");
require("env2")(envPath);
const initDiscord = require('./modules/discord');
const initServer = require("./modules/slack");
const initTelegram = require('./modules/telegram');

initDiscord();
initServer();
initTelegram();
