const slackHooks = require("../../slack/hooks");

module.exports = (client, words) => {
  slackHooks(words);
};