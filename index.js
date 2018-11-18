require('env2')('./.env')

const Discord = require('discord.js');
const dictionaryCtrl = require('./modules/dictionary/control');
const translateCtrl = require('./modules/translate/control');
const slackHook = require('./hooks/slack');
const utils = require('./utils');

const server = require('./server'); // load express server

const client = new Discord.Client()
client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
})

const replyHook = (word) => {
  slackHook(word); // alway call the slack hook
  return (msg)=> {
    return msg.reply.bind(msg); // keep 'this' in msg
  }
};

client.on('message', msg => {
  replyHook(msg.toString().replace(/^<@[0-9]+>,/g, ''));
  if(/^t\s/.test(msg)){
    const word = msg.toString().replace(/^t\s/, '');
    const hook = replyHook(word)(msg);
    const replyText = utils.recurseCb(hook);

    const isSingleWord = word.split(' ').length === 1;
    if(isSingleWord){
      dictionaryCtrl.discord(replyText)(word);
    }else{
      translateCtrl(replyText)(word);
    }
  }
})

const token = process.env.BOT_TOKEN;
client.login(token)
