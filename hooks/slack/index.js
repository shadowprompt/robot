const axios = require('axios');
const url = process.env.SLACK_WEBHOOK_URL;

module.exports = (msg) => {
  axios.post(url, {
      text: msg,
  }).then(res => {
    // console.log('hook success')
  })
  .catch(err => {
    console.log('hook error ', err)
  });
};