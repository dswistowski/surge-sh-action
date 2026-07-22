const xbytes = require('../lib');

const input = process.argv.slice(2).join(' ');
const parsed = input.replace(xbytes.globalByteFilter, xbytes.createSizeParser({bits: false, iec: false}));

console.log(parsed);
