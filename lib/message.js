const en = {
  bold: '\u001b[1m',
  normal: '\u001b[0m',
  usage: '[options] [config-file (default: app-config.json) ]',
  register_app: 'Register the application and get client_id & client_secret.',
  get_access_token: 'Get access token.',
  all: 'Do "--regist-app" "--get-code" and "--get-access-token".',
  only_one_config: 'Only one setting file can be specified.',
  press_authorize: 'Open the above URL on the browser. Please press "AUTHORIZE".',
  open_url_and_press_authorize: 'Please open the above URL on the browser and press "AUTHORIZE".',
  input_code: 'Please enter the code displayed on the browser.',
  cantSaveFile: (file) => "Can't save _FILE_.".replace('_FILE_', file),
  cantLoadFile: (file) => "Can't load _FILE_.".replace('_FILE_', file),
  savedToFile: (file) => 'Information has saved in the _FILE_ file.'.replace('_FILE_', file),
  end: 'End'
};

const ja = {
  usage: '[オプション] [設定ファイル名 (ディフォルト: app-config.json) ]',
  register_app: 'アプリを登録して、client_id と client_secret を受け取ります。',
  get_access_token: 'アクセストークンを取得します。',
  all: '"--regist-app" "--get-code" "--get-access-token" を順次実行します。',
  only_one_config: '設定ファイルを複数指定することはできません。',
  press_authorize: '上記のURLをブラウザで開きましたアカウントのアクセスを承認してください。',
  open_url_and_press_authorize: 'ブラウザを自動的に開くことができませんでした。上記の URL をブラウザで開きアカウントのアクセスを承認してください。',
  input_code: '承認後にブラウザに表示された許可コードを入力してください。',
  cantSaveFile: (file) => '_FILE_ を保存できません'.replace('_FILE_', file),
  cantLoadFile: (file) => '_FILE_ を読み込めません'.replace('_FILE_', file),
  savedToFile: (file) => '情報は _FILE_ に保存しました。'.replace('_FILE_', file),
  end: '終了'
};

const jaRex = /ja_JP\.UTF-?8/i;

if (process.env.LANG && jaRex.test(process.env.LANG)) {
  module.exports = Object.assign(en,ja);
} else {
  module.exports = en;
}
