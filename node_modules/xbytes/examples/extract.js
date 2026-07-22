const xbytes = require('../lib');

const sizes = process.argv.slice(2).join(' ');
const parsing = xbytes.extractBytes(sizes).map(size => ({size, bytes: xbytes.parseSize(size)}));

console.table(parsing);
