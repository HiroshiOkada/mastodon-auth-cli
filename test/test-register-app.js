const expect = require('chai').expect;
const rewire = require("rewire");
const registerApp = rewire('../lib/register-app');
const nock = require('nock');

describe('register-app のテスト', () => {

  it('関数の存在チェック', () =>  {
    expect(registerApp).to.be.a('function');
    expect(registerApp.__get__('callHost')).to.be.a('function');
  });

  it('callHost チェック', () =>  {
    const callHost = registerApp.__get__('callHost');
    const postData = {
      client_name: 'app-one',
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      scopes: 'read write follow',
      "website": "http://example.com"
    };
    const replyData =  {
      id: 42,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      client_id: '6dead94cea63ef5f47c1368ac53aee3db40bbc7741dde3910d92ae928e04c371',
      client_secret: 'c5b7799625c02aa5ddd1d49b1223a9a2371ef6ec76412e8167575f72e1ac9e7c'
    };
    const scope = nock('https://mastodon.expamle.com')
      .post('/api/v1/apps', postData)
      .reply(200, replyData);

    callHost({
      "host_name": "mastodon.example.com",
      "client_name": "app-one",
      "website": "http://example.com"
    }).then((result) => {
      expect(result).to.eql(replyData);
      expect(scope.isDone()).to.be.true;
    });
  });
});

