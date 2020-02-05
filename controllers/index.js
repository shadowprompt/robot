const axios = require('axios');

const dictionaryCtrl = require('../modules/dictionary/control');
const translateCtrl = require('../modules/translate/control');

module.exports = (msg, command, args) => {
  if(command === 'help'){
    msg.channel.send({
      content: "This is the help description! \n Every time you type `!help`, I will be here!",
      embed: {
        fields: [{
          name: '!t love',
          value: 'You will get the explanation of love from dictionary. '
        }]
      }
    })
  }else if(command === 't'){
    const isSingleWord = args.length === 1;
    if(isSingleWord){
      dictionaryCtrl.discord(msg)(args.join(' '));
      console.log('存储 -> ', args.join(' '));
      axios.post('http://127.0.0.1:5050/dict', {
        word: args.join(' '),
      }).then(res => {
        console.log('store success')
      }).catch(err => {
        console.log('store error ', err)
      });
    }else{
      translateCtrl(msg)(args.join(' '));
    }
  }
}