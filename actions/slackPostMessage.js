const https = require('https');
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
module.exports = (result) => new Promise(((resolve, reject) => {
  const externalRequest = https.request(requestOptions, (externalResponse) => {
    externalResponse.on('end', () => {
      console.log('externalResponse end');
      resolve();
    });

    externalResponse.on('data', (data) => {
      console.log('externalResponse data');
    });

    externalResponse.on('error', (err) => {
      console.log('externalResponse error', err);
      reject('externalResponse error');
    });
  });

  externalRequest.on('error', (err) => {
    console.log('externalRequest error ', err);
    reject('externalRequest error');
  });
  externalRequest.write(JSON.stringify(result));
  externalRequest.end();
}));
