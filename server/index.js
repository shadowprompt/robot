const express = require("express");
const http = require('http');
const https = require('https');
const qs = require('querystring');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// create an express object: a Web server
const app = express();
const dictionaryCtrl = require('../modules/dictionary/control');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/", function (request, response) {
  response.send("<h1>Hello :)</h1><p><a href='/about'>About</a></p>");
});

app.post('/slackEvent', (req, res) => {
  const {
    challenge,
    type,
    subtype,
    event
  } = req.body;
  // verify the url
  if (type === 'url_verification') {
    console.log('/slackEvent', challenge, type);
    res.send({
      challenge
    })
  } else {
    console.log('/slackEvent', type, event.type);
    console.log(JSON.stringify(req.body));
    res.send({
      "text": "Got it!",
      "attachments": [{
        "text": "Have a nice day"
      }]
    });
  }
});

app.post('/slackInteract', (req, res) => {
  const {
    payload
  } = req.body;
  const {
    actions: [{
      value
    }]
  } = JSON.parse(payload); // payload is String
  console.log('/slackInteract', req.body);
  res.send({
    "response_type": "ephemeral",
    "replace_original": false,
    "text": `I got it ${value}`
  }); // 避免原有的内容消失
});

app.post('/slackMsgMenu', (req, res) => {
  console.log('/slackMsgMenu', req.body);
  res.send('slackMsgMenu');
});


app.post('/translate', (req, res) => {
  const {
    text,
    response_url
  } = req.body;
  console.log('translate response_url', response_url);
  if (response_url && response_url.includes('hooks.slack.com')) {
    dictionaryCtrl.slack(res)(text);
    // }else if(response_url.includes('www.daozhao.com.cn')){
  } else {
    const requestOptions = {
      protocol: 'https:',
      hostname: 'slack.com', //url or ip address
      path: '/api/chat.postMessage',
      method: 'POST', //HTTP Method
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
      },
    };

    const externalRequest = https.request(requestOptions, (externalResponse) => {
      externalResponse.on('end', () => {
        console.log('externalResponse end');
        res.send({
          postMessage: 'success'
        });
      });

      externalResponse.on('data', () => {
        console.log('externalResponse data');
      });
    });

    externalRequest.on('error', (err) => {
      console.log('err ', err);
    });
    dictionaryCtrl.slack2(externalRequest)(text);
  }
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

// 不支持mysql的sha2验证模式
const sequelize = new Sequelize('discord_db', 'root', '123456', {
  dialect: 'mysql',
  host: "localhost",
  port: 13306,
});
const User = sequelize.define('user', {
  userName: {
    type: Sequelize.STRING, // 指定值的类型
    field: 'user_name' // 指定存储在表中的键名称
  },
  // 没有指定 field，表中键名称则与对象键名相同，为 email
  email: {
    type: Sequelize.STRING
  }
}, {
  // 如果为 true 则表的名称和 model 相同，即 user
  // 为 false MySQL创建的表名称会是复数 users
  // 如果指定的表名称本就是复数形式则不变
  freezeTableName: false
});



const port = process.env.PORT || 4000;
app.listen(port);
console.log('express server on ' + port);
module.exports = app;