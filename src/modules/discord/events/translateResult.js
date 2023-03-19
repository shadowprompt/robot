const slackWebHookAction = require("../../../actions/slackWebHook");
const utils = require("../../../utils");

module.exports = (client, data) => {
    const resultJson = utils.generateSlackResult(data);
    slackWebHookAction(resultJson);
};