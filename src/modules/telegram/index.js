const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5329428908:AAGYRRTXy79EGW2h3kPoImg7pqNam5iVe3o';

const init = () => {
  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

// Listen for any kind of message. There are different kinds of
// messages.
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    // bot.sendMessage(chatId, 'Received your message');
    console.log('message:', moment(msg.date * 1000).format('YYYY-MM-DD HH:mm:ss'), msg.text);
    bot.sendMessage(chatId, "received: " + msg.text);
  });
}

module.exports = init;