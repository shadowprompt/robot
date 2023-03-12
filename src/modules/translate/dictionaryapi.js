const axios = require('axios');

const BASE_URL = process.env.DICTIONARYAPI_BASE_URL;

module.exports = (word) => {
    console.log('dictionary api translate ', word);
    const url = `${BASE_URL}/entries/en/${word}`;
    return axios.get(url);
};
