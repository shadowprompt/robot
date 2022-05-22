const express = require("express");
const slackRouters = require('./routers/slack');
const translateRouters = require('./routers/translate');
const bodyParser = require('body-parser');

// create an express object: a Web server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/slack', slackRouters);
app.use('/translate', translateRouters);

app.get("/", function (request, response) {
  response.send("<h1>Hello :)</h1><p><a href='/about'>About</a></p>");
});

app.get("*", function (request, response) {
  console.log('* url', request.url);
  if (request.url.toLowerCase().includes('auth')) {
    console.log(`auth=${request.url}:${request.body}`);
    response.json({
      status: 'success'
    });
  } else {
    response.send("no special");
  }
});

module.exports = app;
