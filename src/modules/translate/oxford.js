const axios = require('axios');

const app_id = process.env['DICTIONARY_APP_ID'];
const app_key = process.env['DICTIONARY_APP_KEY'];
const BASE_URL = 'https://od-api.oxforddictionaries.com/api/v2';

module.exports = (word) => {
  console.log('oxford translate ', word);
  const headers = {
    app_id,
    app_key,
  };
  const url = `${BASE_URL}/entries/en/${word}`;
  return axios.get(url, {headers});
};