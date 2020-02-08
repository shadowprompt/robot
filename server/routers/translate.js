const router = require('express').Router();
const getTranslation = require("../../modules/translate/getTranslation");
const slackPostMessageAction = require("../../actions/slackPostMessage");
const utils = require("../../utils");

router.post('/', (req, res) => {
  const {
    text,
    response_url
  } = req.body;
  console.log('translate response_url', response_url, text);
  if (response_url && response_url.includes('hooks.slack.com')) {
    getTranslation([text]).then(response => {
      const resultJson = utils.generateSlackResult(response.data);
      res.send(resultJson);
    });

  // }else if(response_url.includes('www.daozhao.com.cn')){
  } else {
    getTranslation([text]).then(response => {
      const resultJson = utils.generateSlackResult(response.data, true);
      slackPostMessageAction(resultJson).then(() => {
        res.send({
          postMessage: 'success'
        });
      })
    });
  }
});

module.exports = router;