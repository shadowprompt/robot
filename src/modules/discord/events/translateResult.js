const slackWebHookAction = require("../../../actions/slackWebHook");

module.exports = (client, result) => {
    slackWebHookAction(result);
};