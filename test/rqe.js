const {run} = require('@@vm-guard');

module.exports = {
  test: run('exports.c = 1+1'),
  a: 22
};