const router = require('express').Router();
router.post('/event', (req, res) => {
  const {
    challenge,
    type,
    subtype,
    event
  } = req.body;
  // verify the url
  if (type === 'url_verification') {
    console.log('/slack/event', challenge, type);
    res.send({
      challenge
    })
  } else {
    console.log('/slack/event', type, event && event.type);
    console.log(JSON.stringify(req.body));
    res.send({
      "text": "Got it!",
      "attachments": [{
        "text": "Have a nice day"
      }]
    });
  }
});

router.post('/interact', (req, res) => {
  const {
    payload
  } = req.body;
  const {
    actions: [{
      value
    }]
  } = JSON.parse(payload); // payload is String
  console.log('/slack/interact', req.body);
  res.send({
    "response_type": "ephemeral",
    "replace_original": false,
    "text": `I got it ${value}`
  }); // 避免原有的内容消失
});

router.post('/msgMenu', (req, res) => {
  console.log('/slack/msgMenu', req.body);
  res.send('slack/msgMenu');
});
module.exports = router;