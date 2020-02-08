const axios = require("axios");
module.exports = (words) => axios.post('https://www.daozhao.com.cn/dict', {
  word: words,
}).then(res => {
  console.log('store success')
}).catch(err => {
  console.log('store error ', err)
});