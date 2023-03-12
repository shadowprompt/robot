const worker_threads = require("worker_threads");

function addSlackAction(result) {
  const lastAttachment = result.attachments[result.attachments.length - 1];
  lastAttachment.footer = "from Dictionary Api";
  lastAttachment.color = "#FF9333";
  lastAttachment.ts = Date.now();
  lastAttachment.callback_id = "word_remembered";
  lastAttachment.actions = [
    {
      name: "game",
      text: "Remembered",
      type: "button",
      value: "1",
      style: "primary"
    },
    {
      name: "game",
      text: "Not...",
      type: "button",
      value: "0",
      style: "danger"
    },
    {
      name: "game",
      text: "I don't know .",
      type: "button",
      value: "-1",
      style: "danger",
      confirm: {
        title: "Are you sure?",
        text: "Wouldn't you prefer to give up?",
        ok_text: "Yes",
        dismiss_text: "No"
      }
    }
  ];
  return result;
}

module.exports = {
  recurseCb: function getInfo(msg){
    return function(item, name, alias ){
      const type = Object.prototype.toString.call(item);
      const cb = msg.reply;
      switch(type){
        case '[object String]':
          cb(`${item}: ${name}`);
          break;
        case '[object Number]':
          cb(name.repeat(6));
          // cb(`${' '.repeat(item)}${item} ---`);
          break;
        case '[object Object]':
          if(Object.prototype.toString.call(item[name]) === '[object Array]'){
            cb(`${alias || name}: ${item[name][0]}`);
          }else{
            cb(`${alias || name}: ${item[name]}`);
          }
          break;
        case '[object Array]':
          item.forEach((it => getInfo(cb)(it, name, alias)));
          break;
        default:
          break
      }
    } 
  },
  generateSlackResult: (data, isExternal = false) => {
    const results = data || [];
    const [first = {}] = results;

    const attachments = [];
    const resultJson = {
      text: first.word,
      attachments,
    };

    if (isExternal) {
      resultJson.channel = process.env.SLACK_MESSAGE_CHANNEL;
    }
    results.forEach(result => {
      const attachment = {
        color: "#3366FF",
        fields: []
      };
      attachments.push(attachment);
      // 读音
      const phonetics = result.phonetics || [];
      phonetics.forEach(phonetic =>  {
        attachment.fields.push({
          title: phonetic.text,
          value: phonetic.audio || '',
        });
      });
      // 语义及其示例
      const meanings = result.meanings || [];
      meanings.forEach(meaning =>  {

        const partOfSpeech = meaning.partOfSpeech; // 词性
        const definitions = meaning.definitions || [];

        attachments.push({
          color: "#ff1010",
          fields: [{
            title: 'Definition & Example',
            value: partOfSpeech,
          }]
        });

        definitions.forEach(definition => {
          let att = {
            title: definition.definition,
            text: '',
            color: "#66C947",
            fields: [{
              title: definition.example ? 'Example' : '',
              value: definition.example,
            }],
          };
          attachments.push(att);
        });
      })
    })
    // 添加交互动作
    return addSlackAction(resultJson);
  },
  generateDiscordResult: (data) => {
    const results = data || [];
    const [first = {}] = results;

    const fields = [];
    const resultJson = {
      embed: {
        title: first.word,
        fields
      }
    };
    results.forEach(result => {
      // 读音
      const phonetics = result.phonetics || [];
      phonetics.forEach(phonetic => {
        fields.push({
          name: phonetic.text,
          value: phonetic.audio || 'same pronunciations',
        });
      });
      // 语义及其示例
      const meanings = result.meanings || [];
      meanings.forEach(meaning =>  {
        const partOfSpeech = meaning.partOfSpeech; // 词性
        const definitions = meaning.definitions || [];
        fields.push({
          name: partOfSpeech,
          value: '--',
        });

        definitions.forEach(definition => {
          fields.push({
            name: definition.definition,
            value: definition.example || '--',
            inline: true
          });
        });
      });
    });
    return resultJson;
  },
};