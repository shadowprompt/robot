const oxfordTranslate = require("./oxford");
const yandexTranslate = require("./yandex");
module.exports = (words) => {
  console.log('words -- ', words);
  const wordText = Array.isArray(words) ? words.join(' ') : words;
  return oxfordTranslate(wordText);
};