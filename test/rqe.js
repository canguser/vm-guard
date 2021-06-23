const { run } = require('../lib');

// function run(script, options) {
//   return NodeVM.code(script, './vm.js', options);
// }

run(`
d = require('@@vm-guard')
const {WebhookTrigger} = require('test-tako-connector-sdk/lib')
console.log(WebhookTrigger);
c = require("./t1");
// const util = require('util')

B = class extends c.A{
    async execute() {
        return undefined;
    }

    screening() {
        return 123;
    }
}

C = class {}

console.log(C.prototype.constructor === C);
console.log(C);

const a = new B();
console.log(a instanceof B)

exports.a = 100;
`, {
  timeout: 30000,
  globalAsync: true,
  noHardwareLimit: true,
  compatibleRequire: false,
  allowedVariables: ['util'],
  allowedModules: ['^test-tako-connector-sdk\/.*', '^\/tmp\/.connector\/dirs\/.*', 'node-fetch', '.*']
});

run('console.log(`???`)');
console.log('???')
//
// module.exports = {
//   // test: run('exports.c = 1+1'),
//   a: 22
// };