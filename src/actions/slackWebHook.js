const axios = require('axios');
const SLACK_HOOK_URL = process.env.SLACK_WEBHOOK_URL;

module.exports = (payload) => axios.post(SLACK_HOOK_URL, payload).then(() => {
  console.log('slack hook success')
}).catch(err => {
  console.log('slack hook error', err.message)
});
