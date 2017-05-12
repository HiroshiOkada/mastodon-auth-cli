#!/usr/bin/env node

"use strict";

const msg = require('../lib/message');
const registerApp = require('../lib/register-app');
const getAccessToken = require('../lib/get-access-token');
const prog = require('commander');

let configFile = 'app-config.json';

prog
  .usage(msg.usage)
  .option('-a --register-app', msg.register_app)
  .option('-t --get-access-token', msg.get_access_token)
  .parse(process.argv);

// first no option parameter is config file name
if (prog.args.length === 1) {
  configFile = prog.args[0];
} else if (prog.args.length !== 0) {
  console.error(msg.only_one_config);
  process.exit(1);
}

// If no options then do regsist-app & get-access-token
if (process.argv.slice(2).length == prog.args.length) {
  registerApp(configFile)
    .then(getAccessToken)
    .then(() => console.log(msg.savedToFile(configFile)));
}

if (prog.registerApp) {
  registerApp(configFile)
    .then(() => console.log(msg.savedToFile(configFile)));
}

if (prog.getAccessToken) {
  getAccessToken(configFile)
    .then(() => console.log(msg.savedToFile(configFile)));
}

