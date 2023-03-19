const router = require('express').Router();
const getTranslation = require("../../../services/translate/getTranslation");
const slackPostMessageAction = require("../../../actions/slackPostMessage");
const utils = require("../../../utils");

router.post('/', (req, res) => {
  const {
    text,
    response_url
  } = req.body;
  console.log('translate response_url', response_url, text);

  const isInternal = response_url && response_url.includes('hooks.slack.com');
  getTranslation([text]).then(response => {
    const resultJson = utils.generateSlackResult(response.data, !isInternal);

    if (isInternal) {
      // 直接回应slack服务器即可
      res.send(resultJson);
    } else {
      // 自行发送请求至slack服务器后响应请求方
      slackPostMessageAction(resultJson).then(() => {
        res.send({
          postMessage: 'success'
        });
      })
    }
  }).catch(err => {
    const responseText = `slack getTranslation isInternal=${isInternal} error:${err.message}`;
    console.log(responseText);
    res.send(responseText);
  });
});

module.exports = router;
