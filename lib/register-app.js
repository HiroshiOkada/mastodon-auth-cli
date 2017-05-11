// registerApp

const request = require('request');
const url = require('url');

const msg = require('./message');

const prompt = require('inquirer').createPromptModule();
const questions = [
  {
    name: 'host_name',
    message: 'Mastodon インスタンスのホスト名を入力',
    default: 'mastodon.example.jp',
    validate: (input) => /^(?:[A-Za-z0-9][A-Za-z0-9-]{0,61}\.)[A-Za-z][A-Za-z0-9-]{1,61}/.test(input),
    filter: (input) => input.trim()
  },
  {
    name: 'client_name',
    message: 'クライアントアプリ名を入力',
    default: 'app-' + Date.now(),
    validate: (input) => input.length > 1,
    filter: (input) => input.trim()
  },
  {
    name: 'website',
    message: 'アプリのホームページを入力(省略可能)',
    default: '',
    filter: (input) => /^(http|https):\/\//.test(input) ? input.trim() : ''
  },

];

function callHost(data) {

  return new Promise((resolve, reject) => {

    const uri = url.format({
      protocol: 'https',
      host: data.host_name,
      pathname: '/api/v1/apps',
    });

    const jsonData = {
      client_name: data.client_name,
      redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow'
    };

    if (data.website && data.website !== '') {
      jsonData.website = data.website;
    }

    request(
      {
        method: 'POST',
        uri: uri,
        headers: { "Content-type": "application/json" },
        json:  jsonData
      },
      (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
  });
}

module.exports = (configFile) => {
  const config = require('./config')(configFile);
  console.log('\n## ' + msg.register_app);

  return config.load()
    .then((data) => {
      questions.forEach((q) => q.default = data[q.name] || q.default);
      return prompt(questions);
    }).then((answer) => {

      Object.assign(config.data, answer);
      return config.save();
    }).then(callHost)
    .then((result) => {
      if (!result.client_id) {
        console.log('client_id が取得できません。' + JSON.stringify(result));
        process.exit(1);
      }
      config.data.client_id = result.client_id;
      config.data.client_secret = result.client_secret;
      console.log('client_id: ' +  msg.bold + config.data.client_id + msg.normal);
      console.log('client_secret: ' + msg.bold + config.data.client_secret + msg.normal);
      return config.save();
    }).then(() => {
      return (configFile);
    }).catch((err) => {
      if (err.code === "ENOTFOUND") {
        console.log('インスタンス(ホスト)が見つかりません。' + err.hostname);
        process.exit(1);
      } else if (err.code === "ECONNREFUSED") {
        console.log('インスタンス(ホスト)に接続を拒否されました。');
        process.exit(1);
      }
    });
};

