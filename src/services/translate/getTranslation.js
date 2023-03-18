const oxfordTranslate = require("./oxford");
const yandexTranslate = require("./yandex");
const dictionaryApiTranslate = require("./dictionaryapi");
const translateMap = {
  oxford: oxfordTranslate,
  yandex: yandexTranslate,
  dictionaryapi: dictionaryApiTranslate,
};
module.exports = (words) => {
  console.log('words -- ', words);
  const wordText = Array.isArray(words) ? words.join(' ') : words;
  const env = process.env.DICTIONARY_SERVICE;
  const func = translateMap[env] || translateMap['dictionary'];
  console.log('getTranslation ', env);
  return func(wordText);
};