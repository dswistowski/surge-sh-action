const xbytes = require('../lib');

const unit = process.argv[2].trim();

const value =
  process.argv
    .slice(3)
    .join(' ')
    .trim() || '1KB 1KiB 1Kb 1Kib';

console.log(value.replace(xbytes.globalByteFilter, xbytes.createRelativeSizer(unit || 'b')));
