// getAccessToken

const OAuth2 = require('oauth').OAuth2;
const opn = require('opn');

const BROWSER_WAIT = 2500;

const msg = require('./message');
const prompt = require('inquirer').createPromptModule();
const questions = [
  {
    name: 'code',
    message: msg.input_code,
    default: '',
    validate: (input) => input.length > 16,
    filter: (input) => input.trim()
  }
];

function getAccessToken(oauth, code) {
  return new Promise((resolve, reject) => {
    oauth.getOAuthAccessToken(code,
      {
        grant_type: 'authorization_code',
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      },
      (err, accessToken, refreshToken) => {
        if (err) {
          reject(err);
        }
        if (accessToken) {
          resolve({access_token: accessToken, refresh_token: refreshToken});
        }  else {
          reject( new Error("Can't get access_token"));
        }
      }
    );
  });
}

module.exports = (configFile) => {
  const config = require('./config')(configFile);
  let oauth;
  let url;

  console.log('\n## ' + msg.get_access_token);

  return config.load()
    .then((data) => {
      oauth = new OAuth2(
        data.client_id,
        data.client_secret,
        'https://' + data.host_name,
        null,
        '/oauth/token');

      url = oauth.getAuthorizeUrl({
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        scope: 'read write follow',
        response_type: 'code'});

      console.log('\n' + url + '\n');

      return opn(url, {wait: false});
    }).then(() => {
      return new Promise((resolve) => setTimeout(() => resolve('AUTO'), BROWSER_WAIT));
    }).catch((err) => {
      console.log(err);
      return 'MANUAL';
    }).then((openMode) => {
      if (openMode === 'AUTO') {
        console.log(msg.press_authorize);
      } else {
        console.log(msg.open_url_and_press_authorize);
      }
      return prompt(questions);
    }).then((answer) => {
      return getAccessToken(oauth, answer.code);
    }).then((tokens) => {
      console.log('access_token:' + msg.bold + tokens.access_token + msg.normal);
      config.data.access_token = tokens.access_token;
      if (tokens.refresh_token) {
        console.log('refresh_token:' + msg.bold + tokens.refresh_token + msg.normal);
        config.data.refresh_token = tokens.refresh_token;
      }
    }).then(() => config.save());
};

