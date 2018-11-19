const main = require('./index');
module.exports = {
  discord: (replyFn) => (word) => main(word).then(res => {
    if(res.status === 200){
      const {results} = res.data;
      results.forEach((result, index) => {
        replyFn(index, '+');
        result.lexicalEntries.forEach((lexicalEntry, index2) => {
          replyFn(index2, '+');
          replyFn(lexicalEntry, 'lexicalCategory');
          replyFn(lexicalEntry.pronunciations, 'phoneticSpelling');
          lexicalEntry.entries && lexicalEntry.entries.forEach(entry => {
            entry.senses && entry.senses.forEach(sense => {
              replyFn(sense, 'definitions');
              sense.examples && sense.examples.forEach(example => {
                replyFn(example, 'text', 'Example');
              });
            });
          });
          replyFn(index, '=');
        });
        replyFn(index, '=');
      });
    }else{
      replyFn('something strange');
    }
  }).catch(err => {
    console.log('err ', err.message);
    replyFn('something went wrong');
  }),
  slack: (replyFn) =>(word) => main(word).then(res => {
    const resultJson = {
      text: word,
      attachments: []
    };

    if(res.status === 200){
      const {results} = res.data;
      results.forEach((result) => {
        let attachment = {
          color: "#3366FF",
          fields: [],
        };
        resultJson.attachments.push(attachment);
        result.lexicalEntries.forEach((lexicalEntry) => {
          attachment.fields.push({
            title: lexicalEntry.lexicalCategory,
            value: (lexicalEntry.pronunciations || []).map(item => `${(item.dialects || []).join(' ')} -> ${item.phoneticSpelling}`)  .join(','),
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
      const lastAttachment = resultJson.attachments[resultJson.attachments.length-1];
      lastAttachment.footer = 'from Dictionary Api';
      lastAttachment.color = '#FF9333';
      lastAttachment.ts = Date.now();
      lastAttachment.callback_id = 'word_remembered';
      lastAttachment.actions = [ {
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
      }];
      console.log('resultJson ', resultJson);
      replyFn(resultJson);
    }else{
      replyFn('something strange');
    }
  }).catch(err => {
    console.log('err ', err.message);
    replyFn('something went wrong');
  }),
};