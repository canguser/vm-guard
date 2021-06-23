exports.A = class {
  constructor() {
    this._functions = x=>x
    this._key = 'constructor';
  }
  setKey(key) {
    if(typeof(key) === "number") {
      this._key = key;
    }
  }
  call(x) {
    return this._functions[this._key](x);
  }
};