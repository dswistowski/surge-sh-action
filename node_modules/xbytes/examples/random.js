const xbytes = require('../lib');

const final = +process.argv[2] || 5;
const stacks = [];

for (
  let [i, size] = [0, 0];
  (size = Math.floor(100 * (Math.random() * 10) ** (((Math.random() * 9) | 0) * 3))), (i += 1) <= final;

)
  stacks.push({
    size: `${size}`.replace(/(\d)(?=(\d{3})+$)/g, '$1,'),
    bytes: xbytes(size, {iec: false}),
    iecBytes: xbytes(size, {iec: true}),
    bits: xbytes(size, {bits: true, iec: false}),
    iecBits: xbytes(size, {bits: true, iec: true}),
  });

console.table(stacks);

// $ node index       # parse 5 random bytes
// $ node index 10    # parse 10 random bytes
