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
  if (response_url && response_url.includes('hooks.slack.com')) {
    getTranslation([text]).then(response => {
      const resultJson = utils.generateSlackResult(response.data);
      res.send(resultJson);
    }).catch(err => {
      console.log('slack getTranslation error', err.message)
      res.send('getTranslation error');
    });
  } else {
    getTranslation([text]).then(response => {
      const resultJson = utils.generateSlackResult(response.data, true);
      slackPostMessageAction(resultJson).then(() => {
        res.send({
          postMessage: 'success'
        });
      })
    }).catch(err => {
      console.log('slack getTranslation external error', err.message)
      res.send('getTranslation external error')
    });
  }
});

module.exports = router;
