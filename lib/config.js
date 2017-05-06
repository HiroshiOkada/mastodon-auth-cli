const fs = require('fs');
const msg = require('./message');
const KEYS = ["host_name", "client_name", "client_id", "client_secret", "code", "access_token", "refresh_token", "website"];

function saveJson(filePath, data) {
  const text = JSON.stringify(filterByKeys(data), null, 2);
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, 'utf8', (err) => {
      if (err) {
        reject(new Error(msg.cantSaveFile(filePath)));
      }
      resolve(data);
    });
  });
}

function loadJson(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, text) => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(data);
        } else {
          reject(new Error(msg.cantLoadFile(filePath)));
        }
      } else {
        Object.assign(data, JSON.parse(text));
        resolve(data);
      }
    });
  });
}

function filterByKeys(data) {
  const ret = {};
  KEYS.forEach((key) => {
    if (typeof data[key] !== 'undefined') {
      ret[key] = data[key];
    }
  });
  return ret;
}

module.exports = (filePath) => {
  return {
    load() {
      return loadJson(filePath, this.data);
    },
    save() {
      return saveJson(filePath, this.data);
    },
    KEYS: KEYS,
    data: {}
  };
};

