const xbytes = require('../lib');

let value = process.argv.slice(2).join(' ');
let short = !0;
value = value.replace(/-v/g, () => ((short = !1), '')).trim() || '1KB 1KiB 1Kb 1Kib';

console.table(
  xbytes
    .extractBytes(value)
    .concat(
      value
        .replace(xbytes.globalByteFilter, '')
        .match(/(\d*(?:\.\d+)?)/g)
        .filter(v => +v) || [],
    )
    .map(size => xbytes.relative(size, {short})),
);

/**
 * # <value> is either an number or unit of data measurment
 * $ node index.js <value...> [-v]
 *
 * # -v, Verbose, show full bytes
 *
 * $ node index 5MB
 * $ node index 394858756756
 * $ node index 5 Mb 7 tib 6 TiB .6TiB
 */
