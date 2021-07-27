const url = require('url');
const crypto = require("crypto");

function fullURL(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
  });
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

module.exports = {
  randomTokenString,
  fullURL,
};