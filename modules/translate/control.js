const main = require('./index');

module.exports = (replyText) => (word) => main(word).then(res => {
  if(res.status === 200){
    const {text:[result]} = res.data;
    replyText(word, result);
  }
}).catch(err => {
  console.log('err ', err);
});