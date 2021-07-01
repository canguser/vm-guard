console.log(module.path)
const fs = require('fs'); // 依赖 fs 模块（这是非法的引用）
module.exports = fs;