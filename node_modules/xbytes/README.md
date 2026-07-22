# ByteParser (xbytes)

> NodeJS Byte Parser
> Parse bytes to human readable sizes (4747) → ('4.75 KB') and vice versa.

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

[![NPM][npm-image-url]][npm-url]

## Installing

Via [NPM][npm]:

``` bash
npm install xbytes
```

## Usage

``` javascript
// Node CommonJS
const xbytes = require('xbytes');
// Or Node ES6 Modules
import xbytes from 'xbytes';
// Or TypeScript
import * as xbytes from 'xbytes';
```

``` html
<!-- Or in the Browser -->
<script src="xbytes/dist/index.js"></script>
```

## Examples

``` javascript
xbytes(4747); // '4.75 KB'
xbytes(-3946); // '-3.95 KB'
xbytes(34.724e+4); // '347.24 KB'
xbytes(32000000000); // '32.00 GB'
xbytes(21474836480, {iec: true}); // '20.00 GiB'
xbytes.parseSize('10 GB'); // 10000000
xbytes.parseSize('-50 GiB'); // -53687091200
```

> *IEC Specification**

``` javascript
xbytes(5242880, {iec: true}); // '5 MiB'

xbytes.parseSize('10 GiB'); // 10485760
```

## API

### <a id='fn:xbytes'></a> xbytes(byte[, options])

* `byte`: &lt;[number][]&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#bytestring)&gt;

Parse `byte` to human readable size. If `byte` is not a number or an number-like string, return `null` appropriately.

```javascript
xbytes(2472946)
// << '2.47 MB'
xbytes(49392123904, {iec: true})
// << '46.00 GiB'
```

### <a id='fn:parsesize'></a> xbytes.parseSize(str[, config])

