# mastodon-auth-cli

CLI program to get access token for [Mastodon](https://github.com/tootsuite/mastodon/) API.

## Installing

```
npm install @toycode/mastodon-auth-cli
```

## Usage

In the following examples [configuration-file] can be omitted, if omitted, the access token etc. are saved in file: `app-config.json`.

register app and get access token
```sh
mastodon-auth [configuration-file]
```

register app
```sh
mastodon-auth -a [configuration-file]
```

get access token
```sh
mastodon-auth -t [configuration-file]
```

show Usage
```sh
mastodon-auth -h
```

## LICENSE

MIT

---

[マストドン](https://github.com/tootsuite/mastodon/) API を叩くための
アクセストークンを取得するコマンドラインプログラム

## インストール

```
npm install @toycode/mastodon-auth-cli
```

## 使い方

<small>以下の例で [設定ファイル名] は省略可能です、省略した場合、アクセストークン等は `app-config.json` に保存されます。</small>


アプリを登録しアクセストークンを得る
```sh
mastodon-auth [設定ファイル名]
```

アプリを登録する
```sh
mastodon-auth -a [設定ファイル名]
```

アクセストークンを得る
```sh
mastodon-auth -t [設定ファイル名]
```

使い方を表示
```sh
mastodon-auth -h
```
## ライセンス

MIT

