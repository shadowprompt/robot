const axios = require('axios');

const api_key = process.env.YANDEX_API_KEY;
const BASE_URL = 'https://translate.yandex.net';

module.exports = (word) => {
  const params = {
    text: word,
  };
  const url = `${BASE_URL}/api/v1.5/tr.json/translate?lang=en-zh&key=${api_key}`;
  return axios.get(url, { params });
};