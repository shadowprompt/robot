const axios = require('axios');
const TRANSLATE_URL = 'http://robot.daozhao.com.cn/translate';

module.exports = (word) => axios.post(TRANSLATE_URL, {
  text: word,
}).then(() => {
  console.log('translate sendBack success')
}).catch(err => {
  console.log('translate sendBack error ', err)
});
