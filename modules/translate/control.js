const main = require('./index');

module.exports = (msg) => (word) => main(word).then(res => {
  if(res.status === 200){
    const {text:[result]} = res.data;
    msg.reply(word, result);
  }else{
    msg.reply('something strange');
  }
}).catch(err => {
  console.log('err ', err.message);
  msg.reply('something went wrong');
});