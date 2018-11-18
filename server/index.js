const express = require( "express" );
const bodyParser = require('body-parser');

// create an express object: a Web server
const app = express();
const dictionaryCtrl = require('../modules/dictionary/control');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get( "/", function( request, response ) {
  response.send( "<h1>Hello :)</h1><p><a href='/about'>About</a></p>" ); 
});

app.post('/slackEvent', (req, res) => {
  const {challenge, type, subtype} = req.body;
  console.log('/slackEvent', type, subtype);
  res.send({challenge})
});

app.post('/slackInteract', (req, res) => {
  console.log('/slackInteract', req.body);
  res.send({
    "response_type": "ephemeral",
    "replace_original": false,
    "text": "I got it"
  }); // 避免原有的内容消失
});

app.post('/slackMsgMenu', (req, res) => {
  console.log('/slackMsgMenu', req.body);
  res.send('slackMsgMenu');
});


app.post('/translate', (req, res) => {
  const {text, response_url} = req.body;
  dictionaryCtrl.slack(res.send.bind(res))(text);
});

app.get( "*", function( request, response ) {
  response.send( "no special" );
});


const port = process.env.PORT;
app.listen( port );
console.log('express server on ' + port);
module.exports = app;