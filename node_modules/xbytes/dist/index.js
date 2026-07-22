"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * @module xbytes
 * @license Apache-2.0
 * @author Miraculous Owonubi
 * @copyright (c) 2019 Miraculous Owonubi
 */

/* eslint-disable no-restricted-properties */

function xbytes() {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var options = arguments.length > 1 ? arguments[1] : undefined;
  if (Number.isNaN(size = +size) || typeof size !== 'number') return null;
  var _ref = options || {},
    _ref$iec = _ref.iec,
    iec = _ref$iec === void 0 ? false : _ref$iec,
    _ref$bits = _ref.bits,
    bits = _ref$bits === void 0 ? false : _ref$bits,
    _ref$short = _ref["short"],
    _short = _ref$short === void 0 ? true : _ref$short,
    _ref$space = _ref.space,
    space = _ref$space === void 0 ? true : _ref$space,
    _ref$fixed = _ref.fixed,
    fixed = _ref$fixed === void 0 ? 2 : _ref$fixed,
    prefixIndex = _ref.prefixIndex,
    _ref$sticky = _ref.sticky,
    sticky = _ref$sticky === void 0 ? false : _ref$sticky;
  size *= bits ? 8 : 1;
  var sizes = ['-', 'Kilo', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa', 'Zetta', 'Yotta'];
  var exponent = typeof prefixIndex === 'number' ? prefixIndex : function (v) {
    return sticky && Number.isInteger(v) ? v - 1 : Math.floor(v);
  }(Math.log(Math.abs(size)) / Math.log(iec ? 1024 : 1000)) || 0;
  size /= ~exponent && exponent in sizes ? Math.pow(iec ? 1024 : 1000, exponent) : 1;
  var select = sizes[exponent] || sizes[0];
  var byteStr = !_short ? select.replace(/(\w{2})(\w+)/, "$1".concat(iec ? 'bi' : '$2', "-")).replace(/-/, !bits ? 'Bytes' : 'Bits') : select[0].replace(/(-?|[^\w])$/, "".concat(iec && exponent in sizes && exponent > 0 ? 'i' : '').concat(!bits ? 'B' : 'b'));
  return [size.toFixed(fixed), byteStr].join(space ? ' ' : '');
}
var unitMatcher = /^(?:([kmgtpezy])(i?))?(b)$/i;
var genericMatcher = new RegExp("([+-]?\\d+(?:\\.\\d+)?(?:e[+-]\\d+)?)\\s*((?:([kmgtpezy])(i?))?(b))\\b");
var globalByteFilter = new RegExp(genericMatcher.source, 'gi');
var byteFilter = new RegExp("^".concat(genericMatcher.source), 'i');
function parseUnit(stringUnit) {
  var scan;
  if (typeof stringUnit === 'string' && (scan = stringUnit.match(unitMatcher))) {
    var _scan = scan,
      _scan2 = _slicedToArray(_scan, 4),
      input = _scan2[0],
      key = _scan2[1],
      iec = _scan2[2],
      type = _scan2[3];
    var prefix = key ? key.toUpperCase() : '';
    scan = {
      unitInput: input,
      prefix: prefix,
      iec: !!iec,
      type: type,
      unit: prefix.concat(type),
      bits: type === 'b',
      "byte": type === 'B',
      prefixIndex: 'BKMGTPEZY'.indexOf(prefix.toUpperCase())
    };
  }
  return scan;
}
function parseString(stringBytes) {
  var scan;
  if (typeof stringBytes === 'string' && (scan = stringBytes.match(byteFilter))) {
    var _scan3 = scan,
      _scan4 = _slicedToArray(_scan3, 3),
      input = _scan4[0],
      value = _scan4[1],
      unit = _scan4[2];
    scan = _objectSpread(_objectSpread({}, parseUnit(unit)), {}, {
      input: input,
      value: parseFloat(value)
    });
  }
  return scan;
}
function isBytes(stringBytes) {
  return byteFilter.test(stringBytes);
}
function isUnit(stringUnit) {
  return unitMatcher.test(stringUnit);
}
function extractBytes(stringOfbytes) {
  return (stringOfbytes.match(globalByteFilter) || []).filter(isBytes);
}
function parseSize(stringBytes, parseOptions) {
  var scan;
  var _ref2 = parseOptions || {},
    _ref2$bits = _ref2.bits,
    bits = _ref2$bits === void 0 ? true : _ref2$bits,
    _ref2$iec = _ref2.iec,
    iec = _ref2$iec === void 0 ? true : _ref2$iec;
  if (isBytes(stringBytes) && (scan = parseString(stringBytes) || 0)) {
    var index = scan.prefixIndex;
    scan = scan.value * (iec && !scan.iec ? Math.pow(10, index * 3) : Math.pow(2, 10 * index)) / (bits && scan.type === 'b' ? 8 : 1);
  }
  return scan;
}
function isParsable(input) {
  return isBytes(input) || Number.isFinite(input) && Math.abs(input) <= 0x40000000000000000000000 ||
  // All values 1024 YiB and under are parsable after sticky feature upgrade
  parseFloat(input).toString() === input;
}
function hybridResolve(hybridValue) {
  if (!isParsable(hybridValue)) throw Error("<input> argument [".concat(hybridValue, "] of type '").concat(_typeof(hybridValue), "' must either be a finite number or a ByteString e.g \"10 MB\""));
  return (isBytes(hybridValue) ? parseSize(hybridValue) : +hybridValue) || 0;
}
function parseBytes(input, options) {
  var struct;
  if (!isParsable(input)) throw Error("<input> argument [".concat(input, "] of type '").concat(_typeof(input), "' must either be a finite number or a ByteString e.g \"10 MB\""));
  var bytes = hybridResolve(input);
  if (isBytes(input)) {
    var _ref3 = [parseSize(input), input];
    bytes = _ref3[0];
    struct = _ref3[1];
  } else {
    var _ref4 = [+input || 0, xbytes(+input || 0)];
    bytes = _ref4[0];
    struct = _ref4[1];
  }
  return _objectSpread(_objectSpread({}, struct = parseString(struct)), {}, {
    input: input,
    bytes: bytes,
    size: xbytes(bytes, _objectSpread(_objectSpread({}, struct), options))
  });
}
function internalRelationEngine(parsed, options) {
  // eslint-disable-next-line no-multi-assign
  var size = parsed.bytes;
  var bits = xbytes(size, _objectSpread(_objectSpread({}, options), {}, {
    iec: false,
    bits: true
  }));
  var bytes = xbytes(size, _objectSpread(_objectSpread({}, options), {}, {
    iec: false,
    bits: false
  }));
  var iecBits = xbytes(size, _objectSpread(_objectSpread({}, options), {}, {
    iec: true,
    bits: true
  }));
  var iecBytes = xbytes(size, _objectSpread(_objectSpread({}, options), {}, {
    iec: true,
    bits: false
  }));
  return {
    bytes: bytes,
    iecBytes: iecBytes,
    bits: bits,
    iecBits: iecBits
  };
}
function relative(data, options) {
  var parsed = parseBytes(data);
  var result = internalRelationEngine(parsed, options);
  return _objectSpread({
    parsed: parsed,
    size: parsed.size,
    raw: data
  }, result);
}
relative.bits = function (data, opts) {
  return relative(data, opts).bits;
};
relative.bytes = function (data, opts) {
  return relative(data, opts).bytes;
};
relative.iecBits = function (data, opts) {
  return relative(data, opts).iecBits;
};
relative.iecBytes = function (data, opts) {
  return relative(data, opts).iecBytes;
};
relative.size = function (size, unit, options) {
  var parsed = parseBytes(size);
  var _ref5 = [],
    result = _ref5[0],
    props = _ref5[1];
  if (result = parseUnit(unit)) {
    props = {
      iec: result.iec,
      bits: result.bits,
      prefixIndex: result.prefixIndex
    };
  }
  return xbytes(parsed.bytes, _objectSpread(_objectSpread({}, options), props));
};
function createByteParser(config) {
  return function staticByteParser(size) {
    return xbytes(size, config);
  };
}
function createSizeParser(config) {
  return function staticSizeParser(size) {
    return parseSize(size, config);
  };
}
function createRelativeSizer(unit, config) {
  return function staticRelativeSizer(size) {
    return relative.size(size, unit, config);
  };
}
function parseByteOrByteArray(input) {
  return (Array.isArray(input) ? input : [input]).map(hybridResolve);
}
var ByteUnitObject = /*#__PURE__*/function () {
  function ByteUnitObject(bytes) {
    _classCallCheck(this, ByteUnitObject);
    if (!isParsable(bytes)) throw Error('<bytes> argument must be a finite value');
    this.bytes = hybridResolve(bytes);
    this.checkInternalByteVal();
  }
  return _createClass(ByteUnitObject, [{
    key: "checkInternalByteVal",
    value: function checkInternalByteVal() {
      if (!Number.isFinite(this.bytes)) throw Error('Internal container for bytes value invalid, probably corrupted from external source');
    }
  }, {
    key: "add",
    value: function add(bytes) {
      if (!isParsable(bytes)) throw Error('<bytes> argument must be a finite value');
      this.checkInternalByteVal();
      return new ByteUnitObject(this.bytes + parseByteOrByteArray(bytes).reduce(function (a, v) {
        return a + v;
      }, 0));
    }
  }, {
    key: "subtract",
    value: function subtract(bytes) {
      if (!isParsable(bytes)) throw Error('<bytes> argument must be a finite value');
      this.checkInternalByteVal();
      return new ByteUnitObject(this.bytes - parseByteOrByteArray(bytes).reduce(function (a, v) {
        return a + v;
      }, 0));
    }
  }, {
    key: "multiply",
    value: function multiply(bytes) {
      if (!isParsable(bytes)) throw Error('<bytes> argument must be a finite value');
      this.checkInternalByteVal();
      return new ByteUnitObject(this.bytes * parseByteOrByteArray(bytes).reduce(function (a, v) {
        return a * v;
      }, 1));
    }
  }, {
    key: "divide",
    value: function divide(bytes) {
      if (!isParsable(bytes)) throw Error('<bytes> argument must be a finite value');
      this.checkInternalByteVal();
      return new ByteUnitObject(this.bytes / parseByteOrByteArray(bytes).reduce(function (a, v) {
        return a * v;
      }, 1));
    }
  }, {
    key: "toBits",
    value: function toBits(opts) {
      return relative.bits(this.bytes, opts);
    }
  }, {
    key: "toBytes",
    value: function toBytes(opts) {
      return relative.bytes(this.bytes, opts);
    }
  }, {
    key: "toIECBits",
    value: function toIECBits(opts) {
      return relative.iecBits(this.bytes, opts);
    }
  }, {
    key: "toIECBytes",
    value: function toIECBytes(opts) {
      return relative.iecBytes(this.bytes, opts);
    }
  }, {
    key: "convertTo",
    value: function convertTo(unit, opts) {
      if (!isUnit(unit)) throw Error('<unit> argument must be a valid UnitString. See https://github.com/miraclx/xbytes/blob/master/README.md#unitstring');
      return relative.size(this.bytes, unit, opts);
    }
  }, {
    key: "objectify",
    value: function objectify(opts) {
      return parseBytes(this.bytes, opts);
    }
  }]);
}();
function parse(bytes) {
  return new ByteUnitObject(bytes);
}
xbytes.byteFilter = byteFilter;
xbytes.unitMatcher = unitMatcher;
xbytes.genericMatcher = genericMatcher;
xbytes.globalByteFilter = globalByteFilter;
xbytes.isUnit = isUnit;
xbytes.isBytes = isBytes;
xbytes.relative = relative;
xbytes.isParsable = isParsable;
xbytes.extractBytes = extractBytes;
xbytes.parseSize = parseSize;
xbytes.parseUnit = parseUnit;
xbytes.parseBytes = parseBytes;
xbytes.parseString = parseString;
xbytes.parse = parse;
xbytes.ByteUnitObject = ByteUnitObject;
xbytes.createByteParser = createByteParser;
xbytes.createSizeParser = createSizeParser;
xbytes.createRelativeSizer = createRelativeSizer;
if (typeof module !== 'undefined') module.exports = xbytes;