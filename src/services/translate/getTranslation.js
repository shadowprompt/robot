const oxfordTranslate = require("./oxford");
const yandexTranslate = require("./yandex");
const dictionaryApiTranslate = require("./dictionaryapi");
module.exports = (words) => {
  console.log('words -- ', words);
  const wordText = Array.isArray(words) ? words.join(' ') : words;
  return dictionaryApiTranslate(wordText);
};