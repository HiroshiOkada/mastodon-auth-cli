const expect = require('chai').expect;

const fs = require('fs');
const os = require('os');
const path = require('path');

const TEST_CONFIG_FILE_PATH = path.join(os.tmpdir(), 'config-' + Date.now() +  '.json');

describe('conifg のテスト', () => {

  describe('関数とキーが定義されているかのテスト', () =>  {
    let config = require('../lib/config')(TEST_CONFIG_FILE_PATH);

    it('関数の存在チェック', () =>  {
      expect(config.load).to.be.a('function');
      expect(config.save).to.be.a('function');
    });
    it('キーの存在チェック', () =>  {
      expect(config.KEYS).to.eql(["host_name", "client_name", "client_id", "client_secret", "code", "access_token", "refresh_token", "website"]);
    });
  });

  describe('ファイルが存在しない状態からのテスト', () =>  {
    let config = null;

    beforeEach((done) =>  {
      config = require('../lib/config')(TEST_CONFIG_FILE_PATH);
      fs.unlink(TEST_CONFIG_FILE_PATH, (err) =>  {
        if (!err || err.code === 'ENOENT') {
          done();
        } else {
          throw(err);
        }
      });
    });

    it('ファイルが存在しない状態で読み込みを実行すると、元のデータを返す', () =>  {
      config.data = {a:1};
      return config.load().then((data) => {
        expect(data).to.eql({a:1});
      });
    });

    it('定義されているキーを書き込むと保存される', () =>  {
      config.data.client_id = 'abcde';
      let  config2;

      return config.save().then((data) => {
        expect(data).to.eql({client_id:'abcde'});
      }).then(() => {
        config2 = require('../lib/config')(TEST_CONFIG_FILE_PATH);
        return config2.load();
      }).then((data) => {
        expect(data).to.eql({client_id:'abcde'});
      });
    });

    it('定義されていないキーは保存されない', () =>  {
      config.data.client_id2 = 'abcde';
      let  config2;

      return config.save().then((data) => {
        expect(data).to.eql({client_id2:'abcde'});
      }).then(() => {
        config2 = require('../lib/config')(TEST_CONFIG_FILE_PATH);
        return config2.load();
      }).then((data) => {
        expect(data).to.eql({});
      });
    });
  });

  describe('ファイルが存在する状態からのテスト', () =>  {
    let config = null;
    let config2 = null;
    let init_data = null;

    beforeEach(() =>  {
      init_data = {host_name:'example.jp', client_name:'taro', client_id:'abc', client_secret:'def', code:'hij', access_token:'klm'};
      fs.writeFileSync(TEST_CONFIG_FILE_PATH, JSON.stringify(init_data), 'utf8');
      config = require('../lib/config')(TEST_CONFIG_FILE_PATH);
      config2 = require('../lib/config')(TEST_CONFIG_FILE_PATH);
    });

    after((done) =>  {
      fs.unlink(TEST_CONFIG_FILE_PATH, (err) =>  {
        if (!err || err.code === 'ENOENT') {
          done();
        } else {
          throw(err);
        }
      });
    });

    it('データが読み込める', () =>  {
      return config.load().then((data) => {
        expect(data).to.eql(init_data);
      });
    });

    it('定義されているキーを書き込むと保存される', () =>  {
      let exepect_data = {host_name:'example.jp', client_name:'taro', client_id:'abcde', client_secret:'def', code:'hij', access_token:'klm'};

      return config.load().then((data) => {
        expect(data).to.eql(init_data);
        config.data.client_id = 'abcde';
        return config.save();
      }).then(() => {
        return config2.load();
      }).then((data) => {
        expect(data).to.eql(exepect_data);
      });
    });

    it('定義されていないキーは保存されない', () =>  {
      return config.load().then((data) => {
        expect(data).to.eql(init_data);
        config.data.client_id2 = 'okokok';
        return config.save();
      }).then((data) => {
        expect(data.client_id2).to.eql('okokok');
        return config2.load();
      }).then((data) => {
        expect(data).to.eql(init_data);
      });
    });
  });
});
