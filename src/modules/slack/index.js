const express = require("express");
const slackRouters = require('./routers/slack');
const translateRouters = require('./routers/translate');
const bodyParser = require('body-parser');

// create an express object: a Web slack
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(((req, res, next) => {
  const method = req.method || '';
  console.log('request:', method, req.url);
  console.log(`request: ${method} data ->`, method.toLowerCase() === 'post' ? req.body : req.query);
  next();
}))

app.use('/slack', slackRouters);
app.use('/translate', translateRouters);

app.get("/", function (request, response) {
  response.send("<h1>Hello :)</h1><p><a href='/about'>About</a></p>");
});

app.use("*", function (request, response) {
  console.log('* request default handler', request.url);
  if (request.url.toLowerCase().includes('auth')) {
    console.log(`auth=${request.url}:${request.body}`);
    response.json({
      status: 'success'
    });
  } else {
    response.send("no special");
  }
});

const init = () => {
  const port = process.env.PORT || 6060;
  app.listen(port, function (){
    console.log("slack server listening on " + port);
  });
};


module.exports = init;
