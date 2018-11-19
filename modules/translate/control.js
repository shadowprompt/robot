const main = require('./index');

module.exports = (replyFn) => (word) => main(word).then(res => {
  if(res.status === 200){
    const {text:[result]} = res.data;
    replyFn(word, result);
  }else{
    replyFn('something strange');
  }
}).catch(err => {
  console.log('err ', err.message);
  replyFn('something went wrong');
});