const axios = require('axios');

const app_id = process.env.OXFORD_DICTIONARIES_APP_ID;
const app_key = process.env.OXFORD_DICTIONARIES_APP_KEY;
const BASE_URL = process.env.OXFORD_DICTIONARIES_BASE_URL;

module.exports = (word) => {
  console.log('oxford translate ', word);
  const headers = {
    app_id,
    app_key,
  };
  const url = `${BASE_URL}/entries/en/${word}`;
  return axios.get(url, {headers});
};
