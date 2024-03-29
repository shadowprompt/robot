const axios = require('axios');

const api_key = process.env.YANDEX_TRANSLATE_API_KEY;
const BASE_URL = process.env.YANDEX_TRANSLATE_API_BASE_URL;

module.exports = (word) => {
  const params = {
    text: word,
  };
  const url = `${BASE_URL}/api/v1.5/tr.json/translate?lang=en-zh&key=${api_key}`;
  return axios.get(url, { params });
};
