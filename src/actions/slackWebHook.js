const axios = require('axios');
const SLACK_HOOK_URL = process.env.SLACK_WEBHOOK_URL;

module.exports = (word) => axios.post(SLACK_HOOK_URL, {
  text: word,
}).then(() => {
  console.log('slack hook success')
}).catch(err => {
  console.log('slack hook error', err.message)
});
