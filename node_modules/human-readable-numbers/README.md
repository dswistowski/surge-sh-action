# Human Readable Numbers ![Build Status](https://travis-ci.org/cerberus-ab/human-readable-numbers.svg?branch=master)
Print numbers in human readable format according to [SI prefixes](https://physics.nist.gov/cuu/Units/prefixes.html) except *hecto*, *deka*, *deci* and *centi*.

## Installation
Using npm:
```bash
$ npm i --save human-readable-numbers
```

In a browser:
```html
<script src="dist/index.min.js"></script>
```

In node.js:
```javascript
var HRNumbers = require('human-readable-numbers');
```

Also the module exported as AMD module.

## Documentation
> string toHumanString(number)

Function prints numbers in human readable format.
```javascript
var string = HRNumbers.toHumanString(number);
```
Examples:

From number | To string
--- | ---
0 | 0
120 | 120
5000 | 5k
12345 | 12.3k
1800000 | 1.8M
129500000 | 130M
35e+13 | 350T
1.5e+24 | 1.5Y
0.95 | 950m
0.0006 | 600µ
15e-8 | 150n
4.5e-24 | 4.5y
-30 | -30
-9500 | -9.5k
-17e-10 | -1.7n
 4.567e+27 | 4570Y
