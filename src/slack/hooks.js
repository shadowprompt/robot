const slackWebHookAction = require("../actions/slackWebHook");
const daozhaoTranslateAction = require("../actions/daozhaoTranslate");
const daozhaoDictAction = require("../actions/daozhaoDict");
/**
 * @param words array
 */
module.exports = (words) => {
  console.log('hook func', words);
  const [firstWord] = words;
  if(!firstWord) return;
  // call
  slackWebHookAction(firstWord);
  daozhaoTranslateAction(firstWord);
  daozhaoDictAction(firstWord);
};