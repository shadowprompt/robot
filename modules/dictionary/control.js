const main = require('./index');
const qs = require('querystring');

function generateSlackResult(resultJson, results) {
  results.forEach((result) => {
    let attachment = {
      color: "#3366FF",
      fields: [],
    };
    resultJson.attachments.push(attachment);
    result.lexicalEntries.forEach((lexicalEntry) => {
      attachment.fields.push({
        title: lexicalEntry.lexicalCategory,
        value: (lexicalEntry.pronunciations || []).map(item => `${(item.dialects || []).join(' ')} -> ${item.phoneticSpelling}`).join(','),
        short: true,
      });
      lexicalEntry.entries && lexicalEntry.entries.forEach(entry => {
        entry.senses && entry.senses.forEach(sense => {
          let att = {
            title: 'Definition',
            text: (sense.definitions || []).join(','),
            color: "#66C947",
            fields: [],
          };
          sense.examples && sense.examples.forEach(example => {
            att.fields.push({
              title: 'Example',
              value: example.text,
              short: true,
            });
          });
          resultJson.attachments.push(att);
        });
      });
    });
  });
  const lastAttachment = resultJson.attachments[resultJson.attachments.length - 1];
  lastAttachment.footer = 'from Dictionary Api';
  lastAttachment.color = '#FF9333';
  lastAttachment.ts = Date.now();
  lastAttachment.callback_id = 'word_remembered';
  lastAttachment.actions = [{
      "name": "game",
      "text": "Remembered",
      "type": "button",
      "value": "1",
      "style": "primary"
    },
    {
      "name": "game",
      "text": "Not...",
      "type": "button",
      "value": "0",
      "style": "danger"
    },
    {
      "name": "game",
      "text": "I don't know .",
      "type": "button",
      "value": "-1",
      "style": "danger",
      "confirm": {
        "title": "Are you sure?",
        "text": "Wouldn't you prefer to give up?",
        "ok_text": "Yes",
        "dismiss_text": "No"
      }
    }
  ];
}

module.exports = {
  discord: (msg) => (word) => main(word).then(res => {
    const fields = [];
    const resultJson = {
      embed: {
        title: word,
        fields,
      }
    };
    if (res.status === 200) {
      const {
        results
      } = res.data;
      results.forEach((result) => {
        result.lexicalEntries.forEach((lexicalEntry) => {
          fields.push({
            name: lexicalEntry.lexicalCategory,
            value: lexicalEntry.pronunciations ? lexicalEntry.pronunciations.map(item => `${(item.dialects || []).join(' ')} -> ${item.phoneticSpelling}`).join(',') : 'same pronunciations',
          });
          lexicalEntry.entries && lexicalEntry.entries.forEach(entry => {
            entry.senses && entry.senses.forEach(sense => {
              sense.examples && sense.examples.forEach(example => {
                fields.push({
                  name: 'Example',
                  value: example.text,
                  inline: true,
                });
              });
            });
          });
        });
      });
      console.log('resultJson.embed ', resultJson.embed);
      msg.channel.send(resultJson);
    } else {
      msg.reply('something strange');
    }
  }).catch(err => {
    console.log('err ', err.message);
    msg.reply('something went wrong');
  }),
  slack: (msg) => (word) => main(word).then(res => {
    const resultJson = {
      text: word,
      attachments: []
    };

    if (res.status === 200) {
      const {
        results
      } = res.data;
      generateSlackResult(resultJson, results);
      console.log('resultJson success');
      msg.send(resultJson);
    } else {
      msg.send('something strange');
    }
  }).catch(err => {
    console.log('err ', err.message);
    msg.send('something went wrong');
  }),
  slack2: (msg) => (word) => main(word).then(res => {
    const resultJson = {
      text: word,
      "channel": "C6U247F26",
      attachments: []
    };

    if (res.status === 200) {
      const {
        results
      } = res.data;
      generateSlackResult(resultJson, results);
      console.log('resultJson2 success');
      msg.write(JSON.stringify(resultJson));
      msg.end();
    } else {
      msg.write('something strange');
      msg.end();
    }
  }).catch(err => {
    console.log('err2 ', err);
    msg.write('something went wrong');
    msg.end();
  }),
};