* `str`: &lt;[ByteString](#bytestring)&gt;
* `config`: &lt;[ParseOptions](#parseoptions)&gt;
* Returns: &lt;[number][]&gt;

Parse human readable size to bytes

```javascript
xbytes.parseSize('15.967 MB')
// << 15967000
xbytes.parseSize('5.97 PiB')
// << 6721622443850465
```

### <a id='fn:parse'></a> xbytes.parse(size)

* `str`: &lt;[HybridByte](#hybridbyte)&gt;
* Returns: &lt;[ByteUnitObject](#byteunitobject)&gt;

Create a ByteUnitObject around the specified HybridByte

```javascript
xbytes.parse('10 MiB')
// << ByteUnitObject { bytes: 10485760 }
xbytes.parse('10 MiB').add('20 MiB')
// << ByteUnitObject { bytes: 31457280 }
xbytes.parse('10 MiB').add('20 MiB').toIECBytes()
// << '30.00 MiB'
```

### <a id='fn:isbytes'></a> xbytes.isBytes(str)

* `str`: &lt;[string][]&gt;
* Returns: &lt;[boolean][]&gt;

Check if the provided string is a [ByteString](#bytestring)

``` javascript
xbytes.isBytes('10 MiB')
// << true
xbytes.isBytes('Hello')
// << false
xbytes.isBytes('10 iB')
// << false
xbytes.isBytes('10b')
// << true
```

### <a id='fn:isunit'></a> xbytes.isUnit(str)

* `str`: &lt;[UnitString](#unitstring)&gt;
* Returns: &lt;[boolean][]&gt;

Check if the provided string is an [UnitString](#unitstring)

``` javascript
xbytes.isUnit('GB')
// << true
xbytes.isUnit('giB')
// << true
xbytes.isUnit('iB')
// << false
xbytes.isUnit('BB')
// << false
```

### <a id='fn:isparsable'></a> xbytes.isParsable(input)

* `input`: &lt;[HybridByte](#hybridbyte)&gt;
* Returns: &lt;[boolean][]&gt;

Check if the provided argument is parsable _i.e_ raw_bytes ([number]) or [ByteString](#bytestring).

### <a id='fn:relative'></a> xbytes.relative(size[, options])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[HybridByteRelations](#hybridbyterelations)&gt;

### <a id='fn:relative:bits'></a> xbytes.relative.bits(size[, options])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#Bytestring)&gt;

Show the input size in relation to its `bit` format

### <a id='fn:relative:bytes'></a> xbytes.relative.bytes(size[, options])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#Bytestring)&gt;

Show the input size in relation to its `byte` format

### <a id='fn:relative:iecBits'></a> xbytes.relative.iecBits(size[, options])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#Bytestring)&gt;

Show the input size in relation to its `bit` format under `IEC Standards`

### <a id='fn:relative:iecBytes'></a> xbytes.relative.iecBytes(size[, options])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#Bytestring)&gt;

Show the input size in relation to its `bytes` format under `IEC Standards`

### <a id='fn:relative:size'></a> xbytes.relative.size(size[, unit[, options]])

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* `unit`: &lt;[UnitString](#unitstring)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteString](#bytestring)&gt;

### <a id='fn:parsestring'></a> xbytes.parseString(str)

* `str`: &lt;[ByteString](#bytestring)&gt;
* Returns: &lt;[ParsedByteString](#parsedbytestring)&gt;

Parse a human readable byte into its components

### <a id='fn:parsebytes'></a> xbytes.parseBytes(str, options)

* `str`: &lt;[HybridByte](#hybridbyte)&gt;
* `options`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ParsedBytes](#parsedbytes)&gt;

Parse a human readable byte into its components.
Extended from [parseString()](#parsestring), but with a few extra properties.
And flexibility to use parse either an integer byte value or a `ByteString` resulting in the same object.

### <a id='fn:extractbytes'></a> xbytes.extractBytes(str)

* `str`: &lt;[string][]&gt;
* Returns: &lt;[ByteString](#bytestring)[]&gt;

Extract all [ByteString](#bytestring)s within a string into an array, alternative to `str.match(xbytes.byteFilter)`

### <a id='fn:createbyteparser'></a> xbytes.createByteParser(config)

* `config`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[ByteParser](#byteparser)&gt;

Construct a static [ByteParser](#byteparser) with predefined configurations

### <a id='fn:createsizeparser'></a> xbytes.createSizeParser(config)

* `config`: &lt;[ParseOptions](#parseoptions)&gt;
* Returns: &lt;[SizeParser](#sizeparser)&gt;

Construct a static [SizeParser](#sizeparser) with predefined configurations

### <a id='fn:createrelativesizer'></a> xbytes.createRelativeSizer(unit[, config])

* `unit`: &lt;[UnitString](#unitstring)&gt;
* `config`: &lt;[ByteOptions](#byteoptions)&gt;
* Returns: &lt;[RelativeSizer](#relativesizer)&gt;

Create a [RelativeSizer](#relativesizer) for converting a hybrid byte into any set unit under predefined configuration

### <a id='unitmatcher'></a> xbytes.unitMatcher: [`RegExp`][regexp]

The raw Regular expression used in scanning all string byte units.

### <a id='genericmatcher'></a> xbytes.genericMatcher: [`RegExp`][regexp]

The raw regular expression used in scanning all byte containing strings.

### <a id='bytefilter'></a> xbytes.byteFilter: [`RegExp`][regexp]

An regular expression extension of [`genericMatcher`](#genericmatcher) with the 'i' flag.

### <a id='globalbytefilter'></a> xbytes.globalByteFilter: [`RegExp`][regexp]

An regular expression extension of [`genericMatcher`](#genericmatcher) with the 'gi' flags.

### <a id='unitstring'></a> UnitString: [`String`][string]

 Supported Unit Strings

 | Index | Prefix |    Decimal Bits    | Binary Bits ([IEC][]) |    Decimal Bytes    | Binary Bytes ([IEC][]) |
 | :---: | :----: | :----------------: | :-------------------: | :-----------------: | :--------------------: |
 |   0   |   -    | **b (Bits)**       | **b (Bits)**          | **b (Bits)**        | **b (Bits)**           |
 |   0   |   -    | **B (Bytes)**      | **B (Bytes)**         | **B (Bytes)**       | **B (Bytes)**          |
 |   1   |   K    | **Kb (KiloBits)**  | **Kib (KiloBits)**    | **KB (KiloBytes)**  | **KiB (KibiBytes)**    |
 |   2   |   M    | **Mb (MegaBits)**  | **Mib (MebiBits)**    | **MB (MegaBytes)**  | **MiB (MebiBytes)**    |
 |   3   |   G    | **Gb (GigaBits)**  | **Gib (GibiBits)**    | **GB (GigaBytes)**  | **GiB (GibiBytes)**    |
 |   4   |   T    | **Tb (TeraBits)**  | **Tib (TebiBits)**    | **TB (TeraBytes)**  | **TiB (TebiBytes)**    |
 |   5   |   P    | **Pb (PetaBits)**  | **Pib (PebiBits)**    | **PB (PetaBytes)**  | **PiB (PebiBytes)**    |
 |   6   |   E    | **Eb (ExaBits)**   | **Eib (ExbiBits)**    | **EB (ExaBytes)**   | **EiB (ExbiBytes)**    |
 |   7   |   Z    | **Zb (ZettaBits)** | **Zib (ZebiBits)**    | **ZB (ZettaBytes)** | **ZiB (ZebiBytes)**    |
 |   8   |   Y    | **Yb (YottaBits)** | **Yib (YobiBits)**    | **YB (YottaBytes)** | **YiB (YobiBytes)**    |

### <a id='bytestring'></a> ByteString: [`String`][string]

A stringed byte representation. The result of a parsed byte value.

* '5 MB'
* '10 GiB'
* '0.67 Tb'
* '-50 KB'
* '2e+15 KB'
* '-9e-4 GB'

### <a id='hybridbyte'></a> HybridByte: [`Number`][number]|[`ByteString`](#bytestring)

Used to identify a variable thats either a [ByteString](#bytestring) or a [number][]

* '47 MiB'
* '50kb'
* 74753
* '105'

### <a id='byteoptions'></a> ByteOptions: [`Object`][object]

* `iec`: &lt;[boolean][]&gt; Whether or not to parse under the [IEC standard][IEC] i.e in terms of 1024. **Default**: `true`
* `bits`: &lt;[boolean][]&gt; Whether or not to convert inputed bytes to bits and parse in terms of bits [1 byte = 8 bits]. **Default**: `false`.
* `fixed`: &lt;[number][]&gt; Number of digits to include after decimal point. **Default**: `2`.
* `short`: &lt;[boolean][]&gt; Whether or not to shorten unit String [short: 'MB', long: 'MegaBytes']. **Default**: `true`.
* `space`: &lt;[boolean][]&gt; Whether or not to include a white space inbetween value and unit. **Default**: `true`.
* `sticky`: &lt;[boolean][]&gt; Whether or not to retain unit on max unit values. e.g `'1024.00 GiB'` instead of `'1.00 TiB'`. **Default**: `false`.
* `prefixIndex`: &lt;[number][]&gt; The index of unit relativity [See [UnitString](#unitstring)].

### <a id='parseoptions'></a> ParseOptions: [`Object`][object]

* `iec`: &lt;[boolean][]&gt; Whether or not to enforce compliance to [IEC standard][IEC]s. **Default**: `true`.
* `bits`: &lt;[boolean][]&gt; Whether or not to parse a lower case 'b' in bit format. **Default**: `true`.

### <a id='byteparser'></a> ByteParser: [`Function`][function]

* `size`: &lt;[number][]&gt;
* Returns: &lt;[ByteString](#bytestring)&gt;

Byte parser with predefined configuration. Result of [`createByteParser`](#fn:createbyteparser).

### <a id='sizeparser'></a> SizeParser: [`Function`][function]

* `str`: &lt;[ByteString](#bytestring)[]&gt;
* Returns: &lt;[number][]&gt;

[ByteString](#bytestring) parser with predefined configuration. Result of [`createSizeParser`](#fn:createsizeparser).

### <a id='relativesizer'></a> RelativeSizer: [`Function`][function]

* `size`: &lt;[HybridByte](#hybridbyte)&gt;
* Returns: &lt;[ByteString](#bytestring)&gt;

[HybridByte](#hybridbyte) parser with predefined configuration. Result of [`createRelativeSizer`](#fn:createrelativesizer).

### <a id='parsedunit'></a> ParsedUnit: [`Object`][object]

* `iec`: &lt;[boolean][]&gt; Whether or not the byte is represented under the [IEC standard][IEC] i.e in terms of 1024.
  * `true` in `'7 TiB'`
  * `false` in `'3 TB'`
* `type`: &lt;[string][]&gt; Whether the size is represented as bits(b) or bytes(B).
  * `'b'` in `'499Yb'`
  * `'B'` in `'7 MB'`
* `bits`: &lt;[boolean][]&gt; Whether or not the size is specifically represented as a `bit`.
  * `true` in `84 Yb`
  * `false` in `278.58 KB`
* `bytes`: &lt;[boolean][]&gt; Whether or not the size is specifically represented as a `byte`.
  * `true` in `92 EB`
  * `false` in `28 Mb`
* `unit`: &lt;[UnitString](#unitstring)&gt; Re-parsed UnitString of `inputUnit`, fixing formatting.
  * `'TB'` if `'TB'`
  * `'Gib'` if `'gib'`
* `inputUnit`: &lt;[UnitString](#unitstring)&gt; The unparsed String as was provided.
  * `'47TB'` in `'47TB'`
* `prefix`: &lt;[string][]&gt; The prefix of the size string.
  * `'K'` in `'KB'`
* `prefixIndex`: &lt;[number][]&gt; The index of the size unit [See [UnitString](#unitstring)].
  * `3` in `'GB'`

### <a id='parsedbytestring'></a> ParsedByteString <sub>`extends`</sub> [ParsedUnit](#parsedunit): [`Object`][object]

* `input`: &lt;[ByteString](#bytestring)&gt; The unparsed String as was provided.
  * `'47TB'` in `'47TB'`
* `value`: &lt;[number][]&gt; The value for the size.
  * `83` in `'83MB'`

### <a id='parsedbytes'></a> ParsedBytes <sub>`extends`</sub> [ParsedByteString](#parsedbytestring): [`Object`][object]

* `input`: &lt;[HybridByte](#hybridbyte)&gt; The unparsed String as was provided.
  * `1024` in `1024`
  * `'47TB'` in `'47TB'`
* `size`: &lt;[ByteString](#bytestring)&gt; The value for the size.
  * `83` in `'83MB'`
* `bytes`: &lt;[number][]&gt; The value for the size.
  * `10485760` from `'10 MiB'`

### <a id='byteunitobject'></a> class ByteUnitObject

* `bytes`: &lt;[number][]&gt; Internal byte value.

Wrap a HybridByte in a chainable, transformative object.

```javascript
new ByteUnitObject('10 MiB')
// << ByteUnitObject { bytes: 10485760 }
new ByteUnitObject('10 MiB').add('20 MiB')
// << ByteUnitObject { bytes: 31457280 }
new ByteUnitObject('10 MiB').add('20 MiB').toIECBytes()
// << '30.00 MiB'
```

#### ByteUnitObject().add(bytes)

* `bytes`: &lt;[HybridByte](#hybridbyte)|[HybridByte](#hybridbyte)[]&gt; Byte(s) to subract from the root byte.
* Returns: &lt;[ByteUnitObject](#byteunitobject)&gt;

Add byte(s) to the internal bytes, resulting in a new [`ByteUnitObject`](#byteunitobject) object with the value

#### ByteUnitObject().subtract(bytes)

* `bytes`: &lt;[HybridByte](#hybridbyte)|[HybridByte](#hybridbyte)[]&gt; Subtract byte(s) from the internal bytes, resulting in a new ByteUnitObject object with the value.
* Returns: &lt;[ByteUnitObject](#byteunitobject)&gt;

Subtract byte(s) from the internal bytes, resulting in a new [`ByteUnitObject`](#byteunitobject) object with the value

#### ByteUnitObject().multiply(bytes)

* `bytes`: &lt;[HybridByte](#hybridbyte)|[HybridByte](#hybridbyte)[]&gt; Multiply byte(s) with the internal bytes, resulting in a new ByteUnitObject object with the value.
* Returns: &lt;[ByteUnitObject](#byteunitobject)&gt;

Multiply byte(s) with the internal bytes, resulting in a new [`ByteUnitObject`](#byteunitobject) object with the value

#### ByteUnitObject().divide(bytes)

* `bytes`: &lt;[HybridByte](#hybridbyte)|[HybridByte](#hybridbyte)[]&gt; Byte(s) to divide with.
* Returns: &lt;[ByteUnitObject](#byteunitobject)&gt;

Divide internal bytes by byte(s) specified, resulting in a new [`ByteUnitObject`](#byteunitobject) object with the value

#### ByteUnitObject().convertTo(unit)

* `unit`: &lt;[UnitString](#unitstring)&gt;
* Returns: &lt;[ByteString](#bytestring)&gt;

Parse the internal byte into any unit, following the relativity.

``` javascript
new ByteUnitObject('10 MiB')
// >> ByteUnitObject { bytes: 10485760 }
new ByteUnitObject('10 MiB').convertTo('MB')
// >> '10.49 MB'
new ByteUnitObject('10 MiB').add('50 MB').convertTo('KB')
    '60485.76 KB'
```

#### ByteUnitObject().objectify(opts)

* `opts`: &lt;[ByteOptions](#byteoptions)&gt;

Parse the internal bytes property to a byte object.

#### ByteUnitObject().checkInternalByteVal(bytes)

Method to check integrity of internal bytes. Throw if there's an error somewhere.

### <a id='hybridbyterelations'></a> HybridByteRelations: [`Object`][object]

* `raw`:<a id='hybridraw'></a> &lt;[HybridByte](#hybridbyte)&gt; The unparsed data
* `bits`: &lt;[ByteString](#bytestring)&gt; A relative bit parsing of the input [HybridByte](#hybridraw)
* `size`: &lt;[number][]&gt; The numeric byte format of the input [HybridByte](#hybridraw)
* `bytes`: &lt;[ByteString](#bytestring)&gt; A relative byte parsing of the input [HybridByte](#hybridraw)
* `iecBits`: &lt;[ByteString](#bytestring)&gt; A relative bit parsing of the input [HybridByte](#hybridraw) under the IEC Specification
* `parsed`: &lt;[ByteString](#bytestring)&gt; A relative bit parsing of the input [HybridByte](#hybridraw) under the IEC Specification
* `iecBytes`: &lt;[ByteString](#bytestring)&gt; A relative byte parsing of the input [HybridByte](#hybridraw) under the IEC Specification

## More Examples

Check out some examples in the `examples` folder

``` javascript
$ node examples/index.js 'Hey, its 6GB, but my 8 TB flash drive is better'
┌─────────┬──────────┬───────────┬────────┬───────────┬────────────┬────────────┬─────────────┐
│ (index) │  parsed  │   size    │  raw   │   bytes   │  iecBytes  │    bits    │   iecBits   │
├─────────┼──────────┼───────────┼────────┼───────────┼────────────┼────────────┼─────────────┤
│    0    │ [Object] │ '6.00 GB' │ '6GB'  │ '6.00 GB' │ '5.59 GiB' │ '48.00 Gb' │ '44.70 Gib' │
│    1    │ [Object] │ '8.00 TB' │ '8 TB' │ '8.00 TB' │ '7.28 TiB' │ '64.00 Tb' │ '58.21 Tib' │
└─────────┴──────────┴───────────┴────────┴───────────┴────────────┴────────────┴─────────────┘
$ node examples/parse.js 'The 10GB file was downloaded in 50MB/s'
The 10737418240 file was downloaded in 52428800/s
$ node examples/relative.js mb '10GiB, 1mb 6   gb'
85899.35 Mb, 1.00 Mb 6000.00 Mb
$ node examples/random.js 10 // Parse 10 random bytes
[tabular data]
$ node examples/extract.js 'Hey, its 6GB, but my 8 TB flash drive is better'
┌─────────┬────────┬───────────────┐
│ (index) │  size  │     bytes     │
├─────────┼────────┼───────────────┤
│    0    │ '6GB'  │  6000000000   │
│    1    │ '8 TB' │ 8000000000000 │
└─────────┴────────┴───────────────┘
```

## Features

### Compatible with all versions of NodeJS (tested from v1.8.4)

``` bash
$ nvm exec v1.8.4 node -pe 'require(".")(3748587)'
"3.75 MB"
$ nvm exec v5.12.0 node -pe 'require(".").parseSize("476 TiB")'
523367534821376
$ nvm exec v11.10.0 node -e '
  let xbytes = require("./dist");
  let str = "My 10GB drive transmits at 250MiB/sec"
  console.log(str.replace(xbytes.globalByteFilter, xbytes.relative.bits))
'
"My 80.00 Gb drive transmits at 2.10 Gb/sec"
```

### Decimal parsing

``` javascript
xbytes(524334545.847775856); // 524.33 MB
xbytes.parseSize('665.284 TiB'); // 731487493773328.4

xbytes(.24283884748955); // 0.24 B
xbytes.parseSize('.295 MB'); // 295000
```

### Parse human readable sizes in binary ([IEC][]) format to bytes

``` javascript
xbytes.parseSize('1 MiB'); // 1048576
```

### Parse byte values to extended human readable sizes

``` javascript
xbytes(50000000, {short: false}); // '50.00 MegaBytes'
```

### Match or extract [ByteString](#bytestring)s in a string

``` javascript
let data = 'My 16GB flash drive has a 4GB Zip Archive and a 5MB JavaScript file';
xbytes.extractBytes(data);
  //> [ '16GB', '4GB', '5MB' ]
data.match(xbytes.globalByteFilter)
  //> [ '16GB', '4GB', '5MB' ]
data.replace(xbytes.globalByteFilter, xbytes.parseSize)
  //> 'My 16000000000 flash drive has a 4000000000 Zip Archive and a 5000000 JavaScript file'
data.replace(xbytes.globalByteFilter, xbytes.createSizeParser({ iec: false }))
  //> 'My 17179869184 flash drive has a 4294967296 Zip Archive and a 5242880 JavaScript file'
```

### Decimal and Binary Unit Relativity

``` javascript
import { parseSize, relative } from 'xbytes';

relative('35 TiB').bits // '307.86 Tb'
relative('35 TiB').bytes // '38.48 TB'
relative('35 TiB').iecBits // '280.00 Tib'
relative('35 TiB').iecBytes // '35.00 TiB'

parseSize(relative('35 TiB', {fixed: 20}).bits);
  //> 38482906972160
parseSize(relative('35 TiB', {fixed: 20}).bytes);
  //> 38482906972160
parseSize(relative('35 TiB', {fixed: 20}).iecBits);
  //> 38482906972160
parseSize(relative('35 TiB', {fixed: 20}).iecBytes);
  //> 38482906972160
```

## Development

### Building

Feel free to clone, use in adherance to the [license](#license) and perhaps send pull requests

``` bash
git clone https://github.com/miraclx/xbytes.git
cd xbytes
npm install
# hack on code
npm run build
npm test
```

### Testing

Tests are executed with [Jest][jest]. To use it, simple run `npm install`, it will install
Jest and its dependencies in your project's `node_modules` directory followed by `npm run build` and finally `npm test`.

To run the tests:

```bash
npm install
npm run build
npm test
```

## License

[Apache 2.0][license] © **Miraculous Owonubi** ([@miraclx][author-url]) &lt;omiraculous@gmail.com&gt;

[IEC]: https://en.wikipedia.org/wiki/Units_of_information#Systematic_multiples 'International Electrotechnical Commission'
[npm]:  https://github.com/npm/cli 'The Node Package Manager'
[jest]:  https://github.com/facebook/jest 'Delightful JavaScript Testing'
[license]:  LICENSE 'Apache 2.0 License'
[author-url]: https://github.com/miraclx

[npm-url]: https://npmjs.org/package/xbytes
[npm-image]: https://badgen.net/npm/node/xbytes
[npm-image-url]: https://nodei.co/npm/xbytes.png?stars&downloads
[downloads-url]: https://npmjs.org/package/xbytes
[downloads-image]: https://badgen.net/npm/dm/xbytes

[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
[object]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[string]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type
[boolean]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type
[function]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
