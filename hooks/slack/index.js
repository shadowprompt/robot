const axios = require('axios');
const url = process.env.SLACK_WEBHOOK_URL;

module.exports = (msg) => {
  console.log('msg-->', msg);
  const args = msg.split(/\s+/g);
  const word = args[1];
  if(!word) return;
  console.log('word ', word);
  axios.post(url, {
      text: word,
  }).then(res => {
    console.log('hook success')
  })
  .catch(err => {
    console.log('hook error ', err)
  });

  axios.post('http://127.0.0.1:7000/translate', {
    text: word,
  }).then(res => {
    console.log('sendback success')
  })
  .catch(err => {
    console.log('sendback error ', err)
  });
};