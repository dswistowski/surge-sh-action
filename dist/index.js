/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 9693:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var util = __nccwpck_require__(9023);
var ansiStyles = colors.styles = __nccwpck_require__(2251);
var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);

colors.supportsColor = (__nccwpck_require__(8740).supportsColor);

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function() {
  colors.enabled = true;
};

colors.disable = function() {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function(str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

// eslint-disable-next-line no-unused-vars
var stylize = colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  var styleMap = ansiStyles[style];

  // Stylize should work for non-ANSI styles, too
  if (!styleMap && style in colors) {
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function() {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function(key) {
    ansiStyles[key].closeRe =
      new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function() {
        return build(this._styles.concat(key));
      },
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);

  var str = args.map(function(arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    if (newLinesPresent) {
      str = str.replace(newLineRegex, function(match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function(theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' +
      'If you are trying to set a theme from a file, it is now your (the ' +
      'caller\'s) responsibility to require the file.  The old syntax ' +
      'looked like colors.setTheme(__dirname + ' +
      '\'/../themes/generic-logging.js\'); The new syntax looks like '+
      'colors.setTheme(require(__dirname + ' +
      '\'/../themes/generic-logging.js\'));');
    return;
  }
  for (var style in theme) {
    (function(style) {
      colors[style] = function(str) {
        if (typeof theme[style] === 'object') {
          var out = str;
          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function(name) {
    ret[name] = {
      get: function() {
        return build([name]);
      },
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
};

// custom formatter methods
colors.trap = __nccwpck_require__(2154);
colors.zalgo = __nccwpck_require__(9312);

// maps
colors.maps = {};
colors.maps.america = __nccwpck_require__(8881)(colors);
colors.maps.zebra = __nccwpck_require__(5337)(colors);
colors.maps.rainbow = __nccwpck_require__(8543)(colors);
colors.maps.random = __nccwpck_require__(1298)(colors);

for (var map in colors.maps) {
  (function(map) {
    colors[map] = function(str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());


/***/ }),

/***/ 2154:
/***/ ((module) => {

module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
      '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
      '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240'],
  };
  text.forEach(function(c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};


/***/ }),

/***/ 9312:
/***/ ((module) => {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;
        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};



/***/ }),

/***/ 8881:
/***/ ((module) => {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    if (letter === ' ') return letter;
    switch (i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter);
      case 2: return colors.blue(letter);
    }
  };
};


/***/ }),

/***/ 8543:
/***/ ((module) => {

module['exports'] = function(colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function(letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};



/***/ }),

/***/ 1298:
/***/ ((module) => {

module['exports'] = function(colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
    'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
    'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function(letter, i, exploded) {
    return letter === ' ' ? letter :
      colors[
          available[Math.round(Math.random() * (available.length - 2))]
      ](letter);
  };
};


/***/ }),

/***/ 5337:
/***/ ((module) => {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};


/***/ }),

/***/ 2251:
/***/ ((module) => {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49],

};

Object.keys(codes).forEach(function(key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});


/***/ }),

/***/ 4982:
/***/ ((module) => {

"use strict";
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



module.exports = function(flag, argv) {
  argv = argv || process.argv;

  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);

  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 8740:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/



var os = __nccwpck_require__(857);
var hasFlag = __nccwpck_require__(4982);

var env = process.env;

var forceColor = void 0;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true')
           || hasFlag('color=always')) {
  forceColor = true;
}
if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0
    || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full')
      || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');
    if (Number(process.versions.node.split('.')[0]) >= 8
        && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function(sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    );
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Hyper':
        return 3;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  var level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr),
};


/***/ }),

/***/ 2708:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//
// Remark: Requiring this file will use the "safe" colors API,
// which will not touch String.prototype.
//
//   var colors = require('colors/safe');
//   colors.red("foo")
//
//
var colors = __nccwpck_require__(9693);
module['exports'] = colors;


/***/ }),

/***/ 21:
/***/ ((module) => {

"use strict";


module.exports = ({onlyFirst = false} = {}) => {
	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ 5832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(9441);

/***/ }),

/***/ 6573:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { info, debug } = __nccwpck_require__(7150);
const utils = __nccwpck_require__(8268);

class Cell {
  /**
   * A representation of a cell within the table.
   * Implementations must have `init` and `draw` methods,
   * as well as `colSpan`, `rowSpan`, `desiredHeight` and `desiredWidth` properties.
   * @param options
   * @constructor
   */
  constructor(options) {
    this.setOptions(options);

    /**
     * Each cell will have it's `x` and `y` values set by the `layout-manager` prior to
     * `init` being called;
     * @type {Number}
     */
    this.x = null;
    this.y = null;
  }

  setOptions(options) {
    if (['boolean', 'number', 'bigint', 'string'].indexOf(typeof options) !== -1) {
      options = { content: '' + options };
    }
    options = options || {};
    this.options = options;
    let content = options.content;
    if (['boolean', 'number', 'bigint', 'string'].indexOf(typeof content) !== -1) {
      this.content = String(content);
    } else if (!content) {
      this.content = this.options.href || '';
    } else {
      throw new Error('Content needs to be a primitive, got: ' + typeof content);
    }
    this.colSpan = options.colSpan || 1;
    this.rowSpan = options.rowSpan || 1;
    if (this.options.href) {
      Object.defineProperty(this, 'href', {
        get() {
          return this.options.href;
        },
      });
    }
  }

  mergeTableOptions(tableOptions, cells) {
    this.cells = cells;

    let optionsChars = this.options.chars || {};
    let tableChars = tableOptions.chars;
    let chars = (this.chars = {});
    CHAR_NAMES.forEach(function (name) {
      setOption(optionsChars, tableChars, name, chars);
    });

    this.truncate = this.options.truncate || tableOptions.truncate;

    let style = (this.options.style = this.options.style || {});
    let tableStyle = tableOptions.style;
    setOption(style, tableStyle, 'padding-left', this);
    setOption(style, tableStyle, 'padding-right', this);
    this.head = style.head || tableStyle.head;
    this.border = style.border || tableStyle.border;

    this.fixedWidth = tableOptions.colWidths[this.x];
    this.lines = this.computeLines(tableOptions);

    this.desiredWidth = utils.strlen(this.content) + this.paddingLeft + this.paddingRight;
    this.desiredHeight = this.lines.length;
  }

  computeLines(tableOptions) {
    const tableWordWrap = tableOptions.wordWrap || tableOptions.textWrap;
    const { wordWrap = tableWordWrap } = this.options;
    if (this.fixedWidth && wordWrap) {
      this.fixedWidth -= this.paddingLeft + this.paddingRight;
      if (this.colSpan) {
        let i = 1;
        while (i < this.colSpan) {
          this.fixedWidth += tableOptions.colWidths[this.x + i];
          i++;
        }
      }
      const { wrapOnWordBoundary: tableWrapOnWordBoundary = true } = tableOptions;
      const { wrapOnWordBoundary = tableWrapOnWordBoundary } = this.options;
      return this.wrapLines(utils.wordWrap(this.fixedWidth, this.content, wrapOnWordBoundary));
    }
    return this.wrapLines(this.content.split('\n'));
  }

  wrapLines(computedLines) {
    const lines = utils.colorizeLines(computedLines);
    if (this.href) {
      return lines.map((line) => utils.hyperlink(this.href, line));
    }
    return lines;
  }

  /**
   * Initializes the Cells data structure.
   *
   * @param tableOptions - A fully populated set of tableOptions.
   * In addition to the standard default values, tableOptions must have fully populated the
   * `colWidths` and `rowWidths` arrays. Those arrays must have lengths equal to the number
   * of columns or rows (respectively) in this table, and each array item must be a Number.
   *
   */
  init(tableOptions) {
    let x = this.x;
    let y = this.y;
    this.widths = tableOptions.colWidths.slice(x, x + this.colSpan);
    this.heights = tableOptions.rowHeights.slice(y, y + this.rowSpan);
    this.width = this.widths.reduce(sumPlusOne, -1);
    this.height = this.heights.reduce(sumPlusOne, -1);

    this.hAlign = this.options.hAlign || tableOptions.colAligns[x];
    this.vAlign = this.options.vAlign || tableOptions.rowAligns[y];

    this.drawRight = x + this.colSpan == tableOptions.colWidths.length;
  }

  /**
   * Draws the given line of the cell.
   * This default implementation defers to methods `drawTop`, `drawBottom`, `drawLine` and `drawEmpty`.
   * @param lineNum - can be `top`, `bottom` or a numerical line number.
   * @param spanningCell - will be a number if being called from a RowSpanCell, and will represent how
   * many rows below it's being called from. Otherwise it's undefined.
   * @returns {String} The representation of this line.
   */
  draw(lineNum, spanningCell) {
    if (lineNum == 'top') return this.drawTop(this.drawRight);
    if (lineNum == 'bottom') return this.drawBottom(this.drawRight);
    let content = utils.truncate(this.content, 10, this.truncate);
    if (!lineNum) {
      info(`${this.y}-${this.x}: ${this.rowSpan - lineNum}x${this.colSpan} Cell ${content}`);
    } else {
      // debug(`${lineNum}-${this.x}: 1x${this.colSpan} RowSpanCell ${content}`);
    }
    let padLen = Math.max(this.height - this.lines.length, 0);
    let padTop;
    switch (this.vAlign) {
      case 'center':
        padTop = Math.ceil(padLen / 2);
        break;
      case 'bottom':
        padTop = padLen;
        break;
      default:
        padTop = 0;
    }
    if (lineNum < padTop || lineNum >= padTop + this.lines.length) {
      return this.drawEmpty(this.drawRight, spanningCell);
    }
    let forceTruncation = this.lines.length > this.height && lineNum + 1 >= this.height;
    return this.drawLine(lineNum - padTop, this.drawRight, forceTruncation, spanningCell);
  }

  /**
   * Renders the top line of the cell.
   * @param drawRight - true if this method should render the right edge of the cell.
   * @returns {String}
   */
  drawTop(drawRight) {
    let content = [];
    if (this.cells) {
      //TODO: cells should always exist - some tests don't fill it in though
      this.widths.forEach(function (width, index) {
        content.push(this._topLeftChar(index));
        content.push(utils.repeat(this.chars[this.y == 0 ? 'top' : 'mid'], width));
      }, this);
    } else {
      content.push(this._topLeftChar(0));
      content.push(utils.repeat(this.chars[this.y == 0 ? 'top' : 'mid'], this.width));
    }
    if (drawRight) {
      content.push(this.chars[this.y == 0 ? 'topRight' : 'rightMid']);
    }
    return this.wrapWithStyleColors('border', content.join(''));
  }

  _topLeftChar(offset) {
    let x = this.x + offset;
    let leftChar;
    if (this.y == 0) {
      leftChar = x == 0 ? 'topLeft' : offset == 0 ? 'topMid' : 'top';
    } else {
      if (x == 0) {
        leftChar = 'leftMid';
      } else {
        leftChar = offset == 0 ? 'midMid' : 'bottomMid';
        if (this.cells) {
          //TODO: cells should always exist - some tests don't fill it in though
          let spanAbove = this.cells[this.y - 1][x] instanceof Cell.ColSpanCell;
          if (spanAbove) {
            leftChar = offset == 0 ? 'topMid' : 'mid';
          }
          if (offset == 0) {
            let i = 1;
            while (this.cells[this.y][x - i] instanceof Cell.ColSpanCell) {
              i++;
            }
            if (this.cells[this.y][x - i] instanceof Cell.RowSpanCell) {
              leftChar = 'leftMid';
            }
          }
        }
      }
    }
    return this.chars[leftChar];
  }

  wrapWithStyleColors(styleProperty, content) {
    if (this[styleProperty] && this[styleProperty].length) {
      try {
        let colors = __nccwpck_require__(2708);
        for (let i = this[styleProperty].length - 1; i >= 0; i--) {
          colors = colors[this[styleProperty][i]];
        }
        return colors(content);
      } catch (e) {
        return content;
      }
    } else {
      return content;
    }
  }

  /**
   * Renders a line of text.
   * @param lineNum - Which line of text to render. This is not necessarily the line within the cell.
   * There may be top-padding above the first line of text.
   * @param drawRight - true if this method should render the right edge of the cell.
   * @param forceTruncationSymbol - `true` if the rendered text should end with the truncation symbol even
   * if the text fits. This is used when the cell is vertically truncated. If `false` the text should
   * only include the truncation symbol if the text will not fit horizontally within the cell width.
   * @param spanningCell - a number of if being called from a RowSpanCell. (how many rows below). otherwise undefined.
   * @returns {String}
   */
  drawLine(lineNum, drawRight, forceTruncationSymbol, spanningCell) {
    let left = this.chars[this.x == 0 ? 'left' : 'middle'];
    if (this.x && spanningCell && this.cells) {
      let cellLeft = this.cells[this.y + spanningCell][this.x - 1];
      while (cellLeft instanceof ColSpanCell) {
        cellLeft = this.cells[cellLeft.y][cellLeft.x - 1];
      }
      if (!(cellLeft instanceof RowSpanCell)) {
        left = this.chars['rightMid'];
      }
    }
    let leftPadding = utils.repeat(' ', this.paddingLeft);
    let right = drawRight ? this.chars['right'] : '';
    let rightPadding = utils.repeat(' ', this.paddingRight);
    let line = this.lines[lineNum];
    let len = this.width - (this.paddingLeft + this.paddingRight);
    if (forceTruncationSymbol) line += this.truncate || '…';
    let content = utils.truncate(line, len, this.truncate);
    content = utils.pad(content, len, ' ', this.hAlign);
    content = leftPadding + content + rightPadding;
    return this.stylizeLine(left, content, right);
  }

  stylizeLine(left, content, right) {
    left = this.wrapWithStyleColors('border', left);
    right = this.wrapWithStyleColors('border', right);
    if (this.y === 0) {
      content = this.wrapWithStyleColors('head', content);
    }
    return left + content + right;
  }

  /**
   * Renders the bottom line of the cell.
   * @param drawRight - true if this method should render the right edge of the cell.
   * @returns {String}
   */
  drawBottom(drawRight) {
    let left = this.chars[this.x == 0 ? 'bottomLeft' : 'bottomMid'];
    let content = utils.repeat(this.chars.bottom, this.width);
    let right = drawRight ? this.chars['bottomRight'] : '';
    return this.wrapWithStyleColors('border', left + content + right);
  }

  /**
   * Renders a blank line of text within the cell. Used for top and/or bottom padding.
   * @param drawRight - true if this method should render the right edge of the cell.
   * @param spanningCell - a number of if being called from a RowSpanCell. (how many rows below). otherwise undefined.
   * @returns {String}
   */
  drawEmpty(drawRight, spanningCell) {
    let left = this.chars[this.x == 0 ? 'left' : 'middle'];
    if (this.x && spanningCell && this.cells) {
      let cellLeft = this.cells[this.y + spanningCell][this.x - 1];
      while (cellLeft instanceof ColSpanCell) {
        cellLeft = this.cells[cellLeft.y][cellLeft.x - 1];
      }
      if (!(cellLeft instanceof RowSpanCell)) {
        left = this.chars['rightMid'];
      }
    }
    let right = drawRight ? this.chars['right'] : '';
    let content = utils.repeat(' ', this.width);
    return this.stylizeLine(left, content, right);
  }
}

class ColSpanCell {
  /**
   * A Cell that doesn't do anything. It just draws empty lines.
   * Used as a placeholder in column spanning.
   * @constructor
   */
  constructor() {}

  draw(lineNum) {
    if (typeof lineNum === 'number') {
      debug(`${this.y}-${this.x}: 1x1 ColSpanCell`);
    }
    return '';
  }

  init() {}

  mergeTableOptions() {}
}

class RowSpanCell {
  /**
   * A placeholder Cell for a Cell that spans multiple rows.
   * It delegates rendering to the original cell, but adds the appropriate offset.
   * @param originalCell
   * @constructor
   */
  constructor(originalCell) {
    this.originalCell = originalCell;
  }

  init(tableOptions) {
    let y = this.y;
    let originalY = this.originalCell.y;
    this.cellOffset = y - originalY;
    this.offset = findDimension(tableOptions.rowHeights, originalY, this.cellOffset);
  }

  draw(lineNum) {
    if (lineNum == 'top') {
      return this.originalCell.draw(this.offset, this.cellOffset);
    }
    if (lineNum == 'bottom') {
      return this.originalCell.draw('bottom');
    }
    debug(`${this.y}-${this.x}: 1x${this.colSpan} RowSpanCell for ${this.originalCell.content}`);
    return this.originalCell.draw(this.offset + 1 + lineNum);
  }

  mergeTableOptions() {}
}

function firstDefined(...args) {
  return args.filter((v) => v !== undefined && v !== null).shift();
}

// HELPER FUNCTIONS
function setOption(objA, objB, nameB, targetObj) {
  let nameA = nameB.split('-');
  if (nameA.length > 1) {
    nameA[1] = nameA[1].charAt(0).toUpperCase() + nameA[1].substr(1);
    nameA = nameA.join('');
    targetObj[nameA] = firstDefined(objA[nameA], objA[nameB], objB[nameA], objB[nameB]);
  } else {
    targetObj[nameB] = firstDefined(objA[nameB], objB[nameB]);
  }
}

function findDimension(dimensionTable, startingIndex, span) {
  let ret = dimensionTable[startingIndex];
  for (let i = 1; i < span; i++) {
    ret += 1 + dimensionTable[startingIndex + i];
  }
  return ret;
}

function sumPlusOne(a, b) {
  return a + b + 1;
}

let CHAR_NAMES = [
  'top',
  'top-mid',
  'top-left',
  'top-right',
  'bottom',
  'bottom-mid',
  'bottom-left',
  'bottom-right',
  'left',
  'left-mid',
  'mid',
  'mid-mid',
  'right',
  'right-mid',
  'middle',
];

module.exports = Cell;
module.exports.ColSpanCell = ColSpanCell;
module.exports.RowSpanCell = RowSpanCell;


/***/ }),

/***/ 7150:
/***/ ((module) => {

let messages = [];
let level = 0;

const debug = (msg, min) => {
  if (level >= min) {
    messages.push(msg);
  }
};

debug.WARN = 1;
debug.INFO = 2;
debug.DEBUG = 3;

debug.reset = () => {
  messages = [];
};

debug.setDebugLevel = (v) => {
  level = v;
};

debug.warn = (msg) => debug(msg, debug.WARN);
debug.info = (msg) => debug(msg, debug.INFO);
debug.debug = (msg) => debug(msg, debug.DEBUG);

debug.debugMessages = () => messages;

module.exports = debug;


/***/ }),

/***/ 2237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { warn, debug } = __nccwpck_require__(7150);
const Cell = __nccwpck_require__(6573);
const { ColSpanCell, RowSpanCell } = Cell;

(function () {
  function next(alloc, col) {
    if (alloc[col] > 0) {
      return next(alloc, col + 1);
    }
    return col;
  }

  function layoutTable(table) {
    let alloc = {};
    table.forEach(function (row, rowIndex) {
      let col = 0;
      row.forEach(function (cell) {
        cell.y = rowIndex;
        // Avoid erroneous call to next() on first row
        cell.x = rowIndex ? next(alloc, col) : col;
        const rowSpan = cell.rowSpan || 1;
        const colSpan = cell.colSpan || 1;
        if (rowSpan > 1) {
          for (let cs = 0; cs < colSpan; cs++) {
            alloc[cell.x + cs] = rowSpan;
          }
        }
        col = cell.x + colSpan;
      });
      Object.keys(alloc).forEach((idx) => {
        alloc[idx]--;
        if (alloc[idx] < 1) delete alloc[idx];
      });
    });
  }

  function maxWidth(table) {
    let mw = 0;
    table.forEach(function (row) {
      row.forEach(function (cell) {
        mw = Math.max(mw, cell.x + (cell.colSpan || 1));
      });
    });
    return mw;
  }

  function maxHeight(table) {
    return table.length;
  }

  function cellsConflict(cell1, cell2) {
    let yMin1 = cell1.y;
    let yMax1 = cell1.y - 1 + (cell1.rowSpan || 1);
    let yMin2 = cell2.y;
    let yMax2 = cell2.y - 1 + (cell2.rowSpan || 1);
    let yConflict = !(yMin1 > yMax2 || yMin2 > yMax1);

    let xMin1 = cell1.x;
    let xMax1 = cell1.x - 1 + (cell1.colSpan || 1);
    let xMin2 = cell2.x;
    let xMax2 = cell2.x - 1 + (cell2.colSpan || 1);
    let xConflict = !(xMin1 > xMax2 || xMin2 > xMax1);

    return yConflict && xConflict;
  }

  function conflictExists(rows, x, y) {
    let i_max = Math.min(rows.length - 1, y);
    let cell = { x: x, y: y };
    for (let i = 0; i <= i_max; i++) {
      let row = rows[i];
      for (let j = 0; j < row.length; j++) {
        if (cellsConflict(cell, row[j])) {
          return true;
        }
      }
    }
    return false;
  }

  function allBlank(rows, y, xMin, xMax) {
    for (let x = xMin; x < xMax; x++) {
      if (conflictExists(rows, x, y)) {
        return false;
      }
    }
    return true;
  }

  function addRowSpanCells(table) {
    table.forEach(function (row, rowIndex) {
      row.forEach(function (cell) {
        for (let i = 1; i < cell.rowSpan; i++) {
          let rowSpanCell = new RowSpanCell(cell);
          rowSpanCell.x = cell.x;
          rowSpanCell.y = cell.y + i;
          rowSpanCell.colSpan = cell.colSpan;
          insertCell(rowSpanCell, table[rowIndex + i]);
        }
      });
    });
  }

  function addColSpanCells(cellRows) {
    for (let rowIndex = cellRows.length - 1; rowIndex >= 0; rowIndex--) {
      let cellColumns = cellRows[rowIndex];
      for (let columnIndex = 0; columnIndex < cellColumns.length; columnIndex++) {
        let cell = cellColumns[columnIndex];
        for (let k = 1; k < cell.colSpan; k++) {
          let colSpanCell = new ColSpanCell();
          colSpanCell.x = cell.x + k;
          colSpanCell.y = cell.y;
          cellColumns.splice(columnIndex + 1, 0, colSpanCell);
        }
      }
    }
  }

  function insertCell(cell, row) {
    let x = 0;
    while (x < row.length && row[x].x < cell.x) {
      x++;
    }
    row.splice(x, 0, cell);
  }

  function fillInTable(table) {
    let h_max = maxHeight(table);
    let w_max = maxWidth(table);
    debug(`Max rows: ${h_max}; Max cols: ${w_max}`);
    for (let y = 0; y < h_max; y++) {
      for (let x = 0; x < w_max; x++) {
        if (!conflictExists(table, x, y)) {
          let opts = { x: x, y: y, colSpan: 1, rowSpan: 1 };
          x++;
          while (x < w_max && !conflictExists(table, x, y)) {
            opts.colSpan++;
            x++;
          }
          let y2 = y + 1;
          while (y2 < h_max && allBlank(table, y2, opts.x, opts.x + opts.colSpan)) {
            opts.rowSpan++;
            y2++;
          }
          let cell = new Cell(opts);
          cell.x = opts.x;
          cell.y = opts.y;
          warn(`Missing cell at ${cell.y}-${cell.x}.`);
          insertCell(cell, table[y]);
        }
      }
    }
  }

  function generateCells(rows) {
    return rows.map(function (row) {
      if (!Array.isArray(row)) {
        let key = Object.keys(row)[0];
        row = row[key];
        if (Array.isArray(row)) {
          row = row.slice();
          row.unshift(key);
        } else {
          row = [key, row];
        }
      }
      return row.map(function (cell) {
        return new Cell(cell);
      });
    });
  }

  function makeTableLayout(rows) {
    let cellRows = generateCells(rows);
    layoutTable(cellRows);
    fillInTable(cellRows);
    addRowSpanCells(cellRows);
    addColSpanCells(cellRows);
    return cellRows;
  }

  module.exports = {
    makeTableLayout: makeTableLayout,
    layoutTable: layoutTable,
    addRowSpanCells: addRowSpanCells,
    maxWidth: maxWidth,
    fillInTable: fillInTable,
    computeWidths: makeComputeWidths('colSpan', 'desiredWidth', 'x', 1),
    computeHeights: makeComputeWidths('rowSpan', 'desiredHeight', 'y', 1),
  };
})();

function makeComputeWidths(colSpan, desiredWidth, x, forcedMin) {
  return function (vals, table) {
    let result = [];
    let spanners = [];
    let auto = {};
    table.forEach(function (row) {
      row.forEach(function (cell) {
        if ((cell[colSpan] || 1) > 1) {
          spanners.push(cell);
        } else {
          result[cell[x]] = Math.max(result[cell[x]] || 0, cell[desiredWidth] || 0, forcedMin);
        }
      });
    });

    vals.forEach(function (val, index) {
      if (typeof val === 'number') {
        result[index] = val;
      }
    });

    //spanners.forEach(function(cell){
    for (let k = spanners.length - 1; k >= 0; k--) {
      let cell = spanners[k];
      let span = cell[colSpan];
      let col = cell[x];
      let existingWidth = result[col];
      let editableCols = typeof vals[col] === 'number' ? 0 : 1;
      if (typeof existingWidth === 'number') {
        for (let i = 1; i < span; i++) {
          existingWidth += 1 + result[col + i];
          if (typeof vals[col + i] !== 'number') {
            editableCols++;
          }
        }
      } else {
        existingWidth = desiredWidth === 'desiredWidth' ? cell.desiredWidth - 1 : 1;
        if (!auto[col] || auto[col] < existingWidth) {
          auto[col] = existingWidth;
        }
      }

      if (cell[desiredWidth] > existingWidth) {
        let i = 0;
        while (editableCols > 0 && cell[desiredWidth] > existingWidth) {
          if (typeof vals[col + i] !== 'number') {
            let dif = Math.round((cell[desiredWidth] - existingWidth) / editableCols);
            existingWidth += dif;
            result[col + i] += dif;
            editableCols--;
          }
          i++;
        }
      }
    }

    Object.assign(vals, result, auto);
    for (let j = 0; j < vals.length; j++) {
      vals[j] = Math.max(forcedMin, vals[j] || 0);
    }
  };
}


/***/ }),

/***/ 9441:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(7150);
const utils = __nccwpck_require__(8268);
const tableLayout = __nccwpck_require__(2237);

class Table extends Array {
  constructor(opts) {
    super();

    const options = utils.mergeOptions(opts);
    Object.defineProperty(this, 'options', {
      value: options,
      enumerable: options.debug,
    });

    if (options.debug) {
      switch (typeof options.debug) {
        case 'boolean':
          debug.setDebugLevel(debug.WARN);
          break;
        case 'number':
          debug.setDebugLevel(options.debug);
          break;
        case 'string':
          debug.setDebugLevel(parseInt(options.debug, 10));
          break;
        default:
          debug.setDebugLevel(debug.WARN);
          debug.warn(`Debug option is expected to be boolean, number, or string. Received a ${typeof options.debug}`);
      }
      Object.defineProperty(this, 'messages', {
        get() {
          return debug.debugMessages();
        },
      });
    }
  }

  toString() {
    let array = this;
    let headersPresent = this.options.head && this.options.head.length;
    if (headersPresent) {
      array = [this.options.head];
      if (this.length) {
        array.push.apply(array, this);
      }
    } else {
      this.options.style.head = [];
    }

    let cells = tableLayout.makeTableLayout(array);

    cells.forEach(function (row) {
      row.forEach(function (cell) {
        cell.mergeTableOptions(this.options, cells);
      }, this);
    }, this);

    tableLayout.computeWidths(this.options.colWidths, cells);
    tableLayout.computeHeights(this.options.rowHeights, cells);

    cells.forEach(function (row) {
      row.forEach(function (cell) {
        cell.init(this.options);
      }, this);
    }, this);

    let result = [];

    for (let rowIndex = 0; rowIndex < cells.length; rowIndex++) {
      let row = cells[rowIndex];
      let heightOfRow = this.options.rowHeights[rowIndex];

      if (rowIndex === 0 || !this.options.style.compact || (rowIndex == 1 && headersPresent)) {
        doDraw(row, 'top', result);
      }

      for (let lineNum = 0; lineNum < heightOfRow; lineNum++) {
        doDraw(row, lineNum, result);
      }

      if (rowIndex + 1 == cells.length) {
        doDraw(row, 'bottom', result);
      }
    }

    return result.join('\n');
  }

  get width() {
    let str = this.toString().split('\n');
    return str[0].length;
  }
}

Table.reset = () => debug.reset();

function doDraw(row, lineNum, result) {
  let line = [];
  row.forEach(function (cell) {
    line.push(cell.draw(lineNum));
  });
  let str = line.join('');
  if (str.length) result.push(str);
}

module.exports = Table;


/***/ }),

/***/ 8268:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const stringWidth = __nccwpck_require__(60);

function codeRegex(capture) {
  return capture ? /\u001b\[((?:\d*;){0,5}\d*)m/g : /\u001b\[(?:\d*;){0,5}\d*m/g;
}

function strlen(str) {
  let code = codeRegex();
  let stripped = ('' + str).replace(code, '');
  let split = stripped.split('\n');
  return split.reduce(function (memo, s) {
    return stringWidth(s) > memo ? stringWidth(s) : memo;
  }, 0);
}

function repeat(str, times) {
  return Array(times + 1).join(str);
}

function pad(str, len, pad, dir) {
  let length = strlen(str);
  if (len + 1 >= length) {
    let padlen = len - length;
    switch (dir) {
      case 'right': {
        str = repeat(pad, padlen) + str;
        break;
      }
      case 'center': {
        let right = Math.ceil(padlen / 2);
        let left = padlen - right;
        str = repeat(pad, left) + str + repeat(pad, right);
        break;
      }
      default: {
        str = str + repeat(pad, padlen);
        break;
      }
    }
  }
  return str;
}

let codeCache = {};

function addToCodeCache(name, on, off) {
  on = '\u001b[' + on + 'm';
  off = '\u001b[' + off + 'm';
  codeCache[on] = { set: name, to: true };
  codeCache[off] = { set: name, to: false };
  codeCache[name] = { on: on, off: off };
}

//https://github.com/Marak/colors.js/blob/master/lib/styles.js
addToCodeCache('bold', 1, 22);
addToCodeCache('italics', 3, 23);
addToCodeCache('underline', 4, 24);
addToCodeCache('inverse', 7, 27);
addToCodeCache('strikethrough', 9, 29);

function updateState(state, controlChars) {
  let controlCode = controlChars[1] ? parseInt(controlChars[1].split(';')[0]) : 0;
  if ((controlCode >= 30 && controlCode <= 39) || (controlCode >= 90 && controlCode <= 97)) {
    state.lastForegroundAdded = controlChars[0];
    return;
  }
  if ((controlCode >= 40 && controlCode <= 49) || (controlCode >= 100 && controlCode <= 107)) {
    state.lastBackgroundAdded = controlChars[0];
    return;
  }
  if (controlCode === 0) {
    for (let i in state) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(state, i)) {
        delete state[i];
      }
    }
    return;
  }
  let info = codeCache[controlChars[0]];
  if (info) {
    state[info.set] = info.to;
  }
}

function readState(line) {
  let code = codeRegex(true);
  let controlChars = code.exec(line);
  let state = {};
  while (controlChars !== null) {
    updateState(state, controlChars);
    controlChars = code.exec(line);
  }
  return state;
}

function unwindState(state, ret) {
  let lastBackgroundAdded = state.lastBackgroundAdded;
  let lastForegroundAdded = state.lastForegroundAdded;

  delete state.lastBackgroundAdded;
  delete state.lastForegroundAdded;

  Object.keys(state).forEach(function (key) {
    if (state[key]) {
      ret += codeCache[key].off;
    }
  });

  if (lastBackgroundAdded && lastBackgroundAdded != '\u001b[49m') {
    ret += '\u001b[49m';
  }
  if (lastForegroundAdded && lastForegroundAdded != '\u001b[39m') {
    ret += '\u001b[39m';
  }

  return ret;
}

function rewindState(state, ret) {
  let lastBackgroundAdded = state.lastBackgroundAdded;
  let lastForegroundAdded = state.lastForegroundAdded;

  delete state.lastBackgroundAdded;
  delete state.lastForegroundAdded;

  Object.keys(state).forEach(function (key) {
    if (state[key]) {
      ret = codeCache[key].on + ret;
    }
  });

  if (lastBackgroundAdded && lastBackgroundAdded != '\u001b[49m') {
    ret = lastBackgroundAdded + ret;
  }
  if (lastForegroundAdded && lastForegroundAdded != '\u001b[39m') {
    ret = lastForegroundAdded + ret;
  }

  return ret;
}

function truncateWidth(str, desiredLength) {
  if (str.length === strlen(str)) {
    return str.substr(0, desiredLength);
  }

  while (strlen(str) > desiredLength) {
    str = str.slice(0, -1);
  }

  return str;
}

function truncateWidthWithAnsi(str, desiredLength) {
  let code = codeRegex(true);
  let split = str.split(codeRegex());
  let splitIndex = 0;
  let retLen = 0;
  let ret = '';
  let myArray;
  let state = {};

  while (retLen < desiredLength) {
    myArray = code.exec(str);
    let toAdd = split[splitIndex];
    splitIndex++;
    if (retLen + strlen(toAdd) > desiredLength) {
      toAdd = truncateWidth(toAdd, desiredLength - retLen);
    }
    ret += toAdd;
    retLen += strlen(toAdd);

    if (retLen < desiredLength) {
      if (!myArray) {
        break;
      } // full-width chars may cause a whitespace which cannot be filled
      ret += myArray[0];
      updateState(state, myArray);
    }
  }

  return unwindState(state, ret);
}

function truncate(str, desiredLength, truncateChar) {
  truncateChar = truncateChar || '…';
  let lengthOfStr = strlen(str);
  if (lengthOfStr <= desiredLength) {
    return str;
  }
  desiredLength -= strlen(truncateChar);

  let ret = truncateWidthWithAnsi(str, desiredLength);

  ret += truncateChar;

  const hrefTag = '\x1B]8;;\x07';

  if (str.includes(hrefTag) && !ret.includes(hrefTag)) {
    ret += hrefTag;
  }

  return ret;
}

function defaultOptions() {
  return {
    chars: {
      top: '─',
      'top-mid': '┬',
      'top-left': '┌',
      'top-right': '┐',
      bottom: '─',
      'bottom-mid': '┴',
      'bottom-left': '└',
      'bottom-right': '┘',
      left: '│',
      'left-mid': '├',
      mid: '─',
      'mid-mid': '┼',
      right: '│',
      'right-mid': '┤',
      middle: '│',
    },
    truncate: '…',
    colWidths: [],
    rowHeights: [],
    colAligns: [],
    rowAligns: [],
    style: {
      'padding-left': 1,
      'padding-right': 1,
      head: ['red'],
      border: ['grey'],
      compact: false,
    },
    head: [],
  };
}

function mergeOptions(options, defaults) {
  options = options || {};
  defaults = defaults || defaultOptions();
  let ret = Object.assign({}, defaults, options);
  ret.chars = Object.assign({}, defaults.chars, options.chars);
  ret.style = Object.assign({}, defaults.style, options.style);
  return ret;
}

// Wrap on word boundary
function wordWrap(maxLength, input) {
  let lines = [];
  let split = input.split(/(\s+)/g);
  let line = [];
  let lineLength = 0;
  let whitespace;
  for (let i = 0; i < split.length; i += 2) {
    let word = split[i];
    let newLength = lineLength + strlen(word);
    if (lineLength > 0 && whitespace) {
      newLength += whitespace.length;
    }
    if (newLength > maxLength) {
      if (lineLength !== 0) {
        lines.push(line.join(''));
      }
      line = [word];
      lineLength = strlen(word);
    } else {
      line.push(whitespace || '', word);
      lineLength = newLength;
    }
    whitespace = split[i + 1];
  }
  if (lineLength) {
    lines.push(line.join(''));
  }
  return lines;
}

// Wrap text (ignoring word boundaries)
function textWrap(maxLength, input) {
  let lines = [];
  let line = '';
  function pushLine(str, ws) {
    if (line.length && ws) line += ws;
    line += str;
    while (line.length > maxLength) {
      lines.push(line.slice(0, maxLength));
      line = line.slice(maxLength);
    }
  }
  let split = input.split(/(\s+)/g);
  for (let i = 0; i < split.length; i += 2) {
    pushLine(split[i], i && split[i - 1]);
  }
  if (line.length) lines.push(line);
  return lines;
}

function multiLineWordWrap(maxLength, input, wrapOnWordBoundary = true) {
  let output = [];
  input = input.split('\n');
  const handler = wrapOnWordBoundary ? wordWrap : textWrap;
  for (let i = 0; i < input.length; i++) {
    output.push.apply(output, handler(maxLength, input[i]));
  }
  return output;
}

function colorizeLines(input) {
  let state = {};
  let output = [];
  for (let i = 0; i < input.length; i++) {
    let line = rewindState(state, input[i]);
    state = readState(line);
    let temp = Object.assign({}, state);
    output.push(unwindState(temp, line));
  }
  return output;
}

/**
 * Credit: Matheus Sampaio https://github.com/matheussampaio
 */
function hyperlink(url, text) {
  const OSC = '\u001B]';
  const BEL = '\u0007';
  const SEP = ';';

  return [OSC, '8', SEP, SEP, url || text, BEL, text, OSC, '8', SEP, SEP, BEL].join('');
}

module.exports = {
  strlen: strlen,
  repeat: repeat,
  pad: pad,
  truncate: truncate,
  mergeOptions: mergeOptions,
  wordWrap: multiLineWordWrap,
  colorizeLines: colorizeLines,
  hyperlink,
};


/***/ }),

/***/ 8926:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var util = __nccwpck_require__(9023);
var ansiStyles = colors.styles = __nccwpck_require__(3680);
var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);

colors.supportsColor = (__nccwpck_require__(2663).supportsColor);

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function() {
  colors.enabled = true;
};

colors.disable = function() {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function(str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

// eslint-disable-next-line no-unused-vars
var stylize = colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  var styleMap = ansiStyles[style];

  // Stylize should work for non-ANSI styles, too
  if(!styleMap && style in colors){
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function() {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function(key) {
    ansiStyles[key].closeRe =
      new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function() {
        return build(this._styles.concat(key));
      },
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);

  var str = args.map(function(arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    if (newLinesPresent) {
      str = str.replace(newLineRegex, function(match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function(theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' +
      'If you are trying to set a theme from a file, it is now your (the ' +
      'caller\'s) responsibility to require the file.  The old syntax ' +
      'looked like colors.setTheme(__dirname + ' +
      '\'/../themes/generic-logging.js\'); The new syntax looks like '+
      'colors.setTheme(require(__dirname + ' +
      '\'/../themes/generic-logging.js\'));');
    return;
  }
  for (var style in theme) {
    (function(style) {
      colors[style] = function(str) {
        if (typeof theme[style] === 'object') {
          var out = str;
          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function(name) {
    ret[name] = {
      get: function() {
        return build([name]);
      },
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
};

// custom formatter methods
colors.trap = __nccwpck_require__(2255);
colors.zalgo = __nccwpck_require__(2799);

// maps
colors.maps = {};
colors.maps.america = __nccwpck_require__(602)(colors);
colors.maps.zebra = __nccwpck_require__(4762)(colors);
colors.maps.rainbow = __nccwpck_require__(7792)(colors);
colors.maps.random = __nccwpck_require__(6407)(colors);

for (var map in colors.maps) {
  (function(map) {
    colors[map] = function(str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());


/***/ }),

/***/ 2255:
/***/ ((module) => {

module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
      '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
      '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240'],
  };
  text.forEach(function(c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};


/***/ }),

/***/ 2799:
/***/ ((module) => {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;
        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};



/***/ }),

/***/ 8721:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var colors = __nccwpck_require__(8926);

module['exports'] = function() {
  //
  // Extends prototype of native string object to allow for "foo".red syntax
  //
  var addProperty = function(color, func) {
    String.prototype.__defineGetter__(color, func);
  };

  addProperty('strip', function() {
    return colors.strip(this);
  });

  addProperty('stripColors', function() {
    return colors.strip(this);
  });

  addProperty('trap', function() {
    return colors.trap(this);
  });

  addProperty('zalgo', function() {
    return colors.zalgo(this);
  });

  addProperty('zebra', function() {
    return colors.zebra(this);
  });

  addProperty('rainbow', function() {
    return colors.rainbow(this);
  });

  addProperty('random', function() {
    return colors.random(this);
  });

  addProperty('america', function() {
    return colors.america(this);
  });

  //
  // Iterate through all default styles and colors
  //
  var x = Object.keys(colors.styles);
  x.forEach(function(style) {
    addProperty(style, function() {
      return colors.stylize(this, style);
    });
  });

  function applyTheme(theme) {
    //
    // Remark: This is a list of methods that exist
    // on String that you should not overwrite.
    //
    var stringPrototypeBlacklist = [
      '__defineGetter__', '__defineSetter__', '__lookupGetter__',
      '__lookupSetter__', 'charAt', 'constructor', 'hasOwnProperty',
      'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString',
      'valueOf', 'charCodeAt', 'indexOf', 'lastIndexOf', 'length',
      'localeCompare', 'match', 'repeat', 'replace', 'search', 'slice',
      'split', 'substring', 'toLocaleLowerCase', 'toLocaleUpperCase',
      'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight',
    ];

    Object.keys(theme).forEach(function(prop) {
      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
        console.log('warn: '.red + ('String.prototype' + prop).magenta +
          ' is probably something you don\'t want to override.  ' +
          'Ignoring style name');
      } else {
        if (typeof(theme[prop]) === 'string') {
          colors[prop] = colors[theme[prop]];
          addProperty(prop, function() {
            return colors[prop](this);
          });
        } else {
          var themePropApplicator = function(str) {
            var ret = str || this;
            for (var t = 0; t < theme[prop].length; t++) {
              ret = colors[theme[prop][t]](ret);
            }
            return ret;
          };
          addProperty(prop, themePropApplicator);
          colors[prop] = function(str) {
            return themePropApplicator(str);
          };
        }
      }
    });
  }

  colors.setTheme = function(theme) {
    if (typeof theme === 'string') {
      console.log('colors.setTheme now only accepts an object, not a string. ' +
        'If you are trying to set a theme from a file, it is now your (the ' +
        'caller\'s) responsibility to require the file.  The old syntax ' +
        'looked like colors.setTheme(__dirname + ' +
        '\'/../themes/generic-logging.js\'); The new syntax looks like '+
        'colors.setTheme(require(__dirname + ' +
        '\'/../themes/generic-logging.js\'));');
      return;
    } else {
      applyTheme(theme);
    }
  };
};


/***/ }),

/***/ 7748:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var colors = __nccwpck_require__(8926);
module['exports'] = colors;

// Remark: By default, colors will add style properties to String.prototype.
//
// If you don't wish to extend String.prototype, you can do this instead and
// native String will not be touched:
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
__nccwpck_require__(8721)();


/***/ }),

/***/ 602:
/***/ ((module) => {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    if (letter === ' ') return letter;
    switch (i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter);
      case 2: return colors.blue(letter);
    }
  };
};


/***/ }),

/***/ 7792:
/***/ ((module) => {

module['exports'] = function(colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function(letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};



/***/ }),

/***/ 6407:
/***/ ((module) => {

module['exports'] = function(colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
    'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
    'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function(letter, i, exploded) {
    return letter === ' ' ? letter :
      colors[
          available[Math.round(Math.random() * (available.length - 2))]
      ](letter);
  };
};


/***/ }),

/***/ 4762:
/***/ ((module) => {

module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};


/***/ }),

/***/ 3680:
/***/ ((module) => {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49],

};

Object.keys(codes).forEach(function(key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});


/***/ }),

/***/ 7755:
/***/ ((module) => {

"use strict";
/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/



module.exports = function(flag, argv) {
  argv = argv || process.argv;

  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);

  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};


/***/ }),

/***/ 2663:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/



var os = __nccwpck_require__(857);
var hasFlag = __nccwpck_require__(7755);

var env = process.env;

var forceColor = void 0;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true')
           || hasFlag('color=always')) {
  forceColor = true;
}
if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0
    || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full')
      || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');
    if (Number(process.versions.node.split('.')[0]) >= 8
        && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function(sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    );
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Hyper':
        return 3;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  var level = supportsColor(stream);
  return translateLevel(level);
}

module.exports = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr),
};


/***/ }),

/***/ 872:
/***/ ((module) => {

"use strict";


module.exports = function () {
  // https://mths.be/emoji
  return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
};


/***/ }),

/***/ 3934:
/***/ (function(module, exports) {

/*! Human readable numbers - v0.9 - 2018; Licensed MIT */
(function(){var PREFIXES={24:"Y",21:"Z",18:"E",15:"P",12:"T",9:"G",6:"M",3:"k",0:"","-3":"m","-6":"µ","-9":"n","-12":"p","-15":"f","-18":"a","-21":"z","-24":"y"};function getExponent(n){if(n===0){return 0}return Math.floor(Math.log10(Math.abs(n)))}function precise(n){return Number.parseFloat(n.toPrecision(3))}function toHumanString(sn){var n=precise(Number.parseFloat(sn));var e=Math.max(Math.min(3*Math.floor(getExponent(n)/3),24),-24);return precise(n/Math.pow(10,e)).toString()+PREFIXES[e]}var HRNumbers={toHumanString:toHumanString};if(typeof define=="function"&&define.amd){define([],function(){return HRNumbers})}else if(true){exports=module.exports=HRNumbers}else{}}).call(this);


/***/ }),

/***/ 298:
/***/ ((module) => {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const UNDEFINED = undefined
const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'

// The characters that carry a meaning of their own inside a regular
//   expression, so a literal one has to be escaped before it is emitted.
const REGEX_LITERAL_SPECIAL = /[.*+?()[\]{}^$|\\/]/
// A line of only spaces is blank -- the trailing-space trimming empties it --
//   but a line holding a tab is a pattern for a tab-named path, since git
//   never trims a tab.
// A leading BOM is removed during compilation, so reject a line that would
//   become empty after removing it and trimming spaces.
const REGEX_TEST_BLANK_LINE = /^\uFEFF? *$/
const REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g

// Invalid:
// - /foo,
// - ./foo,
// - ../foo,
// - .
// - ..
// Valid:
// - .foo
const DOUBLE_SLASH = '//'
const SLASH_CODE = 47
const DOT_CODE = 46


const SLASH = '/'

// Do not use ternary expression here, since "istanbul ignore next" is buggy
let TMP_KEY_IGNORE = 'node-ignore'
/* istanbul ignore else */
if (typeof Symbol !== 'undefined') {
  TMP_KEY_IGNORE = Symbol.for('node-ignore')
}
const KEY_IGNORE = TMP_KEY_IGNORE

const define = (object, key, value) => {
  Object.defineProperty(object, key, {value})
  return value
}

const RETURN_FALSE = () => false

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > The range notation, e.g. [a-zA-Z],
// > can be used to match one of the characters in a range.
//
// gitignore(5) defers to fnmatch(3) for this, and git implements it in
//   `wildmatch.c`.  A bracket expression has a sub-grammar of its own, which
//   is neither the surrounding pattern grammar nor the JavaScript one:
//
//   - a `]` right after `[` or `[!` is a literal member, not the terminator
//   - `[:alpha:]` names one of twelve POSIX classes
//   - `\` escapes the next member, `]` included
//   - `*`, `?` and `.` are plain literal members
//   - an unterminated expression makes the whole pattern match nothing
//
// which means the expression can not be located -- let alone translated -- by
//   a regular expression.  It is scanned out of the pattern before the
//   replacers below run, and put back once they are done, so that neither the
//   metacharacter escaper nor the `?` / `*` replacers ever see its body.

// git classifies with its own ASCII-only ctype macros (`wildmatch.c`), never
//   with the C library ones, so these must not be mapped onto `\d` / `\w` /
//   `\s`, which are wider.  `/` is left out of every expansion, because a
//   bracket expression never matches a path separator.
const POSIX_CLASSES = {
  alnum: '0-9A-Za-z',
  alpha: 'A-Za-z',
  blank: ' \\t',
  cntrl: '\\x00-\\x1f\\x7f',
  digit: '0-9',
  graph: '!-.0-~',
  lower: 'a-z',
  print: ' -.0-~',
  punct: '!-.:-@\\[-`{-~',
  // git's `sane-ctype.h` classifies \v and \f as control, not space,
  //   unlike C's `isspace`
  space: ' \\t\\n\\r',
  upper: 'A-Z',
  xdigit: '0-9A-Fa-f'
}

const CLASS_MEMBERS_TO_ESCAPE = '\\]^-['

const escapeMember = char => CLASS_MEMBERS_TO_ESCAPE.indexOf(char) < 0
  ? char
  : ESCAPE + char

// > if (matched == negated || ((flags & WM_PATHNAME) && text_ch == '/'))
// >   return WM_ABORT_TO_STARSTAR;                     (git, `wildmatch.c`)
// A bracket expression never matches a path separator, whatever its members
//   say, so a negated class gets `/` as one more excluded character, while a
//   plain one -- where a literal member or a range could still let `/` in --
//   is guarded with a lookahead, `/` being impossible to subtract from a
//   JavaScript character class.
const NON_SLASH = '(?!\\/)'

const classSource = (negated, body) => {
  if (negated) {
    return `[^\\/${body}]`
  }

  const source = `[${body}]`

  return new RegExp(source).test('/')
    ? NON_SLASH + source
    : source
}

// Scan the bracket expression that starts at `pattern[start] === '['`,
//   mirroring the member loop of git's `wildmatch.c`.
// @returns {{end: number, source: string} | null} `null` if the expression is
//   never terminated, which makes the whole pattern match nothing.
const scanBracket = (pattern, start) => {
  const {length} = pattern
  let index = start + 1
  let negated = EMPTY

  const lead = pattern[index]
  if (lead === '!' || lead === '^') {
    negated = '^'
    index ++
  }

  let body = EMPTY

  // The member a `-` could start a range from, or EMPTY when the previous
  //   member can not open one (start of the body, or a range / POSIX class
  //   that has just closed)
  let prev = EMPTY

  // git scans the members with a do-while, so the first one is consumed
  //   unconditionally.  That is the whole reason a leading `]` is a member
  //   and not the terminator.
  for (;;) {
    const char = pattern[index]

    if (char === UNDEFINED) {
      return null
    }

    if (char === ESCAPE) {
      const escaped = pattern[index + 1]
      if (escaped === UNDEFINED) {
        return null
      }
      body += escapeMember(escaped)
      prev = escaped
      index ++
    } else if (
      char === '-'
      && prev
      && index + 1 < length
      && pattern[index + 1] !== ']'
    ) {
      index ++
      let to = pattern[index]
      if (to === ESCAPE) {
        // A pattern can not end on a lone backslash -- `checkPattern` has
        //   already thrown it away -- so there is an upper bound to read.
        to = pattern[index += 1]
      }
      // An out-of-order range matches nothing in git but is a syntax error in
      //   JavaScript, so it is dropped.  Its lower bound stays: git tests it
      //   as a plain member before it ever looks at the `-`, so `[c-a]` does
      //   match `c`.
      if (prev <= to) {
        body += `-${escapeMember(to)}`
      }
      prev = EMPTY
    } else if (char === '[' && pattern[index + 1] === ':') {
      const nameStart = index + 2
      let end = nameStart
      while (end < length && pattern[end] !== ']') {
        end ++
      }

      if (end === length) {
        return null
      }

      if (end > nameStart && pattern[end - 1] === ':') {
        const expanded = POSIX_CLASSES[pattern.slice(nameStart, end - 1)]

        // An unknown class name makes the whole pattern match nothing
        if (expanded === UNDEFINED) {
          return null
        }

        body += expanded
        prev = EMPTY
        index = end
      } else {
        // No `:]` to close it, so the `[` is a plain member and scanning
        //   resumes right after it.
        body += escapeMember('[')
        prev = '['
        index = nameStart - 2
      }
    } else {
      body += escapeMember(char)
      prev = char
    }

    index ++

    if (pattern[index] === ']') {
      return {
        end: index,
        source: classSource(negated, body)
      }
    }
  }
}

// An empty JavaScript class can never match, which is how a pattern that git
//   gives up on (`WM_ABORT_ALL`) is expressed here.
const NEVER_MATCH = '[]'

// A NUL can appear in neither a `.gitignore` line nor a path, which makes it
//   the one safe placeholder character.  A literal one in the pattern is
//   held aside all the same, so a collision is impossible by construction.
const PLACEHOLDER = '\u0000'
const REGEX_RESTORE_PLACEHOLDER = new RegExp(
  `${PLACEHOLDER}(\\d+)${PLACEHOLDER}`, 'g'
)

// The one wildcard the chain does not expand for itself is a trailing `*`. How
//   it expands depends on the mode (`regex` vs `checkRegex`), so `_make` is
//   left to do it, and until then the pending wildcard travels as this marker.
//   That is what keeps it apart from a user-escaped literal `\*`: the unescape
//   steps collapse the escaped one to the exact `\*` a wildcard would leave
//   behind, so by the time `_make` runs the two are otherwise the same string
//   and a literal star gets wrongly rewritten into a wildcard. This marker is a
//   private-use character no compiled pattern carries, and it never survives
//   into a `RegExp` -- `_make` always turns it back into a real wildcard first.
const TRAILING_WILDCARD = '\uE000'

// Replace every bracket expression with a placeholder the replacers below
//   leave alone, and translate it separately.
const extractBrackets = pattern => {
  const sources = []
  const hold = source =>
    `${PLACEHOLDER}${sources.push(source) - 1}${PLACEHOLDER}`

  const {length} = pattern
  let out = EMPTY
  let index = 0

  while (index < length) {
    const char = pattern[index]

    if (char === ESCAPE) {
      // > Put a backslash ("\") in front of ... a character to make it literal.
      //                                            (gitignore(5) -> fnmatch(3))
      // A backslash quotes the next character, whatever it is, so `\d` is a
      //   literal `d`, not the regex digit class, and `\?` is a literal `?`,
      //   not a wildcard. Held aside as its literal here, the escape never
      //   reaches the replacers below, which would otherwise let `\d`, `\b`,
      //   `\1`, `\/` keep their regular-expression meaning, and would turn a
      //   `\?` into `[^\/]`.
      //
      // Four escapes are left for the chain, each with dedicated handling it
      //   would be wrong to bypass: `\*` (a literal star, told apart from a
      //   wildcard by `TRAILING_WILDCARD` and the wildcard replacers), `\[`
      //   (a literal bracket, the one `[` the bracket replacer still expects),
      //   `\ ` (a quoted trailing space), and `\\` (a literal backslash). A
      //   lone trailing backslash never reaches here -- `checkPattern` throws
      //   it out first.
      const escaped = pattern[index + 1]

      if (
        escaped === '*'
        || escaped === '['
        || escaped === SPACE
        || escaped === ESCAPE
      ) {
        out += pattern.slice(index, index + 2)
      } else {
        out += hold(
          REGEX_LITERAL_SPECIAL.test(escaped)
            ? ESCAPE + escaped
            : escaped
        )
      }

      index += 2
    } else if (char === PLACEHOLDER) {
      // Hold a literal placeholder character aside as well, so that pattern
      //   text can never be mistaken for a placeholder we emitted.
      out += hold(`[${PLACEHOLDER}]`)
      index ++
    } else if (char === '[') {
      const scanned = scanBracket(pattern, index)

      if (scanned === null) {
        // git gives up on the whole pattern (`WM_ABORT_ALL`), so whatever
        //   follows can not make it match either.
        out += hold(NEVER_MATCH)
        index = length
      } else {
        out += hold(scanned.source)
        index = scanned.end + 1
      }
    } else {
      out += char
      index ++
    }
  }

  return {
    source: out,
    sources
  }
}

// A step of the chain below is normally a `[matcher, replacer]` pair handed
//   to `String.replace`. `DIRECT` marks the ones that are plain string work
//   instead, and take `(source, pattern)`.
//
// Anchoring the two ends is exactly that -- a test of one character and a
//   concatenation -- and putting it through the regular expression engine
//   cost a third of this chain for nothing: 167ns where 10ns does the same
//   job. The two are still steps in the same list, in the same places,
//   because their position in the order is part of what they mean.
const DIRECT = null

// A separator at the beginning or in the middle of a pattern, as opposed to
//   one at the very end.
const REGEX_INNER_SLASH = /\/(?!$)/

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
// The chain that turns one gitignore pattern into a regular expression
//   source, in order. A step is either
//
//   [matcher, replacer]            handed to `String.replace`
//   [matcher, replacer, required]  the same, but skipped outright unless
//                                    `required` appears in the string, which
//                                    the matcher cannot match without
//   [DIRECT, transform]            plain string work, taking (source, pattern)
//
// The `required` character is only ever a shortcut: finding it does not mean
//   the matcher will match, and not finding it means it cannot. It is there
//   because scanning for one character costs a fraction of running a matcher
//   that then finds nothing -- for the wildcard step, whose `[^\\]+`
//   backtracks its way through the whole string before giving up, 11ns
//   against 400ns.
const REPLACERS = [

  [
    // Remove BOM
    // TODO:
    // Other similar zero-width characters?
    /^\uFEFF/,
    () => EMPTY,
    '\uFEFF'
  ],

  [
    // A trailing line terminator, left on when a whole file's contents are
    //   added as one pattern rather than split into lines. git never sees one
    //   -- it reads a `.gitignore` line by line -- so it is not part of the
    //   pattern and is dropped here, apart from the trailing-space trimming,
    //   which follows git in touching spaces and nothing else.
    /[\r\n]+$/,
    () => EMPTY
  ],

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // Only spaces, never tabs or other whitespace: git trims a trailing run
    //   of `' '` and nothing else (dir.c, `trim_trailing_spaces`, a single
    //   `case ' '`), so a pattern ending in a tab keeps it as a literal.
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a ) -> (a)
    // (a \ ) -> (a  )
    /((?:\\\\)*?)(\\? +)$/,
    (_, m1, m2) => m1 + (
      m2.indexOf('\\') === 0
        ? SPACE
        : EMPTY
    )
  ],

  // Replace (\ ) with ' '
  // Only a space: an escaped tab or other whitespace is already a literal by
  //   the time it reaches here, and a bare tab must be left as one, not turned
  //   into a space.
  // (\ ) -> ' '
  // (\\ ) -> '\\ '
  // (\\\ ) -> '\\ '
  [
    /(\\+?) /g,
    (_, m1) => {
      const {length} = m1
      return m1.slice(0, length - length % 2) + SPACE
    }
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]',
    '?'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^',
    SLASH
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/',
    SLASH
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*(?:\\\*\\\*\\\/)+/,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?',
    '*'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    DIRECT,
    (source, pattern) => {
      // Nothing to anchor to, or already anchored
      if (!source || source[0] === '^') {
        return source
      }

      // If has a slash `/` at the beginning or middle
      const anchor = !REGEX_INNER_SLASH.test(pattern)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'

      return anchor + source
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/ at the end of the pattern, i.e. a trailing `'/**/'`
      // > A trailing `"/**/"` (a trailing `"/**"` restricted to directories)
      // >   matches everything inside, but it should not match the current
      // >   folder itself, so it requires at least one directory segment.
      // 'a/**/' matches 'a/b/', 'a/x/y/' but not 'a/'
      ? str.slice(index + 6) === '\\/'
        ? '(?:\\/[^\\/]+)+'

        // case: /**/
        // > A slash followed by two consecutive asterisks then a slash matches
        // >   zero or more directories.
        // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
        // '/**/'
        : '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+',
    '*'
  ],

  // normal intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule,
    //    coz trailing single wildcard will be handed by [trailing wildcard]
    /(^|[^\\]+)(\\\*)+(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1, p2) => {
      // 1.
      // > An asterisk "*" matches anything except a slash.
      // 2.
      // > Other consecutive asterisks are considered regular asterisks
      // > and will match according to the previous rules.
      const unescaped = p2.replace(/\\\*/g, '[^\\/]*')
      return p1 + unescaped
    },
    '*'
  ],

  // trailing wildcard, held apart from a literal star
  [
    // The step above leaves a trailing `*` alone, so a single `\*` is all that
    //   can be left at the end here. Whether it is a wildcard or a literal
    //   turns on the backslashes the user put in front of it: the escaper has
    //   since doubled every one, so what stands here is those `2N` doubled
    //   backslashes and then the star's own escape. An even number of the
    //   original `N` leaves the star unescaped -- a wildcard -- and an odd
    //   number escapes it -- a literal. This runs while the two are still
    //   distinct, before the unescape steps below collapse the literal onto
    //   the very `\*` a wildcard leaves behind.
    /(^|[^\\])((?:\\\\)*)\\\*$/,

    (match, p1, p2) =>
      // `p2` holds the doubled user backslashes; half of them is `N`.
      (p2.length / 2) % 2 === 0
        // A real wildcard: carry it to `_make` as the marker, so the unescape
        //   steps and the trailing-wildcard rewrite can never mistake it for a
        //   literal `\*` (nor the reverse).
        ? p1 + p2 + TRAILING_WILDCARD
        // A literal star: leave it exactly as it stands for the unescape steps.
        : match,
    '*'
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE,
    ESCAPE + ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE,
    ESCAPE + ESCAPE
  ],

  [
    // Every real bracket expression -- POSIX classes included -- has already
    //   been held aside by `extractBrackets`, so the only `[` left in the
    //   pattern is an escaped, literal one.

    // `\` is escaped by step 3
    /\\\[([^\]/]*?)(\\*)($|\])/g,

    // '\\[bar]' -> '\\\\[bar\\]'
    (match, range, endEscape, close) =>
      `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`,
    '['
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    DIRECT,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    source => {
      const last = source[source.length - 1]

      // The pattern is empty, or ends in the pending trailing wildcard the next
      //   step owns. A trailing `*` that is not the marker is a literal star,
      //   which anchors like any other final character.
      if (!last || last === TRAILING_WILDCARD) {
        return source
      }

      return last === SLASH
        // foo/ will not match 'foo'
        ? `${source}$`
        // foo matches 'foo' and 'foo/'
        : `${source}(?=$|\\/$)`
    }
  ]
]

const REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\uE000$/
const MODE_IGNORE = 'regex'
const MODE_CHECK_IGNORE = 'checkRegex'
const UNDERSCORE = '_'

const TRAILING_WILD_CARD_REPLACERS = {
  [MODE_IGNORE] (_, p1) {
    const prefix = p1
      // '\^':
      // '/*' does not match EMPTY
      // '/*' does not match everything

      // '\\\/':
      // 'abc/*' does not match 'abc/'
      ? `${p1}[^/]+`

      // 'a*' matches 'a'
      // 'a*' matches 'aa'
      : '[^/]*'

    return `${prefix}(?=$|\\/$)`
  },

  [MODE_CHECK_IGNORE] (_, p1) {
    // When doing `git check-ignore`
    const prefix = p1
      // '\\\/':
      // 'abc/*' DOES match 'abc/' !
      ? `${p1}[^/]*`

      // 'a*' matches 'a'
      // 'a*' matches 'aa'
      : '[^/]*'

    return `${prefix}(?=$|\\/$)`
  }
}

const WILDCARD = '[^\\/]*'

// Where a run of non-slash wildcards is split by single fixed characters --
//   `[^/]*x[^/]*y...` -- the engine has many equivalent ways to lay the
//   input across the wildcards, and on input that does not match it works
//   through all of them, so the time grows with the number of wildcards
//   rather than the length of the path. Every wildcard but the last in such a
//   run can be pinned to stop at the character that follows it, which leaves
//   one way to lay out the input and no rewinding, without changing which
//   paths match: the fixed characters still bound the count, and the last
//   wildcard still absorbs the rest.
//
// The source is read one token at a time -- a wildcard, a single-character
//   piece (a literal, an escape, a class), or a parenthesised group or anchor
//   that ends the run -- so only a genuine wildcard is touched.
const pinWildcards = source => {
  if (source.indexOf(WILDCARD) < 0) {
    return source
  }

  const tokens = []
  const {length} = source
  let index = 0

  while (index < length) {
    const char = source[index]

    if (source.startsWith(WILDCARD, index)) {
      tokens.push({wildcard: true})
      index += WILDCARD.length
    } else if (char === '[') {
      let end = index + 1

      if (source[end] === '^') {
        end ++
      }

      if (source[end] === ']') {
        end ++
      }

      while (end < length && source[end] !== ']') {
        end += source[end] === ESCAPE
          ? 2
          : 1
      }

      end ++
      tokens.push({single: source.slice(index, end)})
      index = end
    } else if (char === ESCAPE) {
      tokens.push({single: source.slice(index, index + 2)})
      index += 2
    } else if (char === '(') {
      let depth = 0
      let end = index

      do {
        if (source[end] === ESCAPE) {
          end ++
        } else if (source[end] === '(') {
          depth ++
        } else if (source[end] === ')') {
          depth --
        }

        end ++
      } while (end < length && depth > 0)

      if ('*+?'.indexOf(source[end]) >= 0) {
        end ++
      }

      tokens.push({boundary: source.slice(index, end)})
      index = end
    } else if (char === '^' || char === '$') {
      tokens.push({boundary: char})
      index ++
    } else {
      tokens.push({single: char})
      index ++
    }
  }

  let out = EMPTY
  let run = []

  const flush = () => {
    let lastWildcard

    run.forEach((token, at) => {
      if (token.wildcard) {
        lastWildcard = at
      }
    })

    run.forEach((token, at) => {
      if (!token.wildcard) {
        out += token.single
        return
      }

      // A wildcard that is not the last in the run is always immediately
      //   followed by the single character that separates it from the next
      //   one, because a run never holds two wildcards in a row, so it can be
      //   pinned to stop there. The last wildcard stays as it is and takes up
      //   the rest.
      out += at === lastWildcard
        ? WILDCARD
        : `(?:(?!${run[at + 1].single})[^\\/])*`
    })

    run = []
  }

  tokens.forEach(token => {
    if (token.boundary === undefined) {
      run.push(token)
      return
    }

    flush()
    out += token.boundary
  })

  flush()

  return out
}

// @param {pattern}
const makeRegexPrefix = pattern => {
  const {source, sources} = extractBrackets(pattern)

  const replaced = REPLACERS.reduce(
    // A pass whose matcher finds nothing hands back the very string it was
    //   given, so asking first costs a search and saves a rewrite. Ten of the
    //   fifteen passes never fire for a typical .gitignore line, and between
    //   them they were 45% of this chain.
    (prev, [matcher, replacer, required]) => {
      if (matcher === DIRECT) {
        return replacer(prev, pattern)
      }

      if (required !== UNDEFINED && prev.indexOf(required) < 0) {
        return prev
      }

      // A pass whose matcher finds nothing hands back the very string it was
      //   given, so asking first costs a search and saves a rewrite.
      return matcher.test(prev)
        ? prev.replace(matcher, replacer.bind(pattern))
        : prev
    },
    source
  )

  // Most patterns hold no bracket expression at all, and then there is
  //   nothing to put back.
  return sources.length
    ? replaced.replace(
      REGEX_RESTORE_PLACEHOLDER,
      (match, index) => sources[index]
    )
    : replaced
}

// A trailing slash does not stop a pattern being basename-only: it restricts
//   the match to a directory, it does not let the pattern reach across one.
//   Everything else a pattern can hold -- a wildcard, a character class, an
//   escape -- stays inside a single path segment too, so a pattern with no
//   separator in it can only ever describe the last one.
const matchesBasename = body => {
  const index = body.indexOf(SLASH)

  return index < 0 || index === body.length - 1
}

// The last segment of a path, keeping a trailing slash, because a pattern that
//   ends in one matches only a directory.
// 'a/b/c.js' -> 'c.js';  'a/b/' -> 'b/';  'c.js' -> 'c.js' (no copy made)
const basenameOf = path => {
  const end = path.length - 1

  const index = path.lastIndexOf(
    SLASH,
    path[end] === SLASH
      ? end - 1
      : end
  )

  return index < 0
    ? path
    : path.slice(index + 1)
}

// The parent directory of a path, with its trailing separator, or EMPTY when
//   the path has none.
// 'a/b/c' -> 'a/b/';  'a/b/' -> 'a/';  'a' -> EMPTY;  'a/' -> EMPTY
//
// A path holding an empty segment has to be taken apart, because its
//   ancestors are not prefixes of it: the parent of 'a//b' is 'a/', not
//   'a//', and the parent of '/a/' is nothing at all. Both shapes reach here
//   -- 'a//b' is accepted outright, and `checkIgnore` does not put the path
//   it is given through the relative-path check.
//
// Every other path is a prefix of itself, and cutting one costs a fraction of
//   splitting it into an array and joining that back at every level: 73ns
//   against 207ns.
const parentOf = path => {
  if (
    path.charCodeAt(0) === SLASH_CODE
    || path.indexOf(DOUBLE_SLASH) >= 0
  ) {
    const slices = path.split(SLASH).filter(Boolean)

    slices.pop()

    return slices.length
      ? slices.join(SLASH) + SLASH
      : EMPTY
  }

  const end = path.length - 1

  // Look back from before a trailing separator, since that one belongs to the
  //   path itself.
  //
  // A negative place to start would be a trap here: `lastIndexOf` clamps one
  //   to 0 and searches there rather than reporting no match, so '/' would
  //   come back as its own parent and the walk would never end. It cannot
  //   happen -- that is the only path short enough to produce one, and the
  //   test above has already sent it the other way.
  const cut = path.lastIndexOf(
    SLASH,
    path.charCodeAt(end) === SLASH_CODE
      ? end - 1
      : end
  )

  return cut < 0
    ? EMPTY
    : path.slice(0, cut + 1)
}

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)
  && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern
.split(REGEX_SPLITALL_CRLF)
.filter(Boolean)

class IgnoreRule {
  constructor (
    pattern,
    mark,
    body,
    ignoreCase,
    negative,
    prefix
  ) {
    this.pattern = pattern
    this.mark = mark
    this.negative = negative

    define(this, 'body', body)
    define(this, 'ignoreCase', ignoreCase)
    define(this, 'regexPrefix', prefix)
  }

  // Worked out on first use and kept behind an own property, the way `regex`
  //   caches itself in `_regex`. Deciding it in the constructor instead would
  //   add a fourth `defineProperty` to every rule ever built, which cost 4% of
  //   every compile -- including the compiles of rules that are never matched
  //   against anything.
  get _basenameOnly () {
    return define(this, '_basenameOnly', matchesBasename(this.body))
  }

  get regex () {
    const key = UNDERSCORE + MODE_IGNORE

    if (this[key]) {
      return this[key]
    }

    return this._make(MODE_IGNORE, key)
  }

  get checkRegex () {
    const key = UNDERSCORE + MODE_CHECK_IGNORE

    if (this[key]) {
      return this[key]
    }

    return this._make(MODE_CHECK_IGNORE, key)
  }

  _make (mode, key) {
    const str = pinWildcards(this.regexPrefix.replace(
      REGEX_REPLACE_TRAILING_WILDCARD,

      // It does not need to bind pattern
      TRAILING_WILD_CARD_REPLACERS[mode]
    ))

    const regex = this.ignoreCase
      ? new RegExp(str, 'i')
      : new RegExp(str)

    return define(this, key, regex)
  }
}

const createRule = ({
  pattern,
  mark
}, ignoreCase) => {
  let negative = false
  let body = pattern

  // > An optional prefix "!" which negates the pattern;
  if (body.indexOf('!') === 0) {
    negative = true
    body = body.substr(1)
  }

  body = body
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regexPrefix = makeRegexPrefix(body)

  return new IgnoreRule(
    pattern,
    mark,
    body,
    ignoreCase,
    negative,
    regexPrefix
  )
}

class RuleManager {
  constructor (ignoreCase) {
    this._ignoreCase = ignoreCase
    this._rules = []

    // How many of the rules git would tag `EXC_FLAG_NODIR`.
    //
    // The scan uses it to decide, once for the whole set, whether handing
    //   those rules the basename is worth what it costs the others. The
    //   shortcut saves a full-path scan on every rule it applies to and costs
    //   a check on every rule it does not, so a set where almost nothing is
    //   basename-only comes out behind -- a 955 pattern set with 44 of them
    //   measured 19% slower with the shortcut always on.
    //
    // Deciding this by measurement rather than by meaning is safe: a
    //   basename-only pattern gives the very same answer against the whole
    //   path, it just takes longer to say so. The choice can only change how
    //   fast the scan runs, never what it returns.
    this._basenameCount = 0
  }

  _add (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules._rules)
      this._basenameCount += pattern._rules._basenameCount
      this._added = true
      return
    }

    if (isString(pattern)) {
      pattern = {
        pattern
      }
    }

    if (checkPattern(pattern.pattern)) {
      const rule = createRule(pattern, this._ignoreCase)
      this._added = true
      this._rules.push(rule)

      // Deliberately not `rule._basenameOnly`: reading that would materialise
      //   the rule's own copy, and the whole point of leaving it lazy is that
      //   a rule which is compiled and never matched never pays for it.
      if (matchesBasename(rule.body)) {
        this._basenameCount ++
      }
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._add, this)

    return this._added
  }

  // Test one single path without recursively checking parent directories
  //
  // - checkUnignored `boolean` whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.
  // - check `string` either `MODE_IGNORE` or `MODE_CHECK_IGNORE`

  // @returns {TestResult} true if a file is ignored
  test (path, checkUnignored, mode) {
    let ignored = false
    let unignored = false
    let matchedRule

    // Most of a .gitignore is patterns with no slash in them, and running
    //   those against the whole path makes the regular expression engine walk
    //   every directory name on the way to the only segment that could match.
    //   Handing them the basename instead is what git does, and it is where
    //   the time in a directory walk goes: the rule scan was two thirds of it.
    const rules = this._rules
    const {length} = rules

    const shortcut = this._basenameCount * 2 >= length

    const basename = shortcut
      ? basenameOf(path)
      : path

    // A plain loop rather than `forEach`, so that `path`, `basename` and
    //   `shortcut` are locals. As a callback they became closure variables,
    //   and reaching for one of those once per rule cost 10% of a scan over a
    //   large rule set -- more than the shortcut they were there to serve.
    for (let index = 0; index < length; index ++) {
      const rule = rules[index]
      const {negative} = rule

      //          |           ignored : unignored
      // -------- | ---------------------------------------
      // negative |   0:0   |   0:1   |   1:0   |   1:1
      // -------- | ------- | ------- | ------- | --------
      //     0    |  TEST   |  TEST   |  SKIP   |    X
      //     1    |  TESTIF |  SKIP   |  TEST   |    X

      // - SKIP: always skip
      // - TEST: always test
      // - TESTIF: only test if checkUnignored
      // - X: that never happen
      const skip = unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored

      if (!skip && rule[mode].test(
        shortcut && rule._basenameOnly
          ? basename
          : path
      )) {
        ignored = !negative
        unignored = negative

        matchedRule = negative
          ? UNDEFINED
          : rule
      }
    }

    const ret = {
      ignored,
      unignored
    }

    if (matchedRule) {
      ret.rule = matchedRule
    }

    return ret
  }
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

// > pathname should be a `path.relative()`d one
//
// The same thing `REGEX_TEST_INVALID_PATH` says, spelled out: a path is not
//   relative if it begins with a separator, or with `./` or `../`, or is
//   nothing but `.` or `..`. Every match is decided by the first three
//   characters, and this runs on every path handed to the library -- where it
//   was 55% of a cached lookup, more than the cache lookup itself.
const isNotRelative = path => {
  const first = path.charCodeAt(0)

  if (first === SLASH_CODE) {
    return true
  }

  if (first !== DOT_CODE) {
    return false
  }

  // '.'
  if (path.length === 1) {
    return true
  }

  const second = path.charCodeAt(1)

  // './'
  if (second === SLASH_CODE) {
    return true
  }

  if (second !== DOT_CODE) {
    return false
  }

  // '..' or '../'
  return path.length === 2 || path.charCodeAt(2) === SLASH_CODE
}

checkPath.isNotRelative = isNotRelative

// On windows, the following function will be replaced
/* istanbul ignore next */
checkPath.convert = p => p


class Ignore {
  constructor ({
    ignorecase = true,
    ignoreCase = ignorecase,
    allowRelativePaths = false
  } = {}) {
    define(this, KEY_IGNORE, true)

    this._rules = new RuleManager(ignoreCase)
    this._strictPathCheck = !allowRelativePaths
    this._initCache()
  }

  _initCache () {
    // A cache for the result of `.ignores()`
    this._ignoreCache = Object.create(null)

    // A cache for the result of `.test()`
    this._testCache = Object.create(null)
  }

  add (pattern) {
    if (this._rules.add(pattern)) {
      // Some rules have just added to the ignore,
      //   making the behavior changed,
      //   so we need to re-initialize the result cache
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(
      path,
      originalPath,
      this._strictPathCheck
        ? throwError
        : RETURN_FALSE
    )

    return this._t(path, cache, checkUnignored)
  }

  checkIgnore (path) {
    // If the path doest not end with a slash, `.ignores()` is much equivalent
    //   to `git check-ignore`
    if (path.charCodeAt(path.length - 1) !== SLASH_CODE) {
      return this.test(path)
    }

    const parentPath = parentOf(path)

    if (parentPath) {
      const parent = this._t(parentPath, this._testCache, true)

      if (parent.ignored) {
        return parent
      }
    }

    return this._rules.test(path, false, MODE_CHECK_IGNORE)
  }

  _t (
    // The path to be tested
    path,

    // The cache for the result of a certain checking
    cache,

    // Whether should check if the path is unignored
    checkUnignored
  ) {
    if (path in cache) {
      return cache[path]
    }

    const parentPath = parentOf(path)

    // If the path contains a parent directory, check the parent first
    const parent = parentPath
      ? this._t(parentPath, cache, checkUnignored)
      : UNDEFINED

    return cache[path] = parent && parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._rules.test(path, checkUnignored, MODE_IGNORE)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, RETURN_FALSE)

/* istanbul ignore next */
const setupWindows = () => {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


// Windows
// --------------------------------------------------------------
/* istanbul ignore next */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && process.platform === 'win32'
) {
  setupWindows()
}

// COMMONJS_EXPORTS ////////////////////////////////////////////////////////////

module.exports = factory

// Although it is an anti-pattern,
//   it is still widely misused by a lot of libraries in github
// Ref: https://github.com/search?q=ignore.default%28%29&type=code
factory.default = factory

module.exports.isPathValid = isPathValid

// For testing purposes
define(module.exports, Symbol.for('setupWindows'), setupWindows)


/***/ }),

/***/ 1579:
/***/ ((module) => {

/**
 * Expose `isDomain`.
 */

module.exports = isDomain;

/**
 * Matcher.
 */

var matcher = /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/;

/**
 * Loosely validate a domain `string`.
 *
 * @param {String} string
 * @return {Boolean}
 */

function isDomain(string){
  return matcher.test(string);
}

/***/ }),

/***/ 4519:
/***/ ((module) => {

"use strict";
/* eslint-disable yoda */


const isFullwidthCodePoint = codePoint => {
	if (Number.isNaN(codePoint)) {
		return false;
	}

	// Code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (
		codePoint >= 0x1100 && (
			codePoint <= 0x115F || // Hangul Jamo
			codePoint === 0x2329 || // LEFT-POINTING ANGLE BRACKET
			codePoint === 0x232A || // RIGHT-POINTING ANGLE BRACKET
			// CJK Radicals Supplement .. Enclosed CJK Letters and Months
			(0x2E80 <= codePoint && codePoint <= 0x3247 && codePoint !== 0x303F) ||
			// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
			(0x3250 <= codePoint && codePoint <= 0x4DBF) ||
			// CJK Unified Ideographs .. Yi Radicals
			(0x4E00 <= codePoint && codePoint <= 0xA4C6) ||
			// Hangul Jamo Extended-A
			(0xA960 <= codePoint && codePoint <= 0xA97C) ||
			// Hangul Syllables
			(0xAC00 <= codePoint && codePoint <= 0xD7A3) ||
			// CJK Compatibility Ideographs
			(0xF900 <= codePoint && codePoint <= 0xFAFF) ||
			// Vertical Forms
			(0xFE10 <= codePoint && codePoint <= 0xFE19) ||
			// CJK Compatibility Forms .. Small Form Variants
			(0xFE30 <= codePoint && codePoint <= 0xFE6B) ||
			// Halfwidth and Fullwidth Forms
			(0xFF01 <= codePoint && codePoint <= 0xFF60) ||
			(0xFFE0 <= codePoint && codePoint <= 0xFFE6) ||
			// Kana Supplement
			(0x1B000 <= codePoint && codePoint <= 0x1B001) ||
			// Enclosed Ideographic Supplement
			(0x1F200 <= codePoint && codePoint <= 0x1F251) ||
			// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
			(0x20000 <= codePoint && codePoint <= 0x3FFFD)
		)
	) {
		return true;
	}

	return false;
};

module.exports = isFullwidthCodePoint;
module.exports["default"] = isFullwidthCodePoint;


/***/ }),

/***/ 3173:
/***/ ((module) => {

"use strict";


const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

const $ = {
	enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0',

	// modifiers
	reset: init(0, 0),
	bold: init(1, 22),
	dim: init(2, 22),
	italic: init(3, 23),
	underline: init(4, 24),
	inverse: init(7, 27),
	hidden: init(8, 28),
	strikethrough: init(9, 29),

	// colors
	black: init(30, 39),
	red: init(31, 39),
	green: init(32, 39),
	yellow: init(33, 39),
	blue: init(34, 39),
	magenta: init(35, 39),
	cyan: init(36, 39),
	white: init(37, 39),
	gray: init(90, 39),
	grey: init(90, 39),

	// background colors
	bgBlack: init(40, 49),
	bgRed: init(41, 49),
	bgGreen: init(42, 49),
	bgYellow: init(43, 49),
	bgBlue: init(44, 49),
	bgMagenta: init(45, 49),
	bgCyan: init(46, 49),
	bgWhite: init(47, 49)
};

function run(arr, str) {
	let i=0, tmp, beg='', end='';
	for (; i < arr.length; i++) {
		tmp = arr[i];
		beg += tmp.open;
		end += tmp.close;
		if (str.includes(tmp.close)) {
			str = str.replace(tmp.rgx, tmp.close + tmp.open);
		}
	}
	return beg + str + end;
}

function chain(has, keys) {
	let ctx = { has, keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);
	ctx.grey = $.grey.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	return ctx;
}

function init(open, close) {
	let blk = {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
	return function (txt) {
		if (this !== void 0 && this.has !== void 0) {
			this.has.includes(open) || (this.has.push(open),this.keys.push(blk));
			return txt === void 0 ? this : $.enabled ? run(this.keys, txt+'') : txt+'';
		}
		return txt === void 0 ? chain([open], [blk]) : $.enabled ? run([blk], txt+'') : txt+'';
	};
}

module.exports = $;


/***/ }),

/***/ 994:
/***/ ((module) => {

"use strict";


function hasKey(obj, keys) {
	var o = obj;
	keys.slice(0, -1).forEach(function (key) {
		o = o[key] || {};
	});

	var key = keys[keys.length - 1];
	return key in o;
}

function isNumber(x) {
	if (typeof x === 'number') { return true; }
	if ((/^0x[0-9a-f]+$/i).test(x)) { return true; }
	return (/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/).test(x);
}

function isConstructorOrProto(obj, key) {
	return (key === 'constructor' && typeof obj[key] === 'function') || key === '__proto__';
}

module.exports = function (args, opts) {
	if (!opts) { opts = {}; }

	var flags = {
		bools: {},
		strings: {},
		unknownFn: null,
	};

	if (typeof opts.unknown === 'function') {
		flags.unknownFn = opts.unknown;
	}

	if (typeof opts.boolean === 'boolean' && opts.boolean) {
		flags.allBools = true;
	} else {
		[].concat(opts.boolean).filter(Boolean).forEach(function (key) {
			flags.bools[key] = true;
		});
	}

	var aliases = {};

	function aliasIsBoolean(key) {
		return aliases[key].some(function (x) {
			return flags.bools[x];
		});
	}

	Object.keys(opts.alias || {}).forEach(function (key) {
		aliases[key] = [].concat(opts.alias[key]);
		aliases[key].forEach(function (x) {
			aliases[x] = [key].concat(aliases[key].filter(function (y) {
				return x !== y;
			}));
		});
	});

	[].concat(opts.string).filter(Boolean).forEach(function (key) {
		flags.strings[key] = true;
		if (aliases[key]) {
			[].concat(aliases[key]).forEach(function (k) {
				flags.strings[k] = true;
			});
		}
	});

	var defaults = opts.default || {};

	var argv = { _: [] };

	function argDefined(key, arg) {
		return (flags.allBools && (/^--[^=]+$/).test(arg))
			|| flags.strings[key]
			|| flags.bools[key]
			|| aliases[key];
	}

	function setKey(obj, keys, value) {
		var o = obj;
		for (var i = 0; i < keys.length - 1; i++) {
			var key = keys[i];
			if (isConstructorOrProto(o, key)) { return; }
			if (o[key] === undefined) { o[key] = {}; }
			if (
				o[key] === Object.prototype
				|| o[key] === Number.prototype
				|| o[key] === String.prototype
			) {
				o[key] = {};
			}
			if (o[key] === Array.prototype) { o[key] = []; }
			o = o[key];
		}

		var lastKey = keys[keys.length - 1];
		if (isConstructorOrProto(o, lastKey)) { return; }
		if (
			o === Object.prototype
			|| o === Number.prototype
			|| o === String.prototype
		) {
			o = {};
		}
		if (o === Array.prototype) { o = []; }
		if (o[lastKey] === undefined || flags.bools[lastKey] || typeof o[lastKey] === 'boolean') {
			o[lastKey] = value;
		} else if (Array.isArray(o[lastKey])) {
			o[lastKey].push(value);
		} else {
			o[lastKey] = [o[lastKey], value];
		}
	}

	function setArg(key, val, arg) {
		if (arg && flags.unknownFn && !argDefined(key, arg)) {
			if (flags.unknownFn(arg) === false) { return; }
		}

		var value = !flags.strings[key] && isNumber(val)
			? Number(val)
			: val;
		setKey(argv, key.split('.'), value);

		(aliases[key] || []).forEach(function (x) {
			setKey(argv, x.split('.'), value);
		});
	}

	Object.keys(flags.bools).forEach(function (key) {
		setArg(key, defaults[key] === undefined ? false : defaults[key]);
	});

	var notFlags = [];

	if (args.indexOf('--') !== -1) {
		notFlags = args.slice(args.indexOf('--') + 1);
		args = args.slice(0, args.indexOf('--'));
	}

	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		var key;
		var next;

		if ((/^--.+=/).test(arg)) {
			// Using [\s\S] instead of . because js doesn't support the
			// 'dotall' regex modifier. See:
			// http://stackoverflow.com/a/1068308/13216
			var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
			key = m[1];
			var value = m[2];
			if (flags.bools[key]) {
				value = value !== 'false';
			}
			setArg(key, value, arg);
		} else if ((/^--no-.+/).test(arg)) {
			key = arg.match(/^--no-(.+)/)[1];
			setArg(key, false, arg);
		} else if ((/^--.+/).test(arg)) {
			key = arg.match(/^--(.+)/)[1];
			next = args[i + 1];
			if (
				next !== undefined
				&& !(/^(-|--)[^-]/).test(next)
				&& !flags.bools[key]
				&& !flags.allBools
				&& (aliases[key] ? !aliasIsBoolean(key) : true)
			) {
				setArg(key, next, arg);
				i += 1;
			} else if ((/^(true|false)$/).test(next)) {
				setArg(key, next === 'true', arg);
				i += 1;
			} else {
				setArg(key, flags.strings[key] ? '' : true, arg);
			}
		} else if ((/^-[^-]+/).test(arg)) {
			var letters = arg.slice(1, -1).split('');

			var broken = false;
			for (var j = 0; j < letters.length; j++) {
				next = arg.slice(j + 2);

				if (next === '-') {
					setArg(letters[j], next, arg);
					continue;
				}

				if ((/[A-Za-z]/).test(letters[j]) && next[0] === '=') {
					setArg(letters[j], next.slice(1), arg);
					broken = true;
					break;
				}

				if (
					(/[A-Za-z]/).test(letters[j])
					&& (/-?\d+(\.\d*)?(e-?\d+)?$/).test(next)
				) {
					setArg(letters[j], next, arg);
					broken = true;
					break;
				}

				if (letters[j + 1] && letters[j + 1].match(/\W/)) {
					setArg(letters[j], arg.slice(j + 2), arg);
					broken = true;
					break;
				} else {
					setArg(letters[j], flags.strings[letters[j]] ? '' : true, arg);
				}
			}

			key = arg.slice(-1)[0];
			if (!broken && key !== '-') {
				if (
					args[i + 1]
					&& !(/^(-|--)[^-]/).test(args[i + 1])
					&& !flags.bools[key]
					&& (aliases[key] ? !aliasIsBoolean(key) : true)
				) {
					setArg(key, args[i + 1], arg);
					i += 1;
				} else if (args[i + 1] && (/^(true|false)$/).test(args[i + 1])) {
					setArg(key, args[i + 1] === 'true', arg);
					i += 1;
				} else {
					setArg(key, flags.strings[key] ? '' : true, arg);
				}
			}
		} else {
			if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
				argv._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
			}
			if (opts.stopEarly) {
				argv._.push.apply(argv._, args.slice(i + 1));
				break;
			}
		}
	}

	Object.keys(defaults).forEach(function (k) {
		if (!hasKey(argv, k.split('.'))) {
			setKey(argv, k.split('.'), defaults[k]);

			(aliases[k] || []).forEach(function (x) {
				setKey(argv, x.split('.'), defaults[k]);
			});
		}
	});

	if (opts['--']) {
		argv['--'] = notFlags.slice();
	} else {
		notFlags.forEach(function (k) {
			argv._.push(k);
		});
	}

	return argv;
};


/***/ }),

/***/ 3808:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var Fs = __nccwpck_require__(9896),
    Path = __nccwpck_require__(6928);

exports.choose = choose;
exports.noun = noun;
exports.verb = verb;
exports.adjective = adjective;
exports.read = read;
exports.generator = generator;
exports.Dictionary = Dictionary;
exports.Generator = Generator;


// ## Shortcuts ##

function noun(opt) {
  return read(builtin('nouns'), opt);
}

function verb(opt) {
  return read(builtin('verbs'), opt);
}

function adjective(opt) {
  return read(builtin('adjectives'), opt);
}

function read(path, opt) {
  return (new Dictionary()).read(path, opt);
}

function generator(dicts, opt) {
  var gen = new Generator(opt);

  dicts.forEach(function(dict) {
    gen.use(dict, opt);
  });

  return gen;
}

var _names;
function choose() {
  if (!_names)
    _names = generator([adjective, noun]);
  return _names.choose();
}


// ## Dictionary ##

function Dictionary() {
  this.words = [];
}

Dictionary.prototype.read = function(path, opt) {
  var words = this.words,
      maxSize = opt && opt.maxSize,
      enc = (opt && opt.encoding) || 'utf-8',
      data = Fs.readFileSync(path, enc);

  data.split(/\s+/).forEach(function(word) {
    if (word && (!maxSize || word.length <= maxSize))
      words.push(word);
  });

  return this;
};

Dictionary.prototype.choose = function() {
  return this.words[random(this.words.length)];
};


// ## Generator ##

function Generator(opt) {
  this.dicts = [];
  this.glue = (opt && opt.glue) || '-';
}

Generator.prototype.choose = function() {
  var dicts = this.dicts,
      size = dicts.length;

  if (size === 0)
    throw new Error('no available dictionaries.');

  if (size === 1)
    return dicts[0].choose();

  var probe, tries = 10, used = {};
  var seq = dicts.map(function(dict) {
    for (var i = 0; i < tries; i++) {
      if (!used.hasOwnProperty(probe = dict.choose()))
        break;
    }

    if (i === tries)
      throw new Error('too many tries to find a unique word');

    used[probe] = true;
    return probe;
  });

  return seq.join(this.glue);
};

Generator.prototype.use = function(dict, opt) {
  var dicts = this.dicts;

  if (dict instanceof Dictionary)
    dicts.push(dict);
  if (typeof dict == 'string')
    dicts.push((new Dictionary()).read(dict, opt));
  else if (typeof dict == 'function')
    dicts.push(dict(opt));
  else
    next(new Error('unrecognized dictionary type'));

  return this;
};


// ## Helpers ##

function builtin(name) {
  return __nccwpck_require__.ab + "dict/" + name + '.txt';
}

function random(limit) {
  return Math.floor(Math.random() * limit);
}


/***/ }),

/***/ 9803:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2203)

module.exports = MuteStream

// var out = new MuteStream(process.stdout)
// argument auto-pipes
function MuteStream (opts) {
  Stream.apply(this)
  opts = opts || {}
  this.writable = this.readable = true
  this.muted = false
  this.on('pipe', this._onpipe)
  this.replace = opts.replace

  // For readline-type situations
  // This much at the start of a line being redrawn after a ctrl char
  // is seen (such as backspace) won't be redrawn as the replacement
  this._prompt = opts.prompt || null
  this._hadControl = false
}

MuteStream.prototype = Object.create(Stream.prototype)

Object.defineProperty(MuteStream.prototype, 'constructor', {
  value: MuteStream,
  enumerable: false
})

MuteStream.prototype.mute = function () {
  this.muted = true
}

MuteStream.prototype.unmute = function () {
  this.muted = false
}

Object.defineProperty(MuteStream.prototype, '_onpipe', {
  value: onPipe,
  enumerable: false,
  writable: true,
  configurable: true
})

function onPipe (src) {
  this._src = src
}

Object.defineProperty(MuteStream.prototype, 'isTTY', {
  get: getIsTTY,
  set: setIsTTY,
  enumerable: true,
  configurable: true
})

function getIsTTY () {
  return( (this._dest) ? this._dest.isTTY
        : (this._src) ? this._src.isTTY
        : false
        )
}

// basically just get replace the getter/setter with a regular value
function setIsTTY (isTTY) {
  Object.defineProperty(this, 'isTTY', {
    value: isTTY,
    enumerable: true,
    writable: true,
    configurable: true
  })
}

Object.defineProperty(MuteStream.prototype, 'rows', {
  get: function () {
    return( this._dest ? this._dest.rows
          : this._src ? this._src.rows
          : undefined )
  }, enumerable: true, configurable: true })

Object.defineProperty(MuteStream.prototype, 'columns', {
  get: function () {
    return( this._dest ? this._dest.columns
          : this._src ? this._src.columns
          : undefined )
  }, enumerable: true, configurable: true })


MuteStream.prototype.pipe = function (dest, options) {
  this._dest = dest
  return Stream.prototype.pipe.call(this, dest, options)
}

MuteStream.prototype.pause = function () {
  if (this._src) return this._src.pause()
}

MuteStream.prototype.resume = function () {
  if (this._src) return this._src.resume()
}

MuteStream.prototype.write = function (c) {
  if (this.muted) {
    if (!this.replace) return true
    if (c.match(/^\u001b/)) {
      if(c.indexOf(this._prompt) === 0) {
        c = c.substr(this._prompt.length);
        c = c.replace(/./g, this.replace);
        c = this._prompt + c;
      }
      this._hadControl = true
      return this.emit('data', c)
    } else {
      if (this._prompt && this._hadControl &&
          c.indexOf(this._prompt) === 0) {
        this._hadControl = false
        this.emit('data', this._prompt)
        c = c.substr(this._prompt.length)
      }
      c = c.toString().replace(/./g, this.replace)
    }
  }
  this.emit('data', c)
}

MuteStream.prototype.end = function (c) {
  if (this.muted) {
    if (c && this.replace) {
      c = c.toString().replace(/./g, this.replace)
    } else {
      c = null
    }
  }
  if (c) this.emit('data', c)
  this.emit('end')
}

function proxy (fn) { return function () {
  var d = this._dest
  var s = this._src
  if (d && d[fn]) d[fn].apply(d, arguments)
  if (s && s[fn]) s[fn].apply(s, arguments)
}}

MuteStream.prototype.destroy = proxy('destroy')
MuteStream.prototype.destroySoon = proxy('destroySoon')
MuteStream.prototype.close = proxy('close')


/***/ }),

/***/ 2268:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies
 */

var fs = __nccwpck_require__(9896);
var join = (__nccwpck_require__(6928).join);

/**
 * Read and parse .netrc
 *
 * @param {String} file
 * @return {Object}
 * @api public
 */

module.exports = exports = function(file) {
  var home = getHomePath();

  if (!file && !home) return {};
  file = file || join(home, '.netrc');

  if (!file || !fs.existsSync(file)) return {};
  var netrc = fs.readFileSync(file, 'UTF-8');
  return exports.parse(netrc);
};

/**
 * Parse netrc
 *
 * @param {String} content
 * @return {Object}
 * @api public
 */

exports.parse = function(content) {
  // Remove comments
  var lines = content.split('\n');
  for (var n in lines) {
    var i = lines[n].indexOf('#');
    if (i > -1) lines[n] = lines[n].substring(0, i);
  }
  content = lines.join('\n');

  var tokens = content.split(/[ \t\n\r]+/);
  var machines = {};
  var m = null;
  var key = null;

  // if first index in array is empty string, strip it off (happens when first line of file is comment. Breaks the parsing)
  if (tokens[0] === '') tokens.shift();

  for(var i = 0, key, value; i < tokens.length; i+=2) {
    key = tokens[i];
    value = tokens[i+1];

    // Whitespace
    if (!key || !value) continue;

    // We have a new machine definition
    if (key === 'machine') {
      m = {};
      machines[value] = m;
    }
    // key=value
    else {
      m[key] = value;
    }
  }

  return machines
};

/**
 * Generate contents of netrc file from objects.
 * @param {Object} machines as returned by `netrc.parse`
 * @return {String} text of the netrc file
 */

exports.format = function format(machines){
  var lines = [];
  var keys = Object.getOwnPropertyNames(machines).sort();

  keys.forEach(function(key){
    lines.push('machine ' + key);
    var machine = machines[key];
    var attrs = Object.getOwnPropertyNames(machine).sort();
    attrs.forEach(function(attr){
      if (typeof(machine[attr]) === 'string') lines.push('    ' + attr + ' ' + machine[attr]);
    });
  });
  return lines.join('\n');
};

/**
 * Serialise contents objects to netrc file.
 *
 * @param {Object} machines as returned by `netrc.parse`
 * @api public
 */

exports.save = function save(machines){
  var home = getHomePath();
  var destFile = join(home, '.netrc');
  var data = exports.format(machines) + '\n';
  fs.writeFileSync(destFile, data);
};

/**
 * Get the home path
 *
 * @return {String} path to home directory
 * @api private
 */

function getHomePath() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}


/***/ }),

/***/ 9243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(5171);


/***/ }),

/***/ 5171:
/***/ ((module, exports) => {

/*!
 * node-progress
 * Copyright(c) 2011 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Expose `ProgressBar`.
 */

exports = module.exports = ProgressBar;

/**
 * Initialize a `ProgressBar` with the given `fmt` string and `options` or
 * `total`.
 *
 * Options:
 *
 *   - `curr` current completed index
 *   - `total` total number of ticks to complete
 *   - `width` the displayed width of the progress bar defaulting to total
 *   - `stream` the output stream defaulting to stderr
 *   - `head` head character defaulting to complete character
 *   - `complete` completion character defaulting to "="
 *   - `incomplete` incomplete character defaulting to "-"
 *   - `renderThrottle` minimum time between updates in milliseconds defaulting to 16
 *   - `callback` optional function to call when the progress bar completes
 *   - `clear` will clear the progress bar upon termination
 *
 * Tokens:
 *
 *   - `:bar` the progress bar itself
 *   - `:current` current tick number
 *   - `:total` total ticks
 *   - `:elapsed` time elapsed in seconds
 *   - `:percent` completion percentage
 *   - `:eta` eta in seconds
 *   - `:rate` rate of ticks per second
 *
 * @param {string} fmt
 * @param {object|number} options or total
 * @api public
 */

function ProgressBar(fmt, options) {
  this.stream = options.stream || process.stderr;

  if (typeof(options) == 'number') {
    var total = options;
    options = {};
    options.total = total;
  } else {
    options = options || {};
    if ('string' != typeof fmt) throw new Error('format required');
    if ('number' != typeof options.total) throw new Error('total required');
  }

  this.fmt = fmt;
  this.curr = options.curr || 0;
  this.total = options.total;
  this.width = options.width || this.total;
  this.clear = options.clear
  this.chars = {
    complete   : options.complete || '=',
    incomplete : options.incomplete || '-',
    head       : options.head || (options.complete || '=')
  };
  this.renderThrottle = options.renderThrottle !== 0 ? (options.renderThrottle || 16) : 0;
  this.lastRender = -Infinity;
  this.callback = options.callback || function () {};
  this.tokens = {};
  this.lastDraw = '';
}

/**
 * "tick" the progress bar with optional `len` and optional `tokens`.
 *
 * @param {number|object} len or tokens
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.tick = function(len, tokens){
  if (len !== 0)
    len = len || 1;

  // swap tokens
  if ('object' == typeof len) tokens = len, len = 1;
  if (tokens) this.tokens = tokens;

  // start time for eta
  if (0 == this.curr) this.start = new Date;

  this.curr += len

  // try to render
  this.render();

  // progress complete
  if (this.curr >= this.total) {
    this.render(undefined, true);
    this.complete = true;
    this.terminate();
    this.callback(this);
    return;
  }
};

/**
 * Method to render the progress bar with optional `tokens` to place in the
 * progress bar's `fmt` field.
 *
 * @param {object} tokens
 * @api public
 */

ProgressBar.prototype.render = function (tokens, force) {
  force = force !== undefined ? force : false;
  if (tokens) this.tokens = tokens;

  if (!this.stream.isTTY) return;

  var now = Date.now();
  var delta = now - this.lastRender;
  if (!force && (delta < this.renderThrottle)) {
    return;
  } else {
    this.lastRender = now;
  }

  var ratio = this.curr / this.total;
  ratio = Math.min(Math.max(ratio, 0), 1);

  var percent = Math.floor(ratio * 100);
  var incomplete, complete, completeLength;
  var elapsed = new Date - this.start;
  var eta = (percent == 100) ? 0 : elapsed * (this.total / this.curr - 1);
  var rate = this.curr / (elapsed / 1000);

  /* populate the bar template with percentages and timestamps */
  var str = this.fmt
    .replace(':current', this.curr)
    .replace(':total', this.total)
    .replace(':elapsed', isNaN(elapsed) ? '0.0' : (elapsed / 1000).toFixed(1))
    .replace(':eta', (isNaN(eta) || !isFinite(eta)) ? '0.0' : (eta / 1000)
      .toFixed(1))
    .replace(':percent', percent.toFixed(0) + '%')
    .replace(':rate', Math.round(rate));

  /* compute the available space (non-zero) for the bar */
  var availableSpace = Math.max(0, this.stream.columns - str.replace(':bar', '').length);
  if(availableSpace && process.platform === 'win32'){
    availableSpace = availableSpace - 1;
  }

  var width = Math.min(this.width, availableSpace);

  /* TODO: the following assumes the user has one ':bar' token */
  completeLength = Math.round(width * ratio);
  complete = Array(Math.max(0, completeLength + 1)).join(this.chars.complete);
  incomplete = Array(Math.max(0, width - completeLength + 1)).join(this.chars.incomplete);

  /* add head to the complete string */
  if(completeLength > 0)
    complete = complete.slice(0, -1) + this.chars.head;

  /* fill in the actual progress bar */
  str = str.replace(':bar', complete + incomplete);

  /* replace the extra tokens */
  if (this.tokens) for (var key in this.tokens) str = str.replace(':' + key, this.tokens[key]);

  if (this.lastDraw !== str) {
    this.stream.cursorTo(0);
    this.stream.write(str);
    this.stream.clearLine(1);
    this.lastDraw = str;
  }
};

/**
 * "update" the progress bar to represent an exact percentage.
 * The ratio (between 0 and 1) specified will be multiplied by `total` and
 * floored, representing the closest available "tick." For example, if a
 * progress bar has a length of 3 and `update(0.5)` is called, the progress
 * will be set to 1.
 *
 * A ratio of 0.5 will attempt to set the progress to halfway.
 *
 * @param {number} ratio The ratio (between 0 and 1 inclusive) to set the
 *   overall completion to.
 * @api public
 */

ProgressBar.prototype.update = function (ratio, tokens) {
  var goal = Math.floor(ratio * this.total);
  var delta = goal - this.curr;

  this.tick(delta, tokens);
};

/**
 * "interrupt" the progress bar and write a message above it.
 * @param {string} message The message to write.
 * @api public
 */

ProgressBar.prototype.interrupt = function (message) {
  // clear the current line
  this.stream.clearLine();
  // move the cursor to the start of the line
  this.stream.cursorTo(0);
  // write the message text
  this.stream.write(message);
  // terminate the line after writing the message
  this.stream.write('\n');
  // re-display the progress bar with its lastDraw
  this.stream.write(this.lastDraw);
};

/**
 * Terminates a progress bar.
 *
 * @api public
 */

ProgressBar.prototype.terminate = function () {
  if (this.clear) {
    if (this.stream.clearLine) {
      this.stream.clearLine();
      this.stream.cursorTo(0);
    }
  } else {
    this.stream.write('\n');
  }
};


/***/ }),

/***/ 4224:
/***/ ((module) => {

"use strict";


class DatePart {
  constructor({
    token,
    date,
    parts,
    locales
  }) {
    this.token = token;
    this.date = date || new Date();
    this.parts = parts || [this];
    this.locales = locales || {};
  }

  up() {}

  down() {}

  next() {
    const currentIdx = this.parts.indexOf(this);
    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
  }

  setTo(val) {}

  prev() {
    let parts = [].concat(this.parts).reverse();
    const currentIdx = parts.indexOf(this);
    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
  }

  toString() {
    return String(this.date);
  }

}

module.exports = DatePart;

/***/ }),

/***/ 1939:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

const pos = n => {
  n = n % 10;
  return n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
};

class Day extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setDate(this.date.getDate() + 1);
  }

  down() {
    this.date.setDate(this.date.getDate() - 1);
  }

  setTo(val) {
    this.date.setDate(parseInt(val.substr(-2)));
  }

  toString() {
    let date = this.date.getDate();
    let day = this.date.getDay();
    return this.token === 'DD' ? String(date).padStart(2, '0') : this.token === 'Do' ? date + pos(date) : this.token === 'd' ? day + 1 : this.token === 'ddd' ? this.locales.weekdaysShort[day] : this.token === 'dddd' ? this.locales.weekdays[day] : date;
  }

}

module.exports = Day;

/***/ }),

/***/ 5478:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Hours extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setHours(this.date.getHours() + 1);
  }

  down() {
    this.date.setHours(this.date.getHours() - 1);
  }

  setTo(val) {
    this.date.setHours(parseInt(val.substr(-2)));
  }

  toString() {
    let hours = this.date.getHours();
    if (/h/.test(this.token)) hours = hours % 12 || 12;
    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
  }

}

module.exports = Hours;

/***/ }),

/***/ 5397:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  DatePart: __nccwpck_require__(4224),
  Meridiem: __nccwpck_require__(3759),
  Day: __nccwpck_require__(1939),
  Hours: __nccwpck_require__(5478),
  Milliseconds: __nccwpck_require__(8367),
  Minutes: __nccwpck_require__(6576),
  Month: __nccwpck_require__(7423),
  Seconds: __nccwpck_require__(2552),
  Year: __nccwpck_require__(2432)
};

/***/ }),

/***/ 3759:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Meridiem extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }

  down() {
    this.up();
  }

  toString() {
    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }

}

module.exports = Meridiem;

/***/ }),

/***/ 8367:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Milliseconds extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
  }

  down() {
    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
  }

  setTo(val) {
    this.date.setMilliseconds(parseInt(val.substr(-this.token.length)));
  }

  toString() {
    return String(this.date.getMilliseconds()).padStart(4, '0').substr(0, this.token.length);
  }

}

module.exports = Milliseconds;

/***/ }),

/***/ 6576:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Minutes extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMinutes(this.date.getMinutes() + 1);
  }

  down() {
    this.date.setMinutes(this.date.getMinutes() - 1);
  }

  setTo(val) {
    this.date.setMinutes(parseInt(val.substr(-2)));
  }

  toString() {
    let m = this.date.getMinutes();
    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
  }

}

module.exports = Minutes;

/***/ }),

/***/ 7423:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Month extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setMonth(this.date.getMonth() + 1);
  }

  down() {
    this.date.setMonth(this.date.getMonth() - 1);
  }

  setTo(val) {
    val = parseInt(val.substr(-2)) - 1;
    this.date.setMonth(val < 0 ? 0 : val);
  }

  toString() {
    let month = this.date.getMonth();
    let tl = this.token.length;
    return tl === 2 ? String(month + 1).padStart(2, '0') : tl === 3 ? this.locales.monthsShort[month] : tl === 4 ? this.locales.months[month] : String(month + 1);
  }

}

module.exports = Month;

/***/ }),

/***/ 2552:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Seconds extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setSeconds(this.date.getSeconds() + 1);
  }

  down() {
    this.date.setSeconds(this.date.getSeconds() - 1);
  }

  setTo(val) {
    this.date.setSeconds(parseInt(val.substr(-2)));
  }

  toString() {
    let s = this.date.getSeconds();
    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
  }

}

module.exports = Seconds;

/***/ }),

/***/ 2432:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(4224);

class Year extends DatePart {
  constructor(opts = {}) {
    super(opts);
  }

  up() {
    this.date.setFullYear(this.date.getFullYear() + 1);
  }

  down() {
    this.date.setFullYear(this.date.getFullYear() - 1);
  }

  setTo(val) {
    this.date.setFullYear(val.substr(-4));
  }

  toString() {
    let year = String(this.date.getFullYear()).padStart(4, '0');
    return this.token.length === 2 ? year.substr(-2) : year;
  }

}

module.exports = Year;

/***/ }),

/***/ 5366:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(2858),
      erase = _require.erase,
      cursor = _require.cursor;

const _require2 = __nccwpck_require__(5925),
      style = _require2.style,
      clear = _require2.clear,
      figures = _require2.figures,
      wrap = _require2.wrap,
      entriesToDisplay = _require2.entriesToDisplay;

const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);

const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);

const getIndex = (arr, valOrTitle) => {
  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
  return index > -1 ? index : undefined;
};
/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of auto-complete choices objects
 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
 * @param {Number} [opts.limit=10] Max number of results to show
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.fallback] Fallback message - initial to default value
 * @param {String} [opts.initial] Index of the default value
 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.noMatches] The no matches found label
 */


class AutocompletePrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.suggest = opts.suggest;
    this.choices = opts.choices;
    this.initial = typeof opts.initial === 'number' ? opts.initial : getIndex(opts.choices, opts.initial);
    this.select = this.initial || opts.cursor || 0;
    this.i18n = {
      noMatches: opts.noMatches || 'no matches found'
    };
    this.fallback = opts.fallback || this.initial;
    this.clearFirst = opts.clearFirst || false;
    this.suggestions = [];
    this.input = '';
    this.limit = opts.limit || 10;
    this.cursor = 0;
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = clear('', this.out.columns);
    this.complete(this.render);
    this.render();
  }

  set fallback(fb) {
    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
  }

  get fallback() {
    let choice;
    if (typeof this._fb === 'number') choice = this.choices[this._fb];else if (typeof this._fb === 'string') choice = {
      title: this._fb
    };
    return choice || this._fb || {
      title: this.i18n.noMatches
    };
  }

  moveSelect(i) {
    this.select = i;
    if (this.suggestions.length > 0) this.value = getVal(this.suggestions, i);else this.value = this.fallback.value;
    this.fire();
  }

  complete(cb) {
    var _this = this;

    return _asyncToGenerator(function* () {
      const p = _this.completing = _this.suggest(_this.input, _this.choices);

      const suggestions = yield p;
      if (_this.completing !== p) return;
      _this.suggestions = suggestions.map((s, i, arr) => ({
        title: getTitle(arr, i),
        value: getVal(arr, i),
        description: s.description
      }));
      _this.completing = false;
      const l = Math.max(suggestions.length - 1, 0);

      _this.moveSelect(Math.min(l, _this.select));

      cb && cb();
    })();
  }

  reset() {
    this.input = '';
    this.complete(() => {
      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
      this.render();
    });
    this.render();
  }

  exit() {
    if (this.clearFirst && this.input.length > 0) {
      this.reset();
    } else {
      this.done = this.exited = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  abort() {
    this.done = this.aborted = true;
    this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${c}${s2}`;
    this.cursor = s1.length + 1;
    this.complete(this.render);
    this.render();
  }

  delete() {
    if (this.cursor === 0) return this.bell();
    let s1 = this.input.slice(0, this.cursor - 1);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.cursor = this.cursor - 1;
    this.render();
  }

  deleteForward() {
    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor + 1);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.render();
  }

  first() {
    this.moveSelect(0);
    this.render();
  }

  last() {
    this.moveSelect(this.suggestions.length - 1);
    this.render();
  }

  up() {
    if (this.select === 0) {
      this.moveSelect(this.suggestions.length - 1);
    } else {
      this.moveSelect(this.select - 1);
    }

    this.render();
  }

  down() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else {
      this.moveSelect(this.select + 1);
    }

    this.render();
  }

  next() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else this.moveSelect(this.select + 1);

    this.render();
  }

  nextPage() {
    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
    this.render();
  }

  prevPage() {
    this.moveSelect(Math.max(this.select - this.limit, 0));
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor = this.cursor - 1;
    this.render();
  }

  right() {
    if (this.cursor * this.scale >= this.rendered.length) return this.bell();
    this.cursor = this.cursor + 1;
    this.render();
  }

  renderOption(v, hovered, isStart, isEnd) {
    let desc;
    let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : ' ';
    let title = hovered ? color.cyan().underline(v.title) : v.title;
    prefix = (hovered ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;

    if (v.description) {
      desc = ` - ${v.description}`;

      if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
        desc = '\n' + wrap(v.description, {
          margin: 3,
          width: this.out.columns
        });
      }
    }

    return prefix + ' ' + title + color.gray(desc || '');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    let _entriesToDisplay = entriesToDisplay(this.select, this.choices.length, this.limit),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex;

    this.outputText = [style.symbol(this.done, this.aborted, this.exited), color.bold(this.msg), style.delimiter(this.completing), this.done && this.suggestions[this.select] ? this.suggestions[this.select].title : this.rendered = this.transform.render(this.input)].join(' ');

    if (!this.done) {
      const suggestions = this.suggestions.slice(startIndex, endIndex).map((item, i) => this.renderOption(item, this.select === i + startIndex, i === 0 && startIndex > 0, i + startIndex === endIndex - 1 && endIndex < this.choices.length)).join('\n');
      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }

}

module.exports = AutocompletePrompt;

/***/ }),

/***/ 6437:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);

const _require = __nccwpck_require__(2858),
      cursor = _require.cursor;

const MultiselectPrompt = __nccwpck_require__(5554);

const _require2 = __nccwpck_require__(5925),
      clear = _require2.clear,
      style = _require2.style,
      figures = _require2.figures;
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class AutocompleteMultiselectPrompt extends MultiselectPrompt {
  constructor(opts = {}) {
    opts.overrideRender = true;
    super(opts);
    this.inputValue = '';
    this.clear = clear('', this.out.columns);
    this.filteredOptions = this.value;
    this.render();
  }

  last() {
    this.cursor = this.filteredOptions.length - 1;
    this.render();
  }

  next() {
    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.filteredOptions.length - 1;
    } else {
      this.cursor--;
    }

    this.render();
  }

  down() {
    if (this.cursor === this.filteredOptions.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }

    this.render();
  }

  left() {
    this.filteredOptions[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.filteredOptions[this.cursor].selected = true;
    this.render();
  }

  delete() {
    if (this.inputValue.length) {
      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
      this.updateFilteredOptions();
    }
  }

  updateFilteredOptions() {
    const currentHighlight = this.filteredOptions[this.cursor];
    this.filteredOptions = this.value.filter(v => {
      if (this.inputValue) {
        if (typeof v.title === 'string') {
          if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
            return true;
          }
        }

        if (typeof v.value === 'string') {
          if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
            return true;
          }
        }

        return false;
      }

      return true;
    });
    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight);
    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.filteredOptions[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  handleInputChange(c) {
    this.inputValue = this.inputValue + c;
    this.updateFilteredOptions();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else {
      this.handleInputChange(c);
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }

      return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
    }

    return '';
  }

  renderCurrentInput() {
    return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray('Enter something to filter')}\n`;
  }

  renderOption(cursor, v, i) {
    let title;
    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);else title = cursor === i ? color.cyan().underline(v.title) : v.title;
    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title;
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
    }

    const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }

    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render(); // print prompt

    let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(' ');

    if (this.showMinError) {
      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }

    prompt += this.renderOptions(this.filteredOptions);
    this.out.write(this.clear + prompt);
    this.clear = clear(prompt, this.out.columns);
  }

}

module.exports = AutocompleteMultiselectPrompt;

/***/ }),

/***/ 1860:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(5925),
      style = _require.style,
      clear = _require.clear;

const _require2 = __nccwpck_require__(2858),
      erase = _require2.erase,
      cursor = _require2.cursor;
/**
 * ConfirmPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial] Default value (true/false)
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.yes] The "Yes" label
 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
 * @param {String} [opts.no] The "No" label
 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
 */


class ConfirmPrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.value = opts.initial;
    this.initialValue = !!opts.initial;
    this.yesMsg = opts.yes || 'yes';
    this.yesOption = opts.yesOption || '(Y/n)';
    this.noMsg = opts.no || 'no';
    this.noOption = opts.noOption || '(y/N)';
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || false;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }

    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }

    return this.bell();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
    super.render();
    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.done ? this.value ? this.yesMsg : this.noMsg : color.gray(this.initialValue ? this.yesOption : this.noOption)].join(' ');
    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }

}

module.exports = ConfirmPrompt;

/***/ }),

/***/ 7690:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(5925),
      style = _require.style,
      clear = _require.clear,
      figures = _require.figures;

const _require2 = __nccwpck_require__(2858),
      erase = _require2.erase,
      cursor = _require2.cursor;

const _require3 = __nccwpck_require__(5397),
      DatePart = _require3.DatePart,
      Meridiem = _require3.Meridiem,
      Day = _require3.Day,
      Hours = _require3.Hours,
      Milliseconds = _require3.Milliseconds,
      Minutes = _require3.Minutes,
      Month = _require3.Month,
      Seconds = _require3.Seconds,
      Year = _require3.Year;

const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
const regexGroups = {
  1: ({
    token
  }) => token.replace(/\\(.)/g, '$1'),
  2: opts => new Day(opts),
  // Day // TODO
  3: opts => new Month(opts),
  // Month
  4: opts => new Year(opts),
  // Year
  5: opts => new Meridiem(opts),
  // AM/PM // TODO (special)
  6: opts => new Hours(opts),
  // Hours
  7: opts => new Minutes(opts),
  // Minutes
  8: opts => new Seconds(opts),
  // Seconds
  9: opts => new Milliseconds(opts) // Fractional seconds

};
const dfltLocales = {
  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
};
/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {String} [opts.mask] The format mask
 * @param {object} [opts.locales] The date locales
 * @param {String} [opts.error] The error message shown on invalid value
 * @param {Function} [opts.validate] Function to validate the submitted value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */

class DatePrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = 0;
    this.typed = '';
    this.locales = Object.assign(dfltLocales, opts.locales);
    this._date = opts.initial || new Date();
    this.errorMsg = opts.error || 'Please Enter A Valid Value';

    this.validator = opts.validate || (() => true);

    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
    this.clear = clear('', this.out.columns);
    this.render();
  }

  get value() {
    return this.date;
  }

  get date() {
    return this._date;
  }

  set date(date) {
    if (date) this._date.setTime(date.getTime());
  }

  set mask(mask) {
    let result;
    this.parts = [];

    while (result = regex.exec(mask)) {
      let match = result.shift();
      let idx = result.findIndex(gr => gr != null);
      this.parts.push(idx in regexGroups ? regexGroups[idx]({
        token: result[idx] || match,
        date: this.date,
        parts: this.parts,
        locales: this.locales
      }) : result[idx] || match);
    }

    let parts = this.parts.reduce((arr, i) => {
      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string') arr[arr.length - 1] += i;else arr.push(i);
      return arr;
    }, []);
    this.parts.splice(0);
    this.parts.push(...parts);
    this.reset();
  }

  moveCursor(n) {
    this.typed = '';
    this.cursor = n;
    this.fire();
  }

  reset() {
    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart));
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === 'string') {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.validate();

      if (_this2.error) {
        _this2.color = 'red';

        _this2.fire();

        _this2.render();

        return;
      }

      _this2.done = true;
      _this2.aborted = false;

      _this2.fire();

      _this2.render();

      _this2.out.write('\n');

      _this2.close();
    })();
  }

  up() {
    this.typed = '';
    this.parts[this.cursor].up();
    this.render();
  }

  down() {
    this.typed = '';
    this.parts[this.cursor].down();
    this.render();
  }

  left() {
    let prev = this.parts[this.cursor].prev();
    if (prev == null) return this.bell();
    this.moveCursor(this.parts.indexOf(prev));
    this.render();
  }

  right() {
    let next = this.parts[this.cursor].next();
    if (next == null) return this.bell();
    this.moveCursor(this.parts.indexOf(next));
    this.render();
  }

  next() {
    let next = this.parts[this.cursor].next();
    this.moveCursor(next ? this.parts.indexOf(next) : this.parts.findIndex(part => part instanceof DatePart));
    this.render();
  }

  _(c) {
    if (/\d/.test(c)) {
      this.typed += c;
      this.parts[this.cursor].setTo(this.typed);
      this.render();
    }
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
    super.render(); // Print prompt

    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), []).join('')].join(' '); // Print error

    if (this.error) {
      this.outputText += this.errorMsg.split('\n').reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }

}

module.exports = DatePrompt;

/***/ }),

/***/ 6624:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  TextPrompt: __nccwpck_require__(2129),
  SelectPrompt: __nccwpck_require__(9790),
  TogglePrompt: __nccwpck_require__(1574),
  DatePrompt: __nccwpck_require__(7690),
  NumberPrompt: __nccwpck_require__(9407),
  MultiselectPrompt: __nccwpck_require__(5554),
  AutocompletePrompt: __nccwpck_require__(5366),
  AutocompleteMultiselectPrompt: __nccwpck_require__(6437),
  ConfirmPrompt: __nccwpck_require__(1860)
};

/***/ }),

/***/ 5554:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);

const _require = __nccwpck_require__(2858),
      cursor = _require.cursor;

const Prompt = __nccwpck_require__(9528);

const _require2 = __nccwpck_require__(5925),
      clear = _require2.clear,
      figures = _require2.figures,
      style = _require2.style,
      wrap = _require2.wrap,
      entriesToDisplay = _require2.entriesToDisplay;
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class MultiselectPrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.minSelected = opts.min;
    this.showMinError = false;
    this.maxChoices = opts.max;
    this.instructions = opts.instructions;
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string') ch = {
        title: ch,
        value: idx
      };
      return {
        title: ch && (ch.title || ch.value || ch),
        description: ch && ch.description,
        value: ch && (ch.value === undefined ? idx : ch.value),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear('', this.out.columns);

    if (!opts.overrideRender) {
      this.render();
    }
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    const selected = this.value.filter(e => e.selected);

    if (this.minSelected && selected.length < this.minSelected) {
      this.showMinError = true;
      this.render();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }

  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.value.length - 1;
    } else {
      this.cursor--;
    }

    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }

    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  toggleAll() {
    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
      return this.bell();
    }

    const newSelected = !this.value[this.cursor].selected;
    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else if (c === 'a') {
      this.toggleAll();
    } else {
      return this.bell();
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }

      return '\nInstructions:\n' + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n` + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n` + (this.maxChoices === undefined ? `    a: Toggle all\n` : '') + `    enter/return: Complete answer`;
    }

    return '';
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + ' ' + arrowIndicator + ' ';
    let title, desc;

    if (v.disabled) {
      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
    } else {
      title = cursor === i ? color.cyan().underline(v.title) : v.title;

      if (cursor === i && v.description) {
        desc = ` - ${v.description}`;

        if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
          desc = '\n' + wrap(v.description, {
            margin: prefix.length,
            width: this.out.columns
          });
        }
      }
    }

    return prefix + title + color.gray(desc || '');
  } // shared with autocompleteMultiselect


  paginateOptions(options) {
    if (options.length === 0) {
      return color.red('No matches for this query.');
    }

    let _entriesToDisplay = entriesToDisplay(this.cursor, options.length, this.optionsPerPage),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex;

    let prefix,
        styledOptions = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (i === startIndex && startIndex > 0) {
        prefix = figures.arrowUp;
      } else if (i === endIndex - 1 && endIndex < options.length) {
        prefix = figures.arrowDown;
      } else {
        prefix = ' ';
      }

      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
    }

    return '\n' + styledOptions.join('\n');
  } // shared with autocomleteMultiselect


  renderOptions(options) {
    if (!this.done) {
      return this.paginateOptions(options);
    }

    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value.filter(e => e.selected).map(v => v.title).join(', ');
    }

    const output = [color.gray(this.hint), this.renderInstructions()];

    if (this.value[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }

    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render(); // print prompt

    let prompt = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.renderDoneOrInstructions()].join(' ');

    if (this.showMinError) {
      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }

    prompt += this.renderOptions(this.value);
    this.out.write(this.clear + prompt);
    this.clear = clear(prompt, this.out.columns);
  }

}

module.exports = MultiselectPrompt;

/***/ }),

/***/ 9407:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(2858),
      cursor = _require.cursor,
      erase = _require.erase;

const _require2 = __nccwpck_require__(5925),
      style = _require2.style,
      figures = _require2.figures,
      clear = _require2.clear,
      lines = _require2.lines;

const isNumber = /[0-9]/;

const isDef = any => any !== undefined;

const round = (number, precision) => {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
};
/**
 * NumberPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {Number} [opts.initial] Default value
 * @param {Number} [opts.max=+Infinity] Max value
 * @param {Number} [opts.min=-Infinity] Min value
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */


class NumberPrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.msg = opts.message;
    this.initial = isDef(opts.initial) ? opts.initial : '';
    this.float = !!opts.float;
    this.round = opts.round || 2;
    this.inc = opts.increment || 1;
    this.min = isDef(opts.min) ? opts.min : -Infinity;
    this.max = isDef(opts.max) ? opts.max : Infinity;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;

    this.validator = opts.validate || (() => true);

    this.color = `cyan`;
    this.value = ``;
    this.typed = ``;
    this.lastHit = 0;
    this.render();
  }

  set value(v) {
    if (!v && v !== 0) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(`${this.initial}`));
      this._value = ``;
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(`${round(v, this.round)}`);
      this._value = round(v, this.round);
    }

    this.fire();
  }

  get value() {
    return this._value;
  }

  parse(x) {
    return this.float ? parseFloat(x) : parseInt(x);
  }

  valid(c) {
    return c === `-` || c === `.` && this.float || isNumber.test(c);
  }

  reset() {
    this.typed = ``;
    this.value = ``;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === `string`) {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      yield _this2.validate();

      if (_this2.error) {
        _this2.color = `red`;

        _this2.fire();

        _this2.render();

        return;
      }

      let x = _this2.value;
      _this2.value = x !== `` ? x : _this2.initial;
      _this2.done = true;
      _this2.aborted = false;
      _this2.error = false;

      _this2.fire();

      _this2.render();

      _this2.out.write(`\n`);

      _this2.close();
    })();
  }

  up() {
    this.typed = ``;

    if (this.value === '') {
      this.value = this.min - this.inc;
    }

    if (this.value >= this.max) return this.bell();
    this.value += this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  down() {
    this.typed = ``;

    if (this.value === '') {
      this.value = this.min + this.inc;
    }

    if (this.value <= this.min) return this.bell();
    this.value -= this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  delete() {
    let val = this.value.toString();
    if (val.length === 0) return this.bell();
    this.value = this.parse(val = val.slice(0, -1)) || ``;

    if (this.value !== '' && this.value < this.min) {
      this.value = this.min;
    }

    this.color = `cyan`;
    this.fire();
    this.render();
  }

  next() {
    this.value = this.initial;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (!this.valid(c)) return this.bell();
    const now = Date.now();
    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed

    this.typed += c;
    this.lastHit = now;
    this.color = `cyan`;
    if (c === `.`) return this.fire();
    this.value = Math.min(this.parse(this.typed), this.max);
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
    this.fire();
    this.render();
  }

  render() {
    if (this.closed) return;

    if (!this.firstRender) {
      if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
      this.out.write(clear(this.outputText, this.out.columns));
    }

    super.render();
    this.outputError = ''; // Print prompt

    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), !this.done || !this.done && !this.placeholder ? color[this.color]().underline(this.rendered) : this.rendered].join(` `); // Print error

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
  }

}

module.exports = NumberPrompt;

/***/ }),

/***/ 9528:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const readline = __nccwpck_require__(3785);

const _require = __nccwpck_require__(5925),
      action = _require.action;

const EventEmitter = __nccwpck_require__(4434);

const _require2 = __nccwpck_require__(2858),
      beep = _require2.beep,
      cursor = _require2.cursor;

const color = __nccwpck_require__(3173);
/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class Prompt extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;

    this.onRender = (opts.onRender || (() => void 0)).bind(this);

    const rl = readline.createInterface({
      input: this.in,
      escapeCodeTimeout: 50
    });
    readline.emitKeypressEvents(this.in, rl);
    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = ['SelectPrompt', 'MultiselectPrompt'].indexOf(this.constructor.name) > -1;

    const keypress = (str, key) => {
      let a = action(key, isSelect);

      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    this.onRender(color);
    if (this.firstRender) this.firstRender = false;
  }

}

module.exports = Prompt;

/***/ }),

/***/ 9790:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(5925),
      style = _require.style,
      clear = _require.clear,
      figures = _require.figures,
      wrap = _require.wrap,
      entriesToDisplay = _require.entriesToDisplay;

const _require2 = __nccwpck_require__(2858),
      cursor = _require2.cursor;
/**
 * SelectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 */


class SelectPrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
    this.warn = opts.warn || '- This option is disabled';
    this.cursor = opts.initial || 0;
    this.choices = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string') ch = {
        title: ch,
        value: idx
      };
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value === undefined ? idx : ch.value),
        description: ch && ch.description,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = (this.choices[this.cursor] || {}).value;
    this.clear = clear('', this.out.columns);
    this.render();
  }

  moveCursor(n) {
    this.cursor = n;
    this.value = this.choices[n].value;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    if (!this.selection.disabled) {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    } else this.bell();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.moveCursor(this.choices.length - 1);
    } else {
      this.moveCursor(this.cursor - 1);
    }

    this.render();
  }

  down() {
    if (this.cursor === this.choices.length - 1) {
      this.moveCursor(0);
    } else {
      this.moveCursor(this.cursor + 1);
    }

    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.choices.length);
    this.render();
  }

  _(c, key) {
    if (c === ' ') return this.submit();
  }

  get selection() {
    return this.choices[this.cursor];
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    let _entriesToDisplay = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage),
        startIndex = _entriesToDisplay.startIndex,
        endIndex = _entriesToDisplay.endIndex; // Print prompt


    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(false), this.done ? this.selection.title : this.selection.disabled ? color.yellow(this.warn) : color.gray(this.hint)].join(' '); // Print choices

    if (!this.done) {
      this.outputText += '\n';

      for (let i = startIndex; i < endIndex; i++) {
        let title,
            prefix,
            desc = '',
            v = this.choices[i]; // Determine whether to display "more choices" indicators

        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = ' ';
        }

        if (v.disabled) {
          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
          prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + ' ' : '  ') + prefix;
        } else {
          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
          prefix = (this.cursor === i ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;

          if (v.description && this.cursor === i) {
            desc = ` - ${v.description}`;

            if (prefix.length + title.length + desc.length >= this.out.columns || v.description.split(/\r?\n/).length > 1) {
              desc = '\n' + wrap(v.description, {
                margin: 3,
                width: this.out.columns
              });
            }
          }
        }

        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
      }
    }

    this.out.write(this.outputText);
  }

}

module.exports = SelectPrompt;

/***/ }),

/***/ 2129:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(2858),
      erase = _require.erase,
      cursor = _require.cursor;

const _require2 = __nccwpck_require__(5925),
      style = _require2.style,
      clear = _require2.clear,
      lines = _require2.lines,
      figures = _require2.figures;
/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */


class TextPrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.initial = opts.initial || ``;

    this.validator = opts.validate || (() => true);

    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.clear = clear(``, this.out.columns);
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(this.initial));
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }

    this._value = v;
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.value = ``;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  validate() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let valid = yield _this.validator(_this.value);

      if (typeof valid === `string`) {
        _this.errorMsg = valid;
        valid = false;
      }

      _this.error = !valid;
    })();
  }

  submit() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      _this2.value = _this2.value || _this2.initial;
      _this2.cursorOffset = 0;
      _this2.cursor = _this2.rendered.length;
      yield _this2.validate();

      if (_this2.error) {
        _this2.red = true;

        _this2.fire();

        _this2.render();

        return;
      }

      _this2.done = true;
      _this2.aborted = false;

      _this2.fire();

      _this2.render();

      _this2.out.write('\n');

      _this2.close();
    })();
  }

  next() {
    if (!this.placeholder) return this.bell();
    this.value = this.initial;
    this.cursor = this.rendered.length;
    this.fire();
    this.render();
  }

  moveCursor(n) {
    if (this.placeholder) return;
    this.cursor = this.cursor + n;
    this.cursorOffset += n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${c}${s2}`;
    this.red = false;
    this.cursor = this.placeholder ? 0 : s1.length + 1;
    this.render();
  }

  delete() {
    if (this.isCursorAtStart()) return this.bell();
    let s1 = this.value.slice(0, this.cursor - 1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.red = false;

    if (this.isCursorAtStart()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
      this.moveCursor(-1);
    }

    this.render();
  }

  deleteForward() {
    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor + 1);
    this.value = `${s1}${s2}`;
    this.red = false;

    if (this.isCursorAtEnd()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
    }

    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) return this.bell();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor * this.scale >= this.rendered.length || this.placeholder) return this.bell();
    this.moveCursor(1);
    this.render();
  }

  isCursorAtStart() {
    return this.cursor === 0 || this.placeholder && this.cursor === 1;
  }

  isCursorAtEnd() {
    return this.cursor === this.rendered.length || this.placeholder && this.cursor === this.rendered.length + 1;
  }

  render() {
    if (this.closed) return;

    if (!this.firstRender) {
      if (this.outputError) this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
      this.out.write(clear(this.outputText, this.out.columns));
    }

    super.render();
    this.outputError = '';
    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.red ? color.red(this.rendered) : this.rendered].join(` `);

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`).reduce((a, l, i) => a + `\n${i ? ' ' : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
  }

}

module.exports = TextPrompt;

/***/ }),

/***/ 1574:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);

const Prompt = __nccwpck_require__(9528);

const _require = __nccwpck_require__(5925),
      style = _require.style,
      clear = _require.clear;

const _require2 = __nccwpck_require__(2858),
      cursor = _require2.cursor,
      erase = _require2.erase;
/**
 * TogglePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial=false] Default value
 * @param {String} [opts.active='no'] Active label
 * @param {String} [opts.inactive='off'] Inactive label
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */


class TogglePrompt extends Prompt {
  constructor(opts = {}) {
    super(opts);
    this.msg = opts.message;
    this.value = !!opts.initial;
    this.active = opts.active || 'on';
    this.inactive = opts.inactive || 'off';
    this.initialValue = this.value;
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  deactivate() {
    if (this.value === false) return this.bell();
    this.value = false;
    this.render();
  }

  activate() {
    if (this.value === true) return this.bell();
    this.value = true;
    this.render();
  }

  delete() {
    this.deactivate();
  }

  left() {
    this.deactivate();
  }

  right() {
    this.activate();
  }

  down() {
    this.deactivate();
  }

  up() {
    this.activate();
  }

  next() {
    this.value = !this.value;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.value = !this.value;
    } else if (c === '1') {
      this.value = true;
    } else if (c === '0') {
      this.value = false;
    } else return this.bell();

    this.render();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);else this.out.write(clear(this.outputText, this.out.columns));
    super.render();
    this.outputText = [style.symbol(this.done, this.aborted), color.bold(this.msg), style.delimiter(this.done), this.value ? this.inactive : color.cyan().underline(this.inactive), color.gray('/'), this.value ? color.cyan().underline(this.active) : this.active].join(' ');
    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }

}

module.exports = TogglePrompt;

/***/ }),

/***/ 1108:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const prompts = __nccwpck_require__(6331);

const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];

const noop = () => {};
/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @param {Function} [onSubmit] Callback function called on prompt submit
 * @param {Function} [onCancel] Callback function called on cancel/abort
 * @returns {Object} Object with values from user input
 */


function prompt() {
  return _prompt.apply(this, arguments);
}

function _prompt() {
  _prompt = _asyncToGenerator(function* (questions = [], {
    onSubmit = noop,
    onCancel = noop
  } = {}) {
    const answers = {};
    const override = prompt._override || {};
    questions = [].concat(questions);
    let answer, question, quit, name, type, lastPrompt;

    const getFormattedAnswer = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (question, answer, skipValidation = false) {
        if (!skipValidation && question.validate && question.validate(answer) !== true) {
          return;
        }

        return question.format ? yield question.format(answer, answers) : answer;
      });

      return function getFormattedAnswer(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    var _iterator = _createForOfIteratorHelper(questions),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        question = _step.value;
        var _question = question;
        name = _question.name;
        type = _question.type;

        // evaluate type first and skip if type is a falsy value
        if (typeof type === 'function') {
          type = yield type(answer, _objectSpread({}, answers), question);
          question['type'] = type;
        }

        if (!type) continue; // if property is a function, invoke it unless it's a special function

        for (let key in question) {
          if (passOn.includes(key)) continue;
          let value = question[key];
          question[key] = typeof value === 'function' ? yield value(answer, _objectSpread({}, answers), lastPrompt) : value;
        }

        lastPrompt = question;

        if (typeof question.message !== 'string') {
          throw new Error('prompt message is required');
        } // update vars in case they changed


        var _question2 = question;
        name = _question2.name;
        type = _question2.type;

        if (prompts[type] === void 0) {
          throw new Error(`prompt type (${type}) is not defined`);
        }

        if (override[question.name] !== undefined) {
          answer = yield getFormattedAnswer(question, override[question.name]);

          if (answer !== undefined) {
            answers[name] = answer;
            continue;
          }
        }

        try {
          // Get the injected answer if there is one or prompt the user
          answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : yield prompts[type](question);
          answers[name] = answer = yield getFormattedAnswer(question, answer, true);
          quit = yield onSubmit(question, answer, answers);
        } catch (err) {
          quit = !(yield onCancel(question, answers));
        }

        if (quit) return answers;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return answers;
  });
  return _prompt.apply(this, arguments);
}

function getInjectedAnswer(injected, deafultValue) {
  const answer = injected.shift();

  if (answer instanceof Error) {
    throw answer;
  }

  return answer === undefined ? deafultValue : answer;
}

function inject(answers) {
  prompt._injected = (prompt._injected || []).concat(answers);
}

function override(answers) {
  prompt._override = Object.assign({}, answers);
}

module.exports = Object.assign(prompt, {
  prompt,
  prompts,
  inject,
  override
});

/***/ }),

/***/ 6331:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const $ = exports;

const el = __nccwpck_require__(6624);

const noop = v => v;

function toPrompt(type, args, opts = {}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    const onExit = opts.onExit || noop;
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('exit', x => res(onExit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}
/**
 * Text prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.text = args => toPrompt('TextPrompt', args);
/**
 * Password prompt with masked input
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.password = args => {
  args.style = 'password';
  return $.text(args);
};
/**
 * Prompt where input is invisible, like sudo
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.invisible = args => {
  args.style = 'invisible';
  return $.text(args);
};
/**
 * Number prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.number = args => toPrompt('NumberPrompt', args);
/**
 * Date prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.date = args => toPrompt('DatePrompt', args);
/**
 * Classic yes/no prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.confirm = args => toPrompt('ConfirmPrompt', args);
/**
 * List prompt, split intput string by `seperator`
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input, in form of an `Array`
 */


$.list = args => {
  const sep = args.separator || ',';
  return toPrompt('TextPrompt', args, {
    onSubmit: str => str.split(sep).map(s => s.trim())
  });
};
/**
 * Toggle/switch prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.toggle = args => toPrompt('TogglePrompt', args);
/**
 * Interactive select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [args.initial] Index of default value
 * @param {String} [args.hint] Hint to display
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.select = args => toPrompt('SelectPrompt', args);
/**
 * Interactive multi-select / autocompleteMultiselect prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.multiselect = args => {
  args.choices = [].concat(args.choices || []);

  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

  return toPrompt('MultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

$.autocompleteMultiselect = args => {
  args.choices = [].concat(args.choices || []);

  const toSelected = items => items.filter(item => item.selected).map(item => item.value);

  return toPrompt('AutocompleteMultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

const byTitle = (input, choices) => Promise.resolve(choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase()));
/**
 * Interactive auto-complete prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
 * @param {number} [args.limit=10] Max number of results to show
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {String} [args.initial] Index of the default value
 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {String} [args.fallback] Fallback message - defaults to initial value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */


$.autocomplete = args => {
  args.suggest = args.suggest || byTitle;
  args.choices = [].concat(args.choices || []);
  return toPrompt('AutocompletePrompt', args);
};

/***/ }),

/***/ 9715:
/***/ ((module) => {

"use strict";


module.exports = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;

  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }

  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J

  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage'; // TODO create home() in prompt types (e.g. TextPrompt)

  if (key.name === 'home') return 'home'; // TODO create end() in prompt types (e.g. TextPrompt)

  if (key.name === 'end') return 'end';
  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';
  return false;
};

/***/ }),

/***/ 7364:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

const strip = __nccwpck_require__(2823);

const _require = __nccwpck_require__(2858),
      erase = _require.erase,
      cursor = _require.cursor;

const width = str => [...strip(str)].length;
/**
 * @param {string} prompt
 * @param {number} perLine
 */


module.exports = function (prompt, perLine) {
  if (!perLine) return erase.line + cursor.to(0);
  let rows = 0;
  const lines = prompt.split(/\r?\n/);

  var _iterator = _createForOfIteratorHelper(lines),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      let line = _step.value;
      rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return erase.lines(rows);
};

/***/ }),

/***/ 4968:
/***/ ((module) => {

"use strict";

/**
 * Determine what entries should be displayed on the screen, based on the
 * currently selected index and the maximum visible. Used in list-based
 * prompts like `select` and `multiselect`.
 *
 * @param {number} cursor the currently selected entry
 * @param {number} total the total entries available to display
 * @param {number} [maxVisible] the number of entries that can be displayed
 */

module.exports = (cursor, total, maxVisible) => {
  maxVisible = maxVisible || total;
  let startIndex = Math.min(total - maxVisible, cursor - Math.floor(maxVisible / 2));
  if (startIndex < 0) startIndex = 0;
  let endIndex = Math.min(startIndex + maxVisible, total);
  return {
    startIndex,
    endIndex
  };
};

/***/ }),

/***/ 4264:
/***/ ((module) => {

"use strict";


const main = {
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  radioOn: '◉',
  radioOff: '◯',
  tick: '✔',
  cross: '✖',
  ellipsis: '…',
  pointerSmall: '›',
  line: '─',
  pointer: '❯'
};
const win = {
  arrowUp: main.arrowUp,
  arrowDown: main.arrowDown,
  arrowLeft: main.arrowLeft,
  arrowRight: main.arrowRight,
  radioOn: '(*)',
  radioOff: '( )',
  tick: '√',
  cross: '×',
  ellipsis: '...',
  pointerSmall: '»',
  line: '─',
  pointer: '>'
};
const figures = process.platform === 'win32' ? win : main;
module.exports = figures;

/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  action: __nccwpck_require__(9715),
  clear: __nccwpck_require__(7364),
  style: __nccwpck_require__(8072),
  strip: __nccwpck_require__(2823),
  figures: __nccwpck_require__(4264),
  lines: __nccwpck_require__(8998),
  wrap: __nccwpck_require__(5589),
  entriesToDisplay: __nccwpck_require__(4968)
};

/***/ }),

/***/ 8998:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const strip = __nccwpck_require__(2823);
/**
 * @param {string} msg
 * @param {number} perLine
 */


module.exports = function (msg, perLine) {
  let lines = String(strip(msg) || '').split(/\r?\n/);
  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine)).reduce((a, b) => a + b);
};

/***/ }),

/***/ 2823:
/***/ ((module) => {

"use strict";


module.exports = str => {
  const pattern = ['[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'].join('|');
  const RGX = new RegExp(pattern, 'g');
  return typeof str === 'string' ? str.replace(RGX, '') : str;
};

/***/ }),

/***/ 8072:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const c = __nccwpck_require__(3173);

const figures = __nccwpck_require__(4264); // rendering user input.


const styles = Object.freeze({
  password: {
    scale: 1,
    render: input => '*'.repeat(input.length)
  },
  emoji: {
    scale: 2,
    render: input => '😃'.repeat(input.length)
  },
  invisible: {
    scale: 0,
    render: input => ''
  },
  default: {
    scale: 1,
    render: input => `${input}`
  }
});

const render = type => styles[type] || styles.default; // icon to signalize a prompt.


const symbols = Object.freeze({
  aborted: c.red(figures.cross),
  done: c.green(figures.tick),
  exited: c.yellow(figures.cross),
  default: c.cyan('?')
});

const symbol = (done, aborted, exited) => aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default; // between the question and the user's input.


const delimiter = completing => c.gray(completing ? figures.ellipsis : figures.pointerSmall);

const item = (expandable, expanded) => c.gray(expandable ? expanded ? figures.pointerSmall : '+' : figures.line);

module.exports = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item
};

/***/ }),

/***/ 5589:
/***/ ((module) => {

"use strict";

/**
 * @param {string} msg The message to wrap
 * @param {object} opts
 * @param {number|string} [opts.margin] Left margin
 * @param {number} opts.width Maximum characters per line including the margin
 */

module.exports = (msg, opts = {}) => {
  const tab = Number.isSafeInteger(parseInt(opts.margin)) ? new Array(parseInt(opts.margin)).fill(' ').join('') : opts.margin || '';
  const width = opts.width;
  return (msg || '').split(/\r?\n/g).map(line => line.split(/\s+/g).reduce((arr, w) => {
    if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width) arr[arr.length - 1] += ` ${w}`;else arr.push(`${tab}${w}`);
    return arr;
  }, [tab]).join('\n')).join('\n');
};

/***/ }),

/***/ 7455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

function isNodeLT(tar) {
  tar = (Array.isArray(tar) ? tar : tar.split('.')).map(Number);
  let i=0, src=process.versions.node.split('.').map(Number);
  for (; i < tar.length; i++) {
    if (src[i] > tar[i]) return false;
    if (tar[i] > src[i]) return true;
  }
  return false;
}

module.exports =
  isNodeLT('8.6.0')
    ? __nccwpck_require__(1108)
    : __nccwpck_require__(9391);


/***/ }),

/***/ 5569:
/***/ ((module) => {

"use strict";


class DatePart {
  constructor({token, date, parts, locales}) {
    this.token = token;
    this.date = date || new Date();
    this.parts = parts || [this];
    this.locales = locales || {};
  }

  up() {}

  down() {}

  next() {
    const currentIdx = this.parts.indexOf(this);
    return this.parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
  }

  setTo(val) {}

  prev() {
    let parts = [].concat(this.parts).reverse();
    const currentIdx = parts.indexOf(this);
    return parts.find((part, idx) => idx > currentIdx && part instanceof DatePart);
  }

  toString() {
    return String(this.date);
  }
}

module.exports = DatePart;




/***/ }),

/***/ 9872:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

const pos = n => {
  n = n % 10;
  return n === 1 ? 'st'
       : n === 2 ? 'nd'
       : n === 3 ? 'rd'
       : 'th';
}

class Day extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setDate(this.date.getDate() + 1);
  }

  down() {
    this.date.setDate(this.date.getDate() - 1);
  }

  setTo(val) {
    this.date.setDate(parseInt(val.substr(-2)));
  }

  toString() {
    let date = this.date.getDate();
    let day = this.date.getDay();
    return this.token === 'DD' ? String(date).padStart(2, '0')
         : this.token === 'Do' ? date + pos(date)
         : this.token === 'd' ? day + 1
         : this.token === 'ddd' ? this.locales.weekdaysShort[day]
         : this.token === 'dddd' ? this.locales.weekdays[day]
         : date;
  }
}

module.exports = Day;


/***/ }),

/***/ 9345:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Hours extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setHours(this.date.getHours() + 1);
  }

  down() {
    this.date.setHours(this.date.getHours() - 1);
  }

  setTo(val) {
    this.date.setHours(parseInt(val.substr(-2)));
  }

  toString() {
    let hours = this.date.getHours();
    if (/h/.test(this.token))
      hours = (hours % 12) || 12;
    return this.token.length > 1 ? String(hours).padStart(2, '0') : hours;
  }
}

module.exports = Hours;


/***/ }),

/***/ 534:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  DatePart: __nccwpck_require__(5569),
  Meridiem: __nccwpck_require__(7426),
  Day: __nccwpck_require__(9872),
  Hours: __nccwpck_require__(9345),
  Milliseconds: __nccwpck_require__(1458),
  Minutes: __nccwpck_require__(6731),
  Month: __nccwpck_require__(4424),
  Seconds: __nccwpck_require__(6379),
  Year: __nccwpck_require__(4661),
}


/***/ }),

/***/ 7426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Meridiem extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setHours((this.date.getHours() + 12) % 24);
  }

  down() {
    this.up();
  }

  toString() {
    let meridiem = this.date.getHours() > 12 ? 'pm' : 'am';
    return /\A/.test(this.token) ? meridiem.toUpperCase() : meridiem;
  }
}

module.exports = Meridiem;


/***/ }),

/***/ 1458:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Milliseconds extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMilliseconds(this.date.getMilliseconds() + 1);
  }

  down() {
    this.date.setMilliseconds(this.date.getMilliseconds() - 1);
  }

  setTo(val) {
    this.date.setMilliseconds(parseInt(val.substr(-(this.token.length))));
  }

  toString() {
    return String(this.date.getMilliseconds()).padStart(4, '0')
                                              .substr(0, this.token.length);
  }
}

module.exports = Milliseconds;


/***/ }),

/***/ 6731:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Minutes extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMinutes(this.date.getMinutes() + 1);
  }

  down() {
    this.date.setMinutes(this.date.getMinutes() - 1);
  }

  setTo(val) {
    this.date.setMinutes(parseInt(val.substr(-2)));
  }

  toString() {
    let m = this.date.getMinutes();
    return this.token.length > 1 ? String(m).padStart(2, '0') : m;
  }
}

module.exports = Minutes;


/***/ }),

/***/ 4424:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Month extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setMonth(this.date.getMonth() + 1);
  }

  down() {
    this.date.setMonth(this.date.getMonth() - 1);
  }

  setTo(val) {
    val = parseInt(val.substr(-2)) - 1;
    this.date.setMonth(val < 0 ? 0 : val);
  }

  toString() {
    let month = this.date.getMonth();
    let tl = this.token.length;
    return tl === 2 ? String(month + 1).padStart(2, '0')
           : tl === 3 ? this.locales.monthsShort[month]
             : tl === 4 ? this.locales.months[month]
               : String(month + 1);
  }
}

module.exports = Month;


/***/ }),

/***/ 6379:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Seconds extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setSeconds(this.date.getSeconds() + 1);
  }

  down() {
    this.date.setSeconds(this.date.getSeconds() - 1);
  }

  setTo(val) {
    this.date.setSeconds(parseInt(val.substr(-2)));
  }

  toString() {
    let s = this.date.getSeconds();
    return this.token.length > 1 ? String(s).padStart(2, '0') : s;
  }
}

module.exports = Seconds;


/***/ }),

/***/ 4661:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const DatePart = __nccwpck_require__(5569);

class Year extends DatePart {
  constructor(opts={}) {
    super(opts);
  }

  up() {
    this.date.setFullYear(this.date.getFullYear() + 1);
  }

  down() {
    this.date.setFullYear(this.date.getFullYear() - 1);
  }

  setTo(val) {
    this.date.setFullYear(val.substr(-4));
  }

  toString() {
    let year = String(this.date.getFullYear()).padStart(4, '0');
    return this.token.length === 2 ? year.substr(-2) : year;
  }
}

module.exports = Year;


/***/ }),

/***/ 5361:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { erase, cursor } = __nccwpck_require__(2858);
const { style, clear, figures, wrap, entriesToDisplay } = __nccwpck_require__(5512);

const getVal = (arr, i) => arr[i] && (arr[i].value || arr[i].title || arr[i]);
const getTitle = (arr, i) => arr[i] && (arr[i].title || arr[i].value || arr[i]);
const getIndex = (arr, valOrTitle) => {
  const index = arr.findIndex(el => el.value === valOrTitle || el.title === valOrTitle);
  return index > -1 ? index : undefined;
};

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of auto-complete choices objects
 * @param {Function} [opts.suggest] Filter function. Defaults to sort by title
 * @param {Number} [opts.limit=10] Max number of results to show
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.fallback] Fallback message - initial to default value
 * @param {String} [opts.initial] Index of the default value
 * @param {Boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.noMatches] The no matches found label
 */
class AutocompletePrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.suggest = opts.suggest;
    this.choices = opts.choices;
    this.initial = typeof opts.initial === 'number'
      ? opts.initial
      : getIndex(opts.choices, opts.initial);
    this.select = this.initial || opts.cursor || 0;
    this.i18n = { noMatches: opts.noMatches || 'no matches found' };
    this.fallback = opts.fallback || this.initial;
    this.clearFirst = opts.clearFirst || false;
    this.suggestions = [];
    this.input = '';
    this.limit = opts.limit || 10;
    this.cursor = 0;
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.render = this.render.bind(this);
    this.complete = this.complete.bind(this);
    this.clear = clear('', this.out.columns);
    this.complete(this.render);
    this.render();
  }

  set fallback(fb) {
    this._fb = Number.isSafeInteger(parseInt(fb)) ? parseInt(fb) : fb;
  }

  get fallback() {
    let choice;
    if (typeof this._fb === 'number')
      choice = this.choices[this._fb];
    else if (typeof this._fb === 'string')
      choice = { title: this._fb };
    return choice || this._fb || { title: this.i18n.noMatches };
  }

  moveSelect(i) {
    this.select = i;
    if (this.suggestions.length > 0)
      this.value = getVal(this.suggestions, i);
    else this.value = this.fallback.value;
    this.fire();
  }

  async complete(cb) {
    const p = (this.completing = this.suggest(this.input, this.choices));
    const suggestions = await p;

    if (this.completing !== p) return;
    this.suggestions = suggestions
      .map((s, i, arr) => ({ title: getTitle(arr, i), value: getVal(arr, i), description: s.description }));
    this.completing = false;
    const l = Math.max(suggestions.length - 1, 0);
    this.moveSelect(Math.min(l, this.select));

    cb && cb();
  }

  reset() {
    this.input = '';
    this.complete(() => {
      this.moveSelect(this.initial !== void 0 ? this.initial : 0);
      this.render();
    });
    this.render();
  }

  exit() {
    if (this.clearFirst && this.input.length > 0) {
      this.reset();
    } else {
      this.done = this.exited = true; 
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  abort() {
    this.done = this.aborted = true;
    this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = this.exited = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${c}${s2}`;
    this.cursor = s1.length+1;
    this.complete(this.render);
    this.render();
  }

  delete() {
    if (this.cursor === 0) return this.bell();
    let s1 = this.input.slice(0, this.cursor-1);
    let s2 = this.input.slice(this.cursor);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.cursor = this.cursor-1;
    this.render();
  }

  deleteForward() {
    if(this.cursor*this.scale >= this.rendered.length) return this.bell();
    let s1 = this.input.slice(0, this.cursor);
    let s2 = this.input.slice(this.cursor+1);
    this.input = `${s1}${s2}`;
    this.complete(this.render);
    this.render();
  }

  first() {
    this.moveSelect(0);
    this.render();
  }

  last() {
    this.moveSelect(this.suggestions.length - 1);
    this.render();
  }

  up() {
    if (this.select === 0) {
      this.moveSelect(this.suggestions.length - 1);
    } else {
      this.moveSelect(this.select - 1);
    }
    this.render();
  }

  down() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else {
      this.moveSelect(this.select + 1);
    }
    this.render();
  }

  next() {
    if (this.select === this.suggestions.length - 1) {
      this.moveSelect(0);
    } else this.moveSelect(this.select + 1);
    this.render();
  }

  nextPage() {
    this.moveSelect(Math.min(this.select + this.limit, this.suggestions.length - 1));
    this.render();
  }

  prevPage() {
    this.moveSelect(Math.max(this.select - this.limit, 0));
    this.render();
  }

  left() {
    if (this.cursor <= 0) return this.bell();
    this.cursor = this.cursor-1;
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length) return this.bell();
    this.cursor = this.cursor+1;
    this.render();
  }

  renderOption(v, hovered, isStart, isEnd) {
    let desc;
    let prefix = isStart ? figures.arrowUp : isEnd ? figures.arrowDown : ' ';
    let title = hovered ? color.cyan().underline(v.title) : v.title;
    prefix = (hovered ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;
    if (v.description) {
      desc = ` - ${v.description}`;
      if (prefix.length + title.length + desc.length >= this.out.columns
        || v.description.split(/\r?\n/).length > 1) {
        desc = '\n' + wrap(v.description, { margin: 3, width: this.out.columns })
      }
    }
    return prefix + ' ' + title + color.gray(desc || '');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    let { startIndex, endIndex } = entriesToDisplay(this.select, this.choices.length, this.limit);

    this.outputText = [
      style.symbol(this.done, this.aborted, this.exited),
      color.bold(this.msg),
      style.delimiter(this.completing),
      this.done && this.suggestions[this.select]
        ? this.suggestions[this.select].title
        : this.rendered = this.transform.render(this.input)
    ].join(' ');

    if (!this.done) {
      const suggestions = this.suggestions
        .slice(startIndex, endIndex)
        .map((item, i) =>  this.renderOption(item,
          this.select === i + startIndex,
          i === 0 && startIndex > 0,
          i + startIndex === endIndex - 1 && endIndex < this.choices.length))
        .join('\n');
      this.outputText += `\n` + (suggestions || color.gray(this.fallback.title));
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

module.exports = AutocompletePrompt;


/***/ }),

/***/ 2548:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);
const { cursor } = __nccwpck_require__(2858);
const MultiselectPrompt = __nccwpck_require__(652);
const { clear, style, figures } = __nccwpck_require__(5512);
/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class AutocompleteMultiselectPrompt extends MultiselectPrompt {
  constructor(opts={}) {
    opts.overrideRender = true;
    super(opts);
    this.inputValue = '';
    this.clear = clear('', this.out.columns);
    this.filteredOptions = this.value;
    this.render();
  }

  last() {
    this.cursor = this.filteredOptions.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.filteredOptions.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.filteredOptions.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.filteredOptions.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.filteredOptions[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.filteredOptions[this.cursor].selected = true;
    this.render();
  }

  delete() {
    if (this.inputValue.length) {
      this.inputValue = this.inputValue.substr(0, this.inputValue.length - 1);
      this.updateFilteredOptions();
    }
  }

  updateFilteredOptions() {
    const currentHighlight = this.filteredOptions[this.cursor];
    this.filteredOptions = this.value
      .filter(v => {
        if (this.inputValue) {
          if (typeof v.title === 'string') {
            if (v.title.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          if (typeof v.value === 'string') {
            if (v.value.toLowerCase().includes(this.inputValue.toLowerCase())) {
              return true;
            }
          }
          return false;
        }
        return true;
      });
    const newHighlightIndex = this.filteredOptions.findIndex(v => v === currentHighlight)
    this.cursor = newHighlightIndex < 0 ? 0 : newHighlightIndex;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.filteredOptions[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  handleInputChange(c) {
    this.inputValue = this.inputValue + c;
    this.updateFilteredOptions();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else {
      this.handleInputChange(c);
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }
      return `
Instructions:
    ${figures.arrowUp}/${figures.arrowDown}: Highlight option
    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection
    [a,b,c]/delete: Filter choices
    enter/return: Complete answer
`;
    }
    return '';
  }

  renderCurrentInput() {
    return `
Filtered results for: ${this.inputValue ? this.inputValue : color.gray('Enter something to filter')}\n`;
  }

  renderOption(cursor, v, i) {
    let title;
    if (v.disabled) title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
    else title = cursor === i ? color.cyan().underline(v.title) : v.title;
    return (v.selected ? color.green(figures.radioOn) : figures.radioOff) + '  ' + title
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
    }

    const output = [color.gray(this.hint), this.renderInstructions(), this.renderCurrentInput()];

    if (this.filteredOptions.length && this.filteredOptions[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render();

    // print prompt

    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');

    if (this.showMinError) {
      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }
    prompt += this.renderOptions(this.filteredOptions);

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt, this.out.columns);
  }
}

module.exports = AutocompleteMultiselectPrompt;


/***/ }),

/***/ 5169:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { style, clear } = __nccwpck_require__(5512);
const { erase, cursor } = __nccwpck_require__(2858);

/**
 * ConfirmPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial] Default value (true/false)
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.yes] The "Yes" label
 * @param {String} [opts.yesOption] The "Yes" option when choosing between yes/no
 * @param {String} [opts.no] The "No" label
 * @param {String} [opts.noOption] The "No" option when choosing between yes/no
 */
class ConfirmPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.value = opts.initial;
    this.initialValue = !!opts.initial;
    this.yesMsg = opts.yes || 'yes';
    this.yesOption = opts.yesOption || '(Y/n)';
    this.noMsg = opts.no || 'no';
    this.noOption = opts.noOption || '(y/N)';
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.value = this.value || false;
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  _(c, key) {
    if (c.toLowerCase() === 'y') {
      this.value = true;
      return this.submit();
    }
    if (c.toLowerCase() === 'n') {
      this.value = false;
      return this.submit();
    }
    return this.bell();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      this.done ? (this.value ? this.yesMsg : this.noMsg)
          : color.gray(this.initialValue ? this.yesOption : this.noOption)
    ].join(' ');

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

module.exports = ConfirmPrompt;


/***/ }),

/***/ 2853:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { style, clear, figures } = __nccwpck_require__(5512);
const { erase, cursor } = __nccwpck_require__(2858);
const { DatePart, Meridiem, Day, Hours, Milliseconds, Minutes, Month, Seconds, Year } = __nccwpck_require__(534);

const regex = /\\(.)|"((?:\\["\\]|[^"])+)"|(D[Do]?|d{3,4}|d)|(M{1,4})|(YY(?:YY)?)|([aA])|([Hh]{1,2})|(m{1,2})|(s{1,2})|(S{1,4})|./g;
const regexGroups = {
  1: ({token}) => token.replace(/\\(.)/g, '$1'),
  2: (opts) => new Day(opts), // Day // TODO
  3: (opts) => new Month(opts), // Month
  4: (opts) => new Year(opts), // Year
  5: (opts) => new Meridiem(opts), // AM/PM // TODO (special)
  6: (opts) => new Hours(opts), // Hours
  7: (opts) => new Minutes(opts), // Minutes
  8: (opts) => new Seconds(opts), // Seconds
  9: (opts) => new Milliseconds(opts), // Fractional seconds
}

const dfltLocales = {
  months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
  monthsShort: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
  weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
  weekdaysShort: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(',')
}


/**
 * DatePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Number} [opts.initial] Index of default value
 * @param {String} [opts.mask] The format mask
 * @param {object} [opts.locales] The date locales
 * @param {String} [opts.error] The error message shown on invalid value
 * @param {Function} [opts.validate] Function to validate the submitted value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class DatePrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = 0;
    this.typed = '';
    this.locales = Object.assign(dfltLocales, opts.locales);
    this._date = opts.initial || new Date();
    this.errorMsg = opts.error || 'Please Enter A Valid Value';
    this.validator = opts.validate || (() => true);
    this.mask = opts.mask || 'YYYY-MM-DD HH:mm:ss';
    this.clear = clear('', this.out.columns);
    this.render();
  }

  get value() {
    return this.date
  }

  get date() {
    return this._date;
  }

  set date(date) {
    if (date) this._date.setTime(date.getTime());
  }

  set mask(mask) {
    let result;
    this.parts = [];
    while(result = regex.exec(mask)) {
      let match = result.shift();
      let idx = result.findIndex(gr => gr != null);
      this.parts.push(idx in regexGroups
        ? regexGroups[idx]({ token: result[idx] || match, date: this.date, parts: this.parts, locales: this.locales })
        : result[idx] || match);
    }

    let parts = this.parts.reduce((arr, i) => {
      if (typeof i === 'string' && typeof arr[arr.length - 1] === 'string')
        arr[arr.length - 1] += i;
      else arr.push(i);
      return arr;
    }, []);

    this.parts.splice(0);
    this.parts.push(...parts);
    this.reset();
  }

  moveCursor(n) {
    this.typed = '';
    this.cursor = n;
    this.fire();
  }

  reset() {
    this.moveCursor(this.parts.findIndex(p => p instanceof DatePart));
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === 'string') {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    await this.validate();
    if (this.error) {
      this.color = 'red';
      this.fire();
      this.render();
      return;
    }
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  up() {
    this.typed = '';
    this.parts[this.cursor].up();
    this.render();
  }

  down() {
    this.typed = '';
    this.parts[this.cursor].down();
    this.render();
  }

  left() {
    let prev = this.parts[this.cursor].prev();
    if (prev == null) return this.bell();
    this.moveCursor(this.parts.indexOf(prev));
    this.render();
  }

  right() {
    let next = this.parts[this.cursor].next();
    if (next == null) return this.bell();
    this.moveCursor(this.parts.indexOf(next));
    this.render();
  }

  next() {
    let next = this.parts[this.cursor].next();
    this.moveCursor(next
      ? this.parts.indexOf(next)
      : this.parts.findIndex((part) => part instanceof DatePart));
    this.render();
  }

  _(c) {
    if (/\d/.test(c)) {
      this.typed += c;
      this.parts[this.cursor].setTo(this.typed);
      this.render();
    }
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    // Print prompt
    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.parts.reduce((arr, p, idx) => arr.concat(idx === this.cursor && !this.done ? color.cyan().underline(p.toString()) : p), [])
          .join('')
    ].join(' ');

    // Print error
    if (this.error) {
      this.outputText += this.errorMsg.split('\n').reduce(
          (a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

module.exports = DatePrompt;


/***/ }),

/***/ 9029:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  TextPrompt: __nccwpck_require__(5910),
  SelectPrompt: __nccwpck_require__(4529),
  TogglePrompt: __nccwpck_require__(6657),
  DatePrompt: __nccwpck_require__(2853),
  NumberPrompt: __nccwpck_require__(768),
  MultiselectPrompt: __nccwpck_require__(652),
  AutocompletePrompt: __nccwpck_require__(5361),
  AutocompleteMultiselectPrompt: __nccwpck_require__(2548),
  ConfirmPrompt: __nccwpck_require__(5169)
};


/***/ }),

/***/ 652:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);
const { cursor } = __nccwpck_require__(2858);
const Prompt = __nccwpck_require__(515);
const { clear, figures, style, wrap, entriesToDisplay } = __nccwpck_require__(5512);

/**
 * MultiselectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {String} [opts.warn] Hint shown for disabled choices
 * @param {Number} [opts.max] Max choices
 * @param {Number} [opts.cursor=0] Cursor start position
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class MultiselectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.cursor = opts.cursor || 0;
    this.scrollIndex = opts.cursor || 0;
    this.hint = opts.hint || '';
    this.warn = opts.warn || '- This option is disabled -';
    this.minSelected = opts.min;
    this.showMinError = false;
    this.maxChoices = opts.max;
    this.instructions = opts.instructions;
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        description: ch && ch.description,
        value: ch && (ch.value === undefined ? idx : ch.value),
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.clear = clear('', this.out.columns);
    if (!opts.overrideRender) {
      this.render();
    }
  }

  reset() {
    this.value.map(v => !v.selected);
    this.cursor = 0;
    this.fire();
    this.render();
  }

  selected() {
    return this.value.filter(v => v.selected);
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    const selected = this.value
      .filter(e => e.selected);
    if (this.minSelected && selected.length < this.minSelected) {
      this.showMinError = true;
      this.render();
    } else {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    }
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length - 1;
    this.render();
  }
  next() {
    this.cursor = (this.cursor + 1) % this.value.length;
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.cursor = this.value.length - 1;
    } else {
      this.cursor--;
    }
    this.render();
  }

  down() {
    if (this.cursor === this.value.length - 1) {
      this.cursor = 0;
    } else {
      this.cursor++;
    }
    this.render();
  }

  left() {
    this.value[this.cursor].selected = false;
    this.render();
  }

  right() {
    if (this.value.filter(e => e.selected).length >= this.maxChoices) return this.bell();
    this.value[this.cursor].selected = true;
    this.render();
  }

  handleSpaceToggle() {
    const v = this.value[this.cursor];

    if (v.selected) {
      v.selected = false;
      this.render();
    } else if (v.disabled || this.value.filter(e => e.selected).length >= this.maxChoices) {
      return this.bell();
    } else {
      v.selected = true;
      this.render();
    }
  }

  toggleAll() {
    if (this.maxChoices !== undefined || this.value[this.cursor].disabled) {
      return this.bell();
    }

    const newSelected = !this.value[this.cursor].selected;
    this.value.filter(v => !v.disabled).forEach(v => v.selected = newSelected);
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.handleSpaceToggle();
    } else if (c === 'a') {
      this.toggleAll();
    } else {
      return this.bell();
    }
  }

  renderInstructions() {
    if (this.instructions === undefined || this.instructions) {
      if (typeof this.instructions === 'string') {
        return this.instructions;
      }
      return '\nInstructions:\n'
        + `    ${figures.arrowUp}/${figures.arrowDown}: Highlight option\n`
        + `    ${figures.arrowLeft}/${figures.arrowRight}/[space]: Toggle selection\n`
        + (this.maxChoices === undefined ? `    a: Toggle all\n` : '')
        + `    enter/return: Complete answer`;
    }
    return '';
  }

  renderOption(cursor, v, i, arrowIndicator) {
    const prefix = (v.selected ? color.green(figures.radioOn) : figures.radioOff) + ' ' + arrowIndicator + ' ';
    let title, desc;

    if (v.disabled) {
      title = cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
    } else {
      title = cursor === i ? color.cyan().underline(v.title) : v.title;
      if (cursor === i && v.description) {
        desc = ` - ${v.description}`;
        if (prefix.length + title.length + desc.length >= this.out.columns
          || v.description.split(/\r?\n/).length > 1) {
          desc = '\n' + wrap(v.description, { margin: prefix.length, width: this.out.columns });
        }
      }
    }

    return prefix + title + color.gray(desc || '');
  }

  // shared with autocompleteMultiselect
  paginateOptions(options) {
    if (options.length === 0) {
      return color.red('No matches for this query.');
    }

    let { startIndex, endIndex } = entriesToDisplay(this.cursor, options.length, this.optionsPerPage);
    let prefix, styledOptions = [];

    for (let i = startIndex; i < endIndex; i++) {
      if (i === startIndex && startIndex > 0) {
        prefix = figures.arrowUp;
      } else if (i === endIndex - 1 && endIndex < options.length) {
        prefix = figures.arrowDown;
      } else {
        prefix = ' ';
      }
      styledOptions.push(this.renderOption(this.cursor, options[i], i, prefix));
    }

    return '\n' + styledOptions.join('\n');
  }

  // shared with autocomleteMultiselect
  renderOptions(options) {
    if (!this.done) {
      return this.paginateOptions(options);
    }
    return '';
  }

  renderDoneOrInstructions() {
    if (this.done) {
      return this.value
        .filter(e => e.selected)
        .map(v => v.title)
        .join(', ');
    }

    const output = [color.gray(this.hint), this.renderInstructions()];

    if (this.value[this.cursor].disabled) {
      output.push(color.yellow(this.warn));
    }
    return output.join(' ');
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    super.render();

    // print prompt
    let prompt = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.renderDoneOrInstructions()
    ].join(' ');
    if (this.showMinError) {
      prompt += color.red(`You must select a minimum of ${this.minSelected} choices.`);
      this.showMinError = false;
    }
    prompt += this.renderOptions(this.value);

    this.out.write(this.clear + prompt);
    this.clear = clear(prompt, this.out.columns);
  }
}

module.exports = MultiselectPrompt;


/***/ }),

/***/ 768:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { cursor, erase } = __nccwpck_require__(2858);
const { style, figures, clear, lines } = __nccwpck_require__(5512);

const isNumber = /[0-9]/;
const isDef = any => any !== undefined;
const round = (number, precision) => {
  let factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

/**
 * NumberPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {Number} [opts.initial] Default value
 * @param {Number} [opts.max=+Infinity] Max value
 * @param {Number} [opts.min=-Infinity] Min value
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class NumberPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.msg = opts.message;
    this.initial = isDef(opts.initial) ? opts.initial : '';
    this.float = !!opts.float;
    this.round = opts.round || 2;
    this.inc = opts.increment || 1;
    this.min = isDef(opts.min) ? opts.min : -Infinity;
    this.max = isDef(opts.max) ? opts.max : Infinity;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.validator = opts.validate || (() => true);
    this.color = `cyan`;
    this.value = ``;
    this.typed = ``;
    this.lastHit = 0;
    this.render();
  }

  set value(v) {
    if (!v && v !== 0) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(`${this.initial}`));
      this._value = ``;
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(`${round(v, this.round)}`);
      this._value = round(v, this.round);
    }
    this.fire();
  }

  get value() {
    return this._value;
  }

  parse(x) {
    return this.float ? parseFloat(x) : parseInt(x);
  }

  valid(c) {
    return c === `-` || c === `.` && this.float || isNumber.test(c)
  }

  reset() {
    this.typed = ``;
    this.value = ``;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === `string`) {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    await this.validate();
    if (this.error) {
      this.color = `red`;
      this.fire();
      this.render();
      return;
    }
    let x = this.value;
    this.value = x !== `` ? x : this.initial;
    this.done = true;
    this.aborted = false;
    this.error = false;
    this.fire();
    this.render();
    this.out.write(`\n`);
    this.close();
  }

  up() {
    this.typed = ``;
    if(this.value === '') {
      this.value = this.min - this.inc;
    }
    if (this.value >= this.max) return this.bell();
    this.value += this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  down() {
    this.typed = ``;
    if(this.value === '') {
      this.value = this.min + this.inc;
    }
    if (this.value <= this.min) return this.bell();
    this.value -= this.inc;
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  delete() {
    let val = this.value.toString();
    if (val.length === 0) return this.bell();
    this.value = this.parse((val = val.slice(0, -1))) || ``;
    if (this.value !== '' && this.value < this.min) {
      this.value = this.min;
    }
    this.color = `cyan`;
    this.fire();
    this.render();
  }

  next() {
    this.value = this.initial;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (!this.valid(c)) return this.bell();

    const now = Date.now();
    if (now - this.lastHit > 1000) this.typed = ``; // 1s elapsed
    this.typed += c;
    this.lastHit = now;
    this.color = `cyan`;

    if (c === `.`) return this.fire();

    this.value = Math.min(this.parse(this.typed), this.max);
    if (this.value > this.max) this.value = this.max;
    if (this.value < this.min) this.value = this.min;
    this.fire();
    this.render();
  }

  render() {
    if (this.closed) return;
    if (!this.firstRender) {
      if (this.outputError)
        this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
      this.out.write(clear(this.outputText, this.out.columns));
    }
    super.render();
    this.outputError = '';

    // Print prompt
    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      !this.done || (!this.done && !this.placeholder)
          ? color[this.color]().underline(this.rendered) : this.rendered
    ].join(` `);

    // Print error
    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`)
          .reduce((a, l, i) => a + `\n${i ? ` ` : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore);
  }
}

module.exports = NumberPrompt;


/***/ }),

/***/ 515:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const readline = __nccwpck_require__(3785);
const { action } = __nccwpck_require__(5512);
const EventEmitter = __nccwpck_require__(4434);
const { beep, cursor } = __nccwpck_require__(2858);
const color = __nccwpck_require__(3173);

/**
 * Base prompt skeleton
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class Prompt extends EventEmitter {
  constructor(opts={}) {
    super();

    this.firstRender = true;
    this.in = opts.stdin || process.stdin;
    this.out = opts.stdout || process.stdout;
    this.onRender = (opts.onRender || (() => void 0)).bind(this);
    const rl = readline.createInterface({ input:this.in, escapeCodeTimeout:50 });
    readline.emitKeypressEvents(this.in, rl);

    if (this.in.isTTY) this.in.setRawMode(true);
    const isSelect = [ 'SelectPrompt', 'MultiselectPrompt' ].indexOf(this.constructor.name) > -1;
    const keypress = (str, key) => {
      let a = action(key, isSelect);
      if (a === false) {
        this._ && this._(str, key);
      } else if (typeof this[a] === 'function') {
        this[a](key);
      } else {
        this.bell();
      }
    };

    this.close = () => {
      this.out.write(cursor.show);
      this.in.removeListener('keypress', keypress);
      if (this.in.isTTY) this.in.setRawMode(false);
      rl.close();
      this.emit(this.aborted ? 'abort' : this.exited ? 'exit' : 'submit', this.value);
      this.closed = true;
    };

    this.in.on('keypress', keypress);
  }

  fire() {
    this.emit('state', {
      value: this.value,
      aborted: !!this.aborted,
      exited: !!this.exited
    });
  }

  bell() {
    this.out.write(beep);
  }

  render() {
    this.onRender(color);
    if (this.firstRender) this.firstRender = false;
  }
}

module.exports = Prompt;


/***/ }),

/***/ 4529:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { style, clear, figures, wrap, entriesToDisplay } = __nccwpck_require__(5512);
const { cursor } = __nccwpck_require__(2858);

/**
 * SelectPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Array} opts.choices Array of choice objects
 * @param {String} [opts.hint] Hint to display
 * @param {Number} [opts.initial] Index of default value
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {Number} [opts.optionsPerPage=10] Max options to display at once
 */
class SelectPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.hint = opts.hint || '- Use arrow-keys. Return to submit.';
    this.warn = opts.warn || '- This option is disabled';
    this.cursor = opts.initial || 0;
    this.choices = opts.choices.map((ch, idx) => {
      if (typeof ch === 'string')
        ch = {title: ch, value: idx};
      return {
        title: ch && (ch.title || ch.value || ch),
        value: ch && (ch.value === undefined ? idx : ch.value),
        description: ch && ch.description,
        selected: ch && ch.selected,
        disabled: ch && ch.disabled
      };
    });
    this.optionsPerPage = opts.optionsPerPage || 10;
    this.value = (this.choices[this.cursor] || {}).value;
    this.clear = clear('', this.out.columns);
    this.render();
  }

  moveCursor(n) {
    this.cursor = n;
    this.value = this.choices[n].value;
    this.fire();
  }

  reset() {
    this.moveCursor(0);
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    if (!this.selection.disabled) {
      this.done = true;
      this.aborted = false;
      this.fire();
      this.render();
      this.out.write('\n');
      this.close();
    } else
      this.bell();
  }

  first() {
    this.moveCursor(0);
    this.render();
  }

  last() {
    this.moveCursor(this.choices.length - 1);
    this.render();
  }

  up() {
    if (this.cursor === 0) {
      this.moveCursor(this.choices.length - 1);
    } else {
      this.moveCursor(this.cursor - 1);
    }
    this.render();
  }

  down() {
    if (this.cursor === this.choices.length - 1) {
      this.moveCursor(0);
    } else {
      this.moveCursor(this.cursor + 1);
    }
    this.render();
  }

  next() {
    this.moveCursor((this.cursor + 1) % this.choices.length);
    this.render();
  }

  _(c, key) {
    if (c === ' ') return this.submit();
  }

  get selection() {
    return this.choices[this.cursor];
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    let { startIndex, endIndex } = entriesToDisplay(this.cursor, this.choices.length, this.optionsPerPage);

    // Print prompt
    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(false),
      this.done ? this.selection.title : this.selection.disabled
          ? color.yellow(this.warn) : color.gray(this.hint)
    ].join(' ');

    // Print choices
    if (!this.done) {
      this.outputText += '\n';
      for (let i = startIndex; i < endIndex; i++) {
        let title, prefix, desc = '', v = this.choices[i];

        // Determine whether to display "more choices" indicators
        if (i === startIndex && startIndex > 0) {
          prefix = figures.arrowUp;
        } else if (i === endIndex - 1 && endIndex < this.choices.length) {
          prefix = figures.arrowDown;
        } else {
          prefix = ' ';
        }

        if (v.disabled) {
          title = this.cursor === i ? color.gray().underline(v.title) : color.strikethrough().gray(v.title);
          prefix = (this.cursor === i ? color.bold().gray(figures.pointer) + ' ' : '  ') + prefix;
        } else {
          title = this.cursor === i ? color.cyan().underline(v.title) : v.title;
          prefix = (this.cursor === i ? color.cyan(figures.pointer) + ' ' : '  ') + prefix;
          if (v.description && this.cursor === i) {
            desc = ` - ${v.description}`;
            if (prefix.length + title.length + desc.length >= this.out.columns
                || v.description.split(/\r?\n/).length > 1) {
              desc = '\n' + wrap(v.description, { margin: 3, width: this.out.columns });
            }
          }
        }

        this.outputText += `${prefix} ${title}${color.gray(desc)}\n`;
      }
    }

    this.out.write(this.outputText);
  }
}

module.exports = SelectPrompt;


/***/ }),

/***/ 5910:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { erase, cursor } = __nccwpck_require__(2858);
const { style, clear, lines, figures } = __nccwpck_require__(5512);

/**
 * TextPrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {String} [opts.style='default'] Render style
 * @param {String} [opts.initial] Default value
 * @param {Function} [opts.validate] Validate function
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 * @param {String} [opts.error] The invalid error label
 */
class TextPrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.transform = style.render(opts.style);
    this.scale = this.transform.scale;
    this.msg = opts.message;
    this.initial = opts.initial || ``;
    this.validator = opts.validate || (() => true);
    this.value = ``;
    this.errorMsg = opts.error || `Please Enter A Valid Value`;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.clear = clear(``, this.out.columns);
    this.render();
  }

  set value(v) {
    if (!v && this.initial) {
      this.placeholder = true;
      this.rendered = color.gray(this.transform.render(this.initial));
    } else {
      this.placeholder = false;
      this.rendered = this.transform.render(v);
    }
    this._value = v;
    this.fire();
  }

  get value() {
    return this._value;
  }

  reset() {
    this.value = ``;
    this.cursor = Number(!!this.initial);
    this.cursorOffset = 0;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.value = this.value || this.initial;
    this.done = this.aborted = true;
    this.error = false;
    this.red = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  async validate() {
    let valid = await this.validator(this.value);
    if (typeof valid === `string`) {
      this.errorMsg = valid;
      valid = false;
    }
    this.error = !valid;
  }

  async submit() {
    this.value = this.value || this.initial;
    this.cursorOffset = 0;
    this.cursor = this.rendered.length;
    await this.validate();
    if (this.error) {
      this.red = true;
      this.fire();
      this.render();
      return;
    }
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  next() {
    if (!this.placeholder) return this.bell();
    this.value = this.initial;
    this.cursor = this.rendered.length;
    this.fire();
    this.render();
  }

  moveCursor(n) {
    if (this.placeholder) return;
    this.cursor = this.cursor+n;
    this.cursorOffset += n;
  }

  _(c, key) {
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${c}${s2}`;
    this.red = false;
    this.cursor = this.placeholder ? 0 : s1.length+1;
    this.render();
  }

  delete() {
    if (this.isCursorAtStart()) return this.bell();
    let s1 = this.value.slice(0, this.cursor-1);
    let s2 = this.value.slice(this.cursor);
    this.value = `${s1}${s2}`;
    this.red = false;
    if (this.isCursorAtStart()) {
      this.cursorOffset = 0
    } else {
      this.cursorOffset++;
      this.moveCursor(-1);
    }
    this.render();
  }

  deleteForward() {
    if(this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    let s1 = this.value.slice(0, this.cursor);
    let s2 = this.value.slice(this.cursor+1);
    this.value = `${s1}${s2}`;
    this.red = false;
    if (this.isCursorAtEnd()) {
      this.cursorOffset = 0;
    } else {
      this.cursorOffset++;
    }
    this.render();
  }

  first() {
    this.cursor = 0;
    this.render();
  }

  last() {
    this.cursor = this.value.length;
    this.render();
  }

  left() {
    if (this.cursor <= 0 || this.placeholder) return this.bell();
    this.moveCursor(-1);
    this.render();
  }

  right() {
    if (this.cursor*this.scale >= this.rendered.length || this.placeholder) return this.bell();
    this.moveCursor(1);
    this.render();
  }

  isCursorAtStart() {
    return this.cursor === 0 || (this.placeholder && this.cursor === 1);
  }

  isCursorAtEnd() {
    return this.cursor === this.rendered.length || (this.placeholder && this.cursor === this.rendered.length + 1)
  }

  render() {
    if (this.closed) return;
    if (!this.firstRender) {
      if (this.outputError)
        this.out.write(cursor.down(lines(this.outputError, this.out.columns) - 1) + clear(this.outputError, this.out.columns));
      this.out.write(clear(this.outputText, this.out.columns));
    }
    super.render();
    this.outputError = '';

    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      this.red ? color.red(this.rendered) : this.rendered
    ].join(` `);

    if (this.error) {
      this.outputError += this.errorMsg.split(`\n`)
          .reduce((a, l, i) => a + `\n${i ? ' ' : figures.pointerSmall} ${color.red().italic(l)}`, ``);
    }

    this.out.write(erase.line + cursor.to(0) + this.outputText + cursor.save + this.outputError + cursor.restore + cursor.move(this.cursorOffset, 0));
  }
}

module.exports = TextPrompt;

/***/ }),

/***/ 6657:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const color = __nccwpck_require__(3173);
const Prompt = __nccwpck_require__(515);
const { style, clear } = __nccwpck_require__(5512);
const { cursor, erase } = __nccwpck_require__(2858);

/**
 * TogglePrompt Base Element
 * @param {Object} opts Options
 * @param {String} opts.message Message
 * @param {Boolean} [opts.initial=false] Default value
 * @param {String} [opts.active='no'] Active label
 * @param {String} [opts.inactive='off'] Inactive label
 * @param {Stream} [opts.stdin] The Readable stream to listen to
 * @param {Stream} [opts.stdout] The Writable stream to write readline data to
 */
class TogglePrompt extends Prompt {
  constructor(opts={}) {
    super(opts);
    this.msg = opts.message;
    this.value = !!opts.initial;
    this.active = opts.active || 'on';
    this.inactive = opts.inactive || 'off';
    this.initialValue = this.value;
    this.render();
  }

  reset() {
    this.value = this.initialValue;
    this.fire();
    this.render();
  }

  exit() {
    this.abort();
  }

  abort() {
    this.done = this.aborted = true;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  submit() {
    this.done = true;
    this.aborted = false;
    this.fire();
    this.render();
    this.out.write('\n');
    this.close();
  }

  deactivate() {
    if (this.value === false) return this.bell();
    this.value = false;
    this.render();
  }

  activate() {
    if (this.value === true) return this.bell();
    this.value = true;
    this.render();
  }

  delete() {
    this.deactivate();
  }
  left() {
    this.deactivate();
  }
  right() {
    this.activate();
  }
  down() {
    this.deactivate();
  }
  up() {
    this.activate();
  }

  next() {
    this.value = !this.value;
    this.fire();
    this.render();
  }

  _(c, key) {
    if (c === ' ') {
      this.value = !this.value;
    } else if (c === '1') {
      this.value = true;
    } else if (c === '0') {
      this.value = false;
    } else return this.bell();
    this.render();
  }

  render() {
    if (this.closed) return;
    if (this.firstRender) this.out.write(cursor.hide);
    else this.out.write(clear(this.outputText, this.out.columns));
    super.render();

    this.outputText = [
      style.symbol(this.done, this.aborted),
      color.bold(this.msg),
      style.delimiter(this.done),
      this.value ? this.inactive : color.cyan().underline(this.inactive),
      color.gray('/'),
      this.value ? color.cyan().underline(this.active) : this.active
    ].join(' ');

    this.out.write(erase.line + cursor.to(0) + this.outputText);
  }
}

module.exports = TogglePrompt;


/***/ }),

/***/ 9391:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const prompts = __nccwpck_require__(4520);

const passOn = ['suggest', 'format', 'onState', 'validate', 'onRender', 'type'];
const noop = () => {};

/**
 * Prompt for a series of questions
 * @param {Array|Object} questions Single question object or Array of question objects
 * @param {Function} [onSubmit] Callback function called on prompt submit
 * @param {Function} [onCancel] Callback function called on cancel/abort
 * @returns {Object} Object with values from user input
 */
async function prompt(questions=[], { onSubmit=noop, onCancel=noop }={}) {
  const answers = {};
  const override = prompt._override || {};
  questions = [].concat(questions);
  let answer, question, quit, name, type, lastPrompt;

  const getFormattedAnswer = async (question, answer, skipValidation = false) => {
    if (!skipValidation && question.validate && question.validate(answer) !== true) {
      return;
    }
    return question.format ? await question.format(answer, answers) : answer
  };

  for (question of questions) {
    ({ name, type } = question);

    // evaluate type first and skip if type is a falsy value
    if (typeof type === 'function') {
      type = await type(answer, { ...answers }, question)
      question['type'] = type
    }
    if (!type) continue;

    // if property is a function, invoke it unless it's a special function
    for (let key in question) {
      if (passOn.includes(key)) continue;
      let value = question[key];
      question[key] = typeof value === 'function' ? await value(answer, { ...answers }, lastPrompt) : value;
    }

    lastPrompt = question;

    if (typeof question.message !== 'string') {
      throw new Error('prompt message is required');
    }

    // update vars in case they changed
    ({ name, type } = question);

    if (prompts[type] === void 0) {
      throw new Error(`prompt type (${type}) is not defined`);
    }

    if (override[question.name] !== undefined) {
      answer = await getFormattedAnswer(question, override[question.name]);
      if (answer !== undefined) {
        answers[name] = answer;
        continue;
      }
    }

    try {
      // Get the injected answer if there is one or prompt the user
      answer = prompt._injected ? getInjectedAnswer(prompt._injected, question.initial) : await prompts[type](question);
      answers[name] = answer = await getFormattedAnswer(question, answer, true);
      quit = await onSubmit(question, answer, answers);
    } catch (err) {
      quit = !(await onCancel(question, answers));
    }

    if (quit) return answers;
  }

  return answers;
}

function getInjectedAnswer(injected, deafultValue) {
  const answer = injected.shift();
    if (answer instanceof Error) {
      throw answer;
    }

    return (answer === undefined) ? deafultValue : answer;
}

function inject(answers) {
  prompt._injected = (prompt._injected || []).concat(answers);
}

function override(answers) {
  prompt._override = Object.assign({}, answers);
}

module.exports = Object.assign(prompt, { prompt, prompts, inject, override });


/***/ }),

/***/ 4520:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

const $ = exports;
const el = __nccwpck_require__(9029);
const noop = v => v;

function toPrompt(type, args, opts={}) {
  return new Promise((res, rej) => {
    const p = new el[type](args);
    const onAbort = opts.onAbort || noop;
    const onSubmit = opts.onSubmit || noop;
    const onExit = opts.onExit || noop;
    p.on('state', args.onState || noop);
    p.on('submit', x => res(onSubmit(x)));
    p.on('exit', x => res(onExit(x)));
    p.on('abort', x => rej(onAbort(x)));
  });
}

/**
 * Text prompt
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.text = args => toPrompt('TextPrompt', args);

/**
 * Password prompt with masked input
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.password = args => {
  args.style = 'password';
  return $.text(args);
};

/**
 * Prompt where input is invisible, like sudo
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {function} [args.onState] On state change callback
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.invisible = args => {
  args.style = 'invisible';
  return $.text(args);
};

/**
 * Number prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.number = args => toPrompt('NumberPrompt', args);

/**
 * Date prompt
 * @param {string} args.message Prompt message to display
 * @param {number} args.initial Default number value
 * @param {function} [args.onState] On state change callback
 * @param {number} [args.max] Max value
 * @param {number} [args.min] Min value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {Boolean} [opts.float=false] Parse input as floats
 * @param {Number} [opts.round=2] Round floats to x decimals
 * @param {Number} [opts.increment=1] Number to increment by when using arrow-keys
 * @param {function} [args.validate] Function to validate user input
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.date = args => toPrompt('DatePrompt', args);

/**
 * Classic yes/no prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.confirm = args => toPrompt('ConfirmPrompt', args);

/**
 * List prompt, split intput string by `seperator`
 * @param {string} args.message Prompt message to display
 * @param {string} [args.initial] Default string value
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {string} [args.separator] String separator
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input, in form of an `Array`
 */
$.list = args => {
  const sep = args.separator || ',';
  return toPrompt('TextPrompt', args, {
    onSubmit: str => str.split(sep).map(s => s.trim())
  });
};

/**
 * Toggle/switch prompt
 * @param {string} args.message Prompt message to display
 * @param {boolean} [args.initial=false] Default value
 * @param {string} [args.active="on"] Text for `active` state
 * @param {string} [args.inactive="off"] Text for `inactive` state
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.toggle = args => toPrompt('TogglePrompt', args);

/**
 * Interactive select prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value }, ...]`
 * @param {number} [args.initial] Index of default value
 * @param {String} [args.hint] Hint to display
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.select = args => toPrompt('SelectPrompt', args);

/**
 * Interactive multi-select / autocompleteMultiselect prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of choices objects `[{ title, value, [selected] }, ...]`
 * @param {number} [args.max] Max select
 * @param {string} [args.hint] Hint to display user
 * @param {Number} [args.cursor=0] Cursor start position
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.multiselect = args => {
  args.choices = [].concat(args.choices || []);
  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
  return toPrompt('MultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

$.autocompleteMultiselect = args => {
  args.choices = [].concat(args.choices || []);
  const toSelected = items => items.filter(item => item.selected).map(item => item.value);
  return toPrompt('AutocompleteMultiselectPrompt', args, {
    onAbort: toSelected,
    onSubmit: toSelected
  });
};

const byTitle = (input, choices) => Promise.resolve(
  choices.filter(item => item.title.slice(0, input.length).toLowerCase() === input.toLowerCase())
);

/**
 * Interactive auto-complete prompt
 * @param {string} args.message Prompt message to display
 * @param {Array} args.choices Array of auto-complete choices objects `[{ title, value }, ...]`
 * @param {Function} [args.suggest] Function to filter results based on user input. Defaults to sort by `title`
 * @param {number} [args.limit=10] Max number of results to show
 * @param {string} [args.style="default"] Render style ('default', 'password', 'invisible')
 * @param {String} [args.initial] Index of the default value
 * @param {boolean} [opts.clearFirst] The first ESCAPE keypress will clear the input
 * @param {String} [args.fallback] Fallback message - defaults to initial value
 * @param {function} [args.onState] On state change callback
 * @param {Stream} [args.stdin] The Readable stream to listen to
 * @param {Stream} [args.stdout] The Writable stream to write readline data to
 * @returns {Promise} Promise with user input
 */
$.autocomplete = args => {
  args.suggest = args.suggest || byTitle;
  args.choices = [].concat(args.choices || []);
  return toPrompt('AutocompletePrompt', args);
};


/***/ }),

/***/ 7452:
/***/ ((module) => {

"use strict";


module.exports = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;
  
  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }
  
  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J
  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage';
  // TODO create home() in prompt types (e.g. TextPrompt)
  if (key.name === 'home') return 'home';
  // TODO create end() in prompt types (e.g. TextPrompt)
  if (key.name === 'end') return 'end';

  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';

  return false;
};


/***/ }),

/***/ 2965:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const strip = __nccwpck_require__(7346);
const { erase, cursor } = __nccwpck_require__(2858);

const width = str => [...strip(str)].length;

/**
 * @param {string} prompt
 * @param {number} perLine
 */
module.exports = function(prompt, perLine) {
  if (!perLine) return erase.line + cursor.to(0);

  let rows = 0;
  const lines = prompt.split(/\r?\n/);
  for (let line of lines) {
    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
  }

  return erase.lines(rows);
};


/***/ }),

/***/ 2187:
/***/ ((module) => {

"use strict";


/**
 * Determine what entries should be displayed on the screen, based on the
 * currently selected index and the maximum visible. Used in list-based
 * prompts like `select` and `multiselect`.
 *
 * @param {number} cursor the currently selected entry
 * @param {number} total the total entries available to display
 * @param {number} [maxVisible] the number of entries that can be displayed
 */
module.exports = (cursor, total, maxVisible)  => {
  maxVisible = maxVisible || total;

  let startIndex = Math.min(total- maxVisible, cursor - Math.floor(maxVisible / 2));
  if (startIndex < 0) startIndex = 0;

  let endIndex = Math.min(startIndex + maxVisible, total);

  return { startIndex, endIndex };
};


/***/ }),

/***/ 6073:
/***/ ((module) => {

"use strict";
	

 const main = {
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  radioOn: '◉',
  radioOff: '◯',
  tick: '✔',	
  cross: '✖',	
  ellipsis: '…',	
  pointerSmall: '›',	
  line: '─',	
  pointer: '❯'	
};	
const win = {
  arrowUp: main.arrowUp,
  arrowDown: main.arrowDown,
  arrowLeft: main.arrowLeft,
  arrowRight: main.arrowRight,
  radioOn: '(*)',
  radioOff: '( )',	
  tick: '√',	
  cross: '×',	
  ellipsis: '...',	
  pointerSmall: '»',	
  line: '─',	
  pointer: '>'	
};	
const figures = process.platform === 'win32' ? win : main;	

 module.exports = figures;


/***/ }),

/***/ 5512:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = {
  action: __nccwpck_require__(7452),
  clear: __nccwpck_require__(2965),
  style: __nccwpck_require__(4809),
  strip: __nccwpck_require__(7346),
  figures: __nccwpck_require__(6073),
  lines: __nccwpck_require__(4632),
  wrap: __nccwpck_require__(3558),
  entriesToDisplay: __nccwpck_require__(2187)
};


/***/ }),

/***/ 4632:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const strip = __nccwpck_require__(7346);

/**
 * @param {string} msg
 * @param {number} perLine
 */
module.exports = function (msg, perLine) {
  let lines = String(strip(msg) || '').split(/\r?\n/);

  if (!perLine) return lines.length;
  return lines.map(l => Math.ceil(l.length / perLine))
      .reduce((a, b) => a + b);
};


/***/ }),

/***/ 7346:
/***/ ((module) => {

"use strict";


module.exports = str => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))'
  ].join('|');

  const RGX = new RegExp(pattern, 'g');
  return typeof str === 'string' ? str.replace(RGX, '') : str;
};


/***/ }),

/***/ 4809:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const c = __nccwpck_require__(3173);
const figures = __nccwpck_require__(6073);

// rendering user input.
const styles = Object.freeze({
  password: { scale: 1, render: input => '*'.repeat(input.length) },
  emoji: { scale: 2, render: input => '😃'.repeat(input.length) },
  invisible: { scale: 0, render: input => '' },
  default: { scale: 1, render: input => `${input}` }
});
const render = type => styles[type] || styles.default;

// icon to signalize a prompt.
const symbols = Object.freeze({
  aborted: c.red(figures.cross),
  done: c.green(figures.tick),
  exited: c.yellow(figures.cross),
  default: c.cyan('?')
});

const symbol = (done, aborted, exited) =>
  aborted ? symbols.aborted : exited ? symbols.exited : done ? symbols.done : symbols.default;

// between the question and the user's input.
const delimiter = completing =>
  c.gray(completing ? figures.ellipsis : figures.pointerSmall);

const item = (expandable, expanded) =>
  c.gray(expandable ? (expanded ? figures.pointerSmall : '+') : figures.line);

module.exports = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item
};


/***/ }),

/***/ 3558:
/***/ ((module) => {

"use strict";


/**
 * @param {string} msg The message to wrap
 * @param {object} opts
 * @param {number|string} [opts.margin] Left margin
 * @param {number} opts.width Maximum characters per line including the margin
 */
module.exports = (msg, opts = {}) => {
  const tab = Number.isSafeInteger(parseInt(opts.margin))
    ? new Array(parseInt(opts.margin)).fill(' ').join('')
    : (opts.margin || '');

  const width = opts.width;

  return (msg || '').split(/\r?\n/g)
    .map(line => line
      .split(/\s+/g)
      .reduce((arr, w) => {
        if (w.length + tab.length >= width || arr[arr.length - 1].length + w.length + 1 < width)
          arr[arr.length - 1] += ` ${w}`;
        else arr.push(`${tab}${w}`);
        return arr;
      }, [ tab ])
      .join('\n'))
    .join('\n');
};


/***/ }),

/***/ 978:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


module.exports = read

var readline = __nccwpck_require__(3785)
var Mute = __nccwpck_require__(9803)

function read (opts, cb) {
  if (opts.num) {
    throw new Error('read() no longer accepts a char number limit')
  }

  if (typeof opts.default !== 'undefined' &&
      typeof opts.default !== 'string' &&
      typeof opts.default !== 'number') {
    throw new Error('default value must be string or number')
  }

  var input = opts.input || process.stdin
  var output = opts.output || process.stdout
  var prompt = (opts.prompt || '').trim() + ' '
  var silent = opts.silent
  var editDef = false
  var timeout = opts.timeout

  var def = opts.default || ''
  if (def) {
    if (silent) {
      prompt += '(<default hidden>) '
    } else if (opts.edit) {
      editDef = true
    } else {
      prompt += '(' + def + ') '
    }
  }
  var terminal = !!(opts.terminal || output.isTTY)

  var m = new Mute({ replace: opts.replace, prompt: prompt })
  m.pipe(output, {end: false})
  output = m
  var rlOpts = { input: input, output: output, terminal: terminal }

  if (process.version.match(/^v0\.6/)) {
    var rl = readline.createInterface(rlOpts.input, rlOpts.output)
  } else {
    var rl = readline.createInterface(rlOpts)
  }


  output.unmute()
  rl.setPrompt(prompt)
  rl.prompt()
  if (silent) {
    output.mute()
  } else if (editDef) {
    rl.line = def
    rl.cursor = def.length
    rl._refreshLine()
  }

  var called = false
  rl.on('line', onLine)
  rl.on('error', onError)

  rl.on('SIGINT', function () {
    rl.close()
    onError(new Error('canceled'))
  })

  var timer
  if (timeout) {
    timer = setTimeout(function () {
      onError(new Error('timed out'))
    }, timeout)
  }

  function done () {
    called = true
    rl.close()

    if (process.version.match(/^v0\.6/)) {
      rl.input.removeAllListeners('data')
      rl.input.removeAllListeners('keypress')
      rl.input.pause()
    }

    clearTimeout(timer)
    output.mute()
    output.end()
  }

  function onError (er) {
    if (called) return
    done()
    return cb(er)
  }

  function onLine (line) {
    if (called) return
    if (silent && terminal) {
      output.unmute()
      output.write('\r\n')
    }
    done()
    // truncate the \n at the end.
    line = line.replace(/\r?\n$/, '')
    var isDefault = !!(editDef && line === def)
    if (def && !line) {
      isDefault = true
      line = def
    }
    cb(null, line, isDefault)
  }
}


/***/ }),

/***/ 2858:
/***/ ((module) => {

"use strict";


const ESC = '\x1B';
const CSI = `${ESC}[`;
const beep = '\u0007';

const cursor = {
  to(x, y) {
    if (!y) return `${CSI}${x + 1}G`;
    return `${CSI}${y + 1};${x + 1}H`;
  },
  move(x, y) {
    let ret = '';

    if (x < 0) ret += `${CSI}${-x}D`;
    else if (x > 0) ret += `${CSI}${x}C`;

    if (y < 0) ret += `${CSI}${-y}A`;
    else if (y > 0) ret += `${CSI}${y}B`;

    return ret;
  },
  up: (count = 1) => `${CSI}${count}A`,
  down: (count = 1) => `${CSI}${count}B`,
  forward: (count = 1) => `${CSI}${count}C`,
  backward: (count = 1) => `${CSI}${count}D`,
  nextLine: (count = 1) => `${CSI}E`.repeat(count),
  prevLine: (count = 1) => `${CSI}F`.repeat(count),
  left: `${CSI}G`,
  hide: `${CSI}?25l`,
  show: `${CSI}?25h`,
  save: `${ESC}7`,
  restore: `${ESC}8`
}

const scroll = {
  up: (count = 1) => `${CSI}S`.repeat(count),
  down: (count = 1) => `${CSI}T`.repeat(count)
}

const erase = {
  screen: `${CSI}2J`,
  up: (count = 1) => `${CSI}1J`.repeat(count),
  down: (count = 1) => `${CSI}J`.repeat(count),
  line: `${CSI}2K`,
  lineEnd: `${CSI}K`,
  lineStart: `${CSI}1K`,
  lines(count) {
    let clear = '';
    for (let i = 0; i < count; i++)
      clear += this.line + (i < count - 1 ? cursor.up() : '');
    if (count)
      clear += cursor.left;
    return clear;
  }
}

module.exports = { cursor, scroll, erase, beep };


/***/ }),

/***/ 3764:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

//filter will reemit the data if cb(err,pass) pass is truthy

// reduce is more tricky
// maybe we want to group the reductions or emit progress updates occasionally
// the most basic reduce just emits one 'data' event after it has recieved 'end'


var through = __nccwpck_require__(461)
var Decoder = (__nccwpck_require__(3193).StringDecoder)

module.exports = split

//TODO pass in a function to map across the lines.

function split (matcher, mapper, options) {
  var decoder = new Decoder()
  var soFar = ''
  var maxLength = options && options.maxLength;
  var trailing = options && options.trailing === false ? false : true
  if('function' === typeof matcher)
    mapper = matcher, matcher = null
  if (!matcher)
    matcher = /\r?\n/

  function emit(stream, piece) {
    if(mapper) {
      try {
        piece = mapper(piece)
      }
      catch (err) {
        return stream.emit('error', err)
      }
      if('undefined' !== typeof piece)
        stream.queue(piece)
    }
    else
      stream.queue(piece)
  }

  function next (stream, buffer) {
    var pieces = ((soFar != null ? soFar : '') + buffer).split(matcher)
    soFar = pieces.pop()

    if (maxLength && soFar.length > maxLength)
      return stream.emit('error', new Error('maximum buffer reached'))

    for (var i = 0; i < pieces.length; i++) {
      var piece = pieces[i]
      emit(stream, piece)
    }
  }

  return through(function (b) {
    next(this, decoder.write(b))
  },
  function () {
    if(decoder.end)
      next(this, decoder.end())
    if(trailing && soFar != null)
      emit(this, soFar)
    this.queue(null)
  })
}


/***/ }),

/***/ 60:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const stripAnsi = __nccwpck_require__(3958);
const isFullwidthCodePoint = __nccwpck_require__(4519);
const emojiRegex = __nccwpck_require__(872);

const stringWidth = string => {
	if (typeof string !== 'string' || string.length === 0) {
		return 0;
	}

	string = stripAnsi(string);

	if (string.length === 0) {
		return 0;
	}

	string = string.replace(emojiRegex(), '  ');

	let width = 0;

	for (let i = 0; i < string.length; i++) {
		const code = string.codePointAt(i);

		// Ignore control characters
		if (code <= 0x1F || (code >= 0x7F && code <= 0x9F)) {
			continue;
		}

		// Ignore combining characters
		if (code >= 0x300 && code <= 0x36F) {
			continue;
		}

		// Surrogates
		if (code > 0xFFFF) {
			i++;
		}

		width += isFullwidthCodePoint(code) ? 2 : 1;
	}

	return width;
};

module.exports = stringWidth;
// TODO: remove this in the next major version
module.exports["default"] = stringWidth;


/***/ }),

/***/ 3958:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const ansiRegex = __nccwpck_require__(21);

module.exports = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;


/***/ }),

/***/ 8941:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RESET = void 0;
const themes_1 = __importDefault(__nccwpck_require__(6769));
const colors = {
    reset: 0,
    red: [38, 5, 160],
    green: 32,
    yellow: [38, 5, 227],
    blue: 34,
    purple: 35,
    cyan: 96,
    pink: [38, 5, 219],
    orange: [38, 5, 215],
    marine: 94,
    white: 97,
    black: 30,
    ...themes_1.default
};
exports.RESET = '\x1b[0m';
exports["default"] = colors;


/***/ }),

/***/ 3773:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.symbolsFunctions = exports.decoratorMap = exports.decoratorFunctions = exports.symbolResets = exports.symbolMap = void 0;
const utils_1 = __nccwpck_require__(7811);
const decoratorMap = {
    bold: '*',
    dim: '~',
    italic: '%',
    underline: '!',
    blink: '^',
    invert: '@',
    hidden: '#',
    strikeout: '$'
};
exports.decoratorMap = decoratorMap;
exports.symbolMap = {
    bold: 1,
    dim: 2,
    italic: 3,
    underline: 4,
    blink: 5,
    invert: 7,
    hidden: 8,
    strikeout: 9
};
exports.symbolResets = {
    bold: 22,
    dim: 22,
    italic: 23,
    underline: 24,
    blink: 25,
    invert: 27,
    hidden: 28,
    strikeout: 29
};
const symbolsFunctions = {
    bold: (color) => (0, utils_1.replaceColor)('bold', color),
    dim: (color) => (0, utils_1.replaceColor)('dim', color),
    italic: (color) => (0, utils_1.replaceColor)('italic', color),
    underline: (color) => (0, utils_1.replaceColor)('underline', color),
    blink: (color) => (0, utils_1.replaceColor)('blink', color),
    invert: (color) => (0, utils_1.replaceColor)('invert', color),
    hidden: (color) => (0, utils_1.replaceColor)('hidden', color),
    strikeout: (color) => (0, utils_1.replaceColor)('strikeout', color),
};
exports.symbolsFunctions = symbolsFunctions;
const decoratorFunctions = {
    bold: (txt, ...args) => symbolsFunctions.bold((0, utils_1.getValue)(txt, ...args)),
    dim: (txt, ...args) => symbolsFunctions.dim((0, utils_1.getValue)(txt, ...args)),
    italic: (txt, ...args) => symbolsFunctions.italic((0, utils_1.getValue)(txt, ...args)),
    underline: (txt, ...args) => symbolsFunctions.underline((0, utils_1.getValue)(txt, ...args)),
    blink: (txt, ...args) => symbolsFunctions.blink((0, utils_1.getValue)(txt, ...args)),
    invert: (txt, ...args) => symbolsFunctions.invert((0, utils_1.getValue)(txt, ...args)),
    hidden: (txt, ...args) => symbolsFunctions.hidden((0, utils_1.getValue)(txt, ...args)),
    strikeout: (txt, ...args) => symbolsFunctions.strikeout((0, utils_1.getValue)(txt, ...args))
};
exports.decoratorFunctions = decoratorFunctions;


/***/ }),

/***/ 5683:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const style_1 = __importDefault(__nccwpck_require__(3057));
module.exports = style_1.default;


/***/ }),

/***/ 3057:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const colors_1 = __importStar(__nccwpck_require__(8941));
const decorators_1 = __nccwpck_require__(3773);
const utils_1 = __nccwpck_require__(7811);
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
function rgbToAnsi(r, g, b, txt) {
    return `\x1b[38;2;${r};${g};${b}m${txt || ''}${txt ? colors_1.RESET : ''}`;
}
function makeColors(codes) {
    return Object.keys(codes).reduce((acc, code) => {
        let value = codes[String(code)];
        if (Array.isArray(value))
            value = value.join(';');
        if (typeof value === 'string' && value.toString().includes('#')) {
            const { r, g, b } = hexToRgb(value);
            value = rgbToAnsi(r, g, b);
            acc[code] = value;
            return acc;
        }
        if (typeof value === 'object') {
            acc[code] = makeColors(value);
            return acc;
        }
        acc[code] = `\x1b[${value}m`;
        return acc;
    }, {});
}
function applySymbols(symbols, value, formattedColor) {
    const keys = Object.keys(symbols);
    return keys.reduce((acc, key) => {
        const symbol = symbols[key];
        const regexString = `\\${symbol}(.*)\\` + symbol;
        const regex = new RegExp(regexString, 'gsm');
        if (acc && acc.match(regex)) {
            const [subject, stripped] = regex.exec(acc);
            const replaced = decorators_1.symbolsFunctions[key](formattedColor + stripped + formattedColor);
            acc = acc.replace(subject, replaced);
        }
        return acc;
    }, value);
}
function makeFunctions(colors, symbols) {
    return Object.keys(colors).reduce((acc, color) => {
        if (typeof colors[color] === 'object') {
            acc[color] = makeFunctions(colors[color], symbols);
            return acc;
        }
        acc[color] = function (text, ...args) {
            const formattedColor = colors[color];
            const value = typeof text === "string" ? text : (0, utils_1.getValue)(text, ...args);
            const formattedValue = applySymbols(symbols, value, formattedColor);
            return `${formattedColor}${formattedValue}${colors_1.RESET}`;
        };
        return acc;
    }, {});
}
function rgb(r, g, b) {
    return function (text, ...args) {
        if (typeof text === "string") {
            return rgbToAnsi(r, g, b, text);
        }
        else {
            const value = (0, utils_1.getValue)(text, ...args);
            return rgbToAnsi(r, g, b, value);
        }
    };
}
function hex(hex) {
    return function (text, ...args) {
        const { r, g, b } = hexToRgb(hex);
        if (typeof text === "string") {
            return rgbToAnsi(r, g, b, text);
        }
        else {
            const value = (0, utils_1.getValue)(text, ...args);
            return rgbToAnsi(r, g, b, value);
        }
    };
}
function ansi(ansi) {
    return function (text, ...args) {
        if (typeof text === "string") {
            return `${ansi}${text}${colors_1.RESET}`;
        }
        else {
            const value = (0, utils_1.getValue)(text, ...args);
            return `${ansi}${value}${colors_1.RESET}`;
        }
    };
}
function style(config) {
    const { colors, theme, decorators } = config || { decorators: decorators_1.decoratorMap, colors: colors_1.default, theme: 'default' };
    const allColors = { ...colors_1.default, ...colors };
    const allSymbols = { ...decorators_1.decoratorMap, ...decorators };
    const colorCodes = makeColors(allColors);
    const themedColors = theme ? { ...colorCodes, ...colorCodes[theme] } : colorCodes;
    if (!themedColors)
        throw new Error(`no such theme ${theme.toString()}`);
    const functions = makeFunctions(themedColors, allSymbols);
    const styled = {
        colors: themedColors,
        symbols: allSymbols,
        ...functions,
        ...decorators_1.decoratorFunctions,
        rgb,
        hex,
        ansi
    };
    return styled;
}
exports["default"] = style;


/***/ }),

/***/ 6769:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const themes = {
    default: {
        red: [38, 5, 160],
        green: 32,
        yellow: [38, 5, 227],
        blue: 34,
        purple: 35,
        cyan: 96,
        pink: [38, 5, 219],
        orange: [38, 5, 215],
        marine: 94,
        white: 97,
        black: 30,
    },
    pastel: {
        red: 31,
        green: [38, 5, 49],
        yellow: [38, 5, 228],
        blue: [38, 5, 39],
        purple: [38, 5, 147],
        cyan: [38, 5, 159],
        pink: [38, 5, 219],
        orange: [38, 5, 209]
    },
    lush: {
        red: [38, 5, 196],
        green: [38, 5, 154],
        yellow: [38, 5, 226],
        blue: [38, 5, 57],
        purple: [38, 5, 128],
        cyan: [38, 5, 87],
        pink: [38, 5, 198],
        orange: [38, 5, 202]
    },
    standard: {
        red: [38, 5, 9],
        green: [38, 5, 10],
        yellow: [38, 5, 11],
        blue: [38, 5, 27],
        purple: [38, 5, 105],
        cyan: [38, 5, 123],
        pink: [38, 5, 200],
        orange: [38, 5, 214]
    },
    beach: {
        red: '#fe4a49',
        green: '#2ab7ca',
        yellow: '#fed766',
        blue: '#92C4EE',
        pink: '#de5285',
        purple: '#8277f9',
        cyan: '#00FFFF',
        orange: '#F77E02'
    },
    nature: {
        red: '#c62828',
        green: '#194d33',
        yellow: '#f2C12e',
        blue: '#04668c',
        pink: '#85327d',
        purple: '#553285',
        cyan: '#0092b2',
        orange: '#f27649'
    },
    neon: {
        red: '#ff5733',
        green: '#74ee15',
        yellow: '#ffe700',
        blue: '#001eff',
        pink: '#f000ff',
        purple: '#ab20fd',
        cyan: '#4deeea',
        orange: '#ff5f1f'
    },
    spring: {
        green: "#005f73",
        cyan: "#0a9396",
        blue: "#94d2bd",
        vanilla: "#e9d8a6",
        gamboge: "#ee9b00",
        alloy: "#ca6702",
        rust: "#bb3e03",
        rufus: "#ae2012",
        auburn: "#9b2226"
    },
    pinkish: {
        chocolate: "#590d22",
        claret: "#800f2f",
        purple: "#a4133c",
        red: "#c9184a",
        crayola: "#ff4d6d",
        pink: "#ff758f",
        salmon: "#ff8fa3",
        cherry: "#ffb3c1",
        pinker: "#ffccd5",
        lavender: "#fff0f3"
    },
    crayons: {
        red: "#f94144",
        orange: "#f3722c",
        carrot: "#f8961e",
        coral: "#f9844a",
        saffron: "#f9c74f",
        pistachio: "#90be6d",
        zomp: "#43aa8b",
        cyan: "#4d908e",
        gray: "#577590",
        cerulean: "#277da1"
    },
    sunset: {
        tangelo: "#ff4800",
        cook: "#ff5400",
        pantone: "#ff6000",
        pumpkin: "#ff6d00",
        safety: "#ff7900",
        uto: "#ff8500",
        princeton: "#ff9100",
        peel: "#ff9e00",
        orange: "#ffaa00",
        yellow: "#ffb600"
    },
    rufus: {
        green: '#005f73',
        cyan: '#0a9396',
        blue: '#94d2bd',
        vanilla: '#e9d8a6',
        gamboge: '#ee9b00',
        orange: '#ca6702',
        rust: '#bb3e03',
        rufous: '#ae2012',
        auburn: '#9b2226',
    },
    summer: {
        green: "#b6c037",
        yellow: "#f2ff49",
        orange: "#f9a146",
        red: "#ff4242",
        pink: "#fb62f6",
        purple: "#b060e7",
        blue: "#645dd7",
        cyan: "#b3fffc",
    },
    autumn: {
        chocolate: '#370617',
        rosewood: '#6a040f',
        penn: '#9d0208',
        engineering: '#d00000',
        sinopia: '#dc2f02',
        persimmon: '#e85d04',
        princeton: '#f48c06',
        pride: '#faa307',
        porridge: '#ffba08',
    },
    mint: {
        nyanza: "#d8f3dc",
        celadon: "#b7e4c7",
        celadoner: "#95d5b2",
        minty: "#74c69d",
        minter: "#52b788",
        sea: "#40916c",
        dartmouth: "#2d6a4f",
        brunswick: "#1b4332",
        green: "#081c15"
    },
    vintage: {
        green: "#797d62",
        moss: "#9b9b7a",
        khaki: "#baa587",
        desert: "#d9ae94",
        peach: "#f1dca7",
        sunglow: "#ffcb69",
        yellow: "#e8ac65",
        orange: "#d08c60",
        chamoisee: "#b58463",
        beaver: "#997b66"
    },
    sport: {
        eerie: '#161a1d',
        blood: '#660708',
        cornell: '#a4161a',
        corneller: '#ba181b',
        imperial: '#e5383b',
        silver: '#b1a7a6',
        timberwolf: '#d3d3d3',
        smoke: '#f5f3f4',
        white: '#ffffff',
    },
    rainbow: {
        amethyst: '#8e6bc7',
        tufts: '#018bda',
        robin: '#00d7eb',
        forest: '#48933e',
        apple: '#76ac2f',
        yellow: '#ffba24',
        bittersweet: '#fd7268',
        cmyk: '#eb1d19',
        crimson: '#df013c',
        folly: '#ff0561',
    },
    pool: {
        violet: '#7400b8',
        grape: '#6930c3',
        slate: '#5e60ce',
        united: '#5390d9',
        picton: '#4ea8de',
        aero: '#48bfe3',
        sky: '#56cfe1',
        tiffany: '#64dfdf',
        turquoise: '#72efdd',
        aquamarine: '#80ffdb',
    },
    champagne: {
        pink: '#eddcd2',
        linen: '#fff1e6',
        misty: '#fde2e4',
        mimi: '#fad2e1',
        cyan: '#c5dedd',
        cream: '#dbe7e4',
        isabelline: '#f0efeb',
        alice: '#d6e2e9',
        columbia: '#bcd4e6',
        powder: '#99c1de',
    }
};
exports["default"] = themes;


/***/ }),

/***/ 7811:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceColor = exports.replaceLast = exports.getValue = void 0;
const decorators_1 = __nccwpck_require__(3773);
function getValue(txt, ...args) {
    const sanitizedArgs = args.filter((a) => a && a !== undefined);
    if (Array.isArray(txt) && sanitizedArgs.length > 0) {
        return txt.map((t, i) => t + (sanitizedArgs[i] || '')).join('');
    }
    else if (Array.isArray(txt)) {
        return txt.join('');
    }
}
exports.getValue = getValue;
function replaceLast(subject, search, replace) {
    const index = subject.lastIndexOf(search);
    if (index === -1) {
        return subject;
    }
    return subject.substring(0, index) + replace + subject.substring(index + search.length);
}
exports.replaceLast = replaceLast;
function replaceColor(key, color) {
    const [code] = [...color.match(/\[[0-9;]+/gsm)];
    const replaced = color.replace('m', `;${decorators_1.symbolMap[key]}m`);
    const value = replaceLast(replaced, code, `${code};${decorators_1.symbolResets[key]}`);
    return value;
}
exports.replaceColor = replaceColor;


/***/ }),

/***/ 102:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


// fetch, because this package has to run in a browser as well as in node — it
// is a global in both (node 18.13+), so there is no bundler shim, no "browser"
// field and no dependency.
//
// surge-stream deliberately does NOT share this file: it streams its uploads,
// and node 24's fetch rejects a streamed request with "expected non-null body
// source" as soon as the server answers early, which is exactly how slushi
// reports 401/403/429 on a publish. it keeps a raw http/https client instead.
// nothing here streams a request body, so none of that applies.
//
//   request(opts, callback) -> callback(error, res, text, stream)
//   res: { statusCode, headers }
//
// opts.body may be a string or anything fetch accepts as a streaming body
// (a web ReadableStream, or any async iterable — tar's minipass qualifies).
// opts.stream:true skips reading the body and hands back res.body, the web
// stream, for the ndjson handshakes to consume.

var pkg = __nccwpck_require__(8891)

// fetch refuses a header value holding anything above U+00FF or a control
// character; node's http quietly dropped the former. publishing must not fail
// because someone put an emoji in their -m message, so strip rather than throw
// — the message is cosmetic, the publish is not. \t is legal in a value.
var headerSafe = function(value){
  return String(value).replace(/[^\t\x20-\x7e\xa0-\xff]/g, "")
}

var clean = function(headers){
  var out = {}
  Object.keys(headers || {}).forEach(function(key){
    var value = headers[key]
    if (value === undefined || value === null) return
    out[key] = headerSafe(value)
  })
  return out
}

// btoa is latin1 and throws above U+00FF, so encode to utf-8 first. that is
// what axios did, and what keeps a non-ascii password working.
var basic = function(auth){
  if (!auth) return null
  var raw   = (auth.username || "") + ":" + (auth.password || "")
  var bytes = new TextEncoder().encode(raw)
  var latin = ""
  for (var i = 0; i < bytes.length; i++) latin += String.fromCharCode(bytes[i])
  return "Basic " + btoa(latin)
}

// axios baseURL semantics: one slash between the two, never zero and never
// two. note this is NOT url.resolve, which drops the last path segment of an
// endpoint that carries a path.
var join = function(endpoint, path){
  if (/^https?:\/\//i.test(path)) return path
  return String(endpoint).replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "")
}

var plain = function(headers){
  var out = {}
  headers.forEach(function(value, key){ out[key.toLowerCase()] = value })
  return out
}

var request = function(opts, callback){
  var headers   = clean(opts.headers)
  var body      = opts.body
  var sending   = body !== undefined && body !== null
  var streaming = sending && typeof body !== "string"

  if (sending && !streaming && !headers["content-type"]){
    headers["content-type"] = "application/json"
  }

  // honoured by node, silently dropped by browsers as a forbidden header
  if (!headers["user-agent"]) headers["user-agent"] = pkg.name + "/" + pkg.version

  // fetch sets content-length itself and forbids setting it by hand
  delete headers["content-length"]

  var authorization = basic(opts.auth)
  if (authorization) headers["authorization"] = authorization

  var init = {
    method:  opts.method || "GET",
    headers: headers
  }

  if (sending){
    init.body = body
    // node requires this whenever the body is not buffered up front
    if (streaming) init.duplex = "half"
  }

  // node does not follow redirects: up to 18.13 its fetch carries the
  // authorization header (a token, or the password at login) on to whatever
  // origin a redirect names. a 3xx reaches sdk.js as itself, as it does from
  // surge-stream. browsers strip the header on a cross-origin redirect
  // themselves, and manual there yields an opaque status-0 response
  if (typeof process !== "undefined" && process.versions && process.versions.node){
    init.redirect = "manual"
  }

  fetch(opts.url, init).then(function(res){
    var adapted = { statusCode: res.status, headers: plain(res.headers) }
    if (opts.stream) return callback(null, adapted, null, res.body)
    return res.text().then(function(text){ return callback(null, adapted, text) })
  }).catch(function(error){
    // fetch reports every transport failure as a bare "fetch failed"; the
    // useful code (ECONNREFUSED, ENOTFOUND, CERT_*) hides in .cause
    if (error && error.cause && error.cause.code) error.code = error.cause.code
    return callback(error)
  })
}

module.exports      = request
module.exports.join = join


/***/ }),

/***/ 9943:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var request = __nccwpck_require__(102)

var sdk = function(config, surgeStream){

  if (surgeStream){
    var stream = surgeStream(config)
  }

  // status handlers are supplied by the caller via config.defaults —
  // the sdk itself never writes to stdout. errors always reach the
  // callback regardless of whether a handler is registered.
  config.defaults = config.defaults || {}

  var handle = function(e, r, b){
    if (r && config.defaults.hasOwnProperty(r.status)){
      return config.defaults[r.status](e, r, b)
    }
  }

  var creds = function(args){
    if(!args) return null

    if (typeof args === 'string'){
      return {
        username: "token",
        password: args
      }
    }
    return {
      username: args.username || args.user,
      password: args.password || args.pass
    }
  }

  // messages is what every consumer reads; errors is kept for compatibility
  var failResponse = {
    errors:   [ "request did not complete" ],
    messages: [ "request did not complete" ],
    details:  {"request": "did not complete" }
  }

  // parsed regardless of content-type and falling back to the raw text, which
  // is what axios did. an empty body is "". several routes reply with
  // pretty-printed json and a trailing newline — JSON.parse takes it.
  var parse = function(text){
    if (!text) return ""
    try { return JSON.parse(text) } catch(e){ return text }
  }

  // a non-2xx body that is not json — an html 404 from an unknown route, or a
  // body-less 5xx — used to reach the caller as a bare string. "" is falsy, so
  // an empty error body read as success and the failure vanished. callers all
  // expect messages/details/status, so describe the status instead.
  var describe = function(status){
    var msg = status >= 300 && status < 400
      ? "endpoint redirected (" + status + ")"
      : "request failed (" + status + ")"
    return {
      messages: [ msg ],
      details:  { request: msg },
      status:   status
    }
  }

  var call = function(args, callback){
    var body = (args.data === undefined || args.data === null)
      ? undefined
      : JSON.stringify(args.data)

    request({
      url:     request.join(config.endpoint, args.url),
      method:  args.method,
      headers: args.headers,
      body:    body,
      auth:    args.auth
    }, function(error, res, text){
      if (error) return callback(failResponse)

      var data = parse(text)

      // handle() keys off .status and must run before the callback: the cli
      // registers 403/404 handlers that process.exit(1), so for those the
      // callback is deliberately never reached
      var response = {
        status:     res.statusCode,
        statusCode: res.statusCode,
        headers:    res.headers,
        data:       data
      }

      handle(null, response, data)

      if (res.statusCode >= 200 && res.statusCode < 300) return callback(null, data, res.headers)

      // 3xx lands here too — redirects are not followed
      if (data && typeof data === "object"){
        data.status = res.statusCode
        return callback(data)
      }

      return callback(describe(res.statusCode))
    })
  }

  var placeholder = function(){
    console.log("`surge-stream` not found")
  }

  return {

    publish: stream ? stream.publish : placeholder,
    encrypt: stream ? stream.encrypt : placeholder,
    ssl: stream ? stream.ssl : placeholder,

    stats: function(callback){
      return call({
        url: "/stats",
        method: "GET"
      }, callback)
    },

    account: function(userCreds, callback){
      return call({
        url: "/account",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    nuke: function(userCreds, callback){
      return call({
        url: "/account",
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },
    
    token: function(userCreds, args, callback){
      if (!callback){
        callback = args
        args = null
      }
      return call({
        url: "/token",
        method: "POST",
        data: args || {},
        auth: creds(userCreds)
      }, function(error, data){
        if (error) return callback(error)
        return callback(null, { user: "token", pass: data.token })
      })
    },

    // full token response (token/id/msg/scope/created_at) —
    // token() above keeps the { user, pass } login shape
    tokenAdd: function(args, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = args
        args = null
      }
      return call({
        url: "/token",
        method: "POST",
        data: args || {},
        auth: creds(userCreds)
      }, callback)
    },

    // browser-handoff login (plans/auth-cli-mfa.md stage 1): open a
    // device session, then poll for the approved token. No auth on
    // either call — this IS login. Poll answers are always 200 with a
    // status of pending, approved (token rides once), or gone.
    loginSession: function(host, callback){
      return call({
        url: "/login/session",
        method: "POST",
        data: { host: host }
      }, callback)
    },

    // opens a browser ceremony to set up or manage two-factor auth —
    // the page runs the whole ceremony, nothing comes back to collect
    mfaSession: function(userCreds, callback){
      return call({
        url: "/mfa/session",
        method: "POST",
        auth: creds(userCreds)
      }, callback)
    },

    loginPoll: function(uuid, poll, callback){
      return call({
        url: "/login/session/" + uuid + "/poll",
        method: "POST",
        data: { poll: poll }
      }, callback)
    },

    tokens: function(userCreds, callback){
      return call({
        url: "/tokens",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    tokenRem: function(id, userCreds, callback){
      if (!id) return callback({
        messages: ["token id must be present"],
        details: { token: "id must be present" }
      })
      return call({
        url: "/tokens/" + id,
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    // one of the account's tokens becomes an org's, its value unchanged,
    // so a pipeline holding it keeps publishing - as the org from then on
    tokenTransfer: function(id, org, userCreds, callback){
      if (!id) return callback({
        messages: ["token id must be present"],
        details: { token: "id must be present" }
      })
      return call({
        url: "/tokens/" + id,
        method: "PUT",
        data: { org: org },
        auth: creds(userCreds)
      }, callback)
    },

    // an org's tokens (slushi plans/org-tokens.md): the org is the actor,
    // so they publish its domains whoever comes and goes. Any member lists,
    // adds and rems them
    orgTokens: function(org, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/tokens",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // args: { msg, scope } - the value comes back here and never again
    orgTokenAdd: function(org, args, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/tokens",
        method: "POST",
        data: args || {},
        auth: creds(userCreds)
      }, callback)
    },

    orgTokenRem: function(org, id, userCreds, callback){
      if (!id) return callback({
        messages: ["token id must be present"],
        details: { token: "id must be present" }
      })
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/tokens/" + encodeURIComponent(id),
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    // orgs (slushi plans/b2b.md): an org is named by its id or slug, or an
    // old slug that still resolves to it
    orgs: function(userCreds, callback){
      return call({
        url: "/orgs",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // the org and its members, with the caller's role
    org: function(org, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org),
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // args: { slug, name } - the caller becomes the org's only admin
    orgCreate: function(args, userCreds, callback){
      return call({
        url: "/orgs",
        method: "POST",
        data: args || {},
        auth: creds(userCreds)
      }, callback)
    },

    // args: { slug, name } - either or both
    orgRename: function(org, args, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org),
        method: "PUT",
        data: args || {},
        auth: creds(userCreds)
      }, callback)
    },

    // refused while the org holds any domain; its slugs are free at once
    orgRemove: function(org, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org),
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    // members and pending invites (pending: true)
    orgMembers: function(org, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/members",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // one by email: a member's account email, the email its invite went
    // to, or a pending invite's
    orgMember: function(org, email, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/members/" + encodeURIComponent(email),
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // a one-time code any signed-in account can join with, for whoever
    // invites to deliver - nothing is emailed: { code, hint, role,
    // expires_at }. role is optional: "member" (the default) or "admin",
    // which only an admin may mint. claim joins with it, scrap cancels it
    orgInvite: function(org, role, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = role
        role = null
      }
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/invites",
        method: "POST",
        data: role ? { role: role } : {},
        auth: creds(userCreds)
      }, callback)
    },

    // role: "admin" | "member", for a member
    orgRole: function(org, email, role, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/members/" + encodeURIComponent(email),
        method: "PUT",
        data: { role: role },
        auth: creds(userCreds)
      }, callback)
    },

    // removes a member
    orgRevoke: function(org, email, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/members/" + encodeURIComponent(email),
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    // joins as the signed-in account, whatever email the invite went to
    orgJoin: function(org, code, userCreds, callback){
      return call({
        url: "/orgs/" + encodeURIComponent(org) + "/join",
        method: "POST",
        data: { code: code },
        auth: creds(userCreds)
      }, callback)
    },

    // who owns a domain: { owner: { account: email } | { org: { slug,
    // name } } | "someone else" }
    owner: function(projectDomain, userCreds, callback){
      return call({
        url: "/" + projectDomain + "/owner",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // moves a domain into an org you're in, or to your own account (to:
    // your email); anyone else gets a code instead (transferCode)
    transfer: function(projectDomain, to, userCreds, callback){
      return call({
        url: "/" + projectDomain + "/owner",
        method: "PUT",
        data: { to: to },
        auth: creds(userCreds)
      }, callback)
    },

    // a code whoever claims it takes the domain with: { code, expires_at }.
    // a new one each time; the last stops working
    transferCode: function(projectDomain, userCreds, callback){
      return call({
        url: "/" + projectDomain + "/owner/code",
        method: "POST",
        auth: creds(userCreds)
      }, callback)
    },

    // any code: a transfer code takes its domain into the signed-in
    // account ({ domain, owner, orgs }), an invite joins its org ({ org:
    // { slug, name }, role, already }). opts.check describes what the code
    // would do and does nothing: { check, kind: "transfer", domain, from,
    // by, expires_at, yours } or { check, kind: "invite", org, role, by,
    // expires_at, member }
    claim: function(code, opts, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = opts
        opts = {}
      }
      var data = { code: code }
      if (opts && opts.check) data.check = true
      return call({
        url: "/claim",
        method: "POST",
        data: data,
        auth: creds(userCreds)
      }, callback)
    },

    // cancels a code: { scrapped: "transfer", domain } or { scrapped:
    // "invite", org: { slug, name } }
    scrap: function(code, userCreds, callback){
      return call({
        url: "/scrap",
        method: "POST",
        data: { code: code },
        auth: creds(userCreds)
      }, callback)
    },

    reset: function(email, callback){
      return call({
        url: "/token/reset/" + email,
        method: "POST"
      }, callback)
    },

    // sends an email-verification link to the authenticated account.
    // replies: { verified: true } when already verified,
    // { sent: true } when the email went out, or { sent: false, msg }
    // when inside the resend window (one send per 5 minutes)
    verification: function(userCreds, callback){
      return call({
        url: "/verification",
        method: "POST",
        auth: creds(userCreds)
      }, callback)
    },

    // mints a 48h browser checkout link for the authed account.
    // plan is optional (defaults server-side); replies { url }
    upgradeLink: function(plan, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = plan
        plan = null
      }
      return call({
        url: "/upgrade/link",
        method: "POST",
        data: plan ? { plan: plan } : {},
        auth: creds(userCreds)
      }, callback)
    },

    // mints a 48h Stripe billing-portal link (card, invoices, cancel).
    // replies { url }
    billingLink: function(userCreds, callback){
      return call({
        url: "/billing/link",
        method: "POST",
        data: {},
        auth: creds(userCreds)
      }, callback)
    },

    // one status word and, when it is the user's move, one action —
    // { status, action, https, reason, records, evidence }
    status: function(projectDomain, userCreds, callback){
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      return call({
        url: "/" + projectDomain + "/status",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    certs: function(projectDomain, userCreds, callback){
      return call({
        url: "/" + projectDomain + "/certs",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    metadata: function(projectDomain, projectRevision, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = projectRevision
        projectRevision = null
      }
      var u = projectRevision 
        ? "/" + projectDomain + "/" + projectRevision + "/metadata.json"
        : "/" + projectDomain + "/metadata.json"
      return call({
        url: u,
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    manifest: function(projectDomain, projectRevision, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = projectRevision
        projectRevision = null
      }
      var u = projectRevision 
        ? "/" + projectDomain + "/" + projectRevision + "/manifest.json"
        : "/" + projectDomain + "/manifest.json"
      return call({
        url: u,
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    // list(creds, cb)                       every domain the account reaches
    // list({ limit, offset, org }, creds, cb) a page of them, or one org's;
    //                                        cb(error, domains, total)
    // list(domain, creds, cb)                a domain's revisions
    list: function(projectDomain, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = projectDomain
        projectDomain = null
      }
      var opts = projectDomain && typeof projectDomain === "object" ? projectDomain : null
      if (opts) projectDomain = null
      var u = projectDomain 
        ? "/" + projectDomain + "/list"
        : "/list"
      if (opts){
        var query = ["limit", "offset", "org"].filter(function(k){
          return opts[k] !== undefined && opts[k] !== null
        }).map(function(k){
          return k + "=" + encodeURIComponent(opts[k])
        })
        if (query.length) u = u + "?" + query.join("&")
      }
      return call({
        url: u,
        method: "GET",
        auth: creds(userCreds)
      }, function(error, data, headers){
        if (error || projectDomain) return callback(error, data)
        var total = parseInt((headers || {})["x-total-count"], 10)
        callback(null, data, isNaN(total) ? (data || []).length : total)
      })
    }, 

    rollback: function(projectDomain, userCreds, callback){
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      return call({
        url: "/" + projectDomain + "/rollback",
        method: "POST",
        auth: creds(userCreds)
      }, callback)
    },

    rollfore: function(projectDomain, userCreds, callback){
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      return call({
        url: "/" + projectDomain + "/rollfore",
        method: "POST",
        auth: creds(userCreds)
      }, callback)
    },

    cutover: function(projectDomain, projectRevision, userCreds, callback){
      if (!callback){
        callback  = userCreds
        userCreds = projectRevision
        projectRevision = null
      }
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      var u = projectRevision
        ? "/" + projectDomain + "/rev/" + projectRevision.toString()
        : "/" + projectDomain + "/rev"
      return call({
        url: u,
        method: "PUT",
        auth: creds(userCreds)
      }, callback)
    },

    bust: function(projectDomain, userCreds, callback){
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      return call({
        url: "/" + projectDomain + "/cache",
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    teardown: function(projectDomain, userCreds, callback){
      if (!projectDomain) return callback({
        messages: ["domain must be preset"],
        details: { domain: "must be present" }
      })
      return call({
        url: "/" + projectDomain,
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    discard: function(projectDomain, projectRevision, userCreds, callback){
      if (!callback){
        callback = userCreds,
        userCreds = projectRevision,
        projectRevision = null
      }
      var u = projectRevision
        ? "/" + projectDomain + "/rev/" + projectRevision.toString()
        : "/" + projectDomain + "/rev"
      return call({
        url: u,
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    plan: function(domain, args, userCreds, callback){
      if (!callback){
        callback  = userCreds
        userCreds = args
        args      = domain
        domain    = null
      }
      var u = domain
        ? "/" + domain + "/plan"
        : "/plan"
      return call({
        url: u,
        method: "PUT",
        auth: creds(userCreds),
        data: args
      }, callback)
    },

    // current subscription state. without a domain this is the account
    // (subscription: null when nothing is paid); with a domain it is the
    // project paywall payload (type/plan/perks/stripe_pk/card)
    subscription: function(domain, userCreds, callback){
      if (!callback){
        callback  = userCreds
        userCreds = domain
        domain    = null
      }
      var u = domain
        ? "/" + domain + "/subscription"
        : "/subscription"
      return call({
        url: u,
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    card: function(args, userCreds, callback){
      return call({
        url: "/card",
        method: "PUT",
        auth: creds(userCreds),
        data: args
      }, callback)
    },

    plans: function(domain, headers, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = headers
        headers = domain
        domain = null
      }
      var u = domain
        ? "/" + domain + "/plans"
        : "/plans"
      return call({
        url: u,
        method: "GET",
        headers: headers,
        auth: creds(userCreds)
      }, callback)
    },

    invite: function(domain, args, userCreds, callback){
      if (!callback){
        callback = userCreds
        userCreds = args
        args = null
      }
      return call({
        url: "/" + domain + "/collaborators",
        method: "POST",
        data: args,
        auth: creds(userCreds)
      }, callback)
    },

    revoke: function(list, userCreds, callback){
      var emails  = list.filter(function(l){ return l.indexOf("@") !== -1 })
      var domains = list.filter(function(l){ return l.indexOf("@") === -1 })

      return call({
        url: "/" + domains[0] + "/collaborators",
        method: "DELETE",
        data: { emails: emails },
        auth: creds(userCreds)
      }, callback)
    },

    dns: function(domain, userCreds, callback){
      return call({
        url: "/" + domain + "/dns",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    zone: function(domain, userCreds, callback){
      return call({
        url: "/" + domain + "/zone",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    dnsAdd: function(domain, args, userCreds, callback){
      return call({
        url: "/" + domain + "/dns",
        method: "POST",
        auth: creds(userCreds),
        data: args
      }, callback)
    },

    zoneAdd: function(domain, args, userCreds, callback){
      return call({
        url: "/" + domain + "/zone",
        method: "POST",
        auth: creds(userCreds),
        data: args
      }, callback)
    },

    dnsRem: function(domain, id, userCreds, callback){
      return call({
        url: "/" + domain + "/dns/" + id,
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    zoneRem: function(domain, id, userCreds, callback){
      return call({
        url: "/" + domain + "/zone/" + id,
        method: "DELETE",
        auth: creds(userCreds)
      }, callback)
    },

    settings: function(domain, args, userCreds, callback){
      return call({
        url: "/" + domain + "/settings",
        method: "PUT",
        auth: creds(userCreds),
        data: args
      }, callback)
    },

    analytics: function(domain, userCreds, callback){
      return call({
        url: "/" + domain + "/analytics",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    usage: function(domain, userCreds, callback){
      return call({
        url: "/" + domain + "/usage",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    },

    audit: function(domain, userCreds, callback){
      return call({
        url: "/" + domain + "/audit",
        method: "GET",
        auth: creds(userCreds)
      }, callback)
    }

  }
}

module.exports = sdk

/***/ }),

/***/ 9532:
/***/ ((__unused_webpack_module, exports) => {

// The upload format, and only the writing half of it: regular files in a
// tar archive (slushi plans/single-file.md). No fs, no node-tar and no
// Buffer, so the same code runs in Node and in a browser. stream.js wraps
// it with the file system; a browser would wrap it with its file APIs.
//
// It writes exactly what node-tar 7 wrote for surge-stream before
// (tar.c({ portable: true, mtime: new Date(0) })): the same USTAR header
// fields, the same prefix split for long paths, the same PAX header when a
// path doesn't fit or isn't ASCII, the same padding and end blocks. The
// tests compare the two byte for byte, and extract both with the server's
// own extractor.
//
//   header(path, size, mode)   bytes before a file's content: a PAX header
//                              when needed, then the file's 512-byte header
//   padding(size)              zeros after the content, to the next block
//   end()                      the two zero blocks that close the archive

var BLOCK = 512

var encoder = new TextEncoder()
var utf8 = function(str){ return encoder.encode(str) }
var byteLength = function(str){ return utf8(str).length }

// the largest number a null-terminated octal field holds, by width
var MAXNUM = { 12: 8589934591, 8: 2097151 }

// node-tar's octal: zero-padded, then a space and a NUL - except a number
// that already fills the field, which gets only the NUL
var octal = function(num, size){
  var str = Math.floor(num).toString(8)
  if (str.length === size - 1) return str + "\0"
  return new Array(size - str.length - 1).join("0") + str + " \0"
}

var writeAscii = function(buf, off, str){
  for (var i = 0; i < str.length; i++) buf[off + i] = str.charCodeAt(i)
}

// a string into a fixed field, whole characters only (as Buffer.write
// does), NUL-padded. true when it couldn't be stored faithfully: too long,
// or not ASCII
var writeString = function(buf, off, size, str){
  if (str === undefined) return false
  var at = 0
  for (var ch of str){
    var bytes = utf8(ch)
    if (at + bytes.length > size) break
    buf.set(bytes, off + at)
    at += bytes.length
  }
  return str.length !== byteLength(str) || str.length > size
}

var writeNumber = function(buf, off, size, num){
  if (num === undefined) return false
  if (num > MAXNUM[size] || num < 0) throw new Error("tar field overflow: " + num)
  writeAscii(buf, off, octal(num, size))
  return false
}

// posix path helpers, as node-tar uses them
var dirname = function(p){
  var i = p.lastIndexOf("/")
  if (i === -1) return "."
  if (i === 0) return "/"
  return p.slice(0, i)
}
var basename = function(p){ return p.slice(p.lastIndexOf("/") + 1) }
var join = function(a, b){ return a === "." ? b : a + "/" + b }

// a path that's too long for the 100-byte name field moves its leading
// directories into the 155-byte prefix field. [name, prefix, needsPax]
var splitPrefix = function(p){
  var size = 100, prefixSize = 155
  if (byteLength(p) < size) return [p, "", false]
  var name = basename(p), prefix = dirname(p)
  var root = p.charAt(0) === "/" ? "/" : "."
  do {
    if (byteLength(name) <= size && byteLength(prefix) <= prefixSize) return [name, prefix, false]
    if (byteLength(name) > size && byteLength(prefix) <= prefixSize) return [name.slice(0, size - 1), prefix, true]
    name = join(basename(prefix), name)
    prefix = dirname(prefix)
  } while (prefix !== root)
  return [p.slice(0, size - 1), "", true]
}

// one 512-byte header block. f: { path, mode, size, type, uname, gname,
// devmaj, devmin, linkpath } (undefined fields stay NUL; node-tar leaves
// owner, group and link fields empty in portable mode, and writes the
// device numbers as 0).
// true when a PAX header has to carry what didn't fit
var encode = function(buf, off, f){
  var split = splitPrefix(f.path)
  var needPax = split[2]
  needPax = writeString(buf, off, 100, split[0]) || needPax
  needPax = writeNumber(buf, off + 100, 8, f.mode) || needPax
  needPax = writeNumber(buf, off + 124, 12, f.size) || needPax
  needPax = writeNumber(buf, off + 136, 12, 0) || needPax
  buf[off + 156] = f.type.charCodeAt(0)
  needPax = writeString(buf, off + 157, 100, f.linkpath) || needPax
  writeAscii(buf, off + 257, "ustar\u000000")
  needPax = writeString(buf, off + 265, 32, f.uname) || needPax
  needPax = writeString(buf, off + 297, 32, f.gname) || needPax
  needPax = writeNumber(buf, off + 329, 8, f.devmaj) || needPax
  needPax = writeNumber(buf, off + 337, 8, f.devmin) || needPax
  needPax = writeString(buf, off + 345, 155, split[1]) || needPax
  var sum = 8 * 0x20
  for (var i = off; i < off + 148; i++) sum += buf[i]
  for (var j = off + 156; j < off + BLOCK; j++) sum += buf[j]
  writeAscii(buf, off + 148, octal(sum, 8))
  return needPax
}

// "<len> key=value\n", where len counts its own digits
var paxField = function(key, value){
  var s = " " + key + "=" + value + "\n"
  var len = byteLength(s)
  var digits = Math.floor(Math.log(len) / Math.log(10)) + 1
  if (len + digits >= Math.pow(10, digits)) digits += 1
  return (digits + len) + s
}

var paxHeader = function(path, size){
  var body = utf8(paxField("path", path) + paxField("mtime", 0) + paxField("size", size))
  var buf = new Uint8Array(BLOCK * Math.ceil(1 + body.length / BLOCK))
  encode(buf, 0, {
    path: ("PaxHeader/" + basename(path)).slice(0, 99),
    mode: 0o644, size: body.length, type: "x",
    linkpath: "", uname: "", gname: "", devmaj: 0, devmin: 0
  })
  buf.set(body, BLOCK)
  return buf
}

// node-tar's portable mode: permission bits only, owner read/write always,
// never group/other write
var portableMode = function(mode){
  return ((mode & 0o7777) | 0o600) & ~0o22
}

exports.header = function(path, size, mode){
  var block = new Uint8Array(BLOCK)
  var needPax = encode(block, 0, {
    path: path, mode: portableMode(mode === undefined ? 0o644 : mode), size: size, type: "0",
    devmaj: 0, devmin: 0
  })
  if (!needPax) return block
  var pax = paxHeader(path, size)
  var out = new Uint8Array(pax.length + BLOCK)
  out.set(pax, 0)
  out.set(block, pax.length)
  return out
}

exports.padding = function(size){
  return new Uint8Array((BLOCK - size % BLOCK) % BLOCK)
}

exports.end = function(){
  return new Uint8Array(BLOCK * 2)
}


/***/ }),

/***/ 660:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// What goes into a project, decided once for every client (slushi
// plans/single-file.md, plans/drop.md). No fs and no Buffer, so a browser
// uses it as is; stream.js supplies the file system around it, a drop
// page would supply the browser's file APIs.
//
//   single(name)          a one-file project: { as } its name at the root,
//                         or { refused } the reason it can't be published
//   ignorer(text)         the ignore filter: surge's defaults, plus a
//                         project's .surgeignore text when it has one
//   references(html)      relative src/href paths in a page, the files it
//                         uses that publishing it alone would leave behind

var Ignore      = __nccwpck_require__(6599)
var surgeIgnore = __nccwpck_require__(3917)

// a project of exactly one file publishes at the root. One row per type;
// a type without a row is refused before anything uploads
var SINGLE = [
  { test: /\.html?$/i, as: "index.html" }
]

exports.single = function(name){
  var rule = SINGLE.filter(function(r){ return r.test.test(name) })[0]
  if (rule) return { as: rule.as }
  return { refused: "A project is a directory - put " + name + " in a folder and publish the folder." }
}

exports.ignorer = function(surgeignoreText){
  var ig = Ignore().add(surgeIgnore)
  if (surgeignoreText) ig.add(surgeignoreText)
  return ig
}

// relative to the page's folder, without query or fragment, decoded,
// deduplicated, at most 200 (callers keep the ones that exist). "/x"
// counts: it names the domain's root, which is where the page goes.
// Anything with a scheme, or protocol-relative ("//host/x"), points
// elsewhere
exports.references = function(html){
  var seen = {}, out = []
  var re = /\b(?:src|href)\s*=\s*["']([^"'#?]+)/gi, m
  while ((m = re.exec(String(html))) && out.length < 200){
    var ref = m[1].trim()
    if (!ref || /^[a-z][a-z0-9+.-]*:/i.test(ref) || ref.indexOf("//") === 0) continue
    try { ref = decodeURIComponent(ref) } catch(e){}
    ref = ref.replace(/^\/+/, "")
    if (!ref || seen[ref]) continue
    seen[ref] = true
    out.push(ref)
  }
  return out
}


/***/ }),

/***/ 6968:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var http  = __nccwpck_require__(8611)
var https = __nccwpck_require__(5692)

var pkg = __nccwpck_require__(6759)

// minimal http(s) client. surge-sdk talks fetch so it can run in a browser;
// this package cannot (it tars a directory off disk) and must NOT, because
// node 24's fetch rejects a streamed upload with "expected non-null body
// source" the moment the server answers early — which is exactly how slushi
// reports 401/403/429 on a publish. see slushi/plans/drop-axios.md 7b.

var once = function(fn){
  var called = false
  return function(){
    if (called) return
    called = true
    return fn.apply(null, arguments)
  }
}

// node throws ERR_HTTP_INVALID_HEADER_VALUE (synchronously) on an undefined
// header value where axios silently drops it. the cli relies on that: it never
// sets config.version, and sends stage/message/add/rem as undefined whenever
// the flag is absent, plus ssl as null on every publish.
// node drops characters above U+00FF from a header value but THROWS on a
// control character, and a publish must not die over a -m message. strip both.
var headerSafe = function(value){
  return String(value).replace(/[^\t\x20-\x7e\xa0-\xff]/g, "")
}

var clean = function(headers){
  var out = {}
  Object.keys(headers || {}).forEach(function(key){
    var value = headers[key]
    if (value === undefined || value === null) return
    out[key] = headerSafe(value)
  })
  return out
}

// the || "" coercion is load bearing. "token" + ":" + undefined would put the
// literal string "undefined" on the wire as the password; axios encodes a
// missing field as empty. with the coercion node's auth option is byte
// identical to axios, utf-8 and all.
var credentials = function(auth){
  if (!auth) return undefined
  return (auth.username || "") + ":" + (auth.password || "")
}

// axios baseURL semantics: one slash between the two, never zero and never
// two. note this is NOT url.resolve, which drops the last path segment of an
// endpoint that carries a path.
var join = function(endpoint, path){
  if (/^https?:\/\//i.test(path)) return path
  return String(endpoint).replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "")
}

var collect = function(res, callback){
  var chunks = []
  res.on("data", function(chunk){ chunks.push(chunk) })
  res.on("end", function(){ callback(null, Buffer.concat(chunks).toString("utf8")) })
  res.on("error", callback)
}

// opts: { url, method, headers, body, auth, stream, timeout }
// body may be a string or a readable stream. with stream:true the response is
// handed over unread, for the ndjson handshakes to pipe. timeout (ms): an
// idle socket that long fails the request, for calls a caller can do
// without (a publish itself has none: a big upload can be slow)
var request = function(opts, callback){
  var done      = once(callback)
  // WHATWG URL, not url.parse (DEP0169). it throws where url.parse never
  // did, so a bad url comes back as an error rather than a crash
  try { var target = new URL(opts.url) } catch (error) { return done(error) }
  var transport = target.protocol === "https:" ? https : http
  var headers   = clean(opts.headers)
  var body      = opts.body
  var streaming = body !== undefined && body !== null && typeof body.pipe === "function"

  if (body !== undefined && body !== null && !streaming){
    if (!headers["content-type"]) headers["content-type"] = "application/json"
    headers["content-length"] = Buffer.byteLength(body)
  }

  if (!headers["user-agent"]) headers["user-agent"] = pkg.name + "/" + pkg.version

  var req = transport.request({
    protocol: target.protocol,
    // URL keeps the brackets on an ipv6 literal, http wants them off
    hostname: target.hostname.replace(/^\[|\]$/g, ""),
    port:     target.port,
    path:     target.pathname + target.search,
    method:   opts.method || "GET",
    headers:  headers,
    auth:     credentials(opts.auth)
  }, function(res){
    if (opts.stream) return done(null, res)
    collect(res, function(error, text){
      if (error) return done(error)
      return done(null, res, text)
    })
  })

  req.on("error", function(error){ return done(error) })
  if (opts.timeout) req.setTimeout(opts.timeout, function(){ req.destroy(new Error("timeout")) })

  if (streaming){
    // without this the tar stream's own failure lands as an unhandled "error"
    // event and takes the process with it. axios attaches the equivalent.
    body.on("error", function(error){
      req.destroy()
      return done(error)
    })
    return body.pipe(req)
  }

  return req.end(body === undefined || body === null ? undefined : body)
}

module.exports      = request
module.exports.join = join


/***/ }),

/***/ 9721:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var path          = __nccwpck_require__(6928)
var fs            = __nccwpck_require__(9896)
var crypto        = __nccwpck_require__(6982)
var EventEmitter  = __nccwpck_require__(4434)
var zlib          = __nccwpck_require__(3106)
var Readable      = (__nccwpck_require__(2203).Readable)
var Transform     = (__nccwpck_require__(2203).Transform)
var pipeline      = (__nccwpck_require__(2203).pipeline)
var split         = __nccwpck_require__(3764)
var pack          = __nccwpck_require__(9532)
var project       = __nccwpck_require__(660)
var request       = __nccwpck_require__(6968)


var stream = function(config){

  var creds = function(args){
    if(!args) return null

    if (typeof args === 'string'){
      return {
        username: "token",
        password: args
      }
    }
    return {
      username: args.username || args.user,
      password: args.password || args.pass
    }
  }

  // an in-memory entry's bytes, exactly the size it states: content a
  // caller computed wrongly can't be framed in a tar, so it fails the
  // publish rather than corrupt the upload
  var contentOf = function(entry){
    var data = typeof entry.content === "function" ? entry.content() : entry.content
    if (typeof data === "string") data = Buffer.from(data)
    if (!data || typeof data.byteLength !== "number") throw new Error("no content for " + entry.name)
    if (data.byteLength !== entry.size) throw new Error(entry.name + " is " + data.byteLength + " bytes, not the " + entry.size + " its entry states")
    return data
  }

  // Helper: Recursively get all files in a directory
  //
  // symlinks are resolved here, client side, and packed as the content they
  // point at (tar follow), so the server only ever receives regular files. a
  // link that resolves to nothing (dangling, or back to an ancestor) is
  // skipped and reported rather than crashing the publish. entries that are
  // not symlinks take exactly the path they always have.
  //
  // ancestors holds the real path of every directory above this one, root
  // first, so a link back up the tree is caught before it recurses
  var getFiles = function(dir, ig, prefix, ancestors, skipped) {
    var results = []
    var entries = fs.readdirSync(dir)
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i]
      var fullPath = path.join(dir, entry)
      var relativePath = prefix ? prefix + "/" + entry : entry
      var stat = fs.lstatSync(fullPath)
      var isLink = stat.isSymbolicLink()
      if (isLink) {
        try {
          stat = fs.statSync(fullPath)
        } catch (e) {
          // dangling, or a chain of links that never ends (ELOOP)
          if (!ig.ignores(relativePath)) skipped.push(relativePath)
          continue
        }
      }
      if (stat.isDirectory()) {
        // Check if directory itself should be ignored
        if (ig.ignores(relativePath + "/")) continue
        var realPath = isLink
          ? fs.realpathSync.native(fullPath)
          : path.join(ancestors[ancestors.length - 1], entry)
        if (ancestors.indexOf(realPath) !== -1) {
          skipped.push(relativePath)
          continue
        }
        results = results.concat(getFiles(fullPath, ig, relativePath, ancestors.concat(realPath), skipped))
      } else if (stat.isFile()) {
        // Check if file should be ignored
        if (!ig.ignores(relativePath)) results.push(relativePath)
      } else if (!ig.ignores(relativePath)) {
        // fifos, sockets and devices have no content, and a fifo hangs tar
        skipped.push(relativePath)
      }
    }
    return results
  }

  // the archive, one file at a time: each file's header, its content read
  // as the upload drains (a project can be hundreds of MB), its padding,
  // then the end blocks. fs.stat follows a symlinked file to its target,
  // as getFiles already follows symlinked directories. Each file is read
  // for exactly the size its header states, as node-tar did: a file that
  // grows mid-publish (an agent rewriting the project) goes as it was at
  // the stat, one that shrinks fails the upload rather than corrupt it
  // entries: [{ name, full }] - the path inside the project, and the file
  // on disk it's read from (a single file is published under another name),
  // or [{ name, content }] - a file already in memory (see publishEntries)
  var tarStream = function(dirName, entries){
    // look-ahead: the next AHEAD files are stat'd (and read, when small)
    // while the current one goes out, so a project of thousands of small
    // files isn't one round trip per file. Bounded: at most AHEAD small
    // files (each <= SMALL bytes) sit in memory at once
    var AHEAD = 8
    var SMALL = 1024 * 1024
    var CHUNK = 1024 * 1024

    var slots   = []      // index -> { err, stat, data, ready, waiting }
    var started = 0       // next index to prefetch
    var current = 0       // next index to emit
    var reading = null    // a large file's read stream, while it goes out
    var busy    = false   // waiting on the current file's slot
    var done    = false

    var out = new Readable({
      highWaterMark: CHUNK,
      read: function(){
        if (reading) return reading.resume()
        if (!busy && !done) next()
      }
    })

    // a small file's content, exactly stat.size bytes: a file that grew
    // since the stat goes as it was, one that shrank can't be framed
    var readSmall = function(full, f, size, cb){
      fs.readFile(full, function(err, data){
        if (err) return cb(err)
        if (data.length < size) return cb(new Error("file shrank during publish: " + f))
        cb(null, data.length > size ? data.subarray(0, size) : data)
      })
    }

    var prefetch = function(){
      while (started < entries.length && started - current < AHEAD){
        (function(i){
          var f = entries[i].name, full = entries[i].full
          var slot = slots[i] = { ready: false, waiting: null }
          var finish = function(err, stat, data){
            slot.err = err; slot.stat = stat; slot.data = data; slot.ready = true
            if (slot.waiting){ var w = slot.waiting; slot.waiting = null; w() }
          }
          if (entries[i].full === undefined){
            var data
            try { data = contentOf(entries[i]) } catch (err){ return finish(err) }
            return finish(null, { size: data.length, mode: entries[i].mode }, data)
          }
          fs.stat(full, function(err, stat){
            if (err) return finish(err)
            if (stat.size === 0 || stat.size > SMALL) return finish(null, stat, null)
            readSmall(full, f, stat.size, function(err, data){ finish(err, stat, data) })
          })
        })(started++)
      }
    }

    var next = function(){
      if (current >= entries.length){
        done = true
        out.push(Buffer.from(pack.end()))
        return out.push(null)
      }
      prefetch()
      var i = current, slot = slots[i]
      if (!slot.ready){
        busy = true
        slot.waiting = function(){ busy = false; emit(i) }
        return
      }
      emit(i)
    }

    var emit = function(i){
      var slot = slots[i], f = entries[i].name
      slots[i] = null
      current = i + 1
      if (slot.err) return out.destroy(slot.err)
      var size = slot.stat.size
      out.push(Buffer.from(pack.header(dirName + "/" + f, size, slot.stat.mode)))
      if (size === 0) return next()
      if (slot.data){
        // a Uint8Array from memory goes out as a Buffer, without a copy
        if (!Buffer.isBuffer(slot.data)) slot.data = Buffer.from(slot.data.buffer, slot.data.byteOffset, slot.data.byteLength)
        out.push(slot.data)
        if (out.push(Buffer.from(pack.padding(size)))) next()
        return
      }
      // a large file streams, read for exactly its stated size
      var sent = 0
      reading = fs.createReadStream(entries[i].full, { start: 0, end: size - 1, highWaterMark: CHUNK })
      reading.on("data", function(chunk){
        sent += chunk.length
        if (!out.push(chunk)) reading.pause()
      })
      reading.on("error", function(err){ out.destroy(err) })
      reading.on("end", function(){
        reading = null
        if (sent !== size) return out.destroy(new Error("file shrank during publish: " + f))
        if (out.push(Buffer.from(pack.padding(size)))) next()
      })
    }

    return out
  }

  // gzip as node-tar's portable mode wrote it: the OS byte of the gzip
  // header (byte 9) is 255, "unknown", not the packing machine's OS
  var portableGzip = function(){
    var first = true
    return new Transform({
      transform: function(chunk, enc, cb){
        if (first && chunk.length > 9){
          first = false
          chunk[9] = 255
        }
        cb(null, chunk)
      }
    })
  }

  // the files a page uses that exist next to it on disk: publishing the
  // page alone leaves them behind
  var localReferences = function(file){
    var html
    try { html = fs.readFileSync(file, "utf8").slice(0, 2 * 1024 * 1024) } catch(e){ return [] }
    var dir = path.dirname(file)
    return project.references(html).filter(function(ref){
      try { return fs.statSync(path.join(dir, ref)).isFile() } catch(e){ return false }
    }).slice(0, 20)
  }

  var singleFile = function(file){
    var name = path.basename(file)
    var rule = project.single(name)
    if (rule.refused) return { refused: rule.refused }
    return {
      entries: [{ name: rule.as, full: file }],
      dirName: name.replace(/\.[^.]*$/, "") || "project",
      skipped: [],
      single: { file: name, as: rule.as, local: localReferences(file) }
    }
  }

  // the upload: entries packed under dirName (which the server strips),
  // gzipped
  var packBody = function(dirName, entries){
    return pipeline(tarStream(dirName, entries), zlib.createGzip(), portableGzip(), function(){})
  }

  // what a project is made of: { entries, dirName, skipped } plus single
  // for a one-file project, or { refused }
  var createProject = function(projectPath){
    if (fs.statSync(projectPath).isFile()) return singleFile(path.resolve(projectPath))

    // surge's ignore rules, plus the project's .surgeignore
    var surgeignorePath = path.join(projectPath, ".surgeignore")
    var ig = project.ignorer(fs.existsSync(surgeignorePath) ? fs.readFileSync(surgeignorePath, "utf8") : null)

    // the directory's name prefixes every entry: "dirname/file.txt", not
    // "./file.txt"
    var absolutePath = path.resolve(projectPath)
    var dirName = path.basename(absolutePath)

    // Get all files (not directories) to pack, respecting ignore rules
    var skipped = []
    var files = getFiles(absolutePath, ig, "", [fs.realpathSync.native(absolutePath)], skipped)

    // only file entries, no directory entries, each under the directory's
    // name ("dirname/file.txt"), which the server strips
    var entries = files.map(function(f){ return { name: f, full: path.join(absolutePath, f) } })

    return { entries: entries, dirName: dirName, skipped: skipped }
  }

  // upload dedupe (slushi plans/upload-dedupe.md): before packing, the
  // server is told every file's sha256 and size (POST /:domain/carry) and
  // answers which of them its current revision of the domain lacks. Only
  // those go in the upload, with the ticket that carries the rest. Any
  // trouble on the way - a file that can't be read, an older server, an
  // error, no answer - just means the upload sends everything, as always
  var CARRY_MIN   = 1024 * 1024        // smaller projects: the extra round trip costs more than it saves
  var CARRY_FILES = 100000             // the server's limit
  var CARRY_BODY  = 9 * 1024 * 1024    // under the server's 10mb

  var hashFile = function(full, cb){
    var hash = crypto.createHash("sha256"), size = 0
    var s = fs.createReadStream(full)
    s.on("data", function(d){ size += d.length; hash.update(d) })
    s.on("error", cb)
    s.on("end", function(){ cb(null, { sha256: hash.digest("hex"), size: size }) })
  }

  // name -> { sha256, size } for every entry, four files at a time. An
  // entry in memory may bring its own sha256 (a store that keys content by
  // hash already has it); otherwise its content is hashed
  var hashAll = function(entries, cb){
    if (entries.length && entries[0].full === undefined){
      var known = {}
      try {
        entries.forEach(function(e){
          if (e.sha256) return known[e.name] = { sha256: e.sha256, size: e.size }
          var data = contentOf(e)
          known[e.name] = { sha256: crypto.createHash("sha256").update(data).digest("hex"), size: data.length }
        })
      } catch (err){ return cb(err) }
      return cb(null, known)
    }
    var out = {}, next = 0, active = 0, finished = 0, failed = false
    var start = function(){
      while (active < 4 && next < entries.length){
        (function(e){
          active++
          hashFile(e.full, function(err, h){
            active--
            if (failed) return
            if (err){ failed = true; return cb(err) }
            out[e.name] = h
            if (++finished === entries.length) return cb(null, out)
            start()
          })
        })(entries[next++])
      }
    }
    if (!entries.length) return cb(null, out)
    start()
  }

  // calls back with { ticket, missing: [names] }, or nothing for a full
  // upload
  var askCarry = function(projectDomain, userCreds, entries, cb){
    hashAll(entries, function(err, files){
      if (err) return cb()
      var body = JSON.stringify({ files: files })
      if (Buffer.byteLength(body) > CARRY_BODY) return cb()
      request({
        url:     request.join(config.endpoint, projectDomain + "/carry"),
        method:  "POST",
        headers: { version: config.version, accept: "application/json" },
        body:    body,
        auth:    creds(userCreds),
        timeout: 30000
      }, function(err, res, text){
        if (err || res.statusCode !== 200) return cb()
        var reply = null
        try { reply = JSON.parse(text) } catch(e){}
        if (!reply || !reply.ticket || !Array.isArray(reply.missing)) return cb()
        cb({ ticket: reply.ticket, missing: reply.missing })
      })
    })
  }

  // Helper: Handle NDJSON response data and emit events
  // stale: set (instead of emitting anything) on the frame a carried
  // publish ends with when the server no longer has a carried file - the
  // publish goes again in full
  var handleResponseData = function(emitter, data, successRef, stale){
    try {
      var obj = JSON.parse(data)
      if (stale && obj.type === "error" && obj.error && obj.error.carry === "stale"){
        stale.value = true
        return
      }
      emitter.emit("data", obj)

      if (obj.type === "info") successRef.value = true

      var t = obj.type
      delete obj.type

      emitter.emit(t, obj)
    } catch(e) {
      // Ignore JSON parse errors (empty lines, etc)
    }
  }

  // Helper: Handle HTTP error status codes
  var handleErrorStatus = function(emitter, statusCode, headers){
    if (statusCode == 401) emitter.emit("unauthorized", headers["reason"] || "Unauthorized")
    if (statusCode == 403) emitter.emit("forbidden", headers["reason"] || "Forbidden")
    if (statusCode == 422) emitter.emit("invalid", headers["reason"] || "Invalid")
    if (statusCode == 429) emitter.emit("ratelimited", headers["reason"] || "Rate limited. Try again later.")
  }

  // one handshake for all three verbs. they differ only in the path they PUT
  // to, what they send as a body, and the content-type; everything after the
  // response is identical, so it lives here once.
  // opts.emitter: the caller's emitter, to keep one across a retry.
  // opts.retry: called in place of fail when a carried publish went stale
  var handshake = function(opts){
    var emitter = opts.emitter || new EventEmitter()
    var success = { value: false }
    var stale   = opts.retry ? { value: false } : null

    var headers = Object.assign({ version: config.version }, opts.headers || {})
    if (opts.argv) headers.argv = JSON.stringify(opts.argv)

    headers["accept"] = "application/x-ndjson"
    if (opts.contentType) headers["content-type"] = opts.contentType

    request({
      url:     request.join(config.endpoint, opts.path),
      method:  "PUT",
      headers: headers,
      body:    opts.body,
      auth:    creds(opts.userCreds),
      stream:  true
    }, function(error, res){
      // node can call back synchronously on a setup failure, and the caller
      // attaches its listeners only after this function returns — so every
      // emission has to wait a tick
      if (error) return process.nextTick(function(){ emitter.emit("fail") })

      // carries the real status and headers, which is what surge ssl reads to
      // report a 401/403 instead of exiting silently
      emitter.emit("response", res)

      if (res.statusCode < 200 || res.statusCode >= 300){
        // status-specific event first: a bare fail is what the cli treats as
        // an unexplained failure, so it must never arrive before the reason
        handleErrorStatus(emitter, res.statusCode, res.headers)
        emitter.emit("fail")
        res.resume()
        return
      }

      res.pipe(split()).on("data", function(data){
        handleResponseData(emitter, data, success, stale)
      })

      res.on("error", function(error){
        emitter.emit("error", error)
      })

      res.on("end", function(){
        if (stale && stale.value && !success.value) return opts.retry()
        success.value === true
          ? emitter.emit("success")
          : emitter.emit("fail")
      })
    })

    return emitter
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  // file-count and project-size from the project itself when the caller
  // doesn't pass them (the size cap reads both before the upload)
  var withSizes = function(headers, entries, bytes){
    var out = Object.assign({}, headers || {})
    if (out["file-count"] === undefined) out["file-count"] = String(entries.length)
    if (out["project-size"] === undefined) out["project-size"] = String(bytes)
    return out
  }

  var totalSize = function(entries){
    return entries.reduce(function(n, e){
      if (e.full === undefined) return n + e.size
      try { return n + fs.statSync(e.full).size } catch(x){ return n }
    }, 0)
  }

  // refused before any request, in the shape a server refusal arrives in
  var refuse = function(message){
    var refused = new EventEmitter()
    process.nextTick(function(){
      refused.emit("error", { error: { message: message } })
      refused.emit("fail")
    })
    return refused
  }

  // projectPath: a directory, or a single file (see project.single)
  var publish = function(projectPath, projectDomain, userCreds, headers, argv){
    var project = createProject(projectPath)
    if (project.refused) return refuse(project.refused)
    return publishProject(project, projectDomain, userCreds, headers, argv)
  }

  // files that are already in memory - a project held in a database, not
  // on disk - published exactly as a directory is: carry, tar, gzip and the
  // same events, with nothing read from or written to the file system.
  // entries: [{ name, size, content, sha256?, mode? }] where name is the
  // path inside the project ("css/app.css"), content its bytes (a Buffer
  // or Uint8Array of exactly size bytes) or a function returning them,
  // called when the file is hashed or packed, and sha256 its hex digest
  // when the caller already has it (carry then reads no content it lacks)
  var publishEntries = function(entries, projectDomain, userCreds, headers, argv){
    var problem = entriesProblem(entries)
    if (problem) return refuse(problem)
    var project = {
      entries: entries.map(function(e){
        return { name: e.name, size: e.size, content: e.content, sha256: e.sha256, mode: e.mode }
      }),
      dirName: "project",
      skipped: []
    }
    return publishProject(project, projectDomain, userCreds, headers, argv)
  }

  // what's wrong with a list of entries before any of it is sent: a tar
  // can't be framed without each file's size, and the server would see
  // two files at one path as one
  var entriesProblem = function(entries){
    if (!Array.isArray(entries)) return "entries must be a list of files"
    var seen = {}
    for (var i = 0; i < entries.length; i++){
      var e = entries[i] || {}
      if (typeof e.name !== "string" || !e.name || e.name.charAt(0) === "/" || e.name.split("/").indexOf("..") !== -1 || e.name.split("/").indexOf("") !== -1)
        return "entry " + i + " needs a relative path as its name"
      if (seen[e.name]) return "two entries are named " + e.name
      seen[e.name] = true
      if (!(e.size >= 0) || Math.floor(e.size) !== e.size) return e.name + " needs its size in bytes"
      if (e.content === undefined || e.content === null) return e.name + " has no content"
    }
    return null
  }

  // one project's publish, from disk or from memory
  var publishProject = function(project, projectDomain, userCreds, headers, argv){
    var bytes   = totalSize(project.entries)
    var emitter = new EventEmitter()

    // headers always describe the whole project, however much of it the
    // upload carries. A carried upload that goes stale is sent again in
    // full, once, on the same emitter
    var send = function(entries, ticket){
      handshake({
        emitter:     emitter,
        path:        projectDomain,
        body:        packBody(project.dirName, entries),
        contentType: "application/gzip",
        userCreds:   userCreds,
        headers:     Object.assign(withSizes(headers, project.entries, bytes), ticket ? { "carry-ticket": ticket } : {}),
        argv:        argv,
        retry:       ticket ? function(){ send(project.entries, null) } : null
      })
    }

    var carrying = !project.single && bytes >= CARRY_MIN && project.entries.length <= CARRY_FILES
    if (!carrying){
      send(project.entries, null)
    } else {
      askCarry(projectDomain, userCreds, project.entries, function(reply){
        if (!reply) return send(project.entries, null)
        var missing = {}
        reply.missing.forEach(function(name){ missing[name] = true })
        var entries = project.entries.filter(function(e){ return missing[e.name] })
        emitter.emit("carry", { carried: project.entries.length - entries.length, sent: entries.length })
        send(entries, reply.ticket)
      })
    }

    // the caller attaches its listeners only after this returns
    if (project.single){
      process.nextTick(function(){ emitter.emit("single", project.single) })
    }
    if (project.skipped.length){
      process.nextTick(function(){ emitter.emit("skipped", project.skipped) })
    }
    return emitter
  }

  var encrypt = function(projectDomain, userCreds, headers, argv){
    return handshake({
      path:      projectDomain + "/encrypt",
      userCreds: userCreds,
      headers:   headers,
      argv:      argv
    })
  }

  var ssl = function(pemPath, projectDomain, userCreds, headers, argv){
    return handshake({
      path:        projectDomain + "/ssl",
      body:        fs.createReadStream(pemPath),
      contentType: "application/x-pem-file",
      userCreds:   userCreds,
      headers:     headers,
      argv:        argv
    })
  }

  return {
    encrypt: encrypt,
    publish: publish,
    publishEntries: publishEntries,
    ssl: ssl
  }
}

module.exports = stream


/***/ }),

/***/ 6599:
/***/ ((module) => {

// A simple implementation of make-array
function makeArray (subject) {
  return Array.isArray(subject)
    ? subject
    : [subject]
}

const UNDEFINED = undefined
const EMPTY = ''
const SPACE = ' '
const ESCAPE = '\\'
const REGEX_TEST_BLANK_LINE = /^\s+$/
const REGEX_INVALID_TRAILING_BACKSLASH = /(?:[^\\]|^)\\$/
const REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION = /^\\!/
const REGEX_REPLACE_LEADING_EXCAPED_HASH = /^\\#/
const REGEX_SPLITALL_CRLF = /\r?\n/g

// Invalid:
// - /foo,
// - ./foo,
// - ../foo,
// - .
// - ..
// Valid:
// - .foo
const REGEX_TEST_INVALID_PATH = /^\.{0,2}\/|^\.{1,2}$/

const REGEX_TEST_TRAILING_SLASH = /\/$/

const SLASH = '/'

// Do not use ternary expression here, since "istanbul ignore next" is buggy
let TMP_KEY_IGNORE = 'node-ignore'
/* istanbul ignore else */
if (typeof Symbol !== 'undefined') {
  TMP_KEY_IGNORE = Symbol.for('node-ignore')
}
const KEY_IGNORE = TMP_KEY_IGNORE

const define = (object, key, value) => {
  Object.defineProperty(object, key, {value})
  return value
}

const REGEX_REGEXP_RANGE = /([0-z])-([0-z])/g

const RETURN_FALSE = () => false

// Sanitize the range of a regular expression
// The cases are complicated, see test cases for details
const sanitizeRange = range => range.replace(
  REGEX_REGEXP_RANGE,
  (match, from, to) => from.charCodeAt(0) <= to.charCodeAt(0)
    ? match
    // Invalid range (out of order) which is ok for gitignore rules but
    //   fatal for JavaScript regular expression, so eliminate it.
    : EMPTY
)

// See fixtures #59
const cleanRangeBackSlash = slashes => {
  const {length} = slashes
  return slashes.slice(0, length - length % 2)
}

// > If the pattern ends with a slash,
// > it is removed for the purpose of the following description,
// > but it would only find a match with a directory.
// > In other words, foo/ will match a directory foo and paths underneath it,
// > but will not match a regular file or a symbolic link foo
// >  (this is consistent with the way how pathspec works in general in Git).
// '`foo/`' will not match regular file '`foo`' or symbolic link '`foo`'
// -> ignore-rules will not deal with it, because it costs extra `fs.stat` call
//      you could use option `mark: true` with `glob`

// '`foo/`' should not continue with the '`..`'
const REPLACERS = [

  [
    // Remove BOM
    // TODO:
    // Other similar zero-width characters?
    /^\uFEFF/,
    () => EMPTY
  ],

  // > Trailing spaces are ignored unless they are quoted with backslash ("\")
  [
    // (a\ ) -> (a )
    // (a  ) -> (a)
    // (a ) -> (a)
    // (a \ ) -> (a  )
    /((?:\\\\)*?)(\\?\s+)$/,
    (_, m1, m2) => m1 + (
      m2.indexOf('\\') === 0
        ? SPACE
        : EMPTY
    )
  ],

  // Replace (\ ) with ' '
  // (\ ) -> ' '
  // (\\ ) -> '\\ '
  // (\\\ ) -> '\\ '
  [
    /(\\+?)\s/g,
    (_, m1) => {
      const {length} = m1
      return m1.slice(0, length - length % 2) + SPACE
    }
  ],

  // Escape metacharacters
  // which is written down by users but means special for regular expressions.

  // > There are 12 characters with special meanings:
  // > - the backslash \,
  // > - the caret ^,
  // > - the dollar sign $,
  // > - the period or dot .,
  // > - the vertical bar or pipe symbol |,
  // > - the question mark ?,
  // > - the asterisk or star *,
  // > - the plus sign +,
  // > - the opening parenthesis (,
  // > - the closing parenthesis ),
  // > - and the opening square bracket [,
  // > - the opening curly brace {,
  // > These special characters are often called "metacharacters".
  [
    /[\\$.|*+(){^]/g,
    match => `\\${match}`
  ],

  [
    // > a question mark (?) matches a single character
    /(?!\\)\?/g,
    () => '[^/]'
  ],

  // leading slash
  [

    // > A leading slash matches the beginning of the pathname.
    // > For example, "/*.c" matches "cat-file.c" but not "mozilla-sha1/sha1.c".
    // A leading slash matches the beginning of the pathname
    /^\//,
    () => '^'
  ],

  // replace special metacharacter slash after the leading slash
  [
    /\//g,
    () => '\\/'
  ],

  [
    // > A leading "**" followed by a slash means match in all directories.
    // > For example, "**/foo" matches file or directory "foo" anywhere,
    // > the same as pattern "foo".
    // > "**/foo/bar" matches file or directory "bar" anywhere that is directly
    // >   under directory "foo".
    // Notice that the '*'s have been replaced as '\\*'
    /^\^*\\\*\\\*\\\//,

    // '**/foo' <-> 'foo'
    () => '^(?:.*\\/)?'
  ],

  // starting
  [
    // there will be no leading '/'
    //   (which has been replaced by section "leading slash")
    // If starts with '**', adding a '^' to the regular expression also works
    /^(?=[^^])/,
    function startingReplacer () {
      // If has a slash `/` at the beginning or middle
      return !/\/(?!$)/.test(this)
        // > Prior to 2.22.1
        // > If the pattern does not contain a slash /,
        // >   Git treats it as a shell glob pattern
        // Actually, if there is only a trailing slash,
        //   git also treats it as a shell glob pattern

        // After 2.22.1 (compatible but clearer)
        // > If there is a separator at the beginning or middle (or both)
        // > of the pattern, then the pattern is relative to the directory
        // > level of the particular .gitignore file itself.
        // > Otherwise the pattern may also match at any level below
        // > the .gitignore level.
        ? '(?:^|\\/)'

        // > Otherwise, Git treats the pattern as a shell glob suitable for
        // >   consumption by fnmatch(3)
        : '^'
    }
  ],

  // two globstars
  [
    // Use lookahead assertions so that we could match more than one `'/**'`
    /\\\/\\\*\\\*(?=\\\/|$)/g,

    // Zero, one or several directories
    // should not use '*', or it will be replaced by the next replacer

    // Check if it is not the last `'/**'`
    (_, index, str) => index + 6 < str.length

      // case: /**/
      // > A slash followed by two consecutive asterisks then a slash matches
      // >   zero or more directories.
      // > For example, "a/**/b" matches "a/b", "a/x/b", "a/x/y/b" and so on.
      // '/**/'
      ? '(?:\\/[^\\/]+)*'

      // case: /**
      // > A trailing `"/**"` matches everything inside.

      // #21: everything inside but it should not include the current folder
      : '\\/.+'
  ],

  // normal intermediate wildcards
  [
    // Never replace escaped '*'
    // ignore rule '\*' will match the path '*'

    // 'abc.*/' -> go
    // 'abc.*'  -> skip this rule,
    //    coz trailing single wildcard will be handed by [trailing wildcard]
    /(^|[^\\]+)(\\\*)+(?=.+)/g,

    // '*.js' matches '.js'
    // '*.js' doesn't match 'abc'
    (_, p1, p2) => {
      // 1.
      // > An asterisk "*" matches anything except a slash.
      // 2.
      // > Other consecutive asterisks are considered regular asterisks
      // > and will match according to the previous rules.
      const unescaped = p2.replace(/\\\*/g, '[^\\/]*')
      return p1 + unescaped
    }
  ],

  [
    // unescape, revert step 3 except for back slash
    // For example, if a user escape a '\\*',
    // after step 3, the result will be '\\\\\\*'
    /\\\\\\(?=[$.|*+(){^])/g,
    () => ESCAPE
  ],

  [
    // '\\\\' -> '\\'
    /\\\\/g,
    () => ESCAPE
  ],

  [
    // > The range notation, e.g. [a-zA-Z],
    // > can be used to match one of the characters in a range.

    // `\` is escaped by step 3
    /(\\)?\[([^\]/]*?)(\\*)($|\])/g,
    (match, leadEscape, range, endEscape, close) => leadEscape === ESCAPE
      // '\\[bar]' -> '\\\\[bar\\]'
      ? `\\[${range}${cleanRangeBackSlash(endEscape)}${close}`
      : close === ']'
        ? endEscape.length % 2 === 0
          // A normal case, and it is a range notation
          // '[bar]'
          // '[bar\\\\]'
          ? `[${sanitizeRange(range)}${endEscape}]`
          // Invalid range notaton
          // '[bar\\]' -> '[bar\\\\]'
          : '[]'
        : '[]'
  ],

  // ending
  [
    // 'js' will not match 'js.'
    // 'ab' will not match 'abc'
    /(?:[^*])$/,

    // WTF!
    // https://git-scm.com/docs/gitignore
    // changes in [2.22.1](https://git-scm.com/docs/gitignore/2.22.1)
    // which re-fixes #24, #38

    // > If there is a separator at the end of the pattern then the pattern
    // > will only match directories, otherwise the pattern can match both
    // > files and directories.

    // 'js*' will not match 'a.js'
    // 'js/' will not match 'a.js'
    // 'js' will match 'a.js' and 'a.js/'
    match => /\/$/.test(match)
      // foo/ will not match 'foo'
      ? `${match}$`
      // foo matches 'foo' and 'foo/'
      : `${match}(?=$|\\/$)`
  ]
]

const REGEX_REPLACE_TRAILING_WILDCARD = /(^|\\\/)?\\\*$/
const MODE_IGNORE = 'regex'
const MODE_CHECK_IGNORE = 'checkRegex'
const UNDERSCORE = '_'

const TRAILING_WILD_CARD_REPLACERS = {
  [MODE_IGNORE] (_, p1) {
    const prefix = p1
      // '\^':
      // '/*' does not match EMPTY
      // '/*' does not match everything

      // '\\\/':
      // 'abc/*' does not match 'abc/'
      ? `${p1}[^/]+`

      // 'a*' matches 'a'
      // 'a*' matches 'aa'
      : '[^/]*'

    return `${prefix}(?=$|\\/$)`
  },

  [MODE_CHECK_IGNORE] (_, p1) {
    // When doing `git check-ignore`
    const prefix = p1
      // '\\\/':
      // 'abc/*' DOES match 'abc/' !
      ? `${p1}[^/]*`

      // 'a*' matches 'a'
      // 'a*' matches 'aa'
      : '[^/]*'

    return `${prefix}(?=$|\\/$)`
  }
}

// @param {pattern}
const makeRegexPrefix = pattern => REPLACERS.reduce(
  (prev, [matcher, replacer]) =>
    prev.replace(matcher, replacer.bind(pattern)),
  pattern
)

const isString = subject => typeof subject === 'string'

// > A blank line matches no files, so it can serve as a separator for readability.
const checkPattern = pattern => pattern
  && isString(pattern)
  && !REGEX_TEST_BLANK_LINE.test(pattern)
  && !REGEX_INVALID_TRAILING_BACKSLASH.test(pattern)

  // > A line starting with # serves as a comment.
  && pattern.indexOf('#') !== 0

const splitPattern = pattern => pattern
.split(REGEX_SPLITALL_CRLF)
.filter(Boolean)

class IgnoreRule {
  constructor (
    pattern,
    mark,
    body,
    ignoreCase,
    negative,
    prefix
  ) {
    this.pattern = pattern
    this.mark = mark
    this.negative = negative

    define(this, 'body', body)
    define(this, 'ignoreCase', ignoreCase)
    define(this, 'regexPrefix', prefix)
  }

  get regex () {
    const key = UNDERSCORE + MODE_IGNORE

    if (this[key]) {
      return this[key]
    }

    return this._make(MODE_IGNORE, key)
  }

  get checkRegex () {
    const key = UNDERSCORE + MODE_CHECK_IGNORE

    if (this[key]) {
      return this[key]
    }

    return this._make(MODE_CHECK_IGNORE, key)
  }

  _make (mode, key) {
    const str = this.regexPrefix.replace(
      REGEX_REPLACE_TRAILING_WILDCARD,

      // It does not need to bind pattern
      TRAILING_WILD_CARD_REPLACERS[mode]
    )

    const regex = this.ignoreCase
      ? new RegExp(str, 'i')
      : new RegExp(str)

    return define(this, key, regex)
  }
}

const createRule = ({
  pattern,
  mark
}, ignoreCase) => {
  let negative = false
  let body = pattern

  // > An optional prefix "!" which negates the pattern;
  if (body.indexOf('!') === 0) {
    negative = true
    body = body.substr(1)
  }

  body = body
  // > Put a backslash ("\") in front of the first "!" for patterns that
  // >   begin with a literal "!", for example, `"\!important!.txt"`.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_EXCLAMATION, '!')
  // > Put a backslash ("\") in front of the first hash for patterns that
  // >   begin with a hash.
  .replace(REGEX_REPLACE_LEADING_EXCAPED_HASH, '#')

  const regexPrefix = makeRegexPrefix(body)

  return new IgnoreRule(
    pattern,
    mark,
    body,
    ignoreCase,
    negative,
    regexPrefix
  )
}

class RuleManager {
  constructor (ignoreCase) {
    this._ignoreCase = ignoreCase
    this._rules = []
  }

  _add (pattern) {
    // #32
    if (pattern && pattern[KEY_IGNORE]) {
      this._rules = this._rules.concat(pattern._rules._rules)
      this._added = true
      return
    }

    if (isString(pattern)) {
      pattern = {
        pattern
      }
    }

    if (checkPattern(pattern.pattern)) {
      const rule = createRule(pattern, this._ignoreCase)
      this._added = true
      this._rules.push(rule)
    }
  }

  // @param {Array<string> | string | Ignore} pattern
  add (pattern) {
    this._added = false

    makeArray(
      isString(pattern)
        ? splitPattern(pattern)
        : pattern
    ).forEach(this._add, this)

    return this._added
  }

  // Test one single path without recursively checking parent directories
  //
  // - checkUnignored `boolean` whether should check if the path is unignored,
  //   setting `checkUnignored` to `false` could reduce additional
  //   path matching.
  // - check `string` either `MODE_IGNORE` or `MODE_CHECK_IGNORE`

  // @returns {TestResult} true if a file is ignored
  test (path, checkUnignored, mode) {
    let ignored = false
    let unignored = false
    let matchedRule

    this._rules.forEach(rule => {
      const {negative} = rule

      //          |           ignored : unignored
      // -------- | ---------------------------------------
      // negative |   0:0   |   0:1   |   1:0   |   1:1
      // -------- | ------- | ------- | ------- | --------
      //     0    |  TEST   |  TEST   |  SKIP   |    X
      //     1    |  TESTIF |  SKIP   |  TEST   |    X

      // - SKIP: always skip
      // - TEST: always test
      // - TESTIF: only test if checkUnignored
      // - X: that never happen
      if (
        unignored === negative && ignored !== unignored
        || negative && !ignored && !unignored && !checkUnignored
      ) {
        return
      }

      const matched = rule[mode].test(path)

      if (!matched) {
        return
      }

      ignored = !negative
      unignored = negative

      matchedRule = negative
        ? UNDEFINED
        : rule
    })

    const ret = {
      ignored,
      unignored
    }

    if (matchedRule) {
      ret.rule = matchedRule
    }

    return ret
  }
}

const throwError = (message, Ctor) => {
  throw new Ctor(message)
}

const checkPath = (path, originalPath, doThrow) => {
  if (!isString(path)) {
    return doThrow(
      `path must be a string, but got \`${originalPath}\``,
      TypeError
    )
  }

  // We don't know if we should ignore EMPTY, so throw
  if (!path) {
    return doThrow(`path must not be empty`, TypeError)
  }

  // Check if it is a relative path
  if (checkPath.isNotRelative(path)) {
    const r = '`path.relative()`d'
    return doThrow(
      `path should be a ${r} string, but got "${originalPath}"`,
      RangeError
    )
  }

  return true
}

const isNotRelative = path => REGEX_TEST_INVALID_PATH.test(path)

checkPath.isNotRelative = isNotRelative

// On windows, the following function will be replaced
/* istanbul ignore next */
checkPath.convert = p => p


class Ignore {
  constructor ({
    ignorecase = true,
    ignoreCase = ignorecase,
    allowRelativePaths = false
  } = {}) {
    define(this, KEY_IGNORE, true)

    this._rules = new RuleManager(ignoreCase)
    this._strictPathCheck = !allowRelativePaths
    this._initCache()
  }

  _initCache () {
    // A cache for the result of `.ignores()`
    this._ignoreCache = Object.create(null)

    // A cache for the result of `.test()`
    this._testCache = Object.create(null)
  }

  add (pattern) {
    if (this._rules.add(pattern)) {
      // Some rules have just added to the ignore,
      //   making the behavior changed,
      //   so we need to re-initialize the result cache
      this._initCache()
    }

    return this
  }

  // legacy
  addPattern (pattern) {
    return this.add(pattern)
  }

  // @returns {TestResult}
  _test (originalPath, cache, checkUnignored, slices) {
    const path = originalPath
      // Supports nullable path
      && checkPath.convert(originalPath)

    checkPath(
      path,
      originalPath,
      this._strictPathCheck
        ? throwError
        : RETURN_FALSE
    )

    return this._t(path, cache, checkUnignored, slices)
  }

  checkIgnore (path) {
    // If the path doest not end with a slash, `.ignores()` is much equivalent
    //   to `git check-ignore`
    if (!REGEX_TEST_TRAILING_SLASH.test(path)) {
      return this.test(path)
    }

    const slices = path.split(SLASH).filter(Boolean)
    slices.pop()

    if (slices.length) {
      const parent = this._t(
        slices.join(SLASH) + SLASH,
        this._testCache,
        true,
        slices
      )

      if (parent.ignored) {
        return parent
      }
    }

    return this._rules.test(path, false, MODE_CHECK_IGNORE)
  }

  _t (
    // The path to be tested
    path,

    // The cache for the result of a certain checking
    cache,

    // Whether should check if the path is unignored
    checkUnignored,

    // The path slices
    slices
  ) {
    if (path in cache) {
      return cache[path]
    }

    if (!slices) {
      // path/to/a.js
      // ['path', 'to', 'a.js']
      slices = path.split(SLASH).filter(Boolean)
    }

    slices.pop()

    // If the path has no parent directory, just test it
    if (!slices.length) {
      return cache[path] = this._rules.test(path, checkUnignored, MODE_IGNORE)
    }

    const parent = this._t(
      slices.join(SLASH) + SLASH,
      cache,
      checkUnignored,
      slices
    )

    // If the path contains a parent directory, check the parent first
    return cache[path] = parent.ignored
      // > It is not possible to re-include a file if a parent directory of
      // >   that file is excluded.
      ? parent
      : this._rules.test(path, checkUnignored, MODE_IGNORE)
  }

  ignores (path) {
    return this._test(path, this._ignoreCache, false).ignored
  }

  createFilter () {
    return path => !this.ignores(path)
  }

  filter (paths) {
    return makeArray(paths).filter(this.createFilter())
  }

  // @returns {TestResult}
  test (path) {
    return this._test(path, this._testCache, true)
  }
}

const factory = options => new Ignore(options)

const isPathValid = path =>
  checkPath(path && checkPath.convert(path), path, RETURN_FALSE)

/* istanbul ignore next */
const setupWindows = () => {
  /* eslint no-control-regex: "off" */
  const makePosix = str => /^\\\\\?\\/.test(str)
  || /["<>|\u0000-\u001F]+/u.test(str)
    ? str
    : str.replace(/\\/g, '/')

  checkPath.convert = makePosix

  // 'C:\\foo'     <- 'C:\\foo' has been converted to 'C:/'
  // 'd:\\foo'
  const REGEX_TEST_WINDOWS_PATH_ABSOLUTE = /^[a-z]:\//i
  checkPath.isNotRelative = path =>
    REGEX_TEST_WINDOWS_PATH_ABSOLUTE.test(path)
    || isNotRelative(path)
}


// Windows
// --------------------------------------------------------------
/* istanbul ignore next */
if (
  // Detect `process` so that it can run in browsers.
  typeof process !== 'undefined'
  && process.platform === 'win32'
) {
  setupWindows()
}

// COMMONJS_EXPORTS ////////////////////////////////////////////////////////////

module.exports = factory

// Although it is an anti-pattern,
//   it is still widely misused by a lot of libraries in github
// Ref: https://github.com/search?q=ignore.default%28%29&type=code
factory.default = factory

module.exports.isPathValid = isPathValid

// For testing purposes
define(module.exports, Symbol.for('setupWindows'), setupWindows)


/***/ }),

/***/ 7723:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)

// return token to be used for payment
module.exports = function(req, next, abort){
  helpers.space()
  helpers.payment(req, req.plans.stripe_pk, req.plans.card || null)(function(token){
    req.paymentToken = token
    next()
  })
}


/***/ }),

/***/ 1372:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var netrc       = __nccwpck_require__(2268)
var localCreds  = __nccwpck_require__(5986)
var helpers     = __nccwpck_require__(5746)

module.exports = function(req, next){
  req.passintoken = req.argv.token || process.env['SURGE_TOKEN'] || process.env['TRAVIS_SURGE_TOKEN'] || null

  if (req.passintoken){
    req.creds = { email: "token", token: req.passintoken }
  } else {
    req.creds = localCreds(req.endpoint).get()  
  }

  next()
}


/***/ }),

/***/ 8568:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var parse = __nccwpck_require__(2543)
var proxy = __nccwpck_require__(6589)

module.exports = function(req, next){
  req.endpoint = parse(req.argv.endpoint || req.configuration.endpoint || "surge." + req.configuration.platform)

  // every chain that talks to the api resolves an endpoint first, so this is
  // the one place the notice cannot be left out of by accident
  proxy(req)

  next()
}


/***/ }),

/***/ 5230:
/***/ ((module) => {

module.exports = function(req, next){

  // if (req.success === true) {
  //   console.log()
  //   console.log("   Success!".green + (" - Published to " + (req.domain).underline).grey)
  //   console.log()
  // } else {
  //   console.log()
  //   console.log("   Error".red + " - Deployment failed. ".grey)
  //   console.log()
  // }

  return next()
}

/***/ }),

/***/ 7995:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)

module.exports = function(req, next){
  helpers.show()
  return next()
}

/***/ }),

/***/ 2731:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)

// return token to be used for payment
module.exports = function(req, next, abort){
  var prettyPlanName = req.selectedPlan.id.split("-")[0]

  if (req.selectedPlan.dummy){
    req.paymentToken = null
    return next()
  } else {
    helpers.payment(req, req.plans.stripe_pk, req.plans.card || null)(function(token){
      req.paymentToken = token
      next()
    })
  }
}


/***/ }),

/***/ 6115:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)
var moniker = __nccwpck_require__(3808)
var fs = __nccwpck_require__(9896)
var path = __nccwpck_require__(6928)
var os = __nccwpck_require__(857)

module.exports = function(req, next, abort){
  var label = helpers.smart("pem file:").grey
  var pemPath
  var getPem = function(placeholder){
    var nobody = helpers.nobodyToAsk(req)
    if (nobody) return helpers.unasked("no PEM file given and " + nobody + ". Pass --pem <file>.")
    req.read({
      prompt: label,
      default: placeholder,
      edit: true,
      terminal: req.configuration.terminal,
      output: req.configuration.output,
      input: req.configuration.input
    }, function(err, pem){
      if (pem === undefined) return abort("no PEM file provided".grey)
      if (pem === "") return getPem()
      var pemPath = path.resolve(pem || "")
      if (!fs.existsSync(pemPath)) return getPem(pem)
      req.pem = pemPath
      return next()
    })
  }

  var pem = req.argv["pem"]
  pemPath = path.resolve(pem || "")

  if (pem && fs.existsSync(pemPath)) {
    req.pem = pemPath
    //console.log(label, pemPath)
    return next()
  } else {
    return getPem()
  }

}


/***/ }),

/***/ 835:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


module.exports = function(req, next){
  req.pkg = __nccwpck_require__(8342)
  next()
}

/***/ }),

/***/ 5661:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var url         = __nccwpck_require__(7016)
var helpers     = __nccwpck_require__(5746)
var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var os          = __nccwpck_require__(857)
var parseUrl    = __nccwpck_require__(2543)
var surgeSDK    = __nccwpck_require__(9943)

module.exports = function(req, next, abort){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var headers = {}
  if (req.argv.promo) headers.promo = req.argv.promo
  
  sdk.plans(req.domain, headers, { user: "token", pass: req.creds.token }, function(error, plans){
    req.plans = plans  
    return next()
  })

}


/***/ }),

/***/ 8636:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(6928)
var fs   = __nccwpck_require__(9896)
var rules = __nccwpck_require__(660)
var helpers = __nccwpck_require__(5746)
var discovery = __nccwpck_require__(894)

// a project is a directory, or a single file the sdk publishes as a
// one-file project, under the rule surge-stream keeps for every client
// (lib/project.js): an html page as index.html, anything else refused.
// Checked here so a refused file stops before the domain prompt and the
// upload, not after
var accept = function(req, next, abort){
  if (!fs.statSync(req.project).isFile()){
    helpers.log(helpers.smart("project:").grey + " " + req.project)
    return next()
  }
  var rule = rules.single(path.basename(req.project))
  if (rule.refused) return abort(rule.refused.grey)
  req.singleFile = req.project
  helpers.log(helpers.smart("project:").grey + " " + req.project + (" (as " + rule.as + ")").grey)
  return next()
}

module.exports = function(req, next, abort){

  if (req.project || req.argv.project || req.argv["_"][0]) {
    req.project = req.project || path.resolve(req.argv.project || req.argv["_"][0] || "")

    fs.exists(req.project, function(exists){
      if (exists) {
        accept(req, next, abort)
      } else {
        helpers.space()
        helpers.trunc("Aborted".yellow + " - No such file or directory: ".grey + req.project.red)
        helpers.space()
        process.exit(1)
      }
    })
  } else {
    var ask = function(suggestion){
      var nobody = helpers.nobodyToAsk(req)
      if (nobody) return helpers.unasked("no project given and " + nobody + ". Try `" + req.configuration.name + " <path> <domain>`.")
      req.read({
        silent: false,
        prompt: helpers.smart("project:").grey,
        default: suggestion,
        edit: true,
        terminal: req.configuration.terminal,
        output: req.configuration.output,
        input: req.configuration.input
      }, function(err, projectPath){
        if (projectPath === undefined) {
          return abort("Publishing not initiated.".grey)
        }
          
        if (!fs.existsSync(path.resolve(projectPath))){
          console.log("                    ", "please enter valid project path...".grey)
          return ask(projectPath)
        } else {
          req.project = path.resolve(projectPath)
          return accept(req, next, abort)
        }
      })
    }

    var x = path.resolve("./")

    // a cwd carrying a CNAME is the target - surge wrote that file into
    // this exact directory on its last publish, so it is evidence of the
    // publish root and `surge publish` republishes it.
    //
    // a package.json domain is deliberately not enough. it names a domain
    // without saying which directory holds the content, and it lives in
    // the source root - the one directory that must not go out. those
    // fall through to the prompt so the path can be corrected to ./dist.
    var local = discovery.local(x)
    if (local && local.source === "cname"){
      req.project = x
      helpers.log(helpers.smart("project:").grey + " " + req.project)
      return next()
    }

    return ask(path.join(x, path.sep))
  }

}


/***/ }),

/***/ 9369:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(7016)

module.exports = function(req, next, abort){
  req.ssl = null
  var u   = url.parse(req.domain)

  if (u.protocol !== null) {
    if (u.protocol == "https:") req.argv.force = "https"
    if (u.protocol == "http:") req.argv.force = "http"
    req.domain = u.hostname
  }

  // --force rides the argv to the api, which applies it after the upload
  // and drops a bad value silently - so the value is checked here, before
  // anything uploads. clearing it (null) is a config job, not a publish one
  if (req.argv.force !== undefined){
    var force = String(req.argv.force).toLowerCase()
    if (force !== "https" && force !== "http") return abort("`--force` takes https or http.".grey)
    req.argv.force = force
  }

  next()
}


/***/ }),

/***/ 6589:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)

// A proxy set in the environment is not used unless node is told to use it.
// Two things go wrong quietly when that happens: on a network that only allows
// egress through the proxy every request fails with nothing pointing at the
// cause, and on a network that allows direct egress everything works while
// quietly going around a proxy the machine was configured to use. Neither is
// something to find out later, so say it once up front.

var configured = function(){
  return process.env.HTTPS_PROXY || process.env.https_proxy
      || process.env.HTTP_PROXY  || process.env.http_proxy
      || process.env.ALL_PROXY   || process.env.all_proxy
      || null
}

var major = function(){
  return parseInt(process.versions.node.split(".")[0], 10)
}

// node reads the proxy environment itself from 22 onward, and only when asked
var honoured = function(){
  return major() >= 22 && !!process.env.NODE_USE_ENV_PROXY
}

// entries are comma or space separated and may carry a leading dot and a port.
// "*" turns proxying off entirely.
var exempt = function(host){
  var list = (process.env.NO_PROXY || process.env.no_proxy || "").trim()
  if (!list) return false
  if (list === "*") return true

  return list.toLowerCase().split(/[,\s]+/).filter(Boolean).some(function(entry){
    var name = entry.replace(/^\./, "").replace(/:\d+$/, "")
    if (!name) return false
    return host === name || host.slice(-(name.length + 1)) === "." + name
  })
}

// returns whether it said anything, which is what the tests assert on
module.exports = function(req){
  // nothing has been asked of the network yet on these
  if (req.argv && (req.argv.help || req.argv.h || req.argv.version || req.argv.v)) return false

  if (!configured() || honoured()) return false

  var host = ((req.endpoint && req.endpoint.hostname) || "").toLowerCase()
  if (host && exempt(host)) return false

  var hint = major() >= 22
    ? "re-run with NODE_USE_ENV_PROXY=1 to route through it"
    : "proxy support needs node 22 or newer"

  helpers.space()
  helpers.trunc("Warning".yellow + " - proxy settings are not being used".grey)
  helpers.trunc(("          " + hint).grey)
  helpers.space()

  return true
}


/***/ }),

/***/ 5099:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var url         = __nccwpck_require__(7016)
var helpers     = __nccwpck_require__(5746)
var surgeSDK    = __nccwpck_require__(9943)

module.exports = function(req, next, abort){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  if (!req.paymentToken){
    helpers.log()
    if (req.card){
      helpers.trunc("Success".green + " - Using existing card.".grey)
    } else {
      helpers.trunc("Aborted".yellow + " - No card set.".grey)
    }
    helpers.space()
  } else {

    var fields = {}

    if (req.paymentToken){
      fields.token = req.paymentToken
    }

    sdk.card(fields, { user: "token", pass: req.creds.token }, function(error, obj){
      if (error){
        helpers.space()
        helpers.trunc("Error ".red + " - " + (obj.message || obj.msg).grey)
        helpers.space()
        process.exit(1)
      }else{
        helpers.space()
        helpers.trunc(("Success".green + " - ".grey + obj.msg.grey))
        helpers.space()
        process.exit()
      }
    })
  }
}


/***/ }),

/***/ 2874:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(6928)
var fs   = __nccwpck_require__(9896)

module.exports = function(req, next){
  req.project = req.argv.project || req.argv.p || req.argv["_"][0] || null
  req.domain  = req.argv.domain  || req.argv.d || req.argv["_"][1] || null
  next()
}

/***/ }),

/***/ 327:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)
var fs          = __nccwpck_require__(9896)
var path        = __nccwpck_require__(6928)
var Ignore      = __nccwpck_require__(298)
var surgeIgnore = __nccwpck_require__(3917)

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' bytes';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KB','MB','GB','TB','PB','EB','ZB','YB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
}

function walkDir(dir, ig, prefix, stats) {
  var entries = fs.readdirSync(dir)
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i]
    var fullPath = path.join(dir, entry)
    var relativePath = prefix ? prefix + "/" + entry : entry
    var stat = fs.lstatSync(fullPath)

    if (stat.isDirectory()) {
      if (!ig.ignores(relativePath + "/")) {
        walkDir(fullPath, ig, relativePath, stats)
      }
    } else {
      if (!ig.ignores(relativePath)) {
        stats.fileCount++
        stats.totalSize += stat.size
      }
    }
  }
}

module.exports = function(req, next){
  req.projectSize = 0
  req.fileCount = 0

  // a single file is the whole project
  if (req.singleFile){
    req.projectSize = fs.statSync(req.singleFile).size
    req.fileCount = 1
    helpers.log(helpers.smart('size:').grey + " 1 file, " + humanFileSize(req.projectSize))
    return next()
  }

  // Create ignore filter with default surge rules
  var ig = Ignore().add(surgeIgnore)

  // Load .surgeignore if it exists
  var surgeignorePath = path.join(req.project, ".surgeignore")
  if (fs.existsSync(surgeignorePath)) {
    ig.add(fs.readFileSync(surgeignorePath, "utf8"))
  }

  // Walk directory and collect stats
  var stats = { fileCount: 0, totalSize: 0 }
  walkDir(req.project, ig, "", stats)

  req.projectSize = stats.totalSize
  req.fileCount = stats.fileCount

  helpers.log(helpers.smart('size:').grey + " " + req.fileCount + " files, " + humanFileSize(req.projectSize))
  next()
}


/***/ }),

/***/ 6733:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var surgeSDK    = __nccwpck_require__(9943)
var helpers     = __nccwpck_require__(5746)

module.exports = function(req, next, abort){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format ? req.endpoint.format() : req.endpoint,
    defaults: helpers.defaults
  })

  var fields = {
    plan: req.selectedPlan.id
  }

  if (req.paymentToken){
    fields.token = req.paymentToken
  }

  if (req.domain) {
    fields.domain = req.domain
  }

  sdk.plan(fields, { user: 'token', pass: req.creds.token }, function(error, result){
    if (error) {
      helpers.space()
      helpers.trunc(("Error: " + (error.status || "unknown")).red)
      helpers.space()
    } else {
      helpers.space()
      helpers.trunc("Success".green + (" - " + result.msg).grey)
      helpers.space()
    }
  })

}


/***/ }),

/***/ 5197:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var pkg = __nccwpck_require__(8342)
var helpers = __nccwpck_require__(5746)

module.exports = function(req, next){
  if (req.argv.version || req.argv.V) {
    helpers.space()
    helpers.trunc(("v" + pkg.version).grey)
    helpers.space()
  } else {
    next()
  }
}


/***/ }),

/***/ 7210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var surgeSDK    = __nccwpck_require__(9943)
var helpers     = __nccwpck_require__(5746)

/**
 * surge plan --web     browser checkout link (Stripe Checkout)
 * surge plan --manage  browser billing link (Stripe Billing Portal)
 *
 * Prints a 48h link and exits; without either flag this is a pass-through.
 */

module.exports = function(req, next){
  if (!req.argv.web && !req.argv.manage) return next()

  var sdk = surgeSDK({
    endpoint: req.endpoint.format()
  })

  var method = req.argv.manage ? "billingLink" : "upgradeLink"

  sdk[method]({ user: "token", pass: req.creds.token }, function(error, reply){
    helpers.space()
    if (error || !reply || !reply.url){
      var msg = (error && error.messages && error.messages[0]) || "could not create link"
      helpers.trunc("Error".red + (" - " + msg).grey)
      helpers.space()
      process.exit(1)
    }
    if (req.argv.manage){
      helpers.trunc("Manage your plan, card, and invoices in your browser:".grey)
    } else {
      helpers.trunc("Upgrade in your browser (link valid 48 hours):".grey)
    }
    helpers.space()
    helpers.trunc(("   " + reply.url).underline)
    helpers.space()
    process.exit()
  })
}


/***/ }),

/***/ 597:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)

module.exports = function(req, next){

  if (req.creds == null) {
    helpers.space()
    helpers.trunc(("Welcome to " + (req.configuration.name || "Surge").underline + "!").blue + (" (" + req.configuration.platform +")").grey)
  }

  return next()
}

/***/ }),

/***/ 1368:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)

module.exports = function(req, next){
  //req.endpoint = req.argv.endpoint || req.configuration.endpoint || 'surge.' + req.configuration.platform)

  var commands = ['h','b', 'd','e','a','r','v','V','p', 's', 'm', 'message', 'stage', 'endpoint','project','domain','add','remove','version','verbose','token','help','pem', 'promo', 'build', 'preview', 'web', 'manage', 'browser', 'private', 'public', 'force', 'name', 'admin', 'all', 'yes', '$0','_'];

  var args = [];
  for (param in req.argv) {
    args.push(param)
  }

  var filteredSet = args.filter(function(n){ return (commands.indexOf(n) === -1) });

  if (filteredSet.length != 0) {
    helpers.log()
    helpers.trunc("Aborted".yellow + ` - \`${ filteredSet[0] }\` is not a surge argument.`.grey).hr()
    process.exit(1)
  } else {
    return next()
  }
}


/***/ }),

/***/ 4988:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var localCreds  = __nccwpck_require__(5986)
var helpers     = __nccwpck_require__(5746)
var os          = __nccwpck_require__(857)
var url         = __nccwpck_require__(7016)
var parseUrl    = __nccwpck_require__(2543)

module.exports = function(req, next, abort){

  var authenticateAndSave = function(callback){
    // before the login banner, so a pipeline sees only the reason
    // with CI set, `surge login` would abort here too - so the way out
    // is unsetting it, not logging in
    var nobody = helpers.nobodyToAsk(req)
    if (nobody) return helpers.unasked("not logged in and " + nobody + ". " + (nobody.indexOf("CI") === 0
      ? "Set SURGE_TOKEN, or unset CI to log in here."
      : "Run `" + req.configuration.name + " login` in a terminal, or set SURGE_TOKEN."))
    if (req.creds){
      helpers.space()  
    }
    helpers.trunc("Login or create surge account by entering email & password.".grey)
    helpers.space()
    helpers.loginForm(req, function(creds){
      localCreds(req.endpoint).set(creds.email, creds.token)
      req.creds = creds
      return accountOrAuthenticate(callback)
    })
  }

  var accountOrAuthenticate = function(callback){
    helpers.fetchAccount(req.endpoint)(req.creds.email, req.creds.token, function(error, account){
      if (account){
        req.account = account
        return callback()
      } else {
        if (req.passintoken){
          helpers.space()
          helpers.trunc("Invalid token")
          helpers.space()
          process.exit(1)
        } else {
          return authenticateAndSave(callback)  
        }
      }
    })
  }

  if (req.creds){
    return accountOrAuthenticate(next)  
  } else {
    return authenticateAndSave(next)
  }

}


/***/ }),

/***/ 5075:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var os          = __nccwpck_require__(857)
var spawn       = (__nccwpck_require__(5317).spawn)
var surgeSDK    = __nccwpck_require__(9943)
var localCreds  = __nccwpck_require__(5986)
var helpers     = __nccwpck_require__(5746)

// browser-handoff login (plans/auth-cli-mfa.md stage 1) — opt-in via
// --browser while it proves out beside the password prompt. Prints the
// hub url + code, tries to open the browser (fails soft over ssh), and
// polls with a secret that never leaves this process until the human
// approves on the sign-in page.
module.exports = function(req, next, abort){
  if (!req.argv.browser) return next()

  var sdk = surgeSDK({ endpoint: req.endpoint.format() })

  sdk.loginSession(os.hostname(), function(error, session){
    if (error || !session || !session.uuid){
      helpers.space()
      helpers.trunc("Error".red + " - Could not start a browser sign-in. Try again, or run surge login without --browser.".grey)
      helpers.space()
      process.exit(1)
    }

    helpers.trunc("Continue in the browser to sign in.".grey)
    helpers.space()
    helpers.trunc("        url: ".grey + session.url.underline)
    helpers.trunc("       code: ".grey + session.code)
    helpers.space()

    // best effort — over ssh there is nothing to open, the url does
    // the work on any browser anywhere
    var opener = process.platform === "darwin" ? "open"
      : process.platform === "win32" ? "explorer" : "xdg-open"
    try {
      spawn(opener, [session.url], { stdio: "ignore", detached: true }).on("error", new Function).unref()
    } catch(e){}

    var deadline = Date.now() + (session.expires_in || 600) * 1000
    var interval = (session.interval || 2) * 1000

    var poll = function(){
      if (Date.now() > deadline){
        helpers.trunc("Aborted".yellow + " - Sign-in timed out. Run surge login again.".grey)
        helpers.space()
        process.exit(1)
      }
      sdk.loginPoll(session.uuid, session.poll, function(error, result){
        // transient weather — keep polling until the deadline says stop
        if (error || !result) return setTimeout(poll, interval)
        if (result.status === "approved"){
          localCreds(req.endpoint).set(result.email, result.token)
          req.creds = { email: result.email, token: result.token }
          return next()
        }
        if (result.status === "gone"){
          helpers.space()
          helpers.trunc("Aborted".yellow + " - Sign-in expired or was cancelled. Run surge login again.".grey)
          helpers.space()
          process.exit(1)
        }
        return setTimeout(poll, interval)
      })
    }
    setTimeout(poll, interval)
  })
}


/***/ }),

/***/ 894:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


var moniker = __nccwpck_require__(3808)
var fs      = __nccwpck_require__(9896)
var path    = __nccwpck_require__(6928)
var os      = __nccwpck_require__(857)
var helpers = __nccwpck_require__(5746)

// reads a domain out of a directory. CNAME wins, then a `surge.domain`
// field in package.json. returns { domain, source } or null.
var fromDir = function(dir){
  try {
    var cname = fs.readFileSync(path.join(dir, "CNAME")).toString().split(os.EOL)[0].trim()
    if (helpers.validDomain(cname)) return { domain: cname, source: "cname" }
  } catch(e) {}
  try {
    var pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json")).toString())
    if (pkg.surge && helpers.validDomain(pkg.surge.domain)) return { domain: pkg.surge.domain, source: "pkg" }
  } catch(e) {}
  return null
}

// a `./` (or `../`, `/`, `~`, bare `.`) prefix always means path, even
// when a directory shares its name with a valid domain.
var forcedPath = function(arg){
  return arg === "." || arg === ".." ||
         arg.indexOf("./") === 0 || arg.indexOf("../") === 0 ||
         arg.indexOf("/") === 0 || arg.indexOf("~") === 0
}

// reads the local domain for a directory (cwd by default) without a req.
// dispatchers use this to decide between a default read and a usage screen.
exports.local = function(dir){
  return fromDir(path.resolve(dir || process.cwd()))
}

// resolves the [<domain>] slot every command shares. the slot is really
// [<domain>|<path>] defaulting to "." — a domain is used directly, a path
// resolves via its CNAME then package.json. in a domain slot a valid
// domain beats a same-named directory; `./` forces the path reading.
// a consumed positional is shifted off argv._ so trailing args (rev,
// emails) always start at argv._[0] downstream.
//
// opts.positional  read argv._[0] as the slot (default true; publish
//                  passes false — its first positional is the project)
// opts.extras      the command takes trailing positionals - a first arg
//                  that is neither domain nor path belongs to the
//                  command, so skip it and infer instead
// opts.prompt      prompt when unresolved instead of aborting
// opts.generate    seed the prompt with a generated domain suggestion
// opts.log         print the resolved domain: line (publish recap style)
//
// sets req.domain and req.domainSource: arg|cname|pkg|prompt|generated
exports.resolve = function(opts){
  opts = opts || {}

  return function(req, next, abort){
    var label = helpers.smart("domain:").grey

    var finish = function(domain, source, echoed){
      // acme:<domain> - the org rides to the api as a header (deploy.js)
      var named = helpers.splitOrg(domain)
      if (named){
        req.org = named.org
        domain = named.domain
      }
      req.domain = domain
      req.domainSource = source
      // the prompt already leaves its own domain: line on screen
      if (opts.log && !echoed) helpers.log(label, domain)
      return next()
    }

    // a prompt suggestion stays a clean moniker - the user can edit it.
    // an unattended `_` must succeed first try, so it carries entropy;
    // twelve years of publishes means the bare pairs are mostly taken.
    var generate = function(entropy){
      var name = moniker.choose()
      if (entropy) name += "-" + Math.random().toString(36).slice(2, 6)
      return [name, req.configuration.platform].join(".")
    }

    // the prompt default is the project directory's name - that is what
    // the user calls this project. build-output dirs climb to the parent
    // (publishing foo/dist means the project is foo), and a name that
    // slugifies to nothing falls back to a moniker.
    var suggest = function(){
      var base = path.resolve(req.project || process.cwd())
      var name = path.basename(base)
      // a single file names itself - page.html suggests page; an
      // index.html says nothing, so its folder does
      if (req.singleFile){
        name = path.basename(req.singleFile).replace(/\.html?$/i, "")
        if (name.toLowerCase() === "index") name = path.basename(path.dirname(req.singleFile))
      }
      var generic = ["dist", "build", "public", "www", "site", "_site", "out", "output", "dest", "static"]
      if (generic.indexOf(name.toLowerCase()) !== -1){
        name = path.basename(path.dirname(base))
      }
      name = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "")
      if (!name) return generate()
      return [name, req.configuration.platform].join(".")
    }

    var prompt = function(suggestion){
      var nobody = helpers.nobodyToAsk(req)
      if (nobody) return helpers.unasked("no domain given and " + nobody + ". Try `" + req.configuration.name + " <path> <domain>`.")
      var suggested = suggestion
      var ask = function(draft){
        helpers.read({
          silent: false,
          prompt: label,
          default: draft || "",
          edit: true,
          terminal: req.configuration.terminal,
          output: req.configuration.output,
          input: req.configuration.input
        }, function(err, domain){
          if (domain === undefined) return abort("Not initiated.".grey)
          if (err || !(helpers.splitOrg(domain) || helpers.validDomain(domain))) return ask(domain)
          return finish(domain, opts.generate && domain === suggested ? "generated" : "prompt", true)
        })
      }
      return ask(suggestion)
    }

    // the slot may be pre-set by publish shorthand, a -d/--domain flag,
    // or sit in the first positional
    var arg = req.domain || null
    var positional = false
    if (!arg && typeof req.argv.domain === "string"){
      arg = req.argv.domain
    }
    if (!arg && opts.positional !== false && req.argv._[0] != null){
      arg = String(req.argv._[0])
      positional = true
    }

    var consume = function(){
      if (positional) req.argv._.shift()
    }

    if (arg){
      if (arg === "_"){
        consume()
        return finish(generate(true), "generated")
      }

      var isPath = forcedPath(arg)
      // an email is never a domain, however url parsing mangles it
      if (!isPath && arg.indexOf("@") === -1 && (helpers.splitOrg(arg) || helpers.validDomain(arg))){
        consume()
        return finish(arg, "arg")
      }

      var dir = path.resolve(arg)
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()){
        var found = fromDir(dir)
        if (found){
          consume()
          return finish(found.domain, found.source)
        }
        return abort(("No CNAME found in " + arg + " - pass a domain or publish first.").grey)
      }
      if (isPath) return abort(("No such directory: " + arg).grey)

      if (!opts.extras){
        if (opts.prompt) return prompt(arg)
        return abort(("`" + arg + "` is not a domain.").grey)
      }
      // extras mode - the arg belongs to the command, infer instead
    }

    // a single file is its own project: the cwd's CNAME belongs to some
    // other project, and inferring it would replace that whole domain
    // with one page
    if (req.singleFile){
      if (opts.prompt) return prompt(opts.generate ? suggest() : "")
      return abort("No domain found - pass a domain.".grey)
    }

    // no arg — infer from the project directory, falling back to cwd
    // (a regenerated ./dist loses its CNAME; the cwd package.json survives)
    var base = path.resolve(req.project || process.cwd())
    var found = fromDir(base)
    if (!found && base !== process.cwd()) found = fromDir(process.cwd())
    if (found) return finish(found.domain, found.source)

    if (opts.prompt) return prompt(opts.generate ? suggest() : "")
    return abort("No domain found - pass a domain or publish first.".grey)
  }
}

exports.setDomainFromArgs = function(req, next){
  if (!req.domain && req.argv._[0]) {
    req.domain = req.argv._[0]
  }
  return next()
}


/***/ }),

/***/ 5021:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null
  
  helpers.space()
  if (!domain){
    helpers.trunc("domain required".grey)
    return next()
  }
  sdk.analytics(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error || !response) return next(error || "no response from server")
    helpers.displayAudience(response)
    return next()
  })
  
}

/***/ }),

/***/ 5024:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null
  
  sdk.audit(domain, { user: "token", pass: req.creds.token }, function(error, response){
    helpers.space()
    if (!response){
      if (!domain){
        helpers.trunc("domain required".grey)
      } 
      return next()
    } else {
      helpers.displayAudit(response)
      return next()
    }
  })
  
}

/***/ }),

/***/ 2429:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  sdk.bust(domain, { user: "token", pass: req.creds.token }, function(error, response){
    // response.confirmed = ["sfo-11", "jfk-08", "ams-14"]
    // response.unconfirmed = ["yyz-16"]
    // the sdk hands back the body only (never the status code) and routes
    // every failure to error — any reply here means the bust went out
    if (error){
      return next(error)
    }else{
      helpers.space()
      helpers.trunc("⦿ Busting cache".green + " " + domain.underline.grey)
      helpers.displayServers(response.instances)
      return next()
    }
  })

}


/***/ }),

/***/ 8716:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain = req.domain

  sdk.certs(domain, { user: "token", pass: req.creds.token }, function(error, payload){
    if (error) return next(error)
    helpers.displayCertInfo(payload, { short: false, showEmpty: true })
    return next()
  })
  
}

/***/ }),

/***/ 9287:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers  = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

// surge claim <code> - any code (plans/transfer.md, plans/b2b.md): a
// transfer code takes its domain into the signed-in account, an invite
// joins its org. The code says which, so nothing else is typed; moving a
// claimed domain into an org is the next command.
//
// With someone at the terminal it first shows what the code does and asks
// (2026-10-28): a transfer makes you a domain's owner, history and all.
// --yes, CI, agents and pipes claim straight away

module.exports = function(req, next){

  var bin  = req.configuration.name
  var sdk  = surgeSDK({ endpoint: req.endpoint.format() })
  var auth = { user: "token", pass: req.creds.token }
  var code = req.argv["_"][0] != null ? String(req.argv["_"][0]).trim() : null

  var abort = function(msg){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - " + msg).grey)
    helpers.space()
    process.exit(1)
  }

  if (!code) return abort("claim takes a code - `" + bin + " claim <code>`.")

  var article = function(role){ return role === "admin" ? "an admin" : "a member" }

  var claim = function(){ sdk.claim(code, auth, done) }

  // read trims its prompt, so the indent sits inside the colour code
  var ask = function(question){
    helpers.read({
      prompt: ("   " + question + " (y/N)").grey,
      terminal: req.configuration.terminal,
      output: req.configuration.output,
      input: req.configuration.input
    }, function(err, answer){
      if (/^y(es)?$/i.test(String(answer || "").trim())) return claim()
      abort("nothing claimed. The code still works.")
    })
  }

  // what accepting does, in a sentence, then who it's from and when it
  // runs out, then the question
  var check = function(){
    sdk.claim(code, { check: true }, auth, function(error, c){
      if (error) return abort((error.messages && error.messages[0]) || error.message || "could not check that code")
      var expires = c.expires_at ? "expires " + String(c.expires_at).split("T")[0] : null
      var details = function(from){
        var line = [from ? "From " + from : null, expires].filter(Boolean).join(" · ")
        if (line) helpers.trunc(line.grey)
      }
      helpers.space()
      if (c.kind === "invite"){
        if (c.member) return abort("you're already in " + c.org.slug + ". The code still works for someone else.")
        var name = c.org.name && c.org.name !== c.org.slug ? " (" + c.org.name + ")" : ""
        helpers.trunc("Adds you as " + article(c.role) + " to the '" + c.org.slug + "' org" + name + ".")
        details(c.by)
        return ask("Would you like to join?")
      }
      if (c.yours) return abort(c.domain + " is already yours.")
      helpers.trunc("Makes you the owner of " + c.domain.underline + ".")
      details(c.from && c.from.org ? "the '" + c.from.org.slug + "' org" : c.by)
      return ask("Would you like to claim it?")
    })
  }

  var done = function(error, rsp){
    if (error) return abort((error.messages && error.messages[0]) || error.message || "could not claim with that code")
    helpers.space()
    if (rsp.org){
      helpers.trunc("Success".green + (rsp.already
        ? " - you're already in " + rsp.org.slug + ". The code is used up, and nothing changed."
        : " - joined " + rsp.org.slug + " as " + article(rsp.role) + ".").grey)
      return next()
    }
    helpers.trunc("Success".green + (" - " + rsp.domain.underline + " is now yours.").grey)
    var orgs = rsp.orgs || []
    if (orgs.length){
      helpers.trunc(("To put it in an org: " + bin + " " + rsp.domain + " transfer " + (orgs.length === 1 ? orgs[0] : "<org>")).grey)
    }
    return next()
  }

  if (req.argv.yes || helpers.nobodyToAsk(req)) return claim()
  check()

}


/***/ }),

/***/ 9869:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain = req.domain

  if (!domain) {
    helpers.space()
    helpers.trunc("Error".red + (" - domain required".grey))
    return next()
  }
  
  sdk.settings(domain, req.argv, { user: "token", pass: req.creds.token }, function(error, rsp){
    if (error) {
      helpers.space()
      if (error.hasOwnProperty("message")){
        helpers.trunc("Error".red + (" - " + error.message).grey)
      }else{
        error.messages.forEach(function(m){
          helpers.trunc("Error".red + (" - " + m).grey)
        })
      }
      helpers.space()  
      process.exit(1)
    } else {
      helpers.displayConfig(rsp)
      return next()
    }
  })

}

/***/ }),

/***/ 2577:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  sdk.cutover(domain, rev, { user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      return next(error)
    }else{
      // the sdk hands back the body only (never the status code), so the
      // outcome comes from what was serving before — same as rollback
      var success = !response.former || String(response.former.rev) !== String(response.revision.rev)
      helpers.space()
      if (success){
        helpers.trunc("⤮ Cutover".green)
        helpers.displayRevisionBasicInfo(response.revision, response.domain)
        helpers.displayServers(response.instances)
        helpers.trunc("Done".green + (" - " + domain.underline + " now serving revision " + response.revision.preview.underline).grey)
      }else{
        helpers.trunc("⤮ Cutover".yellow)
        helpers.displayRevisionBasicInfo(response.revision, response.domain)
        helpers.trunc("Unchanged".yellow + (" - already serving " + response.revision.preview.underline).grey)
      }
      return next()
    }
  })

}


/***/ }),

/***/ 8348:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers     = __nccwpck_require__(5746)
var client      = __nccwpck_require__(1340)
var localCreds  = __nccwpck_require__(5986)
var surge       = __nccwpck_require__(3932)
var surgeSDK    = __nccwpck_require__(9943)
var surgeStream = __nccwpck_require__(9721)
var ProgressBar = __nccwpck_require__(9243)
var fs = __nccwpck_require__(9896)
var path = __nccwpck_require__(6928)


module.exports = function(req, next){
  
  var progress = {}
  var progressDone = {}
  var ts = new Date().toJSON()


  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  }, surgeStream)


  /**
   * progress
   *
   * payload includes upload progress
   *
   */

  sdk.publish(req.project, req.domain, {
    "user":"token",
    "pass": req.creds.token
  }, {
    "version" : req.pkg.version,
    "file-count": req.fileCount,
    "project-size": req.projectSize,
    "cmd": req.configuration.cmd,
    "timestamp": ts,
    "stage": req.argv.s,
    "message": req.argv.m,
    "add": req.argv.a,
    "rem": req.argv.r,
    "ssl": req.ssl,
    "org": req.org,
    "user-agent": client.userAgent(req.pkg.version, req.argv, process.env, process.stdin.isTTY)
  }, req.argv)


  /**
   * skipped
   *
   * paths left out of the upload because they have no content: symlinks
   * that resolve to nothing (dangling, or looping) and fifos/sockets
   *
   */

  /**
   * single
   *
   * a single file publishes as a one-file project; local lists the files
   * the page uses that sit next to it and so stay behind
   *
   */

  .on("single", function(single){
    if (!single.local || !single.local.length) return
    var shown = single.local.slice(0, 5).join(", ")
    var more  = single.local.length > 5 ? " +" + (single.local.length - 5) + " more" : ""
    var them  = single.local.length === 1 ? "it" : "them"
    helpers.log(helpers.smart("left behind:").grey + " " + shown + more + (" - " + single.file + " uses " + them + "; publish its folder to include " + them).grey)
  })

  .on("skipped", function(paths){
    var shown = paths.slice(0, 5).join(", ")
    var more  = paths.length > 5 ? " +" + (paths.length - 5) + " more" : ""
    helpers.log(helpers.smart("skipped:").grey + " " + shown + more + " (nothing to publish)".grey)
  })


  /**
   * progress
   *
   * payload includes upload progress
   *
   */

  /**
   * carry
   *
   * files the domain's current revision already has stay on the server;
   * only the rest are uploaded. not emitted under 1 MB or for a domain
   * with nothing published yet - those upload everything
   *
   */

  .on("carry", function(payload){
    var total = payload.carried + payload.sent
    helpers.log(helpers.smart("changed:").grey + " " + payload.sent + " of " + total + " files" + (" (" + payload.carried + " already published)").grey)
  })

  .on("progress", function(payload){
    try {

      // we have two different display for the progress bars
      var labels = {
        "upload": helpers.smart('upload:').grey,
           "cdn": helpers.smart('CDN:').grey,
       "encrypt": helpers.smart('encryption:').grey
      }
      var displays = {
        "upload": labels.upload + ' [:bar] :percent',
           "cdn": labels.cdn + ' [:bar] :percent',
       "encrypt": labels.encrypt + ' [:bar] :percent'
      }

      // in a log, one line per bar once it finishes
      if (!helpers.redraws()){
        if (!labels[payload.id] || progressDone[payload.id]) return
        if (payload.written < payload.total) return
        progressDone[payload.id] = true
        return helpers.log(labels[payload.id] + " done")
      }

      // create progress bar (if one doesnt exist)
      progress[payload.id] = progress[payload.id] || new ProgressBar(displays[payload.id], {
        complete: '=', incomplete: ' ', width: 25, total: payload.total
      })

      // clear file name on last update
      var file = payload.written >= payload.total ? "" : payload.file

      // refresh view
      if (!progressDone[payload.id]){
        if (payload.written / payload.total === 1) progressDone[payload.id] = true
        if (payload.written > payload.total) progressDone[payload.id] = true
        progress[payload.id].update(payload.written / payload.total)
      }

    } catch(e){}

  })


  /**
   * regionInfo
   *
   * payload includes information about surge edgenode regions
   *
   *   {
   *     nsDomain: "surge.world",
   *     regions: {
   *       "yyz":{ "ip": "159.203.50.177",   "country": "CA",  "city": "Toronto" },
   *       "jfk":{ "ip": "159.203.159.100",  "country": "US",  "city": "New York" },
   *       "sfo":{ "ip": "138.197.235.123",  "country": "US",  "city": "San Francisco" },
   *       "lhr":{ "ip": "46.101.67.123",    "country": "GB",  "city": "London" },
   *       "ams":{ "ip": "188.166.132.94",   "country": "NL",  "city": "Amsterdam" },
   *       "fra":{ "ip": "138.68.112.220",   "country": "DE",  "city": "Frankfurt" },
   *       "sgp":{ "ip": "139.59.195.30",    "country": "SG",  "city": "Singapore" },
   *       "blr":{ "ip": "139.59.50.135",    "country": "IN",  "city": "Bangalore" }
   *     }
   *   }
   *
   */

  // .on("progress", function(d){
  //   console.log(JSON.stringify(d))
  // })

  .on("info", function(payload){
    req.info = payload
    // helpers.displayServers(payload.instances)
    // helpers.displayPreview(payload)
    helpers.displayPublishInfo(payload, (req.configuration && req.configuration.platform) || "surge.sh")
  })


  /**
   * users
   *
   * payload includes list of collaborators
   *
   */  

  .on("users", function(payload){
    helpers.log(helpers.smart("users:").grey, payload.users.join(", "))
  })


  /**
   * cert
   *
   * payload includes information about SSL certificate
   *
   */  

  // .on("cert", function(payload){
  //   try{
  //     helpers.log(helpers.smart("encryption:").grey + " " + payload.data.issuer + " - " + (payload.data.altnames || []).join(", ") + ( " (" + payload.data.expiresInWords + ")").grey)
  //   } catch(e){
  //     helpers.space()
  //     helpers.log(helpers.smart("Error").red + (" - " + "please report error to support@surge.sh").grey)
  //     helpers.space()
  //   }
  // })

  // cert display lives in the verdicts box (tables.verdicts) — no server
  // emits "ssl" today, and a revived emitter must not double-print


  /**
   * collect
   *
   * payload includes information needed to subscribe to a plan that will then accept the upload
   *
   */

  .on("collect", function(payload){
    var msg = ("   " + payload.plan.name.underline + " plan requred. ").grey + ("$" + (payload.plan.amount / 100) + "/mo with a " + payload.plan.trial_period_days + " day trial").underline.grey
    helpers.log()
    if (payload.hasOwnProperty("perks")) {
      helpers.log(msg += "\n\n     Includes...".blue)
      payload.perks.forEach(function(perk){ helpers.log(("       - " + perk).blue); })
      helpers.log()
    } else {
      helpers.log(msg)
    }
    if (payload.checkout_url){
      helpers.log(("     Or pay in your browser: ").grey + payload.checkout_url.underline)
      helpers.log()
    }
    req.plan = payload.plan.name
    helpers.payment(req, payload.stripe_pk, payload.card)(function(paymentToken){
      sdk.plan({ 
        "plan": payload.plan.id, 
        "token": paymentToken, 
        "timestamp": ts 
      }, { "user": "token", "pass": req.creds.token }, function(errors, rsp){
        if (errors) {
          helpers.space()
          helpers.trunc("Error".red + " - troubles switching plan".grey)
          helpers.space()
        }else{
          helpers.space()
          helpers.trunc(rsp.msg.grey)
          helpers.space()
        }
      })
    })
  })


  /**
   * unauthenticated
   *
   */

  .on("unauthenticated", function(payload){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - local token has expired and cleared. please try again.").grey)
    helpers.space()
    localCreds(req.endpoint).set(null)
    process.exit(1)
  })


  /**
   * forbidden
   *
   */

  .on("forbidden", function(payload){
    helpers.space()
    // the server sends a precise reason header when it has one; the
    // stream falls back to the literal "Forbidden" when it doesn't
    var msg = (payload && payload !== "Forbidden")
      ? payload
      : "you do not have permission to publish to " + req.domain.underline
    helpers.trunc("Aborted".yellow + (" - " + msg).grey)
    helpers.space()
    process.exit(1)
  })


  /**
   * ratelimited
   *
   * too many publishes in the window — the reason includes when to retry
   *
   */

  .on("ratelimited", function(payload){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - " + payload).grey)
    helpers.space()
    process.exit(1)
  })


  /**
   * error (depricated)
   *
   * payload includes information needed to display compile errors to user
   *
   */

  .on("error", function(payload){
    // three payload shapes arrive here: a compile error (filename/stack/
    // lineno), a server abort ({ error: { message } } only), and a raw
    // transport Error (no .error at all). Only the first is a compile
    // error — the rest get the standard Aborted line.
    var err = (payload && payload.error) || payload || {}
    if (err.filename && err.stack){
      console.log()
      console.log()
      helpers.log("   Processing Error:".yellow, err.filename).log()
      console.log(helpers.stacktrace(err.stack, { lineno: err.lineno }))
      helpers.log()
      console.log("  ", err.message)
      console.log()
      req.status = req.status || "Compile Error"
    } else {
      helpers.space()
      helpers.trunc("Aborted".yellow + (" - " + (err.message || "deployment failed. please try again.")).grey)
      helpers.space()
    }
    process.exit(1)
  })


  /**
   * fail
   *
   * the deployment has failed
   *
   */

  .on("fail", function(obj){
    console.log()
    console.log()
    helpers.trunc("Error".red + " - Deployment did not succeed.".grey)
    helpers.space()
    process.exit(1)
  })


  /**
   * success
   *
   * the deployment has failed
   *
   */

  .on("success", function(){
    helpers.space()
    if (req.argv.stage){
      helpers.trunc("Success!".green + (" - Preview available at " + (req.info.metadata.preview).underline).grey)
    } else {
      // a publish naming an org (acme:<domain>) says whose the domain is
      var owner = req.info && req.info.owner && req.info.owner.org
      helpers.trunc("Success!".green + (" - Published to " + (req.domain).underline).grey + (owner ? (" (owned by " + owner + ")").grey : ""))
    }
    helpers.space()

    // persist the domain as the project identity - the next bare publish
    // (and every other [<domain>] slot) resolves from it. never overwrite.
    // a single file has no project directory to carry it
    if (!req.singleFile) try {
      var cnamePath = path.join(req.project, "CNAME")
      if (!fs.existsSync(cnamePath)){
        fs.writeFileSync(cnamePath, req.domain + "\n")
        var rel = path.relative(process.cwd(), cnamePath)
        if (rel.indexOf("..") === 0) rel = cnamePath
        helpers.trunc(("domain written to " + rel).grey)
        helpers.space()
      }
    } catch(e) {}
    // the one message the server wants the user to see — nothing else
    // prints below the publish result
    if (req.info && req.info.cta){
      helpers.trunc(req.info.cta.grey)
      helpers.space()
    }
    return next()
  })


}


/***/ }),

/***/ 6449:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  sdk.discard(domain, rev, { user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      return next(error)
    }else{
      if (response){
        // display discard information
        helpers.space()
        helpers.log("   ✂ Discarded".green + (" " + response.revision.preview.underline).grey)
        helpers.space()

        // display change
        if (response.uncached.change){
          helpers.space()
          if (response.uncached.change == "rollfore"){
            helpers.log("   ⟳ Rollfore".green)
            helpers.displayRevisionBasicInfo(response.revision, response.domain)
          } else if (response.uncached.change == "rollback"){
            helpers.log("   ⟲ Rollback".green)
            helpers.displayRevisionBasicInfo(response.revision, response.domain)
          } else if (response.uncached.change == "offline"){
            helpers.log("   ⤫ Offline".green)
          }
          helpers.space()
        }

        // display regions
        helpers.space()
        //helpers.displayRegions(response)
        helpers.displayServers(response.instances)
        helpers.space()

        if (response.uncached.change){
          helpers.space()
          if (response.uncached.change == "rollfore"){
            helpers.log("   Done".green + (" - " + response.domain.underline + " rolled forward to revision " + response.revision.preview.underline).grey)
          } else if (response.uncached.change == "rollback"){
            helpers.log("   Done".green + (" - " + response.domain.underline + " rolled back to revision " + response.revision.preview.underline).grey)
          } else if (response.uncached.change == "offline"){
            helpers.log("   Done".green + (" - No revisions to serve. Project now offline.").grey)
          }
          helpers.space()
        } else {
          helpers.log("   Done".green + (" - " + response.domain.underline + " still serving " + response.revision.preview.underline).grey)
        }

      }else{
        helpers.space()
        helpers.log("   Unchanged".yellow + (" - No revisions discarded.").grey)
        helpers.space()
      }
      return next()
    }
  })

}


/***/ }),

/***/ 6560:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)


var parseArgs = function(argv){
  var args = JSON.parse(JSON.stringify(argv))

  if (argv["_"][0] && argv["_"][0].indexOf(".") !== -1){
    args.domain  = argv["_"][0]
    args.cmd     = argv["_"][1]
    args.type    = argv.type  || argv["_"][2]
    args.name    = argv.name  || argv["_"][3]
    args.value   = argv.value || argv["_"][4]
    if (args.type === "MX"){ 
      if (argv["_"].length === 5){
        args.name     = argv.name     || "@"
        args.priority = argv.priority || argv["_"][3]
        args.value    = argv.value    || argv["_"][4]
      }else if (argv["_"].length === 6){
        args.name     = argv.name     || argv["_"][3]
        args.priority = argv.priority || argv["_"][4]
        args.value    = argv.value    || argv["_"][5]
      }
    }
  }

  return args
}

module.exports = function(type){

  return function(req, next){
    var add, rem, get

    var sdk = surgeSDK({
      endpoint: req.endpoint.format(),
      defaults: helpers.defaults
    })

    if (type === "dns"){
      add = sdk.dnsAdd
      rem = sdk.dnsRem
      get = sdk.dns
    } else if(type === "zone"){
      add = sdk.zoneAdd
      rem = sdk.zoneRem
      get = sdk.zone
    }

    var args = parseArgs(req.argv)

    if (args.cmd === "add") {
      add(args.domain, args, { user: "token", pass: req.creds.token }, function(error, rsp){
        if (error) {
          if (error.status === 405){
            helpers.space()
            helpers.trunc("Invalid".yellow + (" - " + error.message).grey)
            helpers.space()
            process.exit(1)
          }else{
            helpers.space()
            error.messages.forEach(function(m){ helpers.trunc("Error".red + (" - " + m).grey); })
            helpers.space()
            process.exit(1)
          }
        } else {
          helpers.space()
          helpers.displayRecords(rsp, type)
          helpers.space()
          helpers.trunc("Success".green + " - record added".grey)
          helpers.space()
          process.exit()
        }
      })
    } else if (args.cmd === "rem") {
      rem(args.domain, args.type, { user: "token", pass: req.creds.token }, function(error, rsp){
        if (error) {
          if (error.status === 405){
            helpers.space()
            helpers.trunc("Invalid".yellow + (" - " + error.message).grey)
            helpers.space()
            process.exit(1)
          }else{
            helpers.space()
            helpers.displayRecords(rsp, type)
            helpers.space()
            error.messages.forEach(function(m){ helpers.trunc("Error".red + (" - " + m).grey); })
            helpers.space()
            process.exit(1)
          }
        } else {
          helpers.space()
          helpers.displayRecords(rsp, type)
          helpers.space()
          helpers.trunc("Success".green + " - record removed".grey)
          helpers.space()
        }
      })
    } else {
      get(args.domain, { user: "token", pass: req.creds.token }, function(error, rsp){
        if (error) {
          if (error.status === 405){
            helpers.space()
            helpers.trunc("Invalid".yellow + (" - " + error.message).grey)
            helpers.space()
            process.exit(1)
          }else{
            helpers.space()
            if (rsp){
              helpers.displayRecords(rsp, type)
              helpers.space()  
            }
            helpers.trunc("Error".red + (" - " + error.message).grey)
            helpers.space()
            process.exit(1)
          }
        } else {
          var keys = Object.keys(rsp)
          if (keys.length == 0){
            helpers.space()
            helpers.trunc(("Empty").grey)
            helpers.space()
          }else{
            helpers.space()
            helpers.displayRecords(rsp, type)
            helpers.space()
          }
          return next()
        }
      })
    }

  }
}


/***/ }),

/***/ 342:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers     = __nccwpck_require__(5746)
var localCreds  = __nccwpck_require__(5986)
var surgeSDK    = __nccwpck_require__(9943)
var surgeStream = __nccwpck_require__(9721)
var ProgressBar = __nccwpck_require__(9243)

module.exports = function(req, next){

  var progress = {}
  var progressDone = {}
  var ts = new Date().toJSON()

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  }, surgeStream)


  var domain = req.domain

  sdk.encrypt(domain, {
    "user":"token",
    "pass": req.creds.token
  }, {
    "version" : req.pkg.version,
    "cmd": req.configuration.cmd,
    "timestamp": ts
  }, req.argv)


  /**
   * display progress bars
   *
   *
   */  

  .on("progress", function(payload){
    try {

      // we have two different display for the progress bars
      var labels = {
        "upload": helpers.smart('upload:').grey,
       "encrypt": helpers.smart('encryption:').grey
      }
      var displays = {
        "upload": labels.upload + ' [:bar] :percent',
       "encrypt": labels.encrypt + ' [:bar] :percent'
      }

      // in a log, one line per bar once it finishes
      if (!helpers.redraws()){
        if (!labels[payload.id] || progressDone[payload.id]) return
        if (payload.written < payload.total) return
        progressDone[payload.id] = true
        return helpers.log(labels[payload.id] + " done")
      }

      // create progress bar (if one doesnt exist)
      progress[payload.id] = progress[payload.id] || new ProgressBar(displays[payload.id], {
        complete: '=', incomplete: ' ', width: 25, total: payload.total
      })

      // clear file name on last update
      var file = payload.written >= payload.total ? "" : payload.file

      // refresh view
      if (!progressDone[payload.id]){
        if (payload.written / payload.total === 1) progressDone[payload.id] = true
        if (payload.written > payload.total) progressDone[payload.id] = true
        progress[payload.id].update(payload.written / payload.total)
      }

    } catch(e){}

  })


  /**
   * success
   *
   * the cert application is complete
   *
   */

  // .on("success", function(){
  //   helpers.space()
  //   if (req.argv.stage){
  //     helpers.trunc("Success!".green + (" - Preview available at " + (req.info.metadata.preview).underline).grey)
  //   } else {
  //     helpers.trunc("Success!".green + (" - Published to ").grey)  
  //   }
  //   helpers.space()
  //   return next()
  // })


  /**
   * unauthenticated
   *
   */

  .on("info", function(payload){
    req.info = payload
    helpers.displayCertInfo(payload, { short: false, showEmpty: true })
    helpers.space()
    // helpers.displayServers(payload.instances)
    // helpers.displayPreview(payload)
    //helpers.displayPublishInfo(payload)
  })


  /**
   * collect
   *
   * payload includes information needed to subscribe to a plan that will then accept the upload
   *
   */

  .on("collect", function(payload){
    var msg = ("   " + payload.plan.name.underline + " plan requred. ").grey + ("$" + (payload.plan.amount / 100) + "/mo with a " + payload.plan.trial_period_days + " day trial").underline.grey
    helpers.log()
    if (payload.hasOwnProperty("perks")) {
      helpers.log(msg += "\n\n     Includes...".blue)
      payload.perks.forEach(function(perk){ helpers.log(("       - " + perk).blue); })
      helpers.log()
    } else {
      helpers.log(msg)
    }
    if (payload.checkout_url){
      helpers.log(("     Or pay in your browser: ").grey + payload.checkout_url.underline)
      helpers.log()
    }
    req.plan = payload.plan.name
    helpers.payment(req, payload.stripe_pk, payload.card)(function(paymentToken){
      sdk.plan({ 
        "plan": payload.plan.id, 
        "token": paymentToken, 
        "timestamp": ts 
      }, { "user": "token", "pass": req.creds.token }, function(errors, rsp){
        if (errors) {
          helpers.space()
          helpers.trunc("Error".red + " - troubles switching plan".grey)
          helpers.space()
        }else{
          helpers.space()
          helpers.trunc(rsp.msg.grey)
          helpers.space()
        }
      })
    })
  })


  /**
   * unauthenticated
   *
   */

  .on("unauthenticated", function(payload){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - local token has expired and cleared. please try again.").grey)
    helpers.space()
    localCreds(req.endpoint).set(null)
    process.exit(1)
  })


  /**
   * forbidden
   *
   */

  .on("forbidden", function(payload){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - you do not have permission to publish to " + domain.underline).grey)
    helpers.space()
    process.exit(1)
  })

}

/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  if (!domain){
    helpers.trunc("domain required".grey)
    return next()
  } else {
    sdk.manifest(domain, { user: "token", pass: req.creds.token }, function(error, manifest){
      if (error) return next(error)
      helpers.displayManifest(manifest, domain)
      return next()
    })
  }
  
}

/***/ }),

/***/ 8940:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs        = __nccwpck_require__(9896)
var helpers   = __nccwpck_require__(5746)
var discovery = __nccwpck_require__(894)

var pad = function(str, width){
  while (str.length < width) str += " "
  return str
}

var sourceLabels = { cname: "CNAME found", pkg: "package.json", arg: "given" }

module.exports = function(req, next){
  if (req.argv.help || req.argv.h) {
    var name = req.configuration.name

    // target-first context: argv._[0] is the target slot. a typed target
    // echoes in the lines, a resolvable one renders the header, and a
    // passed path that resolves nothing means no context - never fall
    // back to the cwd and lie about the target.
    var typed = null
    var local = null
    var notAProject = false
    var missing = false
    var a0 = req.argv._[0] != null ? String(req.argv._[0]) : null

    if (typeof req.argv.domain === "string" && helpers.validDomain(req.argv.domain)){
      local = { domain: req.argv.domain, source: "arg" }
    } else if (a0){
      // mirrors the router: a valid domain wins unless the path form is
      // forced - a same-named directory never shadows a domain
      var forced = a0 === "." || a0 === ".." || a0.indexOf("./") === 0 ||
                   a0.indexOf("../") === 0 || a0.indexOf("/") === 0
      if (!forced && a0.indexOf("@") === -1 && helpers.validDomain(a0)){
        typed = a0
        local = { domain: a0, source: "arg" }
      } else if (forced || a0.indexOf("/") !== -1 || fs.existsSync(a0)){
        typed = a0
        if (!fs.existsSync(a0)){
          missing = true
        } else {
          var found = discovery.local(a0)
          if (found){
            local = { domain: found.domain, source: found.source, at: a0 }
          } else {
            notAProject = true
          }
        }
      }
    } else {
      local = discovery.local()
    }

    // the slot reads <domain> because that is what almost everyone puts
    // there. a path works too - that is the power-user form, left for the
    // docs rather than spent on a line of the help screen.
    var proj = typed ? typed + " " : (local ? "" : "<domain> ")

    // rows are collected before anything prints so one description column
    // serves every section. the widest line sets it, which matters because
    // the target slot changes width with context - empty inside a project,
    // the typed domain when one is given, <domain> otherwise.
    var rows = []
    var row = function(section, left, desc){
      rows.push({ section: section, left: left, desc: desc })
    }
    var cmd = function(word, args){
      return name + " " + proj + word + (args ? " " + args : "")
    }

    // each section opens with its own blank line, so the header and the
    // context line below it close without one
    helpers
      .log()
      .log("  " + req.configuration.platform.replace(/^\w/, c => c.toUpperCase()).underline.blue, "⚡ Static Web Publishing".brightYellow, req.pkg.version.grey)

    if (local){
      var label = sourceLabels[local.source] || local.source
      if (local.at && local.at !== ".") label += " in " + local.at
      helpers
        .log()
        .log("  " + local.domain.underline + (" (" + label + ")").grey)
    } else if (missing){
      helpers
        .log()
        .log("  " + typed.underline + " (no such directory)".grey)
    } else if (notAProject){
      helpers
        .log()
        .log("  " + typed.underline + " (not a surge project yet)".grey)
    }

    // publish takes a path, never a domain - a domain has nothing to upload
    var typedPath = typed && !missing && (notAProject || (local && local.at)) ? typed : null
    var typedDomain = typed && local && !local.at ? typed : null
    var pair = typedPath
      ? name + " " + typedPath + " <domain>"
      : (typedDomain ? name + " <path> " + typedDomain : name + " <path> <domain>")
    var publishLine = typedPath
      ? name + " " + typedPath + " publish"
      : (local && !typed ? name + " publish" : name + " <path> publish")

    row("PUBLISHING", pair, "publish dir to domain")
    row("PUBLISHING", publishLine, "publish using local CNAME")
    row("PUBLISHING", name + " <page.html> <domain>", "publish one html page as index.html")
    row("PUBLISHING", pair + " --preview", "publish a preview, production untouched")

    // previews are only useful if the way to ship one is on the same
    // screen - an agent reading this learns cutover exists
    if (!notAProject && !missing){
      row("REVISIONS", cmd("revs"), "list revisions")
      row("REVISIONS", cmd("cutover", "[<rev>]"), "serve a revision (ships a preview)")
      row("REVISIONS", cmd("rollback|rollfore"), "change live revision")
      row("REVISIONS", cmd("discard", "<rev>"), "remove a revision")
    }

    row("ADMIN", name + " whoami", "display current session")
    row("ADMIN", name + " login", "authenticate")
    row("ADMIN", name + " logout", "remove session & expire token")
    row("ADMIN", name + " verify", "verify email address")
    row("ADMIN", name + " mfa", "manage two-factor auth")
    row("ADMIN", name + " list", "list your domains, newest first")
    row("ADMIN", name + " card", "change billing credit card")
    row("ADMIN", name + " plan", "show/change account plan")
    row("ADMIN", name + " tokens", "show available tokens commands")
    row("ADMIN", name + " orgs", "show your orgs")
    row("ADMIN", name + " claim <code>", "join an org, or take a domain, with a code")
    row("ADMIN", name + " scrap <code>", "cancel an invite or transfer code")

    // a target that is not a project yet gets the way in, not a list
    // of commands that cannot run against it
    if (!notAProject && !missing){
      row("PROJECT", cmd("config"), "show/change project configuration")
      // invite and revoke still run, for old grants; orgs share domains now
      row("PROJECT", cmd("transfer", "[<org>]"), "move to an org, or get a code to give it away")
      row("PROJECT", cmd("teardown"), "remove project (!destructive)")
      row("PROJECT", cmd("stats"), "show available analytics commands")
      row("PROJECT", cmd("dns"), "show available dns commands")
      row("PROJECT", cmd("debug"), "show available debug commands")
    }

    row("AUTH", "--token <token>", "authenticate without logging in")
    row("AUTH", "SURGE_TOKEN=<token>", "same, from the environment")

    // the widest line sets the description column, but only up to a ceiling
    // - a long absolute path in the target slot would otherwise drag every
    // `surge login` in the screen out to its width. past the ceiling a line
    // just runs over and keeps its own gap.
    var CEILING = 44
    var GAP = 6
    var width = 0
    rows.forEach(function(r){
      if (r.left.length > width && r.left.length <= CEILING) width = r.left.length
    })

    var section = null
    rows.forEach(function(r){
      if (r.section !== section){
        section = r.section
        helpers.log().log("  " + section.grey)
      }
      var left = r.left.length >= width + GAP ? r.left + pad("", GAP) : pad(r.left, width + GAP)
      helpers.log("    " + left + r.desc.grey)
    })
    helpers
      .log()
      .log("  " + (name + " <command> --help for one command").grey)
      .log()
  } else {
    next()
  }
}

// namespace usage screens - shown for a verbless noun. the lines echo the
// target exactly as typed (or the cwd-implied short form), the header
// announces what it resolved to, and <domain> only renders when nothing
// resolves at all.

var usageHeader = function(local, label){
  if (!local) return
  var src = sourceLabels[local.source] || local.source
  if (local.at && local.at !== ".") src += " in " + local.at
  helpers
    .log("  " + local.domain.underline + (" (" + src + "). " + label + " commands...").grey)
    .log()
}

var projToken = function(local, typed){
  return typed ? typed + " " : (local ? "" : "<domain> ")
}

module.exports.dnsUsage = function(name, local, typed){
  var proj = projToken(local, typed)
  helpers.log()
  usageHeader(local, "DNS")
  helpers
    .log("    " + name + " " + proj + "dns " + "list".grey)
    .log("    " + name + " " + proj + "dns " + "add <type> <name> <value>".grey)
    .log("    " + name + " " + proj + "dns " + "rem <id>".grey)
    .log()
    .log("  " + "NS SERVERS (GEO)".grey)
    .log("  ns1.surge.world")
    .log("  ns2.surge.world")
    .log("  ns3.surge.world")
    .log("  ns4.surge.world")
    .log()
}

module.exports.debugUsage = function(name, local, typed){
  var proj = projToken(local, typed)
  helpers.log()
  usageHeader(local, "Debug")
  helpers
    .log("    " + name + " " + proj + "debug " + "status".grey)
    .log("    " + name + " " + proj + "debug " + "files".grey)
    .log("    " + name + " " + proj + "debug " + "audit".grey)
    .log("    " + name + " " + proj + "debug " + "bust".grey)
    .log("    " + name + " " + proj + "debug " + "certs".grey)
    .log("    " + name + " " + proj + "debug " + "encrypt".grey)
    .log()
}

module.exports.statsUsage = function(name, local, typed){
  var proj = projToken(local, typed)
  helpers.log()
  usageHeader(local, "Stats")
  helpers
    .log("    " + name + " " + proj + "stats " + "traffic".grey)
    .log("    " + name + " " + proj + "stats " + "load".grey)
    .log("    " + name + " " + proj + "stats " + "audience".grey)
    .log("    " + name + " " + proj + "stats " + "usage".grey)
    .log()
}

// `surge account` still dispatches, so this screen answers it - but the
// identity verbs are flat, so it teaches the flat spelling rather than the
// one the user happened to type in.
module.exports.accountUsage = function(name){
  helpers
    .log()
    .log("    " + name + " " + "whoami".grey)
    .log("    " + name + " " + "login".grey)
    .log("    " + name + " " + "logout".grey)
    .log("    " + name + " " + "verify".grey)
    .log("    " + name + " " + "card".grey)
    .log("    " + name + " " + "plan".grey)
    .log("    " + name + " " + "nuke".grey)
    .log()
}

module.exports.orgsUsage = function(name){
  helpers
    .log()
    .log("    " + name + " " + "orgs".grey)
    .log("    " + name + " orgs " + "<org>".grey)
    .log("    " + name + " orgs " + "<org> create [--name <name>]".grey)
    .log("    " + name + " orgs " + "<org> rename <slug> [--name <name>]".grey)
    .log("    " + name + " orgs " + "<org> remove".grey)
    .log("    " + name + " orgs " + "<org> invite [--admin]".grey)
    .log("    " + name + " orgs " + "<org> leave".grey)
    .log("    " + name + " orgs " + "<org> members".grey)
    .log("    " + name + " orgs " + "<org> members <email> revoke|mkadmin|rmadmin".grey)
    .log("    " + name + " orgs " + "<org> tokens".grey)
    .log("    " + name + " orgs " + "<org> tokens add [--domain <domain>] [-m <msg>]".grey)
    .log("    " + name + " orgs " + "<org> tokens rem <id>".grey)
    .log()
}

module.exports.tokensUsage = function(name){
  helpers
    .log()
    .log("    " + name + " tokens " + "list".grey)
    .log("    " + name + " tokens " + "add [--domain <domain>] [-m <msg>]".grey)
    .log("    " + name + " tokens " + "rem <id>".grey)
    .log("    " + name + " tokens " + "transfer <id> <org>".grey)
    .log()
}

// one command's usage - `surge <verb> --help`, `surge <target> <verb>
// --help` and `surge help <verb>`. {t} is the target slot: the target as
// typed, <domain> otherwise. the wording follows the command reference on
// surge.sh (docs/cli/reference), which documents every command.
var publishFlags = [
  ["--preview", "publish a preview, production untouched"],
  ["-m, --message <msg>", "attach a message to the revision"],
  ["--force https|http", "redirect all traffic to that protocol (sticks)"],
  ["--private | --public", "lock the domain to the people who can publish it, or open it"],
  ["--token <token>", "authenticate without logging in (or SURGE_TOKEN)"]
]

var usages = {
  publish: {
    lines: ["<path> <domain>", "<path> <org>:<domain>", "<path> publish", "<page.html> <domain>"],
    desc: [
      "Publish a directory to a domain, or one html page as its index.html.",
      "`_` as the domain generates a fresh .surge.sh name; `publish` uses",
      "the project's CNAME file. <org>: claims a new domain for an org."
    ],
    flags: publishFlags
  },
  teardown: { lines: ["{t}teardown"], desc: ["Remove the project from the domain and the CDN (!destructive)."] },
  transfer: {
    lines: ["{t}transfer", "{t}transfer <org>", "{t}transfer <your email>"],
    desc: [
      "Move the domain into an org you're in, or out to your own account.",
      "With nothing after it, prints a code: whoever runs `{n} claim <code>`",
      "takes the domain. A new code replaces the last. Serving is unchanged."
    ]
  },
  claim:    {
    lines: ["claim <code>", "claim <code> --yes"],
    desc: [
      "Join the org an invite code is for, or take the domain a transfer code names.",
      "In a terminal it shows what the code does and asks first; --yes doesn't ask."
    ]
  },
  scrap:    { lines: ["scrap <code>"], desc: ["Cancel an invite or transfer code. It stops working at once."] },
  list:     {
    lines: ["list", "list --all", "list <org>:"],
    desc: [
      "Your domains and your orgs', newest first: owner, age, last publisher.",
      "The newest 50 unless --all. `{n} <domain> list` lists revisions."
    ]
  },
  revs:     { lines: ["{t}revs"], desc: ["The project's revisions - preview url, age, author, size and message -", "with the live revision marked."] },
  rollback: { lines: ["{t}rollback"], desc: ["Serve the previous revision."] },
  rollfore: { lines: ["{t}rollfore"], desc: ["Serve the next revision (the inverse of rollback)."] },
  cutover:  { lines: ["{t}cutover [<rev>]"], desc: ["Serve a revision, or the latest when omitted. Ships a preview."] },
  discard:  { lines: ["{t}discard [<rev>]"], desc: ["Remove a revision. If it was live, production moves to a neighbouring", "revision; discarding the last one takes the project offline."] },
  dns: {
    lines: ["{t}dns list", "{t}dns add <type> <name> <value>", "{t}dns rem <id>"],
    desc: ["The domain's custom DNS records. MX records take a priority."]
  },
  zone: {
    lines: ["{t}zone", "{t}zone add <type> <name> <value>", "{t}zone rem <id>"],
    desc: ["The domain's complete zone in BIND format, including the records", "Surge manages."]
  },
  debug: {
    lines: ["{t}debug status", "{t}debug files", "{t}debug audit", "{t}debug bust", "{t}debug certs", "{t}debug encrypt"],
    desc: ["Diagnostics for the domain. Each also runs on its own: `{n} {t}status`."]
  },
  status:   { lines: ["{t}status"], desc: ["The domain's state: waiting on dns (with the records to add), securing,", "ready (serving once the email is verified), or live."] },
  files:    { lines: ["{t}files"], desc: ["Every file in the live revision, with its size."] },
  audit:    { lines: ["{t}audit"], desc: ["Each edge's state for the domain: revision, files, size, certificate."] },
  bust:     { lines: ["{t}bust"], desc: ["Purge the project from the cache on every edge."] },
  certs:    { lines: ["{t}certs"], desc: ["The certificates installed for the domain: subject, issuer, names,", "expiry, auto-renewal."] },
  encrypt:  { lines: ["{t}encrypt"], desc: ["Provision the domain's managed certificate now. Certificates normally", "provision and renew on their own."] },
  stats: {
    lines: ["{t}stats traffic", "{t}stats load", "{t}stats audience", "{t}stats usage"],
    desc: ["Analytics for the domain. Each also runs on its own: `{n} {t}traffic`."]
  },
  traffic:  { lines: ["{t}traffic"], desc: ["Visits, uniques, cache hits, top pages, 404s and sources, past two weeks."] },
  load:     { lines: ["{t}load"], desc: ["Connection volume per datacenter across the network."] },
  audience: { lines: ["{t}audience"], desc: ["Browsers, operating systems and devices of your visitors."] },
  usage:    { lines: ["{t}usage"], desc: ["Bandwidth served per file, with a projected monthly total."] },
  config: {
    lines: ["{t}config [flags]"],
    desc: ["Show the project's settings, or change them with flags. Any value", "`null` clears it. Changes apply across the edge immediately."],
    flags: [
      ["--force https|http", "redirect all traffic to that protocol"],
      ["--redirect <domain>", "send every request to another domain"],
      ["--cors <origin>|*", "allow cross-origin requests"],
      ["--hsts <seconds>", "set Strict-Transport-Security"],
      ["--private | --public", "lock the domain to the people who can publish it, or open it"]
    ]
  },
  invite:   { lines: ["{t}invite <emails>"], desc: ["Closed: orgs share domains now. Create one with `{n} orgs <org> create`,", "then `{n} {t}transfer <org>`."] },
  revoke:   { lines: ["{t}revoke <emails>"], desc: ["Remove a collaborator granted before orgs, immediately."] },
  ssl:      { lines: ["{t}ssl --pem <file>"], desc: ["Upload a custom certificate as a PEM bundle (cert, intermediates, key).", "Rarely needed: Surge provides the certificate for every domain."] },
  login: {
    lines: ["login"],
    desc: ["Authenticate, or create an account, and store a token in ~/.netrc."],
    flags: [["--browser", "sign in through the browser instead"]]
  },
  logout:   { lines: ["logout"], desc: ["Remove the stored token and expire it."] },
  whoami:   { lines: ["whoami"], desc: ["The logged-in email and plan, and the token in use by id and scope.", "Exits 1 when not authenticated."] },
  verify:   { lines: ["verify"], desc: ["Send an email verification link."] },
  mfa:      { lines: ["mfa"], desc: ["Open the page that sets up or manages two-factor auth."] },
  tokens: {
    lines: ["tokens list", "tokens add [--domain <domain>] [-m <msg>]", "tokens rem <id>", "tokens transfer <id> <org>"],
    desc: ["Tokens for CI and agents. A token is shown once, when added. --domain", "scopes it to one domain or a pattern like *.previews.example.com (repeat", "for more); -m labels it. transfer hands a token to an org, value unchanged."]
  },
  token:    { lines: ["token"], desc: ["Print the token the CLI is authenticating with."] },
  orgs: {
    lines: ["orgs", "orgs <org>", "orgs <org> create [--name <name>]", "orgs <org> rename <slug> [--name <name>]",
            "orgs <org> remove", "orgs <org> invite [--admin]", "orgs <org> leave", "orgs <org> members",
            "orgs <org> members <email> revoke|mkadmin|rmadmin", "orgs <org> tokens",
            "orgs <org> tokens add [--domain <domain>] [-m <msg>]", "orgs <org> tokens rem <id>"],
    desc: ["Orgs you belong to, their members and their tokens. An org token", "publishes as the org and keeps working whoever leaves."]
  },
  plan:     { lines: ["plan [--web | --manage]"], desc: ["Change the account plan, or print a private link for checkout (--web)", "or billing management (--manage)."] },
  card:     { lines: ["card"], desc: ["Update the payment card on file."] },
  nuke:     { lines: ["nuke"], desc: ["Permanently delete your account. Every project must be torn down first."] },
  account:  { lines: ["whoami", "login", "logout", "verify", "card", "plan", "nuke"], desc: ["`{n} account <verb>` is the same as `{n} <verb>`."] }
}
usages.deploy = usages.publish

module.exports.verb = function(name, verb, target){
  var u = usages[verb]
  if (!u) return false
  var t = (target || "<domain>") + " "
  var fill = function(s){ return s.split("{t}").join(t).split("{n}").join(name) }

  helpers.log()
  u.lines.forEach(function(l){ helpers.log("  " + name + " " + fill(l)) })
  helpers.log()
  u.desc.forEach(function(d){ helpers.log("    " + fill(d).grey) })
  if (u.flags){
    var width = 0
    u.flags.forEach(function(f){ if (f[0].length > width) width = f[0].length })
    helpers.log().log("  " + "FLAGS".grey)
    u.flags.forEach(function(f){ helpers.log("    " + pad(f[0], width + 4) + f[1].grey) })
  }
  helpers.log()
  return true
}


/***/ }),

/***/ 6246:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

// collaborator invites are closed (plans/b2b.md): orgs share domains now,
// and the api answers every email as "not sent" with what to do instead.
// grants made before stay, and `revoke` still removes them

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var args = helpers.parseDomainsEmails(req.argv["_"])
  if (req.domain && args.domains.indexOf(req.domain) === -1) args.domains.unshift(req.domain)

  var abort = function(msg){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - " + msg).grey)
    helpers.space()
    process.exit(1)
  }

  sdk.invite(args.domains[0] || null, args, { user: "token", pass: req.creds.token }, function(error, rsp){
    if (error) return abort((error.messages && error.messages[0]) || error.message || "could not invite")
    var invites = (rsp && rsp.invites) || []
    var refused = invites.length && invites.every(function(i){ return i.status === "not sent" })
    if (refused) return abort(invites[0].invite)
    helpers.displayInvites(rsp)
    return next()
  })

}


/***/ }),

/***/ 6971:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url         = __nccwpck_require__(7016)
var Table       = __nccwpck_require__(5832)
var helpers     = __nccwpck_require__(5746)
var surgeSDK    = __nccwpck_require__(9943)

var LIMIT = 50
var terminalBreakpoint = 100

// `acme:` - an org slug and its colon, nothing after
var isOrg = function(arg){
  return /^[a-z0-9][a-z0-9-]*:$/i.test(String(arg || ""))
}

// the owner's email, the org's slug, or shared: someone else's domain
// you can publish to, whose owner isn't yours to know
var ownerOf = function(project){
  var owner = project.owner
  if (!owner) return ""
  if (owner.account) return owner.account
  if (owner.org) return owner.org.slug
  return "shared"
}

// domain, owner, age, publisher, and on wide terminals files and size
var row = function(project, wide){
  var out = [
    project.domain,
    ownerOf(project).grey,
    (project.timeAgoInWords || "").grey,
    (project.email || "").grey
  ]
  if (wide){
    out.push((project.publicFileCount ? project.publicFileCount + " files" : "").grey)
    out.push((project.friendlySize || "").grey)
  }
  return out
}

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  // newest first, 50 at most unless --all; `acme:` keeps one org's.
  // No default handlers here, so a refusal prints the server's words
  var listAllProjects = function(){
    var arg = req.argv["_"][0]
    var opts = { limit: req.argv.all ? null : LIMIT }
    if (arg) opts.org = String(arg).slice(0, -1)
    var plain = surgeSDK({ endpoint: req.endpoint.format() })
    plain.list(opts, { user: "token", pass: req.creds.token }, function(error, projects, total){
      if (error){
        var why = error.messages && error.messages[0]
        helpers.space()
        helpers.trunc("Aborted".yellow + (" - " + (why || "could not list your domains")).grey)
        helpers.space()
        return process.exit(1)
      }
      if (opts.limit) projects = projects.slice(0, opts.limit)
      var table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
               , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
               , 'left': '  ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
               , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 2 }
      })

      if (projects.length != 0) {
        var wide = process.stdout.columns > terminalBreakpoint
        projects.forEach(function(project){
          table.push(row(project, wide))
        })
        helpers.space()
        helpers.log(table.toString())
        if (total > projects.length){
          helpers.space()
          helpers.trunc((projects.length + " of " + total + " - " + req.configuration.name + " list --all").grey)
        }
      } else {
        helpers.space()
        helpers.trunc(("Empty").grey)
      }
      return next()
    })
  }

  var listSingleProject = function(){

    sdk.list(req.domain || req.argv["_"][0], { user: "token", pass: req.creds.token }, function(error, revisions){
      if (error) return next(error)
      revisions.reverse()
      var table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
               , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
               , 'left': '  ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
               , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 1 }
      })
      var lastcmd = ""
      project = req.project || req.domain || ""
      if (revisions.length != 0) {
        revisions.forEach(function(revision){
          if (revision.current){
            var perm = revision.preview.blue.underline
            var row = [
              perm || project.domain.blue.underline,
              revision.timeAgoInWords.blue.underline,
              revision.email.blue.underline,
              (revision.publicFileCount ? (revision.publicFileCount + " files").underline.blue : ""),
              revision.friendlySize.blue.underline
            ]
            if (process.stdout.columns > terminalBreakpoint) row.push((revision.msg||"").blue)
          } else {
            var perm = revision.preview.grey
            var row = [
              perm || project.domain,
              revision.timeAgoInWords.grey,
              revision.email.grey,
              (revision.publicFileCount ? (revision.publicFileCount + " files").grey : ""),
              revision.friendlySize.grey
            ]
            if (process.stdout.columns > terminalBreakpoint) row.push((revision.msg || "").grey)
          }
          table.push(row)
          lastcmd = project.cmd
        })
        helpers.space()
        helpers.log(table.toString())
      } else {
        helpers.space()
        helpers.trunc(("Empty").grey)
      }
      return next()
    })
  }


  if (!req.domain && isOrg(req.argv["_"][0])) {
    listAllProjects()
  } else if (req.domain || req.argv["_"].length > 0) {
    listSingleProject()
  } else {
    listAllProjects()
  }

  

}

module.exports.row = row
module.exports.isOrg = isOrg


/***/ }),

/***/ 9863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  if (!domain){
    helpers.trunc("domain required".grey)
    return next()
  }
  sdk.analytics(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error || !response) return next(error || "no response from server")
    helpers.displayCurrent(response)
    return next()
  })
  
}

/***/ }),

/***/ 2658:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(6928)
var helpers = __nccwpck_require__(5746)

module.exports = function(req, next){
  helpers.log()
  helpers.trunc( "Success".green + (" - Logged in as " + req.creds.email.underline + ".").grey)
  next()

  //helpers.log("              token: ".grey + req.creds.token)

}


/***/ }),

/***/ 8693:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)
var localCreds  = __nccwpck_require__(5986)
var path = __nccwpck_require__(6928)

module.exports = function(req, next){
  var creds = localCreds(req.endpoint).set(null)

  if (req.creds) {
    var filePath = path.join(process.env[(/^win/.test(process.platform)) ? 'USERPROFILE' : 'HOME'], ".netrc")
    helpers.trunc(("Success").green + (" - Token removed from " + filePath.underline + " file.").grey)
  } else {
    helpers.trunc("Not Authenticated.".grey)
  }

  next()

}


/***/ }),

/***/ 357:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var spawn       = (__nccwpck_require__(5317).spawn)
var surgeSDK    = __nccwpck_require__(9943)
var helpers     = __nccwpck_require__(5746)

// two-factor setup and management happen in the browser — the terminal
// never touches a secret, a code, or a recovery code. This opens the
// ceremony and gets out of the way: the page decides whether you get
// setup (mfa off) or the manage screen (mfa on), and a stolen token
// alone can open the page but never finish either ceremony.
module.exports = function(req, next){
  var sdk = surgeSDK({ endpoint: req.endpoint.format() })

  sdk.mfaSession({ user: "token", pass: req.creds.token }, function(error, session){
    if (error || !session || !session.url){
      helpers.space()
      helpers.trunc("Error".red + " - Could not start a two-factor session. Try again.".grey)
      helpers.space()
      process.exit(1)
    }

    helpers.trunc("Continue in the browser to manage two-factor auth.".grey)
    helpers.space()
    helpers.trunc("        url: ".grey + session.url.underline)

    // best effort — over ssh the url does the work on any browser
    var opener = process.platform === "darwin" ? "open"
      : process.platform === "win32" ? "explorer" : "xdg-open"
    try {
      spawn(opener, [session.url], { stdio: "ignore", detached: true }).on("error", new Function).unref()
    } catch(e){}

    next()
  })
}


/***/ }),

/***/ 7098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var localCreds   = __nccwpck_require__(5986)
var surgeSDK     = __nccwpck_require__(9943)
var path         = __nccwpck_require__(6928)
var pkg          = __nccwpck_require__(8342)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.argv["_"][0]
  var rev     = req.argv["_"][1] || null

  helpers.space()
  sdk.nuke({ user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      helpers.displayErrors(error)
      helpers.space()
      return process.exit(1)
    }

    localCreds(req.endpoint).set(null)
    helpers.trunc(("Success").green + (" - " + response.msg).grey)
    helpers.space()
    return next()
  })

}

/***/ }),

/***/ 888:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Table = __nccwpck_require__(5832)
var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

// target-first inside the namespace, like `surge <proj> <verb>`:
//
//   surge orgs                                        every org you belong to, with its members
//   surge orgs <org>                                  an org: its name, your role
//   surge orgs <org> create [--name <name>]
//   surge orgs <org> rename [<slug>] [--name <name>]
//   surge orgs <org> remove                           refused while it holds domains
//   surge orgs <org> invite [--admin]                 prints a one-time code
//   surge orgs <org> leave                            refused for the last admin
//   surge orgs <org> join <code>                      as whoever is signed in
//
//   surge orgs <org> members                          members and pending invites
//   surge orgs <org> members <email>                  one member
//   surge orgs <org> members <email> revoke           remove a member
//   surge orgs <org> members <email> mkadmin|rmadmin
//
//   surge orgs <org> tokens                           the org's tokens
//   surge orgs <org> tokens add [--domain <domain>] [-m <msg>]
//   surge orgs <org> tokens rem <id>
//
// an org token acts as the org: it publishes the org's domains, claims new
// ones for it, and keeps working whoever leaves or resets a password
//
// an invite is a code and nothing is emailed: whoever invites sends it,
// and any account holding it joins with `surge claim <code>` (`join` is
// the older spelling). `surge scrap <code>` cancels one
//
// every writing command names its org: there is no current org. `list` is
// a silent alias of the bare form, and a reserved slug (rolodex) so it can
// never also be an org

var table = function(){
  return new Table({
    chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
           , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
           , 'left': '  ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
           , 'right': '' , 'right-mid': '' , 'middle': ' ' },
    style: { 'padding-left': 0, 'padding-right': 2 }
  })
}

var day = function(iso){
  return iso ? iso.split("T")[0] : "—"
}

module.exports = function(req, next){

  var argv = req.argv
  var bin  = req.configuration.name
  var target = argv["_"][0] != null ? String(argv["_"][0]) : null
  var verb = argv["_"][1] != null ? String(argv["_"][1]) : null
  var name = argv.name != null && argv.name !== true ? String(argv.name) : null

  // no status handlers: their 403/404 lines are about domains, and an
  // org's refusals carry their own message
  var sdk = surgeSDK({ endpoint: req.endpoint.format() })
  var auth = { user: "token", pass: req.creds.token }

  var success = function(msg, note){
    helpers.space()
    helpers.trunc("Success".green + (" - " + msg).grey)
    if (note) helpers.trunc(note.grey)
    return next()
  }

  var article = function(role){ return role === "admin" ? "an admin" : "a member" }

  // a member, or a pending invite (no name: its code's first word stands in)
  var row = function(m){
    var note = m.pending
      ? ["invited", m.invited_by ? "by " + m.invited_by : null, "expires " + day(m.expires_at)].filter(Boolean).join(" · ")
      : [req.account && m.email === req.account.email ? "you" : null, m.bot ? "bot" : null, m.invited_as ? "invited as " + m.invited_as : null].filter(Boolean).join(" · ")
    return ["  " + (m.email || (m.hint + "…").grey), m.role.grey, note.grey]
  }

  // surge orgs
  if (target === null || (target === "list" && verb === null)){
    return sdk.orgs(auth, function(error, orgs){
      if (error) return next(error)
      helpers.space()
      // nothing to list yet: the way in instead
      if (orgs.length === 0){
        helpers.trunc(("Empty").grey)
        __nccwpck_require__(8940).orgsUsage(bin)
        return next()
      }
      // each org's members, fetched together, printed in the orgs' order
      var rosters = new Array(orgs.length), left = orgs.length
      var print = function(){
        var t = table()
        orgs.forEach(function(org, i){
          if (i > 0) t.push(["", "", ""])
          t.push([org.slug + (org.name !== org.slug ? "  " + org.name.grey : ""), "", ("since " + day(org.created_at)).grey])
          rosters[i].forEach(function(m){ t.push(row(m)) })
        })
        helpers.log(t.toString())
        return next()
      }
      orgs.forEach(function(org, i){
        sdk.orgMembers(org.slug, auth, function(error, list){
          rosters[i] = error ? [] : list
          if (--left === 0) print()
        })
      })
    })
  }

  // surge orgs <org>
  if (verb === null){
    return sdk.org(target, auth, function(error, org){
      if (error) return next(error)
      var count = org.members.length
      helpers.space()
      helpers.trunc(org.slug.underline + (org.name !== org.slug ? "  " + org.name : ""))
      helpers.trunc(("you are " + (org.role === "admin" ? "an admin" : "a member") + " · " + count + (count === 1 ? " member" : " members") + " · since " + day(org.created_at)).grey)
      return next()
    })
  }

  // surge orgs <org> create [--name <name>]
  if (verb === "create"){
    var args = { slug: target }
    if (name) args.name = name
    return sdk.orgCreate(args, auth, function(error, org){
      if (error) return next(error)
      return success("Created org " + org.slug + ". You're its admin.")
    })
  }

  // surge orgs <org> rename [<slug>] [--name <name>]
  if (verb === "rename"){
    var slug = argv["_"][2]
    if (slug == null && !name) return next({ messages: ["give the org a new slug or --name - `" + bin + " orgs " + target + " rename <slug>`"] })
    var changes = {}
    if (slug != null) changes.slug = String(slug)
    if (name) changes.name = name
    return sdk.orgRename(target, changes, auth, function(error, org){
      if (error) return next(error)
      var renamed = changes.slug && target !== org.slug && target !== org.id
      return renamed
        ? success("Renamed " + target + " to " + org.slug + ".", target + " stays reserved for this org for 30 days.")
        : success("Saved " + org.slug + (org.name !== org.slug ? " (" + org.name + ")" : "") + ".")
    })
  }


  // one member, or a pending invite, in a line or two
  var describe = function(m){
    helpers.space()
    helpers.trunc(m.email.underline)
    var line = m.pending
      ? "invited as " + article(m.role) + (m.invited_by ? " by " + m.invited_by : "") + " · expires " + day(m.expires_at)
      : m.role + (m.bot ? " · bot" : "") + (m.invited_as ? " · invited as " + m.invited_as : "")
    helpers.trunc(line.grey)
  }

  // surge orgs <org> invite [--admin] - the code and its claim link,
  // like transfer: the code gets read out, the link opens in a browser
  if (verb === "invite"){
    return sdk.orgInvite(target, argv.admin ? "admin" : null, auth, function(error, invite){
      if (error) return next(error)
      helpers.space()
      helpers.trunc("Invite Code: ".grey + invite.code)
      helpers.trunc("Claim Link:  ".grey + helpers.claimLink(req, invite.code))
      return next()
    })
  }

  // surge orgs <org> join <code>
  if (verb === "join"){
    var code = argv["_"][2]
    if (code == null) return next({ messages: ["the invite's code must be present - `" + bin + " orgs " + target + " join <code>`"] })
    return sdk.orgJoin(target, String(code), auth, function(error, org){
      if (error) return next(error)
      return org.already
        ? success("You're already in " + org.slug + ".", "The code is used up, and nothing changed.")
        : success("Joined " + org.slug + " as " + article(org.role) + ".")
    })
  }

  // surge orgs <org> members [<email> [revoke|mkadmin|rmadmin]]
  if (verb === "members"){
    var who = argv["_"][2] != null ? String(argv["_"][2]) : null
    var act = argv["_"][3] != null ? String(argv["_"][3]) : null

    if (who === null){
      return sdk.orgMembers(target, auth, function(error, list){
        if (error) return next(error)
        helpers.space()
        var t = table()
        list.forEach(function(m){ t.push(row(m)) })
        helpers.log(t.toString())
        return next()
      })
    }

    if (act === null){
      return sdk.orgMember(target, who, auth, function(error, m){
        if (error) return next(error)
        describe(m)
        return next()
      })
    }

    // invites stopped going to an email (2026-10-28)
    if (act === "invite"){
      return next({ messages: ["invites are codes now, for you to send - `" + bin + " orgs " + target + " invite`"] })
    }

    if (act === "revoke"){
      return sdk.orgRevoke(target, who, auth, function(error, m){
        if (error) return next(error)
        if (m.pending) return success("Withdrew the invite to " + m.email + ". Its code no longer works.")
        // the org tokens they added keep publishing: say which, and how
        // to rem one, since they may have kept a copy
        var minted = m.tokens || []
        var note = minted.length
          ? (minted.length === 1 ? "Their org token " : "Their org tokens ") + minted.map(function(t){ return t.id + (t.msg ? " (" + t.msg + ")" : "") }).join(", ") + (minted.length === 1 ? " keeps" : " keep") + " working - `" + bin + " orgs " + target + " tokens rem <id>` to stop one."
          : null
        if (m.email === req.account.email) return success("You left " + target + ".", note)
        return success("Removed " + m.email + " from " + target + ".", note)
      })
    }

    if (act === "mkadmin" || act === "rmadmin"){
      return sdk.orgRole(target, who, act === "mkadmin" ? "admin" : "member", auth, function(error, m){
        if (error) return next(error)
        return success(m.email + (m.pending ? "'s invite is now for " : " is now ") + article(m.role) + " of " + target + ".")
      })
    }

    helpers.space()
    helpers.trunc("Aborted".yellow + (" - `" + act + "` is not a " + bin + " orgs members command. Try `" + bin + " orgs`.").grey)
    helpers.space()
    return process.exit(1)
  }

  // surge orgs <org> tokens [add|rem]
  if (verb === "tokens"){
    var sub = argv["_"][2] != null ? String(argv["_"][2]) : null

    if (sub === null || sub === "list"){
      return sdk.orgTokens(target, auth, function(error, list){
        if (error) return next(error)
        helpers.space()
        if (list.length === 0){
          helpers.trunc(("Empty").grey)
          helpers.trunc(("Add one for CI with `" + bin + " orgs " + target + " tokens add -m ci`").grey)
          return next()
        }
        var t = table()
        list.forEach(function(token){
          t.push([
            "  " + token.id,
            token.scope.length > 0 ? token.scope.join(", ") : "org".blue,
            (token.msg || "").grey,
            ("by " + (token.created_by || "—")).grey,
            (token.uses + "x").grey,
            ("used " + (token.last_used_at ? day(token.last_used_at) : "never")).grey
          ])
        })
        helpers.log(t.toString())
        return next()
      })
    }

    if (sub === "add"){
      var args = {}
      if (argv.message) args.msg = String(argv.message)
      if (argv.domain){
        args.scope = (Array.isArray(argv.domain) ? argv.domain : [argv.domain]).map(function(d){ return String(d) })
      }
      return sdk.orgTokenAdd(target, args, auth, function(error, record){
        if (error) return next(error)
        helpers.space()
        helpers.trunc(record.token)
        helpers.space()
        var details = (record.scope.length > 0 ? "Scoped to " + record.scope.join(", ") : "Org token for " + record.org)
        if (record.msg) details += " — " + record.msg
        helpers.trunc(details.grey)
        helpers.trunc(("It publishes as " + record.org + " and keeps working whoever leaves.").grey)
        return next()
      })
    }

    if (sub === "rem"){
      var id = argv["_"][3]
      if (id == null) return next({ messages: ["token id must be present - `" + bin + " orgs " + target + " tokens rem <id>`"] })
      return sdk.orgTokenRem(target, String(id), auth, function(error){
        if (error) return next(error)
        return success("Token " + id + " removed from " + target + ".")
      })
    }

    helpers.space()
    helpers.trunc("Aborted".yellow + (" - `" + sub + "` is not a " + bin + " orgs tokens command. Try `" + bin + " orgs " + target + " tokens`.").grey)
    helpers.space()
    return process.exit(1)
  }

  // removing the org: refused while it holds domains, which are listed
  var removeOrg = function(done){
    sdk.orgRemove(target, auth, function(error, org){
      if (error){
        if (!error.domains) return next(error)
        helpers.space()
        helpers.trunc("Error".red + (" - " + error.messages[0]).grey)
        error.domains.forEach(function(domain){ helpers.trunc("  " + domain) })
        helpers.space()
        return process.exit(1)
      }
      return done(org)
    })
  }

  // surge orgs <org> leave - yourself. The last member leaving removes the
  // org, as `remove` does (decided 2026-10-28): nobody would be left to act
  // for it or its domains
  if (verb === "leave"){
    return sdk.orgMembers(target, auth, function(error, list){
      if (error) return next(error)
      var others = list.filter(function(m){ return !m.pending && m.email !== req.account.email })
      if (others.length === 0){
        return removeOrg(function(org){
          return success("You left " + org.slug + ". You were its last member, so it's removed.", org.slug + " is free for anyone to use.")
        })
      }
      sdk.orgRevoke(target, req.account.email, auth, function(error){
        if (error) return next(error)
        return success("You left " + target + ".")
      })
    })
  }

  // surge orgs <org> remove
  if (verb === "remove"){
    return removeOrg(function(org){
      return success("Removed org " + org.slug + ".", org.slug + " is free for anyone to use.")
    })
  }

  helpers.space()
  helpers.trunc("Aborted".yellow + (" - `" + verb + "` is not a " + bin + " orgs command. Try `" + bin + " orgs`.").grey)
  helpers.space()
  return process.exit(1)

}


/***/ }),

/***/ 2540:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var url         = __nccwpck_require__(7016)
var helpers     = __nccwpck_require__(5746)
var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var os          = __nccwpck_require__(857)
var prompts     = __nccwpck_require__(7455)
var tables      = __nccwpck_require__(5294)

module.exports = function(req, next, abort){
  
  var choice = function(plan){
    plan.metadata.regions = plan.metadata.regions || ""

    var price   = plan.amount.toString().substring(0, plan.amount.toString().length - 2)

    var shortinter = plan.interval == "year" 
      ? "yr" 
      : "mo"

    var title = plan.name

    // add price
    if (price == "00") {
      title += " Free"
    }else{
      title += " $" + price + "/" + shortinter 
    }

    if (plan.current == true){
      title += "  " + " ★ ★ CURRENT ★ ★ ".inverse
      if (plan.comped){
        title += " (comped by surge)"
      }
    } else {
      if (plan.trial_period_days){
        title += " (" + plan.trial_period_days + " day trial)"
      }
    }

    var features = [title].concat(plan.perks || [])

    return {
      value: plan,
      //title: "   " + features.join("\n       - ") + "\n",
      title: plan.name,
      //plan: plan
    }
  }

  var indexOfCurrent = 0
  for (var i in req.plans.list){
    if (req.plans.list[i].current == true)
      indexOfCurrent = parseInt(i)
  }

  var choices = req.plans.list.map(choice)

  // var args = {
  //   type: 'list',
  //   name: 'plan',
  //   default: indexOfCurrent,
  //   choices: choices,
  //   pageSize: 30,
  //   separator: true
  // }

  // use message if the server gives us one
  // args.message = req.plans.message ? (" "  + req.plans.message.yellow + "\n") : ' '
  //args.message = ' '
  // prompt user to choose a plan



  var questions = {
    type: 'select',
    name: 'plan',
    message: 'Select a Plan',
    initial: indexOfCurrent,
    choices: choices
  }

  //console.log(choices)

  // prompts(questions, { onCancel: new Function, onSubmit: new Function }, function(a,b,c){
  //   console.log()
  //   console.log()
  //   console.log(a)
  //   console.log()
  //   console.log(b)
  //   console.log()
  //   console.log(c)
  //   console.log()
  // })

  var table = tables.plans(choices)
  var rows = table.toString().split("\n")
  rows.forEach(function(row, i){
    helpers.trunc(row.grey)
  })
  helpers.space()

  ;(async () => {
    const response = await prompts({
      type: 'select',
      name: 'plan',
      message: 'Select Account Plan',
      initial: indexOfCurrent,
      choices: choices
    }, { 
      
      onCancel: function(resp){
        console.log()
      }, 
      
      onSubmit: function(resp){
        console.log()
      }

    });

    if (response.plan){
      if (response.plan.comped){
        helpers.gap()
        helpers.trunc(" Done".green  + (" - On " + response.plan.name + " plan, free of charge.").grey)
        helpers.space()
        process.exit()
      }else{
        req.selectedPlan = response.plan
        var p = req.selectedPlan.id.split("-")[0]
        req.plan = p.charAt(0).toUpperCase() + p.slice(1)
        return next()
      }
    }else{
      helpers.trunc(" Aborted".yellow  + (" - No plan selected.").grey)
      helpers.space()
    }

  })();



  // inquirer.prompt([args]).then(function (answers) {
  //   helpers.gap()
  //   if (answers.plan.comped){
  //     helpers.trunc(" Done".green  + (" - On " + answers.plan.name + " plan, free of charge.").grey)
  //     helpers.space()
  //     process.exit()
  //   }
  //   req.selectedPlan = answers.plan
  //   var p = req.selectedPlan.id.split("-")[0]
  //   req.plan = p.charAt(0).toUpperCase() + p.slice(1)
  //   return next()
  // })


}


/***/ }),

/***/ 805:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var args = req.domain && req.argv["_"].indexOf(req.domain) === -1
    ? [req.domain].concat(req.argv["_"])
    : req.argv["_"]

  sdk.revoke(args, { user: "token", pass: req.creds.token }, function(error, reply){
    if (error) {
      return next(error)
    } else {
      helpers.space()
      helpers.trunc("Success".green + " - ".grey + reply.successes.join(", ") + " have been revoked.")
      helpers.space()
      return next()
    }
  })

}


/***/ }),

/***/ 6287:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers  = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain = req.domain

  sdk.rollback(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      return next(error)
    }else{
      if (response.revision && response.former && (response.revision.rev !== response.former.rev)){
        var success = true
      }
      helpers.space()
      if (success){
        helpers.trunc("⟲ Rollback".green)
        //helpers.displayRevisionBasicInfo(response.revision, domain)
        helpers.displayRollbackInfo(response, domain)
        helpers.displayServers(response.instances)
        helpers.trunc("Done!".green + (" - " + domain.underline + " now serving revision " + response.revision.preview.underline).grey)
      }else{
        helpers.trunc("⟲ Rollback (redundant)".yellow)
        // nothing moved, so no edge table - the same as cutover
        helpers.displayRevisionBasicInfo(response.revision, req.domain)
        helpers.trunc("Unchanged".yellow + (" - " + domain.underline + " already serving " + response.revision.preview.underline).grey)
      }
      return next()
    }
  })
  
}

/***/ }),

/***/ 5934:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers  = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain = req.domain

  sdk.rollfore(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error){
      return next(error)
    }else{
      if (response.revision && response.former && (response.revision.rev !== response.former.rev)){
        var success = true
      }
      helpers.space()
      if (success){
        helpers.trunc("⟳ Forward".green)
        //helpers.displayRevisionBasicInfo(response.revision, domain)
        helpers.displayRollforeInfo(response, domain)
        helpers.displayServers(response.instances)
        helpers.trunc("Done!".green + (" - " + domain.underline + " now serving revision " + response.revision.preview.underline).grey)
      }else{
        helpers.trunc("⟳ Forward (redundant)".yellow)
        // nothing moved, so no edge table - the same as cutover
        helpers.displayRevisionBasicInfo(response.revision, req.domain)
        helpers.trunc("Unchanged".yellow + (" - " + domain.underline + " already serving " + response.revision.preview.underline).grey)
      }
      return next()
    }
  })
  
}

/***/ }),

/***/ 7954:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers  = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

// surge scrap <code> - cancels a code (plans/b2b.md, 2026-10-28): an org
// invite, by any member of its org, or a transfer code, by whoever may
// make one for its domain. The code says which, so nothing else is typed

module.exports = function(req, next){

  var bin  = req.configuration.name
  var sdk  = surgeSDK({ endpoint: req.endpoint.format() })
  var auth = { user: "token", pass: req.creds.token }
  var code = req.argv["_"][0] != null ? String(req.argv["_"][0]).trim() : null

  var abort = function(msg){
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - " + msg).grey)
    helpers.space()
    process.exit(1)
  }

  if (!code) return abort("scrap takes a code - `" + bin + " scrap <code>`.")

  sdk.scrap(code, auth, function(error, rsp){
    if (error) return abort((error.messages && error.messages[0]) || error.message || "could not scrap that code")
    helpers.space()
    var what = rsp.scrapped === "invite"
      ? "the invite to " + rsp.org.slug
      : "the transfer code for " + rsp.domain.underline
    helpers.trunc("Success".green + (" - scrapped " + what + ". It no longer works.").grey)
    return next()
  })

}


/***/ }),

/***/ 5717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)
var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var os          = __nccwpck_require__(857)
var surgeSDK    = __nccwpck_require__(9943)
var surgeStream = __nccwpck_require__(9721)
var localCreds  = __nccwpck_require__(5986)

module.exports = function(req, next, abort){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format ? req.endpoint.format() : req.endpoint,
    defaults: helpers.defaults
  }, surgeStream)

  var handshake = sdk.ssl(
    req.pem,
    req.domain,
    { user: "token", pass: req.creds.token },
    { version: req.pkg.version },
    req.argv
  )

  // catch errors
  handshake.on('error', function(d){
    console.log(d)
  })

  // output result
  handshake.on("data", function(payload){
    if (payload.hasOwnProperty("type") && payload["type"] == "collect"){
      // stripe Plan/Price objects no longer carry a display name
      var planName = payload.plan.name || payload.plan.nickname || payload.plan.id
      var msg = "      Project requires the ".blue  + planName.yellow + " plan. ".blue + ("$" + (payload.plan.amount / 100) + "/mo").yellow + " (cancel anytime).".blue
      helpers.log()
      if (payload.hasOwnProperty("perks")) {
        helpers.log(msg += " This plan provides...".blue)
        payload.perks.forEach(function(perk){
          helpers.log(("          - " + perk).blue)
        })
      } else {
        helpers.log(msg)
      }
      if (payload.checkout_url){
        helpers.log(("       Or pay in your browser: ").grey + payload.checkout_url.underline)
        helpers.log()
      }
      helpers.payment(req, payload["stripe_pk"], payload.card)(function(token){
        var fields = { plan: payload.plan.id }
        if (token) fields.token = token

        sdk.plan(req.domain, fields, { user: "token", pass: req.creds.token }, function(errors, rsp){
          if (errors) {
            helpers.space()
            helpers.trunc("Error".red + " - troubles switching plan".grey)
            helpers.space()
          } else {
            helpers.space()
            helpers.trunc(rsp.msg.grey)
            helpers.space()
          }
        })
      })
    } else if (payload.hasOwnProperty("type") && payload["type"] == "subscription"){
      // if (payload.data) {
      //   console.log("               plan:".grey, payload.data.plan.name)
      // } else {
      //   console.log("               plan:".grey, "Free")
      // }
    } else if (payload.hasOwnProperty("type") && payload["type"] == "msg"){
      helpers.space()
      if (payload.payload["status"] == "ok") {
        helpers.trunc("Success".green + (" - " + payload.payload["msg"]).grey)
      } else {
        helpers.trunc("Error".yellow + (" - " + payload.payload["msg"]).grey)
      }
      helpers.space()
    }
  })

  // done
  handshake.on("end", function(){
    // console.log()
    // console.log("   Success!".green, "-", "ssl cert has been added to", req.domain)
    // console.log()
    // process.exit()
  })

  handshake.on("response", function(rsp){
    if (rsp.statusCode == 403) {
      helpers.space()
      if(rsp.headers.hasOwnProperty("reason")){
        helpers.trunc("Aborted".yellow + " - " + rsp.headers["reason"])
      } else {
        helpers.trunc("Aborted".yellow + (" - Unauthorized to aplly ssl to " + req.domain.underline).grey)
      }
      helpers.log()
      process.exit(1)
    } else if (rsp.statusCode == 401) {
      localCreds(req.endpoint).set(null)
      helpers.log()
      if(rsp.headers.hasOwnProperty("reason")){
        helpers.trunc("Aborted".yellow + " - " + rsp.headers["reason"])
      } else {
        helpers.trunc("Aborted".yellow + " - Local token has expired. please try again.".grey)
      }
      helpers.log()
      process.exit(1)
    }
  })

}


/***/ }),

/***/ 6825:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  // who owns it, for anyone who holds it (plans/transfer.md); a domain
  // you don't hold just doesn't get the line
  var owned = null
  var ownerLine = function(){
    if (!owned || !owned.owner) return
    var o = owned.owner
    if (o === "someone else") return helpers.trunc(("owned by someone else").grey)
    if (o.org) return helpers.trunc(("owned by " + o.org.slug + (o.org.name && o.org.name !== o.org.slug ? " (" + o.org.name + ")" : "")).grey)
    if (o.account) return helpers.trunc(("owned by you (" + o.account + ")").grey)
  }

  // no default handlers here: their 403 would end status for a domain
  // that only isn't held
  var plain = surgeSDK({ endpoint: req.endpoint.format() })
  plain.owner(req.domain, { user: "token", pass: req.creds.token }, function(error, reply){
    owned = error ? null : reply
    show()
  })

  var show = function(){
  sdk.status(req.domain, { user: "token", pass: req.creds.token }, function(error, reply){
    if (error) return next(error)
    helpers.space()
    var done = next
    next = function(){ ownerLine(); return done.apply(null, arguments) }

    if (reply.status === "live"){
      var scheme = reply.https ? "https://" : "http://"
      helpers.trunc((req.domain).underline + " is " + "live".green + (" - " + scheme + req.domain).grey)
      return next()
    }

    // published, waiting only on the account's email verification
    if (reply.status === "ready"){
      helpers.trunc((req.domain).underline + " is " + "ready".yellow + " - serves once you verify your email (`surge verify` resends the link)".grey)
      return next()
    }

    if (reply.status === "securing"){
      helpers.trunc((req.domain).underline + " is " + "securing".yellow + " - provisioning the certificate. No action needed.".grey)
      return next()
    }

    // waiting on dns — the one action there ever is
    helpers.trunc((req.domain).underline + " is " + "waiting on dns".yellow + " - point your DNS at surge:".grey)
    helpers.space()
    helpers.trunc(("  CNAME     " + reply.records.cname).grey)
    helpers.trunc(("  A (apex)  " + reply.records.a.join(", ")).grey)
    return next()
  })
  }

}


/***/ }),

/***/ 9587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var url         = __nccwpck_require__(7016)
var helpers     = __nccwpck_require__(5746)
var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var os          = __nccwpck_require__(857)
var parseUrl    = __nccwpck_require__(2543)
var surgeSDK    = __nccwpck_require__(9943)

module.exports = function(req, next, abort){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var remove = function(domain){
    sdk.teardown(domain, { user: "token", pass: req.creds.token }, function(error, info){
      if (error) {
        // the api says why when it can ("only the owner of foo.com can tear it down")
        var why = (error.messages && error.messages[0]) || error.message
        if (why) why = String(why).replace(/\.$/, "")
        helpers.space()
        helpers.trunc("Aborted".yellow + (" - " + (why ? why + "." : "Unable to remove " + domain.underline + ".")).grey)
        helpers.space()
        process.exit(1)
      } else {
        helpers.space()
        helpers.trunc("Success".green + (" - " + domain.underline + " has been removed.").grey)
        helpers.space()
        process.exit()
      }
    })
  }

  return remove(parseUrl(req.domain).host)

}


/***/ }),

/***/ 9802:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path = __nccwpck_require__(6928)
var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

module.exports = function(req, next){

  var argv = req.argv
  var cmd  = argv["_"][0]

  // surge token — print the token in use (original behaviour)
  if (cmd !== "add" && cmd !== "rem" && cmd !== "transfer"){
    helpers.space()
    helpers.trunc(req.creds.token.grey)
    return next()
  }

  // no status handlers: theirs are about domains, and a token's refusals
  // (an org token managing tokens, an unknown id) carry their own message
  var sdk = surgeSDK({ endpoint: req.endpoint.format() })

  var auth = { user: "token", pass: req.creds.token }

  // surge token rem <id>
  if (cmd === "rem"){
    var id = argv["_"][1]
    if (!id) return next({ messages: ["token id must be present"] })
    return sdk.tokenRem(id, auth, function(error){
      if (error) return next(error)
      helpers.space()
      helpers.trunc("Success".green + (" - Token " + id + " removed.").grey)
      return next()
    })
  }

  // surge tokens transfer <id> <org> - the token becomes the org's, its
  // value unchanged, so the pipeline holding it keeps working (as the org)
  if (cmd === "transfer"){
    var tid = argv["_"][1]
    var org = argv["_"][2]
    if (!tid || !org) return next({ messages: ["token id and org must be present - `" + req.configuration.name + " tokens transfer <id> <org>`"] })
    return sdk.tokenTransfer(String(tid), String(org), auth, function(error, record){
      if (error) return next(error)
      helpers.space()
      helpers.trunc("Success".green + (" - Token " + record.id + " now belongs to " + record.org + ".").grey)
      helpers.trunc(("Its value is unchanged. It publishes " + record.org + "'s domains and no longer reaches yours.").grey)
      return next()
    })
  }

  // surge token add [--domain <domain>] [-m "..."]
  var args = {}
  if (argv.message) args.msg = String(argv.message)
  if (argv.domain){
    args.scope = (Array.isArray(argv.domain) ? argv.domain : [argv.domain]).map(function(d){
      return String(d)
    })
  }

  sdk.tokenAdd(args, auth, function(error, record){
    if (error) return next(error)
    helpers.space()
    helpers.trunc(record.token)
    helpers.space()
    var details = record.scope.length > 0
      ? "Scoped to " + record.scope.join(", ")
      : "Full account token"
    if (record.msg) details += " — " + record.msg
    helpers.trunc(details.grey)
    return next()
  })

}


/***/ }),

/***/ 553:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var Table = __nccwpck_require__(5832)
var helpers = __nccwpck_require__(5746)
var surgeSDK = __nccwpck_require__(9943)

var day = function(iso, fallback){
  return iso ? iso.split("T")[0] : fallback
}

module.exports = function(req, next){

  // no status handlers: theirs are about domains, and a token's refusals
  // (an org token managing tokens, an unknown id) carry their own message
  var sdk = surgeSDK({ endpoint: req.endpoint.format() })

  sdk.tokens({ user: "token", pass: req.creds.token }, function(error, tokens){
    if (error) return next(error)

    if (tokens.length === 0){
      helpers.space()
      helpers.trunc(("Empty").grey)
      return next()
    }

    var table = new Table({
      chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
             , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
             , 'left': '  ' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
             , 'right': '' , 'right-mid': '' , 'middle': ' ' },
      style: { 'padding-left': 0, 'padding-right': 2 }
    })

    tokens.forEach(function(token){
      table.push([
        token.id,
        token.scope.length > 0 ? token.scope.join(", ") : "account".blue,
        (token.msg || "").grey,
        (token.uses + "x").grey,
        (day(token.created_at, "—")).grey,
        ("used " + day(token.last_used_at, "never")).grey
      ])
    })

    helpers.space()
    helpers.log(table.toString())
    return next()
  })

}


/***/ }),

/***/ 8246:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  helpers.space()
  if (!domain){
    helpers.trunc("domain required".grey)
    return next()
  }
  sdk.analytics(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error || !response) return next(error || "no response from server")
    helpers.displayTraffic(response)
    return next()
  })
  
}

/***/ }),

/***/ 4092:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers  = __nccwpck_require__(5746)
var parseUrl = __nccwpck_require__(2543)
var surgeSDK = __nccwpck_require__(9943)

// moving a domain's owner (plans/transfer.md):
//
//   surge <domain> transfer            a code whoever claims it takes it with
//   surge <domain> transfer <org>      into an org you're in
//   surge <domain> transfer <email>    to your own account, out of an org
//   surge transfer <domain> <org>      the verb-first spelling
//
// the code is the only way to hand a domain to another person: they run
// `surge claim <code>`. A new code each time; the last stops working

module.exports = function(req, next){

  var sdk    = surgeSDK({ endpoint: req.endpoint.format() })
  var auth   = { user: "token", pass: req.creds.token }
  var domain = parseUrl(req.domain).host
  var to     = req.argv["_"][0] != null ? String(req.argv["_"][0]) : null

  var abort = function(error, fallback){
    // most refusals carry messages; the api's permission check sends
    // message alone ("You don't have permission to alter this domain.")
    var why = error && ((error.messages && error.messages[0]) || error.message)
    helpers.space()
    helpers.trunc("Aborted".yellow + (" - " + (why || fallback)).grey)
    helpers.space()
    process.exit(1)
  }

  var label = function(owner){
    if (!owner) return "?"
    if (owner.org) return owner.org.name && owner.org.name !== owner.org.slug ? owner.org.slug + " (" + owner.org.name + ")" : owner.org.slug
    return owner.account + " (your account)"
  }

  if (to === null){
    return sdk.transferCode(domain, auth, function(error, rsp){
      if (error) return abort(error, "could not make a transfer code for " + domain)
      // the code, then the link a person opens to claim it in a browser
      // (2026-11-02, plans/claim.md): the code is what gets read out, the
      // link is what an agent hands to someone without a terminal
      helpers.space()
      helpers.trunc("Transfer Code: ".grey + rsp.code)
      helpers.trunc("Claim Link:    ".grey + helpers.claimLink(req, rsp.code))
      return next()
    })
  }

  sdk.transfer(domain, to, auth, function(error, rsp){
    if (error) return abort(error, "could not transfer " + domain)
    helpers.space()
    if (rsp.unchanged){
      helpers.trunc("Success".green + (" - " + domain.underline + " already belongs to " + label(rsp.owner) + ".").grey)
      return next()
    }
    helpers.trunc("Success".green + (" - " + domain.underline + " transferred to " + label(rsp.owner) + ".").grey)
    var notes = []
    if (rsp.owner && rsp.owner.org) notes.push("Every member of " + rsp.owner.org.slug + " can publish to it and tear it down.")
    if (rsp.from && rsp.from.org) notes.push("Members of " + rsp.from.org.slug + " no longer reach it, and have been emailed.")
    notes.push("Serving is unchanged.")
    ;(rsp.collaborators || []).forEach(function(email){
      notes.push(email + " still publishes here as a collaborator" + (rsp.owner && rsp.owner.org ? " - invite them to " + rsp.owner.org.slug : "") + ".")
    })
    if (rsp.limits) notes.push(rsp.limits + ".")
    notes.forEach(function(n){ helpers.trunc(n.grey) })
    return next()
  })

}


/***/ }),

/***/ 8376:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var helpers      = __nccwpck_require__(5746)
var surgeSDK     = __nccwpck_require__(9943)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format(),
    defaults: helpers.defaults
  })

  var domain  = req.domain
  var rev     = req.argv["_"][0] || null

  if (!domain){
    helpers.trunc("domain required".grey)
    return next()
  }
  sdk.analytics(domain, { user: "token", pass: req.creds.token }, function(error, response){
    if (error || !response) return next(error || "no response from server")
    helpers.displayUsage(response)
    return next()
  })
  
}

/***/ }),

/***/ 2053:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var surgeSDK    = __nccwpck_require__(9943)
var helpers     = __nccwpck_require__(5746)

module.exports = function(req, next){

  var sdk = surgeSDK({
    endpoint: req.endpoint.format()
  })

  sdk.verification({ user: "token", pass: req.creds.token }, function(error, reply){
    if (error){
      var msg = (error.messages && error.messages[0]) || error.error || "could not send verification email"
      helpers.space()
      helpers.trunc("Error".red + (" - " + msg).grey)
      helpers.space()
      process.exit(1)
    }

    helpers.space()
    if (reply.verified === true){
      helpers.trunc("Success".green + (" - " + (reply.email || req.creds.email) + " is already verified.").grey)
    } else if (reply.sent === true){
      helpers.trunc("Email sent".green + (" - follow the link sent to " + (reply.email || req.creds.email) + " to verify.").grey)
    } else {
      helpers.trunc("Hold on".yellow + (" - " + (reply.msg || "verification email already sent. Check your inbox.")).grey)
    }
    helpers.space()
    return next()
  })

}


/***/ }),

/***/ 3182:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var helpers     = __nccwpck_require__(5746)
var creds     = __nccwpck_require__(5986)

// not authenticated exits 1 - whoami is the "check auth first" step a
// pipeline or agent runs, and it must fail when there is no identity
module.exports = function(req, next){
  if (req.creds && req.creds.token) {
    helpers.fetchAccount(req.endpoint)(req.creds.email, req.creds.token, function(error, account){
      if (account){
        req.account = account
        helpers.space()
        var str = req.account.email.underline.grey
        if (req.account.plan){
          str = str + (" - " + req.account.plan.name).grey
          if (req.account.plan.comped === true){
            str = str + " (comped by surge)".grey
          }
        }
        helpers.trunc(str)
        // the token in use, by id - an agent can check it holds a scoped
        // token without printing the secret (older apis send no token)
        if (req.account.token){
          var scope = req.account.token.scope || []
          var reach = req.account.token.org ? "org token for " + req.account.token.org : "full account"
          helpers.trunc((req.account.token.id + " · " + (scope.length > 0 ? "scoped to " + scope.join(", ") : reach)).grey)
        }

        helpers.space()
        return next()
      } else {
        // a rejected SURGE_TOKEN/--token says nothing about the saved
        // login, so only a stale saved token is cleared
        if (!req.passintoken) creds(req.endpoint).set(null)
        helpers.space()
        helpers.trunc(req.passintoken ? "Not Authenticated - token rejected.".grey : "Not Authenticated!".grey)
        helpers.space()
        process.exit(1)
      }
    })
  } else {
    helpers.space()
    helpers.trunc("Not Authenticated".grey)
    helpers.space()
    process.exit(1)
  }

}


/***/ }),

/***/ 3932:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


// load help first so we can display and exit quickly
var help            = __nccwpck_require__(8940)

// modules
var fs              = __nccwpck_require__(9896)
var read            = __nccwpck_require__(978)
var minimist        = __nccwpck_require__(994)

// utils
var helpers         = __nccwpck_require__(5746)
var skin            = __nccwpck_require__(9482)

// mini-libs that return middleware
var auth            = __nccwpck_require__(4988)
var browserLogin    = __nccwpck_require__(5075)
var discovery       = __nccwpck_require__(894)

// middleware
var whitelist       = __nccwpck_require__(1368)
var endpoint        = __nccwpck_require__(8568)
var pkg             = __nccwpck_require__(835)
var version         = __nccwpck_require__(5197)
var welcome         = __nccwpck_require__(597)
var creds           = __nccwpck_require__(1372)
var project         = __nccwpck_require__(8636)
var size            = __nccwpck_require__(327)
var protocol        = __nccwpck_require__(9369)
var pemOrSilent     = __nccwpck_require__(6115)
var ipaddress       = __nccwpck_require__(5230)
var shorthand       = __nccwpck_require__(2874)
var plans           = __nccwpck_require__(5661)
var payment         = __nccwpck_require__(2731)
var setcard         = __nccwpck_require__(5099)
var subscribe       = __nccwpck_require__(6733)
var weblinks        = __nccwpck_require__(7210)
var log             = __nccwpck_require__(7995)

// also middleware but contains main functionality for command
var logout          = __nccwpck_require__(8693)
var login           = __nccwpck_require__(2658)
var whoami          = __nccwpck_require__(3182)
var mfa             = __nccwpck_require__(357)
var deploy          = __nccwpck_require__(8348)
var list            = __nccwpck_require__(6971)
var token           = __nccwpck_require__(9802)
var tokens          = __nccwpck_require__(553)
var orgs            = __nccwpck_require__(888)
var status          = __nccwpck_require__(6825)
var teardown        = __nccwpck_require__(9587)
var transfer        = __nccwpck_require__(4092)
var claim           = __nccwpck_require__(9287)
var scrap           = __nccwpck_require__(7954)
var plan            = __nccwpck_require__(2540)
var card            = __nccwpck_require__(7723)
var ssl             = __nccwpck_require__(5717)
var rollback        = __nccwpck_require__(6287)
var rollfore        = __nccwpck_require__(5934)
var cutover         = __nccwpck_require__(2577)
var bust            = __nccwpck_require__(2429)
var traffic         = __nccwpck_require__(8246)
var load            = __nccwpck_require__(9863)
var audience        = __nccwpck_require__(5021)
var usage           = __nccwpck_require__(8376)
var audit           = __nccwpck_require__(5024)
var discard         = __nccwpck_require__(6449)
var invite          = __nccwpck_require__(6246)
var revoke          = __nccwpck_require__(805)
var encrypt         = __nccwpck_require__(342)
var certs           = __nccwpck_require__(8716)
var dns             = __nccwpck_require__(6560)
var config          = __nccwpck_require__(9869)
var files           = __nccwpck_require__(4016)
var nuke            = __nccwpck_require__(7098)
var verify          = __nccwpck_require__(2053)



var exitifcurrentplan = function(req, next){
  if (req.plans.current && req.plans.current.id === req.selectedPlan.id){
    helpers.trunc("Success".green + (" - You remain on the " + req.plans.current.name.underline + " plan.").grey)
    helpers.space()
    process.exit()
  }else{
    return next()
  }
}


var space = function(req, next){ 
  helpers.space()
  next() 
}

var parse = function(arg){
  if(arg.hasOwnProperty("parent") && arg.parent.hasOwnProperty("rawArgs")){
    arg = arg.parent.rawArgs.slice(3)
  } else if (arg.argv && arg.argv._) {
    arg = arg.parsed.argv._.slice(1)
  }
  return arg instanceof Array
    ? minimist(arg)
    : arg
}

module.exports = function(configuration){
  configuration = configuration || {}

  var ep = configuration.endpoint
    ? configuration.endpoint
    : configuration.platform ? "https://surge." + configuration.platform : 'https://surge.surge.sh'

  configuration.platform = configuration.platform || "surge.sh"
  configuration.name = configuration.name || "surge"

  var options = {
    alias: {
      p: 'project',
      d: 'domain',
      e: 'endpoint',
      a: 'add',
      r: 'remove',
      s: 'stage',
      m: 'message'
    },
    default: { e: ep, s: false }
  }

  var authInfo = function(req, next){
    var str = ("Running as " + req.account.email.underline).grey
    if (req.account.plan){ str = str + (" (" + req.account.plan.name + ")").grey }
    helpers.space()
    helpers.trunc(str)
    helpers.space()
    return next()
  }

  var surge = function(args){
    // will be one of:
    // commander, yargs, process.argv.split(2), OR minimist

    var argv = minimist(args, options)
    var cmd  = argv._[0] != null ? String(argv._[0]) : null

    // we accept --preview
    if (argv.preview) argv.stage = argv.s = argv.preview

    // --private / --public write the same domain setting; both at once
    // is a contradiction we refuse rather than resolve
    if (argv.private !== undefined && argv.public !== undefined){
      helpers.log()
      helpers.trunc("Aborted".yellow + " - use `--private` or `--public`, not both.".grey).hr()
      return process.exit(1)
    }
    if (argv.public !== undefined){
      argv.private = false
      delete argv.public
    }

    var commands = [
      "login", 
      "logout", 
      "whoami",
      "verify",
      "mfa",
      "list",
      "revs",
      "rollback",
      "rollfore",
      "cutover", 
      "discard", 
      "publish",
      "deploy",
      "teardown",
      "transfer",
      "claim",
      "scrap",
      "status",
      "token",
      "tokens",
      "orgs",
      "ssl",
      "plan", 
      "card",
      "invite",
      "revoke",
      "encrypt",
      "config",
      "dns",
      "zone",
      "debug",
      "stats",
      "account",
      "certs",
      "files",
      "audit",
      "bust",
      "usage",
      "traffic",
      "load",
      "audience",
      "nuke",
      ]

    // verbs that operate on a <proj> target (domain | path | cwd)
    var targetable = [
      "publish", "config", "revs", "rollback", "rollfore", "cutover",
      "discard", "invite", "revoke", "teardown", "transfer", "dns", "debug", "stats",
      "list", "ssl", "zone",
      "status", "files", "audit", "bust", "certs", "encrypt",
      "traffic", "load", "audience", "usage"
    ]

    // both grammars are first-class and dispatch silently. the verb-first
    // forms (`surge status example.com`, `surge token add`) and the flat
    // debug/stats verbs keep working forever alongside their target-first
    // and namespaced spellings - help and docs teach the canonical form,
    // the router never nags. identity verbs are flat by nature: they say
    // who is typing, not what to do to a project, so `surge account
    // whoami` is simply an alias of `surge whoami`.

    // flags that state publish intent: a domain to publish to, or a
    // modifier that has no meaning outside publish. a domain given as
    // `-d example.com` is intent exactly like the positional pair, so
    // these route to publish rather than to the verbless overview.
    var publishIntent = function(){
      return !!(argv.domain || argv.project || argv.stage ||
                argv.message || argv.add || argv.remove || argv.build ||
                argv.private !== undefined)
    }

    var isDomainish = function(s){
      return s.indexOf("@") === -1 && (!!helpers.splitOrg(s) || helpers.validDomain(s))
    }
    var isForcedPath = function(s){
      return s === "." || s === ".." || s.indexOf("./") === 0 || s.indexOf("../") === 0 ||
             s.indexOf("/") === 0 || s.indexOf("~") === 0
    }
    var isPathish = function(s){
      return isForcedPath(s) || fs.existsSync(s)
    }
    // a file that exists is never a domain target - page.html looks like a
    // domain but names the thing to publish. a directory keeps today's
    // reading: projects are often named after their domain
    var isFile = function(s){
      try { return fs.statSync(s).isFile() } catch(e) { return false }
    }

    var abort = function(msg){
      helpers.space()
      helpers.trunc("Aborted".yellow + (" - " + msg).grey)
      helpers.space()
      return process.exit(1)
    }

    var wantsHelp = !!(argv.help || argv.h)

    // surge help [verb] - one command's usage, or the overview
    if (cmd === "help"){
      var asked = argv._[1] != null ? String(argv._[1]) : null
      if (asked){
        if (help.verb(configuration.name, asked)) return
        return abort("`" + asked + "` is not a surge command. Try `" + configuration.name + " --help`.")
      }
      argv._ = []
      argv.help = true
      return skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, [whitelist, pkg, help])
    }

    // verb-first: the target is implied (cwd) unless a domain or path
    // follows - each middleware parses that shape itself
    if (cmd && commands.indexOf(cmd) !== -1) {
      if (wantsHelp){
        var after = argv._[1] != null ? String(argv._[1]) : null
        var target = after && (isForcedPath(after) || isDomainish(after)) ? after : null
        if (help.verb(configuration.name, cmd, target)) return
      }
      argv._.shift()
      return surge[cmd]({})(argv)
    }

    // plus was the per-project plan - retired in favour of account plans
    if (cmd === "plus"){
      return abort("the Plus plan is legacy. Manage your plan with `" + configuration.name + " plan`.")
    }

    // library consumers may route anything unrecognized to one command
    if (configuration.default && commands.indexOf(configuration.default) !== -1){
      return surge[configuration.default]({})(argv)
    }

    // target-first: surge <proj> <verb> [args]
    if (cmd){
      var domainT = !isForcedPath(cmd) && !isFile(cmd) && isDomainish(cmd)
      var pathT   = !domainT && isPathish(cmd)

      if (domainT || pathT){
        var verb = argv._[1] != null ? String(argv._[1]) : null

        // the publish pair - surge <path> <domain>, where `_` asks for a
        // generated domain with no prompt
        if (pathT && verb && (isDomainish(verb) || verb === "_")){
          if (wantsHelp && help.verb(configuration.name, "publish")) return
          return surge.publish({})(argv)
        }

        if (wantsHelp && verb && commands.indexOf(verb) !== -1 && help.verb(configuration.name, verb, cmd)) return

        // surge <path> publish - the constructor, no project required yet.
        // publish takes a path, never a domain - a domain has nothing to
        // upload; the pair covers publishing the cwd to a domain.
        // deploy is a silent alias for publish.
        if (verb === "publish" || verb === "deploy"){
          if (domainT){
            return abort(verb + " takes a path - try `" + configuration.name + " <path> " + cmd + "`.")
          }
          argv._.splice(1, 1)
          return surge.publish({})(argv)
        }

        // a path target carrying publish-intent flags is a publish -
        // `surge ./dist -d example.com` states its domain, and
        // --preview/-m/--build mean nothing anywhere else
        if (pathT && !verb && publishIntent()){
          return surge.publish({})(argv)
        }

        // verbless never acts - overview in a terminal (even for a
        // directory that is not a project yet - the help carries the
        // note), loud in a pipeline
        if (!verb){
          return skin({
            configuration: configuration,
            argv: argv,
            read: read
          }, [whitelist, pkg, function(req, next){
            if (!process.stdout.isTTY && !req.argv.help && !req.argv.h){
              var hint = domainT
                ? "`" + configuration.name + " <path> " + cmd + "`"
                : "`" + configuration.name + " " + cmd + " publish`"
              console.error(configuration.name + ": nothing to do - try " + hint + " or `" + configuration.name + " " + cmd + " <command>`")
              return process.exit(1)
            }
            req.argv.help = true
            return help(req, function(){})
          }])
        }

        // a verb against a path target requires a surge project
        if (pathT && !discovery.local(cmd)){
          if (!fs.existsSync(cmd)) return abort("`" + cmd + "` - no such directory.")
          return abort("`" + cmd + "` is not a surge project - publish first or pass a domain.")
        }

        if (commands.indexOf(verb) !== -1 && targetable.indexOf(verb) !== -1){
          argv._.splice(1, 1)
          return surge[verb]({})(argv)
        }

        if (commands.indexOf(verb) !== -1){
          return abort("`" + verb + "` does not take a project - try `" + configuration.name + " " + verb + "`.")
        }

        return abort("`" + verb + "` is not a surge command. Try `" + configuration.name + " --help`.")
      }

      // publish flags mean the positional was meant as a project path,
      // so let publish report it missing rather than calling a failed
      // build directory a bad command
      if (publishIntent()) return surge.publish({})(argv)

      return abort("`" + cmd + "` is not a surge command. Try `" + configuration.name + " --help`.")
    }

    // flag-style publish (CI: surge -p ./dist -d example.com, or bare
    // flags against the cwd: surge --preview)
    if (publishIntent()){
      return surge.publish({})(argv)
    }

    // bare surge - help in a terminal, a loud pointer in a pipeline
    skin({
      configuration: configuration,
      argv: argv,
      read: read
    }, [whitelist, pkg, version, function(req){
      if (process.stdout.isTTY || req.argv.help || req.argv.h){
        req.argv.help = true
        return help(req, function(){})
      }
      console.error("surge requires a path - try `surge <path> <domain>` or `surge --help`")
      process.exit(1)
    }])
  }

  var stub = function(req, next){ 
    return next(); 
  }

  surge.token = function(hooks){
    var hooks = hooks || {}
    var preAuth     = hooks.preAuth       || stub
    var postAuth    = hooks.postAuth      || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      token, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  // tokens namespace - all•add•rem, bare = all. add/rem ride the token
  // machinery, which reads the verb from argv._[0] itself
  surge.tokens = function(hooks){
    var hooks = hooks || {}
    var preAuth     = hooks.preAuth       || stub
    var postAuth    = hooks.postAuth      || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      tokens, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      var verb = argv._[0] != null ? String(argv._[0]) : null

      if (verb === null) return help.tokensUsage(configuration.name)

      if (verb === "add" || verb === "rem" || verb === "transfer") return surge.token(hooks)(argv)

      // list is the read verb everywhere - all stays a silent alias
      if (verb !== "list" && verb !== "all"){
        helpers.space()
        helpers.trunc("Aborted".yellow + (" - `" + verb + "` is not a " + configuration.name + " tokens command. Try `" + configuration.name + " --help`.").grey)
        helpers.space()
        return process.exit(1)
      }

      argv._.shift()
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  // orgs namespace - target-first inside it: `surge orgs <org> <verb>`.
  // bare = every org the account belongs to
  surge.orgs = function(hooks){
    var hooks = hooks || {}
    var preAuth     = hooks.preAuth       || stub
    var postAuth    = hooks.postAuth      || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      orgs, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.login = function(hooks){
    var hooks = hooks || {}
    var preAuth     = hooks.preAuth       || stub
    var postAuth    = hooks.postAuth      || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, browserLogin, auth, postAuth,
      login, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.logout = function(hooks){
    var hooks = hooks || {}
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      creds, logout, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.publish = function(hooks){
    var hooks = hooks || {}
    var preAuth     = hooks.preAuth       || stub
    var postAuth    = hooks.postAuth      || stub
    var preProject  = hooks.preProject    || stub
    var postProject = hooks.postProject   || stub
    var preSize     = hooks.preSize       || stub
    var postSize    = hooks.postSize      || stub
    var preDomain   = hooks.preDomain     || stub
    var postDomain  = hooks.postDomain    || stub
    var prePublish  = hooks.prePublish    || stub
    var postPublish = hooks.postPublish   || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, authInfo, postAuth, shorthand,
      preProject, project, postProject,
      preDomain, discovery.resolve({ positional: false, prompt: true, generate: true, log: true }), protocol, postDomain,
      preSize, size, postSize,
      prePublish, deploy, postPublish, ipaddress
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.mfa = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      mfa, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.whoami = function(hooks){
    var hooks = hooks || {}
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      creds, whoami
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.verify = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, postAuth,
      verify
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.list = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, postAuth, shorthand,
      list, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.rollback = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), rollback, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.rollfore = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), rollfore, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.cutover = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), cutover, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.discard = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), discard, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.bust = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), bust, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.traffic = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), traffic, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.load = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), load, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.audience = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), audience, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.usage = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), usage, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.files = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), files, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.audit = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), audit, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.status = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      shorthand, discovery.resolve({ prompt: true }),
      status, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.teardown = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      shorthand, discovery.resolve({ prompt: true }),
      teardown, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.transfer = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      discovery.resolve({ extras: true }), transfer, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.claim = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      claim, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.scrap = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      scrap, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.plan = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, postAuth,
      weblinks,
      shorthand, discovery.setDomainFromArgs,
      plans, plan, exitifcurrentplan,
      payment, subscribe,
      space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.card = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, postAuth,
      plans, card, setcard,
      space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.nuke = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, welcome, auth, postAuth,
      nuke, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.ssl = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      shorthand, discovery.resolve({ prompt: true }),
      pemOrSilent, ssl, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.invite = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      discovery.resolve({ extras: true }), invite, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.revoke = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      discovery.resolve({ extras: true }), revoke, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.encrypt = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, authInfo, postAuth,
      discovery.resolve({ extras: true }), encrypt, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.certs = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      discovery.resolve({ extras: true }), certs, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.config = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      endpoint, pkg, help, version, space,
      preAuth, creds, auth, postAuth,
      discovery.resolve({ extras: true }), config, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  // dns namespace - [<domain>] all•add•rem, bare = all. normalizes to
  // the legacy domain-first shape the dns middleware parses itself
  surge.dns = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, auth, postAuth,
      dns("dns"), space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      var verbs = ["list", "all", "add", "rem"]
      var a0 = argv._[0] != null ? String(argv._[0]) : null

      // bare noun shows its usage - rendered against the cwd
      if (!a0) return help.dnsUsage(configuration.name, discovery.local(), null)

      if (verbs.indexOf(a0) !== -1){
        // verb leads - the target is the cwd
        var local = discovery.local()
        if (!local){
          helpers.space()
          helpers.trunc("Aborted".yellow + " - No domain found - pass a domain or publish first.".grey)
          helpers.space()
          return process.exit(1)
        }
        argv._.unshift(local.domain)
      } else {
        // <proj> leads - resolve it, exiting when a path is no project
        var ctx = targetContext(a0)
        argv._[0] = ctx.domain

        // verbless never acts - usage against the typed target
        if (argv._[1] == null){
          return help.dnsUsage(configuration.name, ctx, a0)
        }
        if (verbs.indexOf(String(argv._[1])) === -1){
          helpers.space()
          helpers.trunc("Aborted".yellow + (" - `" + String(argv._[1]) + "` is not a " + configuration.name + " dns command. Try `" + configuration.name + " --help`.").grey)
          helpers.space()
          return process.exit(1)
        }
      }

      // list (and its silent alias all) is the bare read in the legacy shape
      if (argv._[1] != null && (String(argv._[1]) === "list" || String(argv._[1]) === "all")) argv._.splice(1, 1)

      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  surge.zone = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version,
      preAuth, creds, auth, postAuth,
      dns("zone"), space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  // target-first namespace parse: [<proj>] <verb>. no verb means usage -
  // verbless never acts. garbage that is neither verb, domain, nor path
  // exits loudly.
  var namespaceParse = function(argv, verbs, label){
    var a0 = argv._[0] != null ? String(argv._[0]) : null
    var a1 = argv._[1] != null ? String(argv._[1]) : null

    if (a0 && verbs.indexOf(a0) !== -1){
      argv._.shift()
      return { verb: a0 }
    }
    if (a1 && verbs.indexOf(a1) !== -1){
      argv._.splice(1, 1)
      return { verb: a1 }
    }
    if (a0 && !helpers.validDomain(a0) && a0.indexOf("/") === -1 && a0.indexOf(".") !== 0 && !fs.existsSync(a0)){
      helpers.space()
      helpers.trunc("Aborted".yellow + (" - `" + a0 + "` is not a " + configuration.name + " " + label + " command. Try `" + configuration.name + " --help`.").grey)
      helpers.space()
      return process.exit(1)
    }
    return { usage: true, typed: a0 }
  }

  // resolves a typed target for a usage screen - a domain is itself, a
  // path must be a surge project, nothing typed falls back to the cwd
  var targetContext = function(typed){
    if (!typed) return discovery.local()
    if (typed.indexOf("@") === -1 && helpers.validDomain(typed) &&
        !(typed === "." || typed === ".." || typed.indexOf("./") === 0 || typed.indexOf("../") === 0 || typed.indexOf("/") === 0)){
      return { domain: typed, source: "arg" }
    }
    var found = discovery.local(typed)
    if (!found){
      var msg = fs.existsSync(typed)
        ? "`" + typed + "` is not a surge project - publish first or pass a domain."
        : "`" + typed + "` - no such directory."
      helpers.space()
      helpers.trunc("Aborted".yellow + (" - " + msg).grey)
      helpers.space()
      return process.exit(1)
    }
    return { domain: found.domain, source: found.source, at: typed }
  }

  surge.revs = function(hooks){
    var hooks = hooks || {}
    var preAuth   = hooks.preAuth  || stub
    var postAuth  = hooks.postAuth || stub
    var onion = [
      whitelist, endpoint, pkg, help, version, space,
      preAuth, creds, welcome, auth, postAuth,
      discovery.resolve({ extras: true }), list, space
    ]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      skin({
        configuration: configuration,
        argv: argv,
        read: read
      }, onion)
    }
  }

  // debug namespace - [<proj>] status·files·audit·bust·certs·encrypt
  surge.debug = function(hooks){
    var verbs = ["status", "files", "audit", "bust", "certs", "encrypt"]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      var parsed = namespaceParse(argv, verbs, "debug")
      if (parsed.usage) return help.debugUsage(configuration.name, targetContext(parsed.typed), parsed.typed)
      return surge[parsed.verb](hooks || {})(argv)
    }
  }

  // stats namespace - [<proj>] traffic·load·audience·usage
  surge.stats = function(hooks){
    var verbs = ["traffic", "load", "audience", "usage"]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      var parsed = namespaceParse(argv, verbs, "stats")
      if (parsed.usage) return help.statsUsage(configuration.name, targetContext(parsed.typed), parsed.typed)
      return surge[parsed.verb](hooks || {})(argv)
    }
  }

  // account namespace - whoami·login·logout·verify·card·plan·nuke,
  // bare = usage. `surge plan` stays a silent alias for the
  // money path.
  surge.account = function(hooks){
    var hooks = hooks || {}
    var verbs = ["whoami", "login", "logout", "verify", "card", "plan", "nuke", "mfa"]
    return function(){
      var argv = parse(arguments[arguments.length -1])
      var verb = argv._[0] != null ? String(argv._[0]) : null

      if (verb === null) return help.accountUsage(configuration.name)

      if (verbs.indexOf(verb) !== -1){
        argv._.shift()
        return surge[verb](hooks)(argv)
      }

      helpers.space()
      helpers.trunc("Aborted".yellow + (" - `" + verb + "` is not a " + configuration.name + " account command. Try `" + configuration.name + " --help`.").grey)
      helpers.space()
      return process.exit(1)
    }
  }

  // deploy is a silent alias for publish - the vocabulary word stays
  // publish everywhere user-visible
  surge.deploy = surge.publish

  return surge

}


/***/ }),

/***/ 1340:
/***/ ((__unused_webpack_module, exports) => {

/**
 * client
 *
 * The User-Agent a publish sends: the CLI and how it was called - where
 * the credential came from, whether CI is set, whether a person's
 * terminal is attached, npx or an installed copy, and the agent running
 * it, if a known one is.
 *
 *   surge/0.54.0 (auth=env; ci=0; tty=0; via=npx; agent=claude-code)
 *
 * Disclosed in the docs (surge.sh/docs/cli/what-surge-sends). The rule
 * that keeps it there: names and 0/1 only. Never a value from the
 * environment, a path, a hostname, or the credential - a new field that
 * would carry one needs a new decision, not a new line here.
 *
 * Without it an agent publishing with someone's SURGE_TOKEN looks like
 * any other login (slushi plans/grok.md).
 */

// an env var each agent sets in the shells it runs, first match wins.
// AI_AGENT is the open convention: its value names the agent, as
// name_version_kind (claude-code_2-1-300_agent) - only the name is sent
var AGENTS = [
  ["claude-code", "CLAUDECODE"],
  ["cursor",      "CURSOR_AGENT"],
  ["gemini",      "GEMINI_CLI"],
  ["codex",       "CODEX_SANDBOX"],
  ["replit",      "REPL_ID"],
  ["e2b",         "E2B_SANDBOX"]
]

var envOn = function(env, name){
  var val = env[name]
  return !!val && !/^(false|0)$/i.test(val)
}

var agentOf = function(env){
  if (env.AI_AGENT){
    var named = String(env.AI_AGENT).split(/[_\/@]/)[0].toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24)
    if (named) return named
  }
  for (var i = 0; i < AGENTS.length; i++){
    if (envOn(env, AGENTS[i][1])) return AGENTS[i][0]
  }
  return null
}

// argv.token → flag, SURGE_TOKEN → env, otherwise the saved login
exports.authOf = function(argv, env){
  if (argv && argv.token) return "flag"
  if (env.SURGE_TOKEN || env.TRAVIS_SURGE_TOKEN) return "env"
  return "netrc"
}

exports.userAgent = function(version, argv, env, isTTY){
  env = env || process.env
  var parts = [
    "auth=" + exports.authOf(argv, env),
    "ci="   + (envOn(env, "CI") ? 1 : 0),
    "tty="  + (isTTY ? 1 : 0),
    // npm sets npm_command=exec for npx and npm exec
    "via="  + (env.npm_command === "exec" ? "npx" : "installed")
  ]
  var agent = agentOf(env)
  if (agent) parts.push("agent=" + agent)
  return "surge/" + version + " (" + parts.join("; ") + ")"
}


/***/ }),

/***/ 5986:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var path        = __nccwpck_require__(6928)
var fs          = __nccwpck_require__(9896)
var netrc       = __nccwpck_require__(2268)
var os          = __nccwpck_require__(857)
__nccwpck_require__(7748)

module.exports = function(endpoint){
  var host = endpoint.host

  var getFile = function() {
    var home = process.env[(/^win/.test(process.platform)) ? 'USERPROFILE' : 'HOME']
    return path.join(home, ".netrc")
  }

  // returns {} when the file is missing, null when it exists but can't be
  // parsed — callers must not write anything back in the null case.
  var read = function(file){
    try {
      return netrc(file)
    }catch(e){
      return null
    }
  }

  var get = function(){
    var obj = read(getFile()) || {}

    if (obj.hasOwnProperty(host)) {
      return {
        "email": obj[host]["login"],
        "token": obj[host]["password"]
      }
    } else {
      return null
    }
  }

  var set = function(email, token){
    var file = getFile()
    var obj = read(file)

    if (obj === null){
      console.log()
      console.log("   Aborted".red + (" - could not read " + file).grey)
      console.log(("   Refusing to modify it. Please fix or remove the file and try again.").grey)
      console.log()
      process.exit(1)
    }

    if (email === null){
      delete obj[host]
    } else {
      obj[host] = {
        "login": email,
        "password": token
      }
    }

    fs.writeFileSync(file, netrc.format(obj) + os.EOL, { mode: 0o600 })
    return email === null ? null : get()
  }

  return {
    set: set,
    get: get
  }

}


/***/ }),

/***/ 5746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var colors      = __nccwpck_require__(7748)
var surgeSDK    = __nccwpck_require__(9943)
var https       = __nccwpck_require__(5692)
var localCreds  = __nccwpck_require__(5986)
var os          = __nccwpck_require__(857)
var url         = __nccwpck_require__(7016)
var urlAddy     = __nccwpck_require__(2543)
var read        = __nccwpck_require__(978)
var isDomain    = __nccwpck_require__(1579)
var s           = 0
var pkg         = __nccwpck_require__(8342)

var url         = __nccwpck_require__(7016)
var Table       = __nccwpck_require__(5832)
var prompts     = __nccwpck_require__(7455)

var tableRevisions = __nccwpck_require__(413)
var tableRegions = __nccwpck_require__(599)
var tables = __nccwpck_require__(5294)


exports.read = read


var sig = '[' + 'surge'.cyan + ']'
sig = null


var reset = exports.reset = function(){
  s = 0
}

var show = exports.show = function(){
  process.stdout.write(s.toString())
}


var space = exports.space = function(d){
  if (s === 0){
    s++
    console.log()
  }
}

var span = exports.gap = function(){
  s = 1
}

var log = exports.log = function(){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(sig)
  args = args.filter(function(n){ return n != undefined });
  console.log.apply(console, args)
  s = 0
  return this
};

var hr = exports.hr = function(){
  return console.log()
};

var smart = exports.smart = function(str){
  var difference = 16 - str.length
  var rsp = ""
  for(var i=0; i < difference; i++){
    rsp += " "
  }
  return rsp + str
}

var shortsmart = exports.shortsmart = function(str){
  var difference = 12 - str.length
  var rsp = ""
  for(var i=0; i < difference; i++){
    rsp += " "
  }
  return rsp + str
}

var trunc = exports.trunc = function(arg){
  log("   " + arg)
  s = 0
  return this
}


exports.stacktrace = function(str, options){
  var lineno  = options.lineno  || -1
  var context = options.context || 8
  var context = context = context / 2
  var lines   = (os.EOL + str).split(os.EOL)
  var start   = Math.max(lineno - context, 1)
  var end     = Math.min(lines.length, lineno + context)

  if(lineno === -1) end = lines.length

  var pad     = end.toString().length

  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start
    return (curr == lineno ? ' > ' : '   ')
      + Array(pad - curr.toString().length + 1).join(' ')
      + curr
      + '| '
      + line
  }).join(os.EOL)

  return context
}

var fetchAccount = exports.fetchAccount = function(endpoint){

  return function(email, pass, callback){
    var sdk = surgeSDK({
      endpoint: endpoint.format()
    })

    sdk.account({ user: "token", pass: pass || "" }, function(error, account){
      if (error) {
        if (error.status === 417) {
          space()
          trunc("Aborted".yellow + " - your client requires upgrade".grey)
          space()
          process.exit(1)
        } else if (error.status === 503) {
          space()
          trunc("Error".red + " - Deployment endpoint temporarily unreachable".grey)
          space()
          process.exit(1)
        } else if (error.status === 404) {
          return callback(null)
        } else {
          return callback(error)
        }
      } else {
        return callback(null, account)
      }
    })
  }
}


var displayErrors = exports.displayErrors = function(error){
  error.messages.forEach(function(m){ trunc("Error".red + (" - " + m).grey); })
}


var fetchToken = exports.fetchToken = function(endpoint){

  return function(email, pass, callback){
    var sdk = surgeSDK({
      endpoint: endpoint.format()
    })

    sdk.token({ user: email, pass: pass || "" }, { msg: "login from " + os.hostname() }, function(error, creds){
      if (error) {
        if (error.status === 417) {
          console.log()
          console.log("     Update Required".yellow, "-", error.messages ? error.messages.join(", ") : "")
          console.log()
          process.exit(1)
        } else if (error.status === 401) {
          return callback(error, null)
        } else {
          return callback(error)
        }
      } else {
        try {
          localCreds(endpoint).set(email, creds.pass.replace(os.EOL, ""))
          return callback(null, { email: email, token: creds.pass })
        } catch(e) {
          return callback({"messages": ["password required"]})
        }
      }
    })
  }
}

var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i

// where a person claims a transfer or invite code in a browser: the auth
// hub of the platform this cli publishes to (auth.surge.sh)
exports.claimLink = function(req, code){
  var platform = (req && req.configuration && req.configuration.platform) || "surge.sh"
  return "https://auth." + platform + "/claim/" + encodeURIComponent(code)
}

// an env var counts as set unless it is empty, "false" or "0"
var envOn = function(name){
  var val = process.env[name]
  return !!val && !/^(false|0)$/i.test(val)
}

// a prompt needs someone to answer it. stdin that is not a terminal (CI,
// agents, pipes, </dev/null) means nobody will, and so does CI being set -
// docker -t, ssh -t and some agent harnesses fake a terminal with nobody
// at it. returns why nobody can answer, or null when prompting is fine.
// an embedder passing its own input stream answers for itself, and
// SURGE_INTERACTIVE=1 answers from piped stdin anyway (the test suite).
exports.nobodyToAsk = function(req){
  if (envOn("SURGE_INTERACTIVE")) return null
  if (req.configuration && req.configuration.input) return null
  if (envOn("CI")) return "CI is set, so nobody to ask"
  // git bash's default window (mintty) hands node a pipe, not a console,
  // with a person at it - untested here, so mintty keeps prompting and
  // only CI stops it
  if (process.env.TERM_PROGRAM === "mintty") return null
  if (!process.stdin.isTTY) return "no terminal to ask"
  return null
}

// progress bars redraw one stderr line in place. a log can't redraw, so
// with CI set (CircleCI and others hand node a pty) or stderr not a
// terminal, each bar is one line printed when it finishes instead
exports.redraws = function(){
  return !envOn("CI") && !!process.stderr.isTTY
}

// the prompt-less abort. stderr, so an agent or pipeline capturing the
// output sees why it stopped
exports.unasked = function(msg){
  console.error()
  console.error("   " + "Aborted".yellow + (" - " + msg).grey)
  console.error()
  process.exit(1)
}

exports.loginForm = function(req, callback){

  var count = 0

  var abort = function(msg){
    console.log()
    console.log("   " + "Aborted".yellow + (" - " + msg).grey)
    console.log()
    process.exit(1)
  }

  var promptEmail = function(suggestion, cb){
    req.read({
      silent: false,
      prompt: smart("email:").grey,
      default: suggestion,
      edit: true,
      terminal: req.configuration.terminal,
      output: req.configuration.output,
      input: req.configuration.input
    }, function(err, answer){
      if (answer === undefined) {
        console.log()
        return abort("Not authenticated.".grey)
      }
      // agents answer "email=you@x.com" - valid, but it is never their
      // mailbox, so offer the address back without the prefix
      if (/^[a-z_]+=/i.test(answer)){
        return promptEmail(answer.replace(/^[a-z_]+=/i, ""), cb)
      }
      if (!pattern.test(answer)){
        return promptEmail(answer, cb)
      } else {
        req.email = answer
        return cb()
      }
    })
  }


  var promptPassword = function(cb){
    var out = req.configuration.output
    s = 0
    if (out) out.isTTY = false
    read({
      prompt: smart("password:").grey,
      silent: true,
      edit: false,
      output: out,
      input: req.configuration.input
    }, function(err, password){
      if (password === undefined){
        console.log()
        return abort("Not authenticated.".grey)
      } 
      fetchToken(req.endpoint)(req.email, password, function(err, obj){
        if (err) {
          // a transport failure carries no status — retrying the password
          // can't fix the network, and the reprompt reads as "wrong password"
          if (!err.status){
            console.log()
            return abort("Unable to reach the Surge API. Check your network and try again.".grey)
          }
          count++
          if (err.hasOwnProperty("details") && err["details"].hasOwnProperty("email")) {
            if (err.messages && err.messages.length) abort(err.messages.join(", "))
            process.exit(1)
          }
          if (count >=3) {
            req.read({
              prompt: smart("forgot?").grey,
              default: "yes",
              terminal: req.configuration.terminal,
              output: req.configuration.output,
              input: req.configuration.input
            }, function(err, reply){
              if (reply == "yes" || reply == "y" || reply == "Y") {
                var sdk = surgeSDK({ endpoint: req.endpoint.format ? req.endpoint.format() : req.endpoint })
                sdk.reset(req.email, function(error, result){
                  if (error) {
                    console.log()
                    if (error.status) {
                      trunc("Oops".red + " - something went wrong trying to reset your password.".grey)
                    } else {
                      trunc("Unable to reach the Surge API.".red + " Check your network and try again.".grey)
                    }
                    console.log()
                    process.exit(1)
                  } else {
                    console.log()
                    trunc("Password Recovery".yellow + " - reset instructions sent to ".grey + req.email.green)
                    console.log()
                    process.exit(1)
                  }
                })
              } else {
                console.log()
                trunc("Aborted".yellow + (" - No password reset sent to " + req.email.underline + ".").grey)
                console.log()
                process.exit(1)
              }
            })
          } else {
            return promptPassword()
          }
        } else {
          // req.creds = localCreds(req.argv.endpoint || req.config.endpoint || 'surge.' + req.config.platform).set(obj.email, obj.token)
          return callback({
            email: obj.email, 
            token: obj.token
          })
        }
      })
    })
  }

  promptEmail("", function(){
    promptPassword(function(token){
      console.log("token", token)
      console.log("hi", req.email)
    })
  })

}


// card tokenization goes straight to stripe (the card never touches the
// surge api), so this is the one HTTP call that cannot ride the sdk.
// callback receives (statusCode, parsedBody); statusCode 0 means the
// request itself failed.
var stripeTokens = function(stripe_pk, params, callback){
  var body = params.toString()
  var request = https.request({
    hostname: "api.stripe.com",
    path: "/v1/tokens",
    method: "POST",
    auth: stripe_pk + ":",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body)
    }
  }, function(response){
    var chunks = []
    response.on("data", function(chunk){ chunks.push(chunk) })
    response.on("end", function(){
      var data
      try { data = JSON.parse(Buffer.concat(chunks).toString()) } catch(e) { data = {} }
      callback(response.statusCode, data)
    })
  })
  request.on("error", function(){ callback(0, {}) })
  request.write(body)
  request.end()
}

exports.payment = function(req, stripe_pk, existing){

  var abort = function(msg){
    if (req.plan){
      console.log()
      try{
        console.log("   " + "Aborted".yellow + " - You remain on the ".grey + req.subscription.plan.name.underline.grey + " plan.".grey)    
      }catch(e) {
        console.log("   " + "Aborted".yellow + " - No charge processed.".grey)  
      }
    } else {
      console.log()
      console.log("   " + "Aborted".yellow + " - Changed not made.".grey)
    }
    console.log()
    process.exit(1)
  }

  function card(cc, ep, cv, cb){
    read({
      silent: false,
      prompt: smart("card number:").grey,
      default: cc,
      edit: true,
    }, function(er, cc){
      if (cc === undefined){
        console.log()
        return abort("Plan not changed.")
      } 
      read({
        prompt: smart("exp (mo/yr):").grey,
        default: ep,
        edit: true,
      }, function(er, ep){
        if (ep === undefined){
          console.log()
          return abort("Plan not changed.")
        } 
        read({
          prompt: smart("cvc:").grey,
          default: cv,
          edit: true,
        }, function(er, cv){
          if (cv === undefined){
            console.log()
            return abort("Plan not changed.")
          } 
          // expiries arrive as 06/29, 0629, 6/29, 06-29, 06/2029 — stripe
          // wants month and year apart, so normalize rather than assume
          // the slash
          var digits = String(ep).replace(/[^0-9]/g, "")
          var yearLen = digits.length >= 5 ? 4 : 2
          var expMonth = digits.slice(0, digits.length - yearLen)
          var expYear = digits.slice(digits.length - yearLen)

          if (!expMonth || parseInt(expMonth) < 1 || parseInt(expMonth) > 12){
            log()
            log("   " + "Expiration must be month and year, like 06/29.".grey)
            log()
            return card(cc, ep, cv, cb)
          }

          var params = new URLSearchParams()
          params.append('card[number]', cc)
          params.append('card[exp_month]', expMonth)
          params.append('card[exp_year]', expYear)
          params.append('card[cvc]', cv)

          stripeTokens(stripe_pk, params, function(status, data){
            if (status >= 200 && status < 300) return cb(data.id)

            if (status == 417){
              space()
              trunc("Update Required".yellow, "-", data)
              space()
              process.exit(1)
            } else if (status == 401){
              console.log(data)
            } else if (status == 402){
              var msg
              if (data.hasOwnProperty("error")){
                msg = data["error"]["message"]
              } else {
                msg = "Card appears to be invalid. Please try again."
              }
              log()
              log("  ", msg.grey)
              log()
              return card(cc, ep, cv, cb)
            } else {
              log()
              req.plan
                ? log(("   Enter payment info to change to the " + req.plan.underline + " plan.").grey)
                : log(("   Enter payment method to be used").grey)
              log()
              return card(cc, ep, cv, cb)
            }
          })

        })
      })
    })
  }

  if (existing !== null) {

    return function(callback){
      var prompt = req.plan
        ? ("   Change to the " + req.plan.underline + " plan using " +  existing.brand.underline.grey + " ending in ".grey + existing.last4.underline.grey + "?".grey).grey
        : ("   Use " +  existing.brand.underline + " ending in ".grey + existing.last4.underline.grey + "?".grey).grey

      read({
        prompt: prompt,
        default: "yes",
        edit: true
      }, function(err, reply){
        if (err){
          console.log()
          return abort("whatever")
        } 

        if (reply === undefined){
          console.log()
          return abort("Plan not changed.")
        } 
        if (["Y", "y", "Yes", "yes"].indexOf(reply) !== -1){
          return callback(null)
        } else {
          //log()
          //log("   Enter new payment method.".grey)
          log()
          return card("", "", "", callback)
        }
      })
    }
  } else {
    return function(callback){
      //log()

      if (req.plan){
        log(("   Enter payment info to change to the " + req.plan.underline + " plan.").grey)
      } else {
        //log()
        log(("   Enter payment method to be used").grey)
      }
      
      log()
      card("", "", "", callback)
    }
  }

}

exports.displayAudience = function(data){
  var table = tables.audience(data)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayAudit = function(data){
  var table = tables.audit(data)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayManifest = function(data, domain){
  var table = tables.manifest(data, domain)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayUsage = function(data){
  var table = tables.usage(data)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayTraffic = function(data){
  var table = tables.traffic(data)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayCurrent = function(data){
  var table = tables.load(data)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayRevisionBasicInfo = function(revision, domain){
  space()
  trunc((revision.preview.underline).grey + (" (" + revision.publicFileCount + " files, " + revision.publicTotalSize + " size)").grey)
  trunc(("by " + revision.email).grey)
  space()
}

exports.displayRollforeInfo = function(response, domain){
  var table = tables.rollfore(response)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayRollbackInfo = function(response, domain){
  var table = tables.rollback(response)
  var rows  = table.toString().split("\n")
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayRevision = function(payload){
  space()
  log("   Promoted revision ".grey + payload.revision.rev + " to production.".grey)
  space()
}

exports.displayPreview = function(payload){
  //log(smart("preview:").grey + " " + payload.metadata.preview.underline)
  log("   live preview..............................................".grey + " " + payload.metadata.preview.grey.underline)
}

exports.displayCname = function(payload){
  if (payload.cname) log(smart("cname:").grey + " " + payload.cname.underline)
}

exports.displayRegions = function(payload, domain){
  var table = tableRegions(payload, domain)
  var rows  = table.toString().split("\n")
  //log(smart("CNAME:").grey + " dns.surge.sh " + "(or use NS servers below)".grey)
  //space()
  //log("   Preview at ".grey + "https://123456789.sintaxi.com".grey.underline)
  //log("   Origin regions…".grey)
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

var displayServers = exports.displayServers = function(instances){
  var table = tables.instances(instances)
  var rows  = table.toString().split("\n")
  //log(smart("CNAME:").grey + " dns.surge.sh " + "(or use NS servers below)".grey)
  //space()
  //log("   Preview at ".grey + "https://123456789.sintaxi.com".grey.underline)
  //log("   Origin regions…".grey)
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

exports.displayNameServers = function(instances, domain){
  var table = tables.instances(instances)
  var rows  = table.toString().split("\n")
  //log(smart("CNAME:").grey + " dns.surge.sh " + "(or use NS servers below)".grey)
  //space()
  //log("   Preview at ".grey + "https://123456789.sintaxi.com".grey.underline)
  //log("   Origin regions…".grey)
  space()
  rows.forEach(function(row, i){
    log(" ", row.grey)
  })
  space()
}

var displayConfirmations = exports.displayConfirmations = function(response){
  if (response.unconfirmed){
    
    if (response.confirmed && response.confirmed.length > 0){
      trunc("Confirmed:".grey)
      trunc("  " + response.confirmed.join(", ").green)
      space()
    }
    
    if (response.unconfirmed && response.unconfirmed.length > 0){
      trunc("Unconfirmed:".grey)
      trunc("  " + response.unconfirmed.join(", ").yellow)  
      space()
    }
    
  }
}

var displayConfig = exports.displayConfig = function(props, args){
  args = args || { short: false }

  var keys = Object.keys(props)
  if (keys.length == 0){
    //space()
    trunc(("Empty").grey)
  }else{
    //space()
    keys.forEach(function(k){
      var key   = k
      var value = props[k]
    
      if (props[k] === null){
        key   = shortsmart(key).grey
        value = "null".grey
      } else if (!isNaN(parseInt(value))){
        key   = shortsmart(key).grey
        value = value.toString().green
      } else {
        key   = shortsmart(key).grey
        // props travel as strings, but a stray boolean must not render
        // as `undefined` — colors only extends String.prototype
        value = String(value).green
      }

      if (props[k] !== null){
        log("   " + key + ": ".grey + value) 
      }else{
        if (!args.short) 
          log("   " + key + ": ".grey + value) 
      }
    })
    space()
  }
}


var displayCertInfo = exports.displayCertInfo = function(payload, args){
  if (payload.certs.length === 0){
    if (args.showEmpty) trunc("Empty".grey)
  }else{
    if (args.short === true){
      var table = tables.certsShort(payload.certs, args.colWidths || args.colWidth, args.platform)
      var rows = table.toString().split("\n")
      rows.forEach(function(row, i){
        log(" ", row.grey)
      })
    }else{
      payload.certs.forEach(function(cert, i){
        var table = tables.cert(cert)
        var rows = table.toString().split("\n")
        rows.forEach(function(row, i){
          log("  ", row.grey)
        })
      })
    }    
  }  
}

var displayMsgs = exports.displayMsgs = function(msgs, args){
  if (msgs){
    var table = tables.msgs(msgs, args.colWidth)
    var rows = table.toString().split("\n")
    rows.forEach(function(row, i){
      log(" ", row)
    })
  }
}

exports.displayPublishInfo = function(payload, platform){
  if (payload.config)
    displayConfig(payload.config, { short: true })

  // payload.msgsTop = [{ msg: "suggestion: run `surge encrypt sintaxi.com` to provision cert", color: "yellow", align: "left" }]
  // payload.msgsMid = [{ msg: "suggestion: run `surge encrypt sintaxi.com` to provision cert", color: "yellow" }]
  // payload.msgsBot = [{ msg: "suggestion: run `surge encrypt sintaxi.com` to provision cert", color: "yellow" }]

  // payload.dns carries the observed verdict (via) — the table header
  // reports what the domain's dns actually does; without it (old server)
  // the header falls back to the static nameserver advice
  var table      = tables.instances(payload.instances, payload.dns)
  var rows       = table.toString().split("\n")
  // the bottom border carries every column split of the body rows — the
  // cert box mirrors these widths so its cells align with the table
  var stripCodes = function(row){
    return row.replace(/[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')
  }
  var colWidths  = stripCodes(rows[rows.length - 1]).slice(1, -1).split("┴").map(function(seg){
    return seg.length
  })
  var tableCols  = rows[0].replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').length

  // a terminal too slim for the full table (rows print two in) gets the
  // narrow layout instead. a log reports no width and keeps the full one
  var narrow = payload.dns && payload.dns.hasOwnProperty("via") && process.stdout.columns && tableCols + 2 > process.stdout.columns
    ? tables.narrowWidths(payload.certs, payload.dns, payload.instances, platform)
    : null
  if (narrow){
    rows       = tables.instances(payload.instances, payload.dns, narrow.fleet).toString().split("\n")
    colWidths  = narrow.verdicts
    tableCols  = stripCodes(rows[0]).length
  }
  
  if (payload.msgsTop)
    displayMsgs(payload.msgsTop, { short: true, showEmpty: false, colWidth: tableCols })

  // the verdicts box: CERT row(s) + DNS row together, above the fleet
  // table. old servers send no verdict — certs fall back to their own box
  // and the fleet table keeps its static nameserver header.
  if (payload.dns && payload.dns.hasOwnProperty("via")){
    tables.verdicts(payload.certs, payload.dns, colWidths, platform).toString().split("\n").forEach(function(row){
      log(" ", row.grey)
    })
  }else if (payload.certs){
    displayCertInfo(payload, { short: true, showEmpty: false, colWidth: tableCols, colWidths: colWidths, platform: platform })
  }

  if (payload.msgsMid)
    displayMsgs(payload.msgsMid, { short: true, showEmpty: false, colWidth: tableCols })
  
  //space()
  rows.forEach(function(row, i){ log(" ", row.grey) })
  //space()

  if (payload.msgsBot) 
    displayMsgs(payload.msgsBot, { short: true, showEmpty: false, colWidth: tableCols })
  
  var pad = function(str, len){
    if (str.length >= len) return str
    return pad("." + str, len)
  }

  var displayURL = function(u){
    var pre      = u.name + " "
    var pst      = u.domain
    var preCount = pre.length
    var pstCount = pst.length
    var numDots  = tableCols - pre.length - pst.length - 2
    var dots = pad(" ", numDots)
    log("   " + [pre, dots, pst.underline].join("").grey)
  }

  if (payload.urls) payload.urls.forEach(displayURL)
  space()
}




exports.displayInvites = function(payload){
  var table = tables.invites(payload.invites)
  var rows = table.toString().split("\n")
  rows.forEach(function(row, i){
    log(row.grey)
  })
  space()
}





var displayZoneFull = exports.displayZoneFull = function(payload){
  var table = tables.zone(payload)
  var rows = table.toString().split("\n")
  rows.forEach(function(row, i){ log("", row.grey); })
  space()
}

var displayZonePart = exports.displayZonePart = function(payload){
  var table = tables.customRecords(payload)
  var rows = table.toString().split("\n")
  rows.forEach(function(row, i){ log("", row.grey); })
  space()
}

exports.displayRecords = function(arg, type){
  reset()
  if (!arg.records || arg.records.length === 0){
    trunc("Empty".grey)
  }else{
    if (type === "dns"){
      return displayZonePart(arg)
    }else if(type === "zone"){
      return displayZoneFull(arg)
    }  
  }
}


// acme:docs.acme.com names the org a new domain is claimed for. returns
// { org, domain } for that shape, or null. A slug never has a dot, so a
// port (example.com:8080) or a scheme (https://...) is never read as one
exports.splitOrg = function(arg) {
  var m = /^([a-z0-9][a-z0-9-]*):([^\/].*)$/i.exec(String(arg || ""))
  if (!m || m[1].toLowerCase() === "http" || m[1].toLowerCase() === "https") return null
  if (!exports.validDomain(m[2])) return null
  return { org: m[1].toLowerCase(), domain: m[2] }
}

exports.validDomain = function(domain) {
  if (domain && (isDomain(domain) === true || isDomain(urlAddy(domain).host) === true)) {
    return true
  } else {
    return false
  }
}

exports.parseDomainsEmails = function(args){
  var domains = []
  var emails = []

  args.forEach(function(item){
    if (item.indexOf("@") !== -1){
      emails.push(item)
    } else {
      if (item.split(".").length > 1){
        domains.push(item)
      }
    }
  })

  return {
    domains: domains,
    emails: emails
  }
}

exports.defaults = {
  
  403: function(e, r, b){
    space()
    trunc("Unauthorized".yellow + " - Insufficient permission to access domain.".grey)
    space()
    process.exit(1)
  },

  404: function(e, r, b){
    space()
    trunc("Error".red + " - Not Found".grey)
    space()
    process.exit(1)
  }

}

/***/ }),

/***/ 9482:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


// lets onion skin cli!!
//
var helpers = __nccwpck_require__(5746)

module.exports = function(req, stack, abort){

  abort = abort || function(msg){
    console.log("\n")
    msg == null
      ? console.log("   Aborted".yellow)
      : console.log("   Aborted".yellow + " - ".grey + msg)
    console.log()
    process.exit(1)
  }

  var that  = this
  var index = 0

  // calling next(err) from any middleware prints the error and exits
  // nonzero. accepts api errors ({ messages: [...] }), Error objects,
  // and plain strings.
  function fail(err){
    var messages = (err.messages && err.messages.length)
      ? err.messages
      : [err.message || err.toString()]
    helpers.space()
    messages.forEach(function(msg){
      helpers.trunc("Error".red + (" - " + msg).grey)
    })
    helpers.space()
    process.exit(1)
  }

  function next(err){
    if (err) return fail(err)
    var layer = stack[index++]
    if(!layer) return
    layer.call(that, req, next, abort)
  }

  return next()
}


/***/ }),

/***/ 599:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var Table = __nccwpck_require__(5832)

module.exports = function(payload, domain){
  
  var table = new Table({
    //head:[{ colSpan:4, content: payload.metadata.preview.grey, hAlign:"center" }],
    style: { 
      'compact': true,
      'padding-left': 3, 
      'padding-right': 3,
    }
  })

  var rows = []

  var report = function(str, status){
    if (["green"].indexOf(status) !== -1) return str.green
    return str.grey
  }

  var iterateMachines = function(machines){
    Object.keys(machines).forEach(function(key, i){
      var val = machines[key]
      table.push([
        { hAlign: "center", content: val.info.grey }, 
        (key + "." + val.apex),
        (val.country + ", " + val.city), 
        { hAlign:"center", content: report(val.report, val.status) }
      ])
    })
  }

  if (payload.hasOwnProperty("regions")) iterateMachines(payload.regions)
  if (payload.hasOwnProperty("nameservers")) iterateMachines(payload.nameservers)
  if (payload.hasOwnProperty("additional")) iterateMachines(payload.additional)

  return table

}    
  

/***/ }),

/***/ 413:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


var Table = __nccwpck_require__(5832)


// returns a table
module.exports = function(project, revisions){
  var table = new Table({
    chars: { 
      'top': '' ,
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '', 
      'left': '  ' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '' ,
      'right-mid': '',
      'middle': ' ' },
    style: { 
      'padding-left': 0, 
      'padding-right': 1 
    }
  })

  revisions.forEach(function(revision){
    if (revision.current){
      var perm = revision.rev ? (revision.rev + ".") + project : ""
      var row = [
        (perm || project.domain).blue,
        revision.email.blue,
        (revision.fileCount.toString() + " files").blue,
        (revision.totalSize.toString() + " bytes").blue,
      ]
    } else {
      var perm = revision.rev ? (revision.rev + ".") + project : ""
      var row = [
        perm || project.domain,
        revision.email,
        revision.fileCount.toString() + " files",
        revision.totalSize.toString() + " bytes"
      ]
    }
    table.push(row)
  })

  return table

}
  
    
    
  

/***/ }),

/***/ 5294:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


var Table     = __nccwpck_require__(5832)
var Chartscii = __nccwpck_require__(8064)
Chartscii     = Chartscii.default || Chartscii
var url       = __nccwpck_require__(7016)
var hrn       = (__nccwpck_require__(3934).toHumanString)
var xbytes    = __nccwpck_require__(4160);

var cleanTable = {
        'top': '' ,
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '', 
      'left': '' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '   ' ,
      'right-mid': '',
      'middle': '  ' 
}

var calculateDays = exports.calculateDays = function(data){
  // young sites may have fewer than 3 days of data — clamp so we
  // never index before the start of the range
  var todayIndex     = data.range.length -1
  var yesterdayIndex = Math.max(data.range.length -2, 0)
  var dayBeforeIndex = Math.max(data.range.length -3, 0)
  var todayDate      = data.range[todayIndex]
  var yesterdayDate  = data.range[yesterdayIndex]
  var dayBeforeDate  = data.range[dayBeforeIndex]

  // default to yesterday
  var focusDayIndex = yesterdayIndex
  var focusDayWord  = "yesterday"

  // focus on today if more traffic than yesterday (or today is all there is)
  if (todayIndex === yesterdayIndex || data.traffic.connections.s[todayIndex] > data.traffic.connections.s[yesterdayIndex]){
    focusDayIndex = todayIndex
    focusDayWord  = "today"
  }

  return {
    todayIndex      : todayIndex,
    todayDate       : todayDate,
    yesterdayIndex  : yesterdayIndex,
    yesterdayDate   : yesterdayDate,
    dayBeforeIndex  : dayBeforeIndex,
    dayBeforeDate   : dayBeforeDate,
    focusDayIndex   : focusDayIndex,
    focusDayDate    : data.range[focusDayIndex],
    focusDayWord    : focusDayWord
  }
}

var calculateTitle = function(data, scope){
  var first     = data.range[0]
  var last      = data.range[data.range.length -1]
  var startDate = new Date(first)
  var endDate   = new Date(last)

  var title = 
    startDate.toLocaleDateString("en", { month: "long"  })
    + " " 
    + first.split("-")[2]
    + " - "
    + endDate.toLocaleDateString("en", { month: "long"  })
    + " " 
    + last.split("-")[2]

  return (scope.toUpperCase().underline.brightMagenta + (" (" + title + ")").grey) + ""
}

var calculateSubTitle = function(data){
  return ("calculated ".grey + data.normalizedAtInWords.brightYellow).italic
}

var chunkArrayInGroups = function(arr, size) {
  var result = [];
  for (var i=0; i<arr.length; i+=size)
    result.push(arr.slice(i, i+size));
  return result;
}

var fqdn = function(domain){
  //return domain.match(/\.$/) ? domain : domain + "."
  return domain
}

var dotnotation = function(email){
  return email.replace("@", ".")
}

var condencedTableAttrs = {
  chars: { 
    'top': '' ,
    'top-mid': '' , 
    'top-left': '' , 
    'top-right': '',
    'bottom': '' ,
    'bottom-mid': '' ,
    'bottom-left': '' ,
    'bottom-right': '', 
    'left': '' ,
    'left-mid': '' ,
    'mid': '' ,
    'mid-mid': '',
    'right': '   ' ,
    'right-mid': '',
    'middle': '  ' },
  style: { 
    'padding-left': 0, 
    'padding-right': 0
  }
}

var revisionOutput = function(revision){
  if (!revision) return "Empty"
  return (
    revision.preview.underline 
    + "\n" + ("by " + revision.email) 
    + ("\n" + revision.publicFileCount + " files, " + revision.publicTotalSize + " size")
    + "\n" + new Date(revision.rev).toUTCString()
  )
}

exports.rollfore = function(response){
  var rollbackTable = new Table(condencedTableAttrs)
  rollbackTable.push([
    { hAlign: "left", content: revisionOutput(response.former).grey },
    [
    " ───┘\\ ",
    "      \\ ",
    "      / ",
    " ───┐/ "
    ].join("\n").grey,
    { hAlign: "left", content: revisionOutput(response.revision).blue }
  ])
  return rollbackTable
}

exports.rollback = function(response){
  var rollbackTable = new Table(condencedTableAttrs)
  rollbackTable.push([
    { hAlign: "left", content: revisionOutput(response.revision).blue },
    [
    "  /└─── ",
    " /",
    " \\",
    "  \\┌─── "
    ].join("\n").grey,
    { hAlign: "left", content: revisionOutput(response.former).grey }
  ])
  return rollbackTable
}


exports.audience = function(data){
  var days     = calculateDays(data)
  var title    = calculateTitle(data, "Audience")
  var subtitle = calculateSubTitle(data)

  var table = new Table({
    colWidths: [24, 24, 24, 24],
    chars: cleanTable,
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })

  table.push([{ 
    colSpan:4, 
    hAlign:"left",
    content: title
  }])

  table.push([
    { 
      colSpan: 4,
      hAlign:"left",
      content: ("calculated ".grey + data.normalizedAtInWords.brightYellow).italic
    },
  ])

  table.push([])

  var col1 = new Table({
    chars: cleanTable,
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })


  col1.push([
    { content: "BROWSER".grey }
  ])

  data.browser[days.focusDayDate].forEach(function(device){
    col1.push([
      { content: hrn(device.count).cyan, hAlign:"right" },
      { content: device.name.grey }
    ])
  })

  var col2 = new Table({
    chars: cleanTable,
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })

  col2.push([
    { content: "OS".grey }
  ])

  data.os[days.focusDayDate].forEach(function(device){
    col2.push([
      { content: hrn(device.count).cyan, hAlign:"right" },
      { content: device.name.grey }
    ])
  })

  col2.push([])

  col2.push([
    { content: "DEVICES".grey }
  ])

  data.device[days.focusDayDate].forEach(function(device){
    col2.push([
      { content: hrn(device.count).cyan, hAlign:"right" },
      { content: device.name.grey }
    ])
  })

  

  table.push([
    { 
      colSpan: 2,
      hAlign:"left",
      content: col1.toString()
    },
    { 
      colSpan: 2,
      hAlign:"left",
      content: col2.toString()
    },
  ])

  return table
}


exports.audit = function(data){
  var table = new Table({
    chars: cleanTable,
  })
  //console.log(data)
  var edgenodes = Object.keys(data)
  edgenodes.forEach(function(edgenode){

    if (data[edgenode]["certError"]){
      if (data[edgenode]["certError"]["code"]){
        var cert = (data[edgenode]["certError"]["code"]).red
      }else if(data[edgenode]["certError"]["reason"]){
        var cert = (data[edgenode]["certError"]["reason"]).red
      }else{
        var cert = ("Unknown reason").red
      }
    }else{
      var cert = ("Cert Valid (" + data[edgenode]["cert"]["valid_to"] + ")").green
    }

    var en = edgenode.split(".")[0]
    table.push([
      { content: en },
      { content: data[edgenode]["rev"].toString().green },
      { content: (data[edgenode]["publicFileCount"] + " files").yellow },
      { content: xbytes(data[edgenode]["publicTotalSize"]).cyan },
      { content: cert }
    ])
  })
  return table
}


exports.plans = function(choices){

  // var head = choices.map(function(choice){
  //   return {
  //     content: choice.value.name,
  //     hAlign: "center"
  //   }
  // })

  // var table = new Table({
  //   head: head,
  //   chars: {},
  //   colWidths: [42, 42],
  //   style: { 
  //     'compact': true,
  //     'padding-left': 3, 
  //     'padding-right': 3,
  //   }
  // })

  // var row = []
  // choices.map(function(choice){
    
  //   row.push({
  //     content: choice.value.perks.join("\n- ") + "\n"
  //   })
  // }) 

  // table.push(row)

  var outerTable = new Table({
    chars: cleanTable,
    //colWidths: [42, 42],
    style: { 
      'compact': true,
      'padding-left': 0, 
      'padding-right': 0,
    }
  })

  // outerTable.push([
  //   {
  //     content: "Hello World",
  //     hAlign: "center"
  //   },
  //   {
  //     content: "Hello World",
  //     hAlign: "center"
  //   }
  // ])

  outerTable.push([{
    content: [
      "",
      "Select an Account Plan".blue,
      "upgrade or downgrade account at any time".italic.grey,
      ""
    ].join("\n"),
    colSpan: choices.length,
    hAlign: "center"
  }])

  var panels = []

  choices.forEach(function(choice){
    var price = choice.value.amount.toString().substring(0, choice.value.amount.toString().length - 2)
    var shortinter = choice.value.interval == "year" ? "yr" : "mo"
    
    var priceFormated
    if (choice.value.price == "00") {
      priceFormated = "Free"
    }else{
      priceFormated = "$" + price + "/" + shortinter 
    }
    var table = new Table({
      head: [{
        content: [choice.value.name, priceFormated].join("\n"),
        hAlign: "center"
      }],
      chars: {},
      colWidths: [38],
      // long perk lines wrap instead of truncating to "…" — the panel
      // width is fixed, so without this the pro perks always elide
      wordWrap: true,
      style: {
        'compact': true,
        'padding-left': 2,
        'padding-right': 2,
      }
    })
    table.push([{
      content: choice.value.perks.join("\n- ") + "\n"
    }])

    panels.push(table.toString())
  })

  outerTable.push(panels)
  
  return outerTable
}

exports.manifest = function(manifest, domain){
  var table = new Table({
    chars: cleanTable,
    //colWidths: [9, 32, 50],
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })

  var files = Object.keys(manifest)

  files.forEach(function(file){
    table.push([
      { content: xbytes(manifest[file]["size"]).cyan, hAlign: "right" },
      //{ content: manifest[file]["md5sum"].grey },
      { content: domain.green + file.grey, }

    ])
  })
  
  return table
}

exports.instances = function(servers, dns, narrow){

  // when the server sent the observed dns verdict, the CERT/DNS rows live
  // in their own verdicts box above (see exports.verdicts) — the fleet
  // table carries no header at all. narrow: exact widths from
  // exports.narrowWidths, for a terminal too slim for the full table
  if (dns && dns.hasOwnProperty("via")){
    return narrow ? buildNarrowFleet(servers, narrow) : buildInstancesTable(servers, null)
  }

  var ns = servers.filter(i => i.type === "NS")
  if (ns && ns.length > 0){
    var dnsTable = new Table({
      chars: { 
        'top': '' ,
        'top-mid': '' , 
        'top-left': '' , 
        'top-right': '',
        'bottom': '' ,
        'bottom-mid': '' ,
        'bottom-left': '' ,
        'bottom-right': '', 
        'left': '' ,
        'left-mid': '' ,
        'mid': '' ,
        'mid-mid': '',
        'right': '   ' ,
        'right-mid': '',
        'middle': '  ' },
      style: { 
        'padding-left': 0, 
        'padding-right': 0
      }
    })

    // function chunkArrayInGroups(arr, size) {
    //   var result = [];
    //   for (var i=0; i<arr.length; i+=size)
    //     result.push(arr.slice(i, i+size));
    //   return result;
    // }

    var groups          = chunkArrayInGroups(ns.map(i => i.domain), 2)
    var nsServersStr    = groups.map(r => r.join("   ")).join("\n")
    var cnameDomainStr  = servers.filter(i => i.type === "CNAME").map(i => i.domain).join("\n")

    dnsTable.push([
      { hAlign: "left", content: nsServersStr.cyan },
      " ",
      { hAlign: "left", content: ("or " + "CNAME" + "…\n").grey.italic + cnameDomainStr.yellow.italic },
    ])
  }

  return buildInstancesTable(servers, dnsTable
    ? [
        { hAlign: "center", vAlign: "center", content: "NS".grey },
        { colSpan: 5, content: dnsTable.toString(), hAlign: "left" }
      ]
    : null)

}

// the narrow fleet: domain, location, ip and the mark. every edge is
// HTTP on the same provider, so those columns are the ones to give up
var buildNarrowFleet = function(servers, widths){
  var table = new Table({
    colWidths: widths,
    style: {
      'compact': true,
      'padding-left': 1,
      'padding-right': 1,
    }
  })

  servers.forEach(function(s){
    if (["NS", "CNAME"].indexOf(s.type) !== -1) return
    table.push([
      s.domain || "",
      s.location || "",
      { hAlign: "left", content: s.ip || "" },
      { hAlign: "center", content: edgeMark(s) }
    ])
  })

  return table
}

var plainLength = function(str){
  return String(str).replace(/\u001b\[[0-9;]*m/g, "").length
}

// exact widths for the narrow layout, both boxes sized as one grid: the
// first column fits the labels and edge domains, the verdicts' main cell
// spans location+ip (long cert names wrap), and the mark column takes the
// longest verdict's width so the boxes keep one right edge
exports.narrowWidths = function(certs, dns, servers, platform){
  var PAD    = 2
  var rows   = exports.verdictRows(certs, dns, platform)
  var fleet  = servers.filter(function(s){ return ["NS", "CNAME"].indexOf(s.type) === -1 })
  var widest = function(list, fn){
    return list.reduce(function(max, item){ return Math.max(max, plainLength(fn(item))) }, 1) + PAD
  }

  var first = Math.max(widest(rows, function(r){ return r.label }), widest(fleet, function(s){ return s.domain || "" }))
  var loc   = widest(fleet, function(s){ return s.location || "" })
  var ip    = widest(fleet, function(s){ return s.ip || "" })
  var end   = widest(rows, function(r){ return r.verdict })

  return { verdicts: [first, loc + ip + 1, end], fleet: [first, loc, ip, end] }
}

// one mark per edge: the worse of two answers - did this publish's purge
// reach it (confirmation) and is the node alive (status). without a
// publish the server sends liveness for both, so they agree
var edgeMark = function(s){
  var rank  = { grey: 0, green: 1, yellow: 2, red: 3 }
  var c     = s.confirmationColor || "grey"
  var l     = s.statusColor || "grey"
  var color = (rank[c] || 0) >= (rank[l] || 0) ? c : l
  var glyph = { green: "✔", yellow: "◍", red: "✗" }[color] || "◍"
  return glyph[color] || glyph.grey
}

var buildInstancesTable = function(servers, head){

  var table = new Table({
    head: head || null,
    style: {
      'compact': true,
      'padding-left': 3,
      'padding-right': 3,
    }
  })

  //table.push([{rowSpan:8,content:'greetings\nfriends'}])


  servers.forEach(function(s){
    var arr = []

    var color = s.info === "pro" ? "grey" : null

    if(s.hasOwnProperty("type"))
      arr.push({ hAlign: "center", content: s.type.grey })

    if(s.hasOwnProperty("domain"))
      color
        ? arr.push(s.domain[color])
        : arr.push(s.domain)

    if(s.hasOwnProperty("location"))
      color
        ? arr.push(s.location[color])
        : arr.push(s.location)

    // if(s.hasOwnProperty("info")){
    //   if (["N/A", "available"].indexOf(s.info) !== -1){
    //     arr.push({ hAlign:"center", content: s.info.grey })
    //   }else{
    //     arr.push({ hAlign:"left", content: s.info })
    //   }
    // } 

    if(s.hasOwnProperty("ip"))
      color
        ? arr.push({ hAlign:"left", content: s.ip[color] })
        : arr.push({ hAlign:"left", content: s.ip })

    if(s.hasOwnProperty("provider"))
      color
        ? arr.push({ hAlign:"left", content: (s.provider || "")[color] })
        : arr.push({ hAlign:"left", content: s.provider })

    if(s.hasOwnProperty("status"))
      arr.push({ hAlign:"center", content: edgeMark(s) })

    if (["NS", "CNAME"].indexOf(s.type) === -1) table.push(arr)
  })

  return table

}

var analyticsAndUsageHeaderTitle = function(data){
  var first     = data.range[0]
  var last      = data.range[data.range.length -1]
  var startDate = new Date(first)
  var endDate   = new Date(last)

  var title = 
    startDate.toLocaleDateString("en", { month: "long"  })
    + " " 
    + first.split("-")[2]
    + " - "
    + endDate.toLocaleDateString("en", { month: "long"  })
    + " " 
    + last.split("-")[2]

  return title
}

exports.usage = function(data){
  var days     = calculateDays(data)
  var title    = calculateTitle(data, "Usage")
  var subtitle = calculateSubTitle(data)


  var table = new Table({
    //colWidths: [50, 50],
    // head: [],
    chars: cleanTable,
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })


  if (data.load[days.focusDayDate].length > 0){

    table.push([
      { content: title, colSpan: 3 },
    ])

    table.push([
      { content: subtitle, colSpan: 3 },
    ])

    table.push([])

    table.push([
      { content: days.focusDayWord.toUpperCase().grey, hAlign: "right" },
      { content: "MONTHLY".grey, hAlign: "right" },
      { content: "FILENAME".grey }
    ])


    data.load[days.focusDayDate].forEach(function(path){
      table.push([
        { content: xbytes(path.count).cyan, hAlign: "right" },
        { content: xbytes(path.count * 30).green, hAlign: "right" },
        { content: path.name.grey }
      ])
    })    

    table.push([])
    
    // table.push([
    //   { content: days.focusDayWord.grey, hAlign: "right" },
    //   { content: "monthly".grey, hAlign: "right", colSpan: 1 },
    //   { content: "", hAlign: "right", colSpan: 1 }
    // ])

    table.push([
      { content: "", hAlign: "right", colSpan: 1 },
      { content: (xbytes(data.bandwidth.all.t * 30)).underline.green, hAlign: "right", colSpan: 1 },
      { content: "ESTIMATED MONTHLY BANDWIDTH".underline.grey, hAlign: "left", colSpan: 1 }
    ])

  } else {
    table.push([
      { content: "Empty".yellow + " - Insufficient data.".grey, width:100 },
    ])
  }
  

  // TOTALS



  return table
}

// vertical bar chart of a daily series ({ s: [...] } shape), zero-based
// scale, 2-cell bars with the day-of-month under each. the current (still
// recording) UTC day renders grey so a half-counted day doesn't read as a
// traffic crash
var buildCurrentChart = function(range, dc, color, size){
  var today  = new Date().toISOString().slice(0, 10)
  var points = range.map(function(date, i){
    var point = { label: date.slice(8), value: dc["s"][i] }
    if (date === today) point.color = "#7a7a7a"
    return point
  })

  // pitch 4 (2-cell bar, 2 gap) up to 14 days; tighter pitch 3 beyond
  // that so a 28-day range stays inside the ~100-column layout
  var pitch = range.length > 14 ? 3 : 4

  var chart = new Chartscii(points, {
    type: "bar",
    orientation: "vertical",
    height: size || 3,
    width: range.length * pitch,
    barSize: 2,
    padding: 0,
    naked: true,
    color: color || "cyan"
  }).create()

  // naked mode leaves a blank row where the axis was — drop it so the
  // day labels sit directly under the bars. the last line is the day
  // labels, which chartscii tints per-bar — restyle the row plain grey
  var lines = chart.split("\n").filter(function(line){ return line.trim().length })
  lines.push(lines.pop().replace(/\x1b\[[0-9;]*m/g, "").grey)
  return lines.join("\n")
}

var padRight = function(str, len){
  return (str + Array(len + 1).join(" ")).slice(0, Math.max(len, str.length))
}

var regionNames = {
  US: "Americas", CA: "Americas",
  NL: "Europe", DE: "Europe", GB: "Europe",
  IN: "Asia", JP: "Asia", SG: "Asia",
  AU: "Oceania"
}

// last 7 full days vs the 7 before (today, still counting, is excluded).
// ✕ marks a datacenter that has taken no traffic for 3+ full days.
// arrows and colors mirror the traffic summary's cleanDelta treatment
var dcTrend = function(s){
  var full = s.slice(0, -1)
  if (full.slice(-3).reduce(function(a, b){ return a + b }, 0) === 0) return "✕".red
  if (full.length < 14) return " "
  var last7 = full.slice(-7).reduce(function(a, b){ return a + b }, 0)
  var prev7 = full.slice(-14, -7).reduce(function(a, b){ return a + b }, 0)
  if (prev7 === 0) return " "
  var delta = (last7 - prev7) / prev7
  if (delta > 0.1) return "↗".green
  if (delta < -0.1) return "↘".red
  return "→".grey
}

// ranked horizontal bars — one row per datacenter, sorted by total
// connections with share-of-total and a week-over-week direction.
// distribution is the question `load` answers, so no time axis here
var buildLoadChart = function(datacenters, total){
  var dcs = Object.keys(datacenters).map(function(name){
    var dc = datacenters[name]
    return { name: name.split(".")[0], city: dc["city"], t: dc["t"], trend: dcTrend(dc["s"]) }
  }).sort(function(a, b){ return b.t - a.t })

  var nameLen = dcs.reduce(function(len, dc){ return Math.max(len, dc.name.length) }, 0)
  var cityLen = dcs.reduce(function(len, dc){ return Math.max(len, dc.city.length) }, 0)

  // chartscii pads labels by raw string length, so ANSI codes in a label
  // shove the bars right — render label-less bars and compose the colored
  // label column ourselves
  var bars = new Chartscii(dcs.map(function(dc){ return { label: "", value: dc.t } }), {
    type: "bar",
    orientation: "horizontal",
    width: 50,
    naked: true,
    labels: false,
    color: "green",
    valueLabels: true,
    valueLabelFormat: function(values){
      return values.map(function(v){
        var share = total ? Math.round(Number(v) / total * 100) : 0
        return hrn(Number(v)).green + (" · " + share + "%").grey
      }).join("")
    }
  }).create().split("\n").filter(function(line){ return line.trim().length })

  var rows = dcs.map(function(dc, i){
    return (padRight(dc.name, nameLen) + "  " + padRight(dc.city, cityLen)).grey + "  " + dc.trend + "  " + (bars[i] || "").trim()
  })

  var legend = "↗ ↘ vs previous week".grey
  if (dcs.some(function(dc){ return dc.trend === "✕".red })) legend += "   ✕ no traffic 3+ days".grey
  return rows.join("\n") + "\n\n" + legend
}

// share of connections by world region, one line
var buildRegionLine = function(datacenters, total){
  var regions = {}
  Object.keys(datacenters).forEach(function(name){
    var region = regionNames[datacenters[name]["country"]] || "Other"
    regions[region] = (regions[region] || 0) + datacenters[name]["t"]
  })
  return Object.keys(regions).sort(function(a, b){ return regions[b] - regions[a] })
    .map(function(region){
      return (region + ":").grey + (" " + Math.round(regions[region] / total * 100) + "%").green
    }).join("   ")
}

exports.load = function(data){
  var days     = calculateDays(data)
  var title    = calculateTitle(data, "Load")
  var subtitle = calculateSubTitle(data)

  // datacenter totals, not data.traffic.connections — the header should
  // agree with what the rows below it sum to
  var total = Object.keys(data.datacenters).reduce(function(sum, name){
    return sum + data.datacenters[name]["t"]
  }, 0)

  var table = new Table({
    chars: cleanTable,
    style: {
      'padding-left': 0,
      'padding-right': 0
    }
  })

  table.push([{
    hAlign:"left",
    content: title
  }])

  table.push([
    {
      hAlign:"left",
      content: subtitle
    },
  ])

  table.push([])

  table.push([{
    hAlign: "left",
    content: hrn(total).green + (" connections / " + data.range.length + " days   ").grey + buildRegionLine(data.datacenters, total)
  }])

  table.push([])

  table.push([{
    hAlign: "left",
    content: buildLoadChart(data.datacenters, total)
  }])

  return table
}

exports.traffic = function(data){
  var days     = calculateDays(data)
  var title    = calculateTitle(data, "Traffic")
  var subtitle = calculateSubTitle(data)

  // CHART

  var uniques = data.traffic.uniques
  var peak    = Math.max.apply(null, uniques["s"])
  var chart   = "UNIQUES".green + ("  peak " + hrn(peak) + "/day").grey + "\n"
              + buildCurrentChart(data.range, uniques, "green", 12)


  // TABLE

  var table = new Table({
    //head: [title + (" (Last "+ data.range.length + " days)").grey + (" calculated 7min ago\n").italic.yellow],
    //head: ["One", "two", "three", "four"],
    colWidths: [24, 24, 24, 24],
    chars: cleanTable,
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    }
  })

  table.push([{ 
    colSpan:4, 
    hAlign:"left",
    content: title
  }])

  table.push([
    { 
      colSpan: 4,
      hAlign:"left",
      content: subtitle
    },
  ])

  table.push([])

  table.push([{ 
    colSpan:4, 
    hAlign:"left",
    content: chart.toString()
  }])


  table.push([])

  // SUMARY TABLE

  var col

  var summaryTable = new Table({
    chars: cleanTable,
    style: {
      'padding-left': 0,
      'padding-right': 6
    }
  })
  

  var summaryCol1 = new Table({
    chars: cleanTable,
    style: { 
      'compact': true,
      'padding-left': 0, 
      'padding-right': 0,
    }
  })

  var cleanDelta = function(d){
    if (isNaN(d)) return ""
    if (d === Infinity) return "+∞".grey
    if (d === 0) return ""

    var r = Math.round(d * 100) / 100
    if (d > 0) return (" " + r + "% ↗").green
    if (d > -3) return (r + "%").yellow
    return (r + "% ↘").red
  }

  // trend compares the two most recent COMPLETE days (yesterday vs the day
  // before) — today is still counting, so any comparison against it swings
  // wildly with the time of day the command runs
  var dayOverDay = function(series){
    var yesterday = series.s[days.yesterdayIndex]
    var dayBefore = series.s[days.dayBeforeIndex]
    return (yesterday - dayBefore) / dayBefore * 100
  }

  summaryCol1.push([
    { hAlign: "right", content:      "Visits:".grey, },
    { hAlign: "right", content: hrn(data.traffic.visits.t).grey  },
    { hAlign: "left", content: cleanDelta(dayOverDay(data.traffic.visits)) }
  ])

  summaryCol1.push([
    { hAlign: "right", content: "Uniques:".grey, },
    { hAlign: "right", content: hrn(data.traffic.uniques.t).grey },
    { hAlign: "left",  content: cleanDelta(dayOverDay(data.traffic.uniques)) }
  ])

  summaryCol1.push([
    { hAlign: "right", content: "Conns:".grey, },
    { hAlign: "right", content: hrn(data.traffic.connections.t).grey },
    { hAlign: "left", content: cleanDelta(dayOverDay(data.traffic.connections)) }
  ])

  //var encryptedPct = data.general.connections.encryption.type
  var encryptionTotal  = data.encryption.cE.t + data.encryption.cU.t + data.encryption.cRe.t + data.encryption.cRu.t
  
  var httpsPct         = encryptionTotal ? data.encryption.cE.t / (encryptionTotal) * 100 : 0
  var httpsPctRounded  = Math.round(httpsPct * 100) / 100

  var httpPct          = data.encryption.cU.t / (encryptionTotal) * 100
  var httpPctRounded   = Math.round(httpPct * 100) / 100

  var r2UnPct          = data.encryption.cRu.t / (encryptionTotal) * 100
  var r2UnPctRounded   = Math.round(r2UnPct * 100) / 100

  // console.log(data.traffic)
  // console.log(data.encryption)

  var summaryCol2 = new Table({
    //head:[{ colSpan:5, content: "", hAlign:"center" }],
    chars: cleanTable,
    style: { 
      'compact': true,
      'padding-left': 0, 
      'padding-right': 0,
    }
  })

  summaryCol2.push([
     { hAlign: "right", content: "Encrypted:".grey },
     { hAlign: "right", content: (httpsPctRounded + "%").green }
  ])

  if (data.encryption.cRe.t > 0){
    var r2EnPct          = data.encryption.cRe.t / (encryptionTotal) * 100
    var r2EnPctRounded   = Math.round(r2EnPct * 100) / 100
    summaryCol2.push([
       { hAlign: "right", content: "forced:".grey },
       { hAlign: "right", content: (r2EnPctRounded + "%").green }
    ])  
  }

  if (data.encryption.cRu.t > 0){
    var r2UnPct          = data.encryption.cRu.t / (encryptionTotal) * 100
    var r2UnPctRounded   = Math.round(r2UnPct * 100) / 100
    summaryCol2.push([
       { hAlign: "right", content: "HTTP forced:".grey },
       { hAlign: "right", content: (r2UnPctRounded + "%").cyan }
    ])  
  }

  if (data.encryption.cU.t > 0){
    summaryCol2.push([
      { hAlign: "right", content: "Naked:".grey },
      { hAlign: "right", content: hrn(data.encryption.cU.t).red }
    ])
  }else{
    summaryCol2.push([
      { hAlign: "right", content: "Naked:".grey },
      { hAlign: "right", content: hrn(data.encryption.cU.t).green }
    ])
  }
    


  // if (data.encryption.connEn.total > 0)
  //   summaryCol2.push("HTTP forced: ".padStart(22, " ").grey + (r2UnPctRounded + "%").red)

  // CACHE
  var cacheTotal         =  data.cache.hit.t + data.cache.miss.t
  var cachePct           =  cacheTotal ? data.cache.hit.t / cacheTotal * 100 : 0
  var cachePctRounded    =  Math.round(cachePct * 100) / 100
  var cacheMisses        =  cacheTotal ? data.cache.miss.t / cacheTotal * 100 : 0
  var cacheMissesRounded =  Math.round(cacheMisses * 100) / 100

  var summaryCol3 = new Table({
    //head:[{ colSpan:5, content: "Hi", hAlign:"center" }],
    chars: cleanTable,
    style: { 
      'compact': true,
      'padding-left': 0, 
      'padding-right': 0,
    }
  })

  var cacheColor = "green"
  if (cacheTotal){
    if (cachePctRounded < 99) cacheColor = "cyan"
    if (cachePctRounded < 95) cacheColor = "yellow"
    if (cachePctRounded < 90) cacheColor = "red"
  }

  summaryCol3.push([
    { hAlign: "right", content: "Cache Hits:".grey }, 
    { hAlign: "right", content: (cachePctRounded + "%")[cacheColor] }
  ])

  summaryCol3.push([
    { hAlign: "right", content: "Misses:".grey },
    { hAlign: "right", content: hrn(data.cache.miss.t)[cacheColor] }
  ])

  summaryTable.push([
    { hAlign: "center", content: summaryCol1.toString() },
    { hAlign: "center", content: summaryCol2.toString() },
    { hAlign: "center", content: summaryCol3.toString() }
  ])

  table.push([
    { hAlign: "left", content: summaryTable.toString(), colSpan: 4}
  ])

  table.push([])

  // ROUTES
  
  if (data.success[days.focusDayDate].length > 28) data.success[days.focusDayDate].length = 28

  var col1 = []
  col1.push(("VISITS: ".green + days.focusDayWord.italic.grey))
  data.success[days.focusDayDate].forEach(function(route, i){
    col1.push(hrn(route.count).padStart(6," ").green + "  " + route.name.grey)
  })

  var col2 = []
  col2.push("NOT FOUND: ".red + days.focusDayWord.italic.grey)
  data.fail[days.focusDayDate].forEach(function(route, i){
    if (i > 7) return
    col2.push(hrn(route.count).padStart(6," ").red + "  " + route.name.grey)
  })

  col2.push("\nREDIRECTS: ".yellow + days.focusDayWord.italic.grey)
  data.redirect[days.focusDayDate].forEach(function(route, i){
    if (i > 7) return
    col2.push(hrn(route.count).padStart(6," ").yellow + "  " + route.name.grey)
  })

  col2.push("\nSOURCES: ".cyan + days.focusDayWord.italic.grey)
  data.source[days.focusDayDate].forEach(function(route, i){
    if (i > 7) return
    col2.push(hrn(route.count).padStart(6," ").cyan + "  " + route.name.grey)
  })

  table.push([
    { 
      colSpan: 2,
      colWidths: 40,
      content: col1.join("\n")
    },
    { 
      colSpan: 2,
      colWidths: 40,
      content: col2.join("\n")
    }
  ])

  return table
}

exports.nameservers = function(servers){
  
  var table = new Table({
    head:[{ colSpan:5, content: "DNS", hAlign:"center" }],
    style: { 
      'compact': true,
      'padding-left': 3, 
      'padding-right': 3,
    }
  })

  var rows = []

  var report = function(str, status){
    if (["green"].indexOf(status) !== -1) return str.green
    return str.grey
  }

  servers.forEach(function(s){
    var arr = []

    if(s.hasOwnProperty("type"))
      arr.push({ hAlign: "center", content: s.type.grey })

    if(s.hasOwnProperty("domain"))
      arr.push(s.domain)

    if(s.hasOwnProperty("location"))
      arr.push(s.location)

    if(s.hasOwnProperty("info")){
      if (["N/A", "available"].indexOf(s.info) !== -1){
        arr.push({ hAlign:"center", content: s.info.grey })
      }else{
        arr.push({ hAlign:"left", content: s.info.grey })
      }
    }

    if(s.hasOwnProperty("status"))
      arr.push({ hAlign:"center", content: report(s.status, s.statusColor) })

    if (s.type == "NS")
    table.push(arr)
  })

  return table

}

// the verdicts box: CERT row(s) and the DNS row in one table, printed
// above the fleet table. its columns mirror the instances table below it:
// the label cell matches the label column, the main cell spans
// domain+city+ip, and the verdict cell spans provider+status — so the
// stacked boxes read as one aligned grid. widths comes from parsing the
// rendered instances table (see helpers.displayPublishInfo); a plain
// number falls back to a standalone layout.
exports.verdicts = function(certs, dns, widths, platform){

  // three widths are the narrow layout's, exact (exports.narrowWidths):
  // one space of padding, and long cert names wrap
  var narrow = Array.isArray(widths) && widths.length === 3

  var colWidths = narrow
    ? widths
    : Array.isArray(widths) && widths.length >= 6
    ? [ widths[0], widths[1] + widths[2] + widths[3] + 2, widths[4] + widths[5] + 1 ]
    : [ 10, widths - 40, 26 ]

  // not compact: each verdict row gets its own ruled-off band
  var table = new Table({
    colWidths: colWidths,
    wordWrap: narrow,
    style: {
      'padding-left': narrow ? 1 : 3,
      'padding-right': narrow ? 1 : 3,
    }
  })

  exports.verdictRows(certs, dns, platform).forEach(function(row){
    table.push([
      { hAlign: "center", content: row.label.grey },
      { hAlign: "left", content: row.main.grey },
      { hAlign: "left", content: row.verdict }
    ])
  })

  return table
}

// the CERT and DNS verdicts as { label, main, verdict } - main plain,
// verdict already colored
exports.verdictRows = function(certs, dns, platform){
  var rows = []

  // one condensed line per cert: the covered names and the renewal state —
  // issuer and the rest live behind `surge certs`. renewal wording is the
  // point: provisioned certs and the platform wildcard are ours to renew —
  // never a user worry, so no countdown — while an uploaded pem expiring
  // genuinely is the user's move.
  ;(certs || []).forEach(function(cert){
    var names = (cert.subjectAltNames || []).join(", ")
    var platformCert = (cert.subjectAltNames || []).indexOf("*." + (platform || "surge.sh")) !== -1
    var renewal
    if (cert.autoRenew || cert.certName === "provisioned" || platformCert){
      renewal = "auto-renew".green
    }else if (cert.expInDays < 0){
      renewal = ("expired " + Math.abs(cert.expInDays) + " days ago").red
    }else if (cert.expInDays < 15){
      renewal = ("expires in " + cert.expInDays + " days").yellow
    }else{
      renewal = ("expires in " + cert.expInDays + " days").green
    }
    rows.push({ label: "CERT", main: names, verdict: renewal })
  })

  // no cert yet: the CERT row carries the state instead of any text below
  // the publish result — waiting on dns when that is the blocker, securing
  // when the dns is fine and issuance is our move. grey either way: color
  // is reserved for the one cell that asks the user to act
  if ((certs || []).length === 0 && dns && dns.hasOwnProperty("via")){
    rows.push({ label: "CERT", main: "none", verdict: dns.via ? "securing".grey : "waiting on dns".grey })
  }

  // the observed dns verdict: the mechanism on the left, the geo verdict
  // in its own cell. geo-aware is the flex — the one action a user ever
  // has (pointing dns) rides the cta line, never a block of records.
  if (dns && dns.hasOwnProperty("via")){
    var verdict = {
      "ns":    { how: "using Surge Name Servers",  geo: "geo-aware".green },
      "cname": { how: "using Surge CNAME Record",  geo: "geo-aware".green },
      "a":     { how: "using Surge A Record",      geo: "not geo-aware".yellow }
    }[dns.via] || { how: "not resolving to Surge", geo: "action required".yellow }

    rows.push({ label: "DNS", main: verdict.how, verdict: verdict.geo })
  }

  return rows
}

// legacy cert box (old server sent no dns verdict) — same rows, no DNS
exports.certsShort = function(certs, widths, platform){
  return exports.verdicts(certs, null, widths, platform)
}

exports.msgs = function(msgs, colWidth, color){
  var table = new Table({
    colWidths:[colWidth - 2],
    style: { 
      'compact': true,
      'padding-left': 2, 
      'padding-right': 2,
    }
  })
  msgs.forEach(function(msg, i){
    if (i % 2 === 1) table.push([""])
    table.push([{ content: msg.msg[msg.color], hAlign: msg.align || 'center' }])
  })
  return table
}

exports.cert = function(cert){
  
  var table = new Table({
    colWidths:[20, 60],
    style: { 
      'compact': true,
      'padding-left': 3, 
      'padding-right': 3,
    }
  })

  var row = {}
  var days = ""
  if (cert.expInDays < -15){
    days = ("Expired").red
  } else if (cert.expInDays < 0){
    days = (cert.expInDays.toString() + " days (expired)").red
  } else if (cert.expInDays > 15){
    days = (cert.expInDays.toString() + " days").green
  } else {
    days = (cert.expInDays.toString() + " days").yellow
  }
  table.push({ "Subject": [cert.subject] })
  table.push({ "Issuer": [cert.issuer] })
  table.push({ "Alt Names": cert.subjectAltNames.join(", ") })
  table.push({ "Expires": [days] })
  table.push({ "Auto-Renew": [cert.autoRenew ? String(cert.autoRenew).green : String(!!cert.autoRenew).grey] })
  return table
}
  

exports.customRecords = function(dninfo){
  var table = new Table({
    chars: { 
      'top': '' ,
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '', 
      'left': '  ' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '' ,
      'right-mid': '',
      'middle': ' ' },
    style: { 
      'padding-left': 0, 
      'padding-right': 0 
    },
    colWidths: [32, 6, 3, 32, 16],
    wordWrap:true
  })

  dninfo.records.forEach(function(record){
    table.push([
      { hAlign: "left", content: record.name.grey },
      { hAlign: "left", content: record.type.blue },
      { hAlign: "left", content: (record.priority || "").toString().grey },
      { hAlign: "left", content: record.value.green.underline },
      { hAlign: "left", content: (record.id ? record.id : "").grey },
    ])
  })

  return table
  
}

exports.zone = function(dninfo){
  var records = dninfo.records

  var table = new Table({
    chars: { 
      'top': '' ,
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '', 
      'left': '  ' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '' ,
      'right-mid': '',
      'middle': ' ' },
    style: { 
      'padding-left': 0, 
      'padding-right': 0
    },
    colWidths: [28, 6, 32, 16, 28],
    wordWrap:true
  })

  // $ORIGIN
  table.push([
    { hAlign: "left", content: ("$ORIGIN " + fqdn(dninfo.origin)).grey, colSpan: 5 },
  ])

  // $TTL
  var ttl = dninfo.props ? (dninfo.props.ttl || 1600) : 1600
  table.push([
    { hAlign: "left", content: ("$TTL " + ttl).grey, colSpan: 5 },
  ])

  var current;

  dninfo.records.forEach(function(record){
    // if (current !== record.category){
    //   table.push([{ content: "", colSpan: 5 }])
    //   current = record.category
    // } 

    if (record.type === "SOA"){
      table.push([
        { hAlign: "left", content: fqdn(record.name).grey  },
        { hAlign: "left", content: record.type.grey  },
        { hAlign: "left", content: fqdn(record.value).grey },
        { hAlign: "left", content: dotnotation(record.email).grey },
        { hAlign: "left", content: ("(" + dninfo.serial + " 1d 2h 4w 1h)").grey },
      ])
    }else if (record.type === "NS"){
      table.push([
        { hAlign: "left", content: fqdn(record.name).grey },
        { hAlign: "left", content: record.type.grey },
        { hAlign: "left", content: fqdn(record.value).grey},
        { hAlign: "left", content: (record.id ? record.id : "").grey },
        { hAlign: "left", content: (record.category ? (";" + record.category.toUpperCase()).grey : ";CUSTOM".grey) },
      ])
    }else if (record.category === "glue"){
      table.push([
        { hAlign: "left", content: fqdn(record.name).grey },
        { hAlign: "left", content: record.type.grey },
        { hAlign: "left", content: record.value.grey},
        { hAlign: "left", content: (record.id ? record.id : "").grey },
        { hAlign: "left", content: (record.category ? (";" + record.category.toUpperCase()).grey : ";CUSTOM".grey) },
      ])
    }else{
      table.push([
        { hAlign: "left", content: record.name.grey },
        { hAlign: "left", content: record.type.grey },
        { hAlign: "left", content: record.value.grey},
        { hAlign: "left", content: (record.id ? record.id : "").grey },
        { hAlign: "left", content: (record.category ? (";" + record.category.toUpperCase()).grey : ";CUSTOM".grey) },
      ])
    }
  })

  

  

  //table.push([{ hAlign: "left", content: "", colSpan: 4 }])

  // // SOA
  // table.push([
  //   { hAlign: "left", content: "surge.world.".grey },
  //   { hAlign: "left", content: "SOA".grey },
  //   { hAlign: "left", content: "ns1.surge.world".grey },
  //   { hAlign: "left", content: "username.example.com   ( 2007120710 1d 2h 4w 1h )".grey },
  // ])

  // table.push([{ hAlign: "left", content: "", colSpan: 4 }])

  // // NS
  // records.filter(function(record){ return record.type == "GLUE" }).forEach(function(record){
  //   table.push([
  //     { hAlign: "left", content: "surge.world.".grey },
  //     { hAlign: "left", content: "NS".grey },
  //     { hAlign: "left", content: (record.name + ".surge.world").grey },
  //     { hAlign: "left", content: "; New York".grey },
  //   ])
  // })

  // table.push([{ hAlign: "left", content: "", colSpan: 4 }])

  // // GLUE
  // records.filter(function(record){ return record.type == "GLUE" }).forEach(function(record){
  //   table.push([
  //     { hAlign: "left", content: record.name.grey },
  //     { hAlign: "left", content: "A".grey },
  //     { hAlign: "left", content: record.value.grey },
  //     { hAlign: "left", content: "; glue".grey },
  //   ])
  // })

  // table.push([{ hAlign: "left", content: "", colSpan: 4 }])


  // // A
  // records.filter(function(record){ return record.type == "A" }).forEach(function(record){
  //   table.push([
  //     { hAlign: "left", content: record.name.grey },
  //     { hAlign: "left", content: record.type.grey },
  //     { hAlign: "left", content: record.value.grey },
  //     { hAlign: "left", content: ";".grey + (record.id ? record.id : "N/A").grey },
  //   ])
  // })


  // // CNAME
  // records.filter(function(record){ return record.type == "CNAME" }).forEach(function(record){
  //   table.push([
  //     { hAlign: "left", content: record.name.grey },
  //     { hAlign: "left", content: record.type.grey },
  //     { hAlign: "left", content: record.value.grey },
  //     { hAlign: "left", content: ";".grey + record.id.grey },
  //   ])
  // })

  // records.forEach(function(record){
  //   if (record.id.indexOf("rec") === 0){
  //     var row = [
  //       { hAlign: "left", content: record.name.green },
  //       { hAlign: "left", content: record.type.green },
  //       { hAlign: "left", content: record.value.green },
  //       { hAlign: "left", content: "; ".green + record.id.green },
  //     ]
  //   }else{
  //     var row = [
  //       { hAlign: "left", content: record.name.grey },
  //       { hAlign: "left", content: record.type.grey },
  //       { hAlign: "left", content: record.value.grey },
  //       { hAlign: "left", content: "; resolved via Geo IP".grey },
  //     ]
  //   }
    
  //   table.push(row)
  // })

  return table

}

exports.invites = function(invites){
  var table = new Table({
    chars: { 
      'top': '' ,
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '',
      'bottom': '' ,
      'bottom-mid': '' ,
      'bottom-left': '' ,
      'bottom-right': '', 
      'left': '  ' ,
      'left-mid': '' ,
      'mid': '' ,
      'mid-mid': '',
      'right': '' ,
      'right-mid': '',
      'middle': ' ' },
    style: { 
      'padding-left': 0, 
      'padding-right': 1 
    }
  })

  invites.forEach(function(invite){
    
    var row = [
      //invite.domain.yellow,
      invite.email.blue,
      invite.invite.underline.grey  
    ]

    if (invite.status == "sent"){
      row.push(invite.status.green)
    } else if (invite.status == "failed") {
      row.push(invite.status.red)
    }else{
      row.push(invite.status.yellow)
    }

    table.push(row)
  })

  return table
}


/***/ }),

/***/ 461:
/***/ ((module, exports, __nccwpck_require__) => {

var Stream = __nccwpck_require__(2203)

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}



/***/ }),

/***/ 2543:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(7016)
var assert = __nccwpck_require__(2613)

module.exports = parse
parse.format = format
parse.parse = parse

function parse (str, parseQueryString) {
  assert.equal(typeof str, 'string')
  var p = url.parse(str, parseQueryString)
  if (!p.slashes)
    p = url.parse('http://' + str, parseQueryString)
  else if (!p.protocol)
    p = url.parse('http:' + str, parseQueryString)

  return p
}

function format (str) {
  return url.format(parse(str))
}


/***/ }),

/***/ 4160:
/***/ ((module) => {

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
if (true) module.exports = xbytes;

/***/ }),

/***/ 5703:
/***/ ((module) => {

module.exports = function publish(core, surge) {
  try {
    const domain = core.getInput('domain', { required: true });
    const project = core.getInput('project') || '.';
    const login = core.getInput('login', { required: true });
    const token = core.getInput('token', { required: true });
    core.setSecret(token);
    process.env.SURGE_LOGIN = login;
    process.env.SURGE_TOKEN = token;
    surge({ default: 'publish' })([project, domain]);
  } catch (error) {
    core.setFailed(error.message);
  }
};


/***/ }),

/***/ 2613:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 5317:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6982:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 4434:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 9896:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 8611:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5692:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 9278:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 4589:
/***/ ((module) => {

"use strict";
module.exports = require("node:assert");

/***/ }),

/***/ 6698:
/***/ ((module) => {

"use strict";
module.exports = require("node:async_hooks");

/***/ }),

/***/ 4573:
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ 7540:
/***/ ((module) => {

"use strict";
module.exports = require("node:console");

/***/ }),

/***/ 7598:
/***/ ((module) => {

"use strict";
module.exports = require("node:crypto");

/***/ }),

/***/ 3053:
/***/ ((module) => {

"use strict";
module.exports = require("node:diagnostics_channel");

/***/ }),

/***/ 610:
/***/ ((module) => {

"use strict";
module.exports = require("node:dns");

/***/ }),

/***/ 8474:
/***/ ((module) => {

"use strict";
module.exports = require("node:events");

/***/ }),

/***/ 7067:
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ 2467:
/***/ ((module) => {

"use strict";
module.exports = require("node:http2");

/***/ }),

/***/ 7030:
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ 643:
/***/ ((module) => {

"use strict";
module.exports = require("node:perf_hooks");

/***/ }),

/***/ 1792:
/***/ ((module) => {

"use strict";
module.exports = require("node:querystring");

/***/ }),

/***/ 7075:
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ 1692:
/***/ ((module) => {

"use strict";
module.exports = require("node:tls");

/***/ }),

/***/ 3136:
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ 7975:
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ 3429:
/***/ ((module) => {

"use strict";
module.exports = require("node:util/types");

/***/ }),

/***/ 5919:
/***/ ((module) => {

"use strict";
module.exports = require("node:worker_threads");

/***/ }),

/***/ 8522:
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ 857:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 6928:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 3785:
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ }),

/***/ 2203:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 3193:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 3557:
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ 4756:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 7016:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 9023:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 3106:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 8064:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var index_exports = {};
__export(index_exports, {
  Chartscii: () => chartscii_default,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// formatters/formatter.ts
var import_styl3 = __toESM(__nccwpck_require__(5683), 1);

// utils/color.ts
var NAMED_COLORS = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  white: [255, 255, 255],
  black: [0, 0, 0],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  marine: [0, 119, 190],
  lime: [0, 255, 0],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  aqua: [0, 255, 255],
  coral: [255, 127, 80],
  salmon: [250, 128, 114],
  gold: [255, 215, 0],
  violet: [238, 130, 238],
  indigo: [75, 0, 130],
  turquoise: [64, 224, 208],
  crimson: [220, 20, 60],
  chocolate: [210, 105, 30],
  tomato: [255, 99, 71],
  skyblue: [135, 206, 235]
};
function isGradientObject(color) {
  return typeof color === "object" && color !== null && color.type === "gradient" && Array.isArray(color.colors);
}
function isGradientString(color) {
  return typeof color === "string" && color.startsWith("gradient(") && color.endsWith(")");
}
function parseGradient(value) {
  if (!value.startsWith("gradient(") || !value.endsWith(")")) {
    return value;
  }
  const content = value.slice(9, -1);
  if (!content) {
    return value;
  }
  const parts = content.split(":");
  const colorsPart = parts[0];
  const options = parts.slice(1);
  const colors = colorsPart.split(",").map((c) => c.trim()).filter((c) => c.length > 0);
  if (colors.length === 0) {
    return value;
  }
  const gradient = {
    type: "gradient",
    colors
  };
  for (const opt of options) {
    const trimmed = opt.trim().toLowerCase();
    if (trimmed === "horizontal" || trimmed === "vertical" || trimmed === "diagonal") {
      gradient.direction = trimmed;
    } else if (trimmed === "reverse" || trimmed === "reversed") {
      gradient.reverse = true;
    }
  }
  return gradient;
}
function normalizeColor(color) {
  if (typeof color === "string" && isGradientString(color)) {
    return parseGradient(color);
  }
  return color;
}
function ansi256ToRgb(index) {
  if (index < 16) {
    const standard = [
      [0, 0, 0],
      // 0: black
      [128, 0, 0],
      // 1: red
      [0, 128, 0],
      // 2: green
      [128, 128, 0],
      // 3: yellow
      [0, 0, 128],
      // 4: blue
      [128, 0, 128],
      // 5: magenta
      [0, 128, 128],
      // 6: cyan
      [192, 192, 192],
      // 7: white
      [128, 128, 128],
      // 8: bright black (gray)
      [255, 0, 0],
      // 9: bright red
      [0, 255, 0],
      // 10: bright green
      [255, 255, 0],
      // 11: bright yellow
      [0, 0, 255],
      // 12: bright blue
      [255, 0, 255],
      // 13: bright magenta
      [0, 255, 255],
      // 14: bright cyan
      [255, 255, 255]
      // 15: bright white
    ];
    return standard[index];
  }
  if (index < 232) {
    const i = index - 16;
    const r = Math.floor(i / 36);
    const g = Math.floor(i % 36 / 6);
    const b = i % 6;
    return [
      r === 0 ? 0 : 55 + r * 40,
      g === 0 ? 0 : 55 + g * 40,
      b === 0 ? 0 : 55 + b * 40
    ];
  }
  const gray = (index - 232) * 10 + 8;
  return [gray, gray, gray];
}
function extractRgbFromAnsi(ansiCode) {
  const rgbMatch = ansiCode.match(/\x1b\[38;2;(\d+);(\d+);(\d+)m/);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }
  const ansi256Match = ansiCode.match(/\x1b\[38;5;(\d+)m/);
  if (ansi256Match) {
    return ansi256ToRgb(parseInt(ansi256Match[1], 10));
  }
  const basicMatch = ansiCode.match(/\x1b\[(\d+)m/);
  if (basicMatch) {
    const code = parseInt(basicMatch[1], 10);
    if (code >= 30 && code <= 37) {
      return ansi256ToRgb(code - 30);
    }
    if (code >= 90 && code <= 97) {
      return ansi256ToRgb(code - 90 + 8);
    }
  }
  return null;
}
function parseColorToRgb(color, themeColors) {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16)
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }
  if (color.startsWith("\x1B[")) {
    const rgb = extractRgbFromAnsi(color);
    if (rgb) return rgb;
  }
  if (themeColors) {
    const themeColor = themeColors[color.toLowerCase()];
    if (typeof themeColor === "string") {
      const rgb = extractRgbFromAnsi(themeColor);
      if (rgb) return rgb;
    }
  }
  const named = NAMED_COLORS[color.toLowerCase()];
  if (named) return named;
  return [255, 255, 255];
}
function interpolateRgb(color1, color2, t) {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t),
    Math.round(color1[1] + (color2[1] - color1[1]) * t),
    Math.round(color1[2] + (color2[2] - color1[2]) * t)
  ];
}
function getColorAtPosition(gradient, position, themeColors) {
  const { colors } = gradient;
  if (colors.length === 0) return [255, 255, 255];
  if (colors.length === 1) return parseColorToRgb(colors[0], themeColors);
  const clampedPosition = Math.max(0, Math.min(1, position));
  const scaledPosition = clampedPosition * (colors.length - 1);
  const lowerIndex = Math.floor(scaledPosition);
  const upperIndex = Math.min(lowerIndex + 1, colors.length - 1);
  const localT = scaledPosition - lowerIndex;
  const color1 = parseColorToRgb(colors[lowerIndex], themeColors);
  const color2 = parseColorToRgb(colors[upperIndex], themeColors);
  return interpolateRgb(color1, color2, localT);
}
function applyGradientToText(text, gradient, themeColors) {
  const { colors } = gradient;
  if (colors.length === 0 || text.length === 0) return text;
  const chars = [...text];
  if (colors.length === 1) {
    const [r, g, b] = parseColorToRgb(colors[0], themeColors);
    return `\x1B[38;2;${r};${g};${b}m${text}\x1B[0m`;
  }
  let result = "";
  for (let i = 0; i < chars.length; i++) {
    let position = chars.length > 1 ? i / (chars.length - 1) : 0;
    if (gradient.reverse) position = 1 - position;
    const [r, g, b] = getColorAtPosition(gradient, position, themeColors);
    result += `\x1B[38;2;${r};${g};${b}m${chars[i]}\x1B[39m`;
  }
  return result;
}
function interpolateGradientColor(gradient, index, total, themeColors) {
  const { colors } = gradient;
  if (colors.length === 0) return "";
  if (colors.length === 1) return colors[0];
  const position = total > 1 ? index / (total - 1) : 0;
  const [r, g, b] = getColorAtPosition(gradient, position, themeColors);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// formatters/formatter.ts
var ChartFormatter = class {
  constructor(options) {
    this.options = options;
    this.colors = (0, import_styl3.default)({ theme: options.theme });
  }
  calculateBarDimensions(barCount, totalSize, charWidth = 1) {
    const alignment = this.options.alignBars || "justify";
    if (alignment !== "justify") {
      return {
        barSize: this.options.barSize || 1,
        padding: this.options.padding || 0
      };
    }
    const hasExplicitPadding = this.options.padding !== void 0 && this.options.padding > 0;
    if (hasExplicitPadding && barCount > 1) {
      if (this.options.barSize !== void 0) {
        const minSize = this.options.barSize * charWidth * barCount + this.options.padding * (barCount - 1);
        const extraPadding = Math.max(0, totalSize - minSize);
        const paddingPerGap = Math.floor(extraPadding / (barCount - 1));
        return {
          barSize: this.options.barSize,
          padding: this.options.padding + paddingPerGap
        };
      }
      const totalPaddingSize = this.options.padding * (barCount - 1);
      const availableForBars = totalSize - totalPaddingSize;
      return {
        barSize: Math.max(1, Math.floor(availableForBars / (barCount * charWidth))),
        padding: this.options.padding
      };
    }
    return this.calculateDefaultDimensions(barCount, totalSize, charWidth);
  }
  calculateAlignmentPadding(barsWidth, totalSize, alignment) {
    if (alignment === "justify") {
      return { leadingPad: 0, trailingPad: 0 };
    }
    const extraSpace = Math.max(0, totalSize - barsWidth);
    if (alignment === "right" || alignment === "bottom") {
      return { leadingPad: extraSpace, trailingPad: 0 };
    }
    if (alignment === "center") {
      const leading = Math.floor(extraSpace / 2);
      return { leadingPad: leading, trailingPad: extraSpace - leading };
    }
    return { leadingPad: 0, trailingPad: extraSpace };
  }
  formatValueWithDecimals(value) {
    const formattedValue = this.options.valueLabelsFloatingPoint !== void 0 ? value.toFixed(this.options.valueLabelsFloatingPoint) : String(value);
    return this.options.valueLabelFormat ? this.options.valueLabelFormat([formattedValue]) : formattedValue;
  }
  formatStackedValueLabel(segments) {
    const values = segments.map((s) => {
      return this.options.valueLabelsFloatingPoint !== void 0 ? s.value.toFixed(this.options.valueLabelsFloatingPoint) : String(s.value);
    });
    return this.options.valueLabelFormat ? this.options.valueLabelFormat(values) : values.join("|");
  }
  formatPercentage(point) {
    return this.options.percentage ? `(${point.percentage.toFixed(2)}%)` : "";
  }
  colorify(txt, color) {
    if (!color) return txt;
    const normalizedColor = typeof color === "string" ? normalizeColor(color) : color;
    if (isGradientObject(normalizedColor)) {
      return this.applyGradient(txt, normalizedColor);
    }
    if (Array.isArray(normalizedColor)) {
      return this.colors.rgb(...normalizedColor)`${txt}`;
    }
    if (typeof normalizedColor === "string") {
      if (normalizedColor.includes("#")) {
        return this.colors.hex(normalizedColor)`${txt}`;
      }
      if (normalizedColor.match(/[0-9]/)) {
        return this.colors.ansi(normalizedColor)`${txt}`;
      }
      if (!this.options.richLabels) {
        const ansiCode = this.colors.colors[normalizedColor];
        if (ansiCode) return `${ansiCode}${txt}${this.colors.colors.reset}`;
      }
      return this.colors[normalizedColor]`${txt}`;
    }
    return txt;
  }
  isGradient(color) {
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    return isGradientObject(normalized);
  }
  normalizeGradient(color) {
    if (typeof color === "string") {
      return normalizeColor(color);
    }
    return color;
  }
  getThemeColors() {
    return this.colors.colors;
  }
  getColorAtPosition(gradient, position) {
    return getColorAtPosition(gradient, position, this.getThemeColors());
  }
  getLabelColorForBar(color, barIndex, totalBars) {
    if (!color) return void 0;
    const normalizedColor = typeof color === "string" ? normalizeColor(color) : color;
    if (!isGradientObject(normalizedColor)) return normalizedColor;
    const { direction = "horizontal", reverse = false } = normalizedColor;
    const chartOrientation = this.options.orientation || "horizontal";
    let position;
    if (chartOrientation === "horizontal") {
      if (direction === "horizontal") {
        position = 0;
      } else if (direction === "diagonal") {
        const vPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        position = vPos / 2;
      } else {
        position = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
      }
    } else {
      if (direction === "vertical") {
        position = 1;
      } else if (direction === "diagonal") {
        const hPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        position = (hPos + 1) / 2;
      } else {
        position = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
      }
    }
    if (reverse) {
      position = 1 - position;
    }
    const [r, g, b] = this.getColorAtPosition(normalizedColor, position);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  getValueLabelColorForBar(color, barIndex, totalBars, barEndPosition) {
    if (!color) return void 0;
    const normalizedColor = typeof color === "string" ? normalizeColor(color) : color;
    if (!isGradientObject(normalizedColor)) return normalizedColor;
    const { direction = "horizontal", reverse = false } = normalizedColor;
    const chartOrientation = this.options.orientation || "horizontal";
    let position;
    if (chartOrientation === "horizontal") {
      if (direction === "horizontal") {
        position = barEndPosition !== void 0 ? barEndPosition : 1;
      } else if (direction === "diagonal") {
        const hPos = barEndPosition !== void 0 ? barEndPosition : 1;
        const vPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        position = (hPos + vPos) / 2;
      } else {
        position = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
      }
    } else {
      if (direction === "vertical") {
        position = barEndPosition !== void 0 ? barEndPosition : 0;
      } else if (direction === "diagonal") {
        const hPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        const vPos = barEndPosition !== void 0 ? barEndPosition : 0;
        position = (hPos + vPos) / 2;
      } else {
        position = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
      }
    }
    if (reverse) {
      position = 1 - position;
    }
    const [r, g, b] = this.getColorAtPosition(normalizedColor, position);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
  applyGradientWithContext(text, gradient, charIndex, totalChars, barIndex, totalBars, rowIndex = 0, totalRows = 1) {
    const { colors, direction = "horizontal", reverse = false } = gradient;
    if (colors.length === 0 || text.length === 0) return text;
    const chars = [...text];
    let result = "";
    for (let i = 0; i < chars.length; i++) {
      let position;
      if (direction === "vertical") {
        position = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
      } else if (direction === "diagonal") {
        const globalCharIndex = charIndex + i;
        const hPos = totalChars > 1 ? globalCharIndex / (totalChars - 1) : 0;
        const vPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        position = (hPos + vPos) / 2;
      } else {
        const globalCharIndex = charIndex + i;
        position = totalChars > 1 ? globalCharIndex / (totalChars - 1) : 0;
      }
      if (reverse) {
        position = 1 - position;
      }
      const [r, g, b] = this.getColorAtPosition(gradient, position);
      result += `\x1B[38;2;${r};${g};${b}m${chars[i]}\x1B[39m`;
    }
    return result;
  }
  applyGradient(text, gradient) {
    return applyGradientToText(text, gradient, this.getThemeColors());
  }
  applyDecorators(text) {
    if (!this.options.richLabels) return text;
    const decorators = {
      "*": { symbol: 1, reset: 22 },
      // bold
      "~": { symbol: 2, reset: 22 },
      // dim
      "%": { symbol: 3, reset: 23 },
      // italic
      "!": { symbol: 4, reset: 24 },
      // underline
      "^": { symbol: 5, reset: 25 },
      // blink
      "@": { symbol: 7, reset: 27 },
      // invert
      "#": { symbol: 8, reset: 28 },
      // hidden
      "$": { symbol: 9, reset: 29 }
      // strikeout
    };
    let result = text;
    for (const [char, { symbol, reset }] of Object.entries(decorators)) {
      const escaped = char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`${escaped}(.+?)${escaped}`, "gs");
      result = result.replace(regex, `\x1B[${symbol}m$1\x1B[${reset}m`);
    }
    return result;
  }
  stripStyle(label) {
    return label.replace(/\x1b\[[0-9;]*m/g, "");
  }
  getTitleConfig() {
    const { title } = this.options;
    if (!title) return void 0;
    if (typeof title === "string") {
      return { text: title };
    }
    return title;
  }
  parseTitlePadding(padding) {
    if (padding === void 0) {
      return { top: 0, right: 0, bottom: 0, left: 0 };
    }
    if (typeof padding === "number") {
      return { top: padding, right: padding, bottom: padding, left: padding };
    }
    if (padding.length === 2) {
      const [vertical, horizontal] = padding;
      return { top: vertical, right: horizontal, bottom: vertical, left: horizontal };
    }
    const [top, right, bottom, left] = padding;
    return { top, right, bottom, left };
  }
  formatTitle(width) {
    const titleConfig = this.getTitleConfig();
    if (!titleConfig) return "";
    const { text, align = "left", color, padding: titlePadding } = titleConfig;
    const { top, right, bottom, left } = this.parseTitlePadding(titlePadding);
    let formattedText = text;
    if (color === "gradient") {
      const chartColor = this.isGradient(this.options.color) ? this.options.color : this.isGradient(this.options._seriesColors?.[0]) ? this.options._seriesColors[0] : this.isGradient(this.options._bullColor) ? this.options._bullColor : void 0;
      if (chartColor) {
        formattedText = this.colorify(text, chartColor);
      }
    } else if (color) {
      formattedText = this.colorify(text, color);
    }
    if (align === "left" && !titlePadding) {
    } else if (align !== "left") {
      if (width && width > text.length) {
        const availableSpace = width - text.length;
        switch (align) {
          case "center": {
            const leftPad = Math.floor(availableSpace / 2);
            const rightPad = availableSpace - leftPad;
            formattedText = " ".repeat(leftPad) + formattedText + " ".repeat(rightPad);
            break;
          }
          case "right":
            formattedText = " ".repeat(availableSpace) + formattedText;
            break;
        }
      }
    } else if (titlePadding) {
      formattedText = " ".repeat(left) + formattedText + " ".repeat(right);
    }
    const lines = [];
    for (let i = 0; i < top; i++) {
      lines.push("");
    }
    lines.push(formattedText);
    for (let i = 0; i < bottom; i++) {
      lines.push("");
    }
    return lines.join("\n");
  }
};
var formatter_default = ChartFormatter;

// formatters/horizontal.ts
var HorizontalChartFormatter = class extends formatter_default {
  constructor(options) {
    super(options);
  }
  calculateDefaultDimensions(barCount, totalSize, _charWidth) {
    const hasPadding = this.options.padding !== void 0;
    const chartPadding = hasPadding ? this.options.padding : 0;
    const defaultPadding = Math.floor((totalSize - chartPadding) / barCount);
    const barSize = this.options.barSize || defaultPadding || 1;
    const padding = hasPadding ? chartPadding : defaultPadding;
    return { barSize, padding };
  }
  format(chart) {
    const barCount = chart.size;
    const { barSize, padding } = this.calculateBarDimensions(barCount, this.options.height);
    const labels = [];
    const chartArray = Array.from(chart.values());
    const lines = Array.from(chart.entries()).map(([i, point]) => {
      const isLast = Number(i) === chart.size - 1;
      const barIndex = Number(i);
      labels.push(this.formatLabel(point, this.options.structure.y, barIndex, barCount));
      const ctx = {
        chart: chartArray,
        point,
        index: barIndex,
        barSize,
        padding: isLast ? 0 : padding
      };
      return this.formatLineWithContext(ctx);
    });
    const alignment = this.options.alignBars || "justify";
    const { leadingPad, trailingPad } = this.calculateVerticalPadding(barCount, barSize, padding, alignment);
    const topPadLines = this.buildAlignmentPadLines(leadingPad, labels);
    const bottomPadLines = this.buildAlignmentPadLines(trailingPad, labels);
    const strippedLabels = labels.map((l) => this.stripStyle(l));
    const maxLabelWidth = Math.max(...strippedLabels.map((label) => label.length - 1));
    const totalChartWidth = maxLabelWidth + 1 + this.options.width;
    return [
      this.formatChartLabel(totalChartWidth),
      ...topPadLines,
      ...lines,
      ...bottomPadLines,
      this.formatBottom(labels)
    ].join("\n");
  }
  calculateVerticalPadding(barCount, barSize, padding, alignment) {
    if (alignment === "justify" || alignment === "left" || alignment === "right") {
      return { leadingPad: 0, trailingPad: 0 };
    }
    const barsHeight = barCount * (barSize + padding) - padding;
    return this.calculateAlignmentPadding(barsHeight, this.options.height, alignment);
  }
  buildAlignmentPadLines(count, labels) {
    if (count <= 0) return [];
    const strippedLabels = labels.map((l) => this.stripStyle(l));
    const maxLabelLength = Math.max(...strippedLabels.map((label) => label.length - 1));
    const axisChar = this.formatStructure(this.options.structure.axis);
    const linePad = this.options.labels ? this.pad(maxLabelLength) : "";
    return Array.from({ length: count }, () => linePad + axisChar);
  }
  formatLineWithContext(ctx) {
    const label = this.formatLabel(ctx.point, this.options.structure.y, ctx.index, ctx.chart.length);
    const bar = this.formatBarWithContext(ctx, label);
    return `${label}${bar}`;
  }
  formatBarWithContext(ctx, label) {
    if (ctx.point.segments?.length) {
      return this.formatStackedBar(ctx.point, label, ctx.barSize, ctx.padding, ctx.index, ctx.chart.length, ctx.chart);
    }
    return this.formatSingleBarWithContext(ctx, label);
  }
  formatSingleBarWithContext(ctx, label) {
    const repeat = ctx.point.scaled / this.options.char.length;
    const color = ctx.point.color || this.options.color || "";
    const barChars = this.options.char?.repeat(repeat);
    const totalBars = ctx.chart.length;
    const currentMaxBarLength = Math.max(...ctx.chart.map((p) => Math.floor(p.scaled / this.options.char.length)));
    const finalMaxBarLength = this.options._finalMaxBarLength ?? currentMaxBarLength;
    const barEndPosition = finalMaxBarLength > 1 ? (repeat - 1) / (finalMaxBarLength - 1) : 0;
    if (this.isGradient(color)) {
      const gradient = this.normalizeGradient(color);
      const direction = gradient.direction || "horizontal";
      const reverse = gradient.reverse || false;
      const fill2 = this.options.fillColor === "auto" ? this.formatGradientFill(ctx.point, gradient, ctx.index, totalBars, finalMaxBarLength, repeat) : this.formatFill(ctx.point);
      if (direction === "vertical" || direction === "diagonal") {
        const totalChars = finalMaxBarLength * totalBars;
        const chars = [...barChars];
        let result = "";
        for (let i = 0; i < chars.length; i++) {
          const globalCharIndex = ctx.index * finalMaxBarLength + i;
          let position;
          if (direction === "diagonal") {
            const hPos = finalMaxBarLength > 1 ? i / (finalMaxBarLength - 1) : 0;
            const vPos = totalChars > 1 ? globalCharIndex / (totalChars - 1) : 0;
            position = (hPos + vPos) / 2;
          } else {
            position = totalChars > 1 ? globalCharIndex / (totalChars - 1) : 0;
          }
          if (reverse) position = 1 - position;
          const [r, g, b] = this.getColorAtPosition(gradient, position);
          result += `\x1B[38;2;${r};${g};${b}m${chars[i]}\x1B[39m`;
        }
        const barContent3 = result + fill2;
        return this.scaleBar(barContent3, ctx.point, label, ctx.barSize, ctx.padding, ctx.index, totalBars, void 0, barEndPosition);
      }
      const coloredBar = this.applyGradientWithContext(barChars, gradient, 0, finalMaxBarLength, ctx.index, totalBars);
      const barContent2 = coloredBar + fill2;
      return this.scaleBar(barContent2, ctx.point, label, ctx.barSize, ctx.padding, ctx.index, totalBars, void 0, barEndPosition);
    }
    const fill = this.formatFill(ctx.point);
    if (this.options.fillColor) {
      const coloredBar = color ? this.colorify(barChars, color) : barChars;
      const barContent2 = coloredBar + fill;
      return this.scaleBar(barContent2, ctx.point, label, ctx.barSize, ctx.padding, ctx.index, totalBars, void 0, barEndPosition);
    }
    const barContent = barChars + fill;
    return this.scaleBar(barContent, ctx.point, label, ctx.barSize, ctx.padding, ctx.index, totalBars, color, barEndPosition);
  }
  formatStackedBar(point, label, barSize, padding, barIndex, totalBars, chart) {
    const combinedBar = this.buildStackedBarContent(point.segments);
    const barWithFill = combinedBar + this.formatFill(point);
    const valueLabel = this.getStackedValueLabel(point);
    const maxBarLength = Math.max(...chart.map((p) => Math.floor(p.scaled / this.options.char.length)));
    const barLength = Math.floor(point.scaled / this.options.char.length);
    const barEndPosition = maxBarLength > 1 ? (barLength - 1) / (maxBarLength - 1) : 0;
    return this.buildScaledBar(barWithFill, point, label, barSize, padding, valueLabel, barIndex, totalBars, void 0, barEndPosition);
  }
  buildStackedBarContent(segments) {
    return segments.map((seg) => this.formatSegment(seg)).join("");
  }
  formatSegment(segment) {
    const repeat = Math.floor(segment.scaled / this.options.char.length);
    const segmentBar = this.options.char?.repeat(repeat);
    return segment.color ? this.colorify(segmentBar, segment.color) : segmentBar;
  }
  getStackedValueLabel(point) {
    if ((this.options.valueLabels || this.options.stackValueLabels) && point.segments) {
      return this.formatStackedValueLabel(point.segments);
    }
    return this.formatValueWithDecimals(point.value);
  }
  scaleBar(bar, point, label, barSize, padding, barIndex, totalBars, color, barEndPosition) {
    const valueLabel = this.formatValueWithDecimals(point.value);
    return this.buildScaledBar(bar, point, label, barSize, padding, valueLabel, barIndex, totalBars, color, barEndPosition);
  }
  buildScaledBar(bar, point, label, barSize, padding, valueLabel, barIndex, totalBars, color, barEndPosition) {
    const space = this.calculateLabelSpace(label);
    const barLines = this.buildBarLines(bar, point, space, barSize, valueLabel, barIndex, totalBars, color, barEndPosition);
    const paddingLines = this.buildPaddingLines(space, padding);
    return [...barLines, ...paddingLines].join("\n");
  }
  calculateLabelSpace(label) {
    const strippedLabel = this.stripStyle(label);
    const naked = this.options.naked ? 0 : 1;
    return strippedLabel.length - naked;
  }
  buildBarLines(bar, point, space, barSize, valueLabel, barIndex, totalBars, color, barEndPosition) {
    return Array.from(
      { length: barSize },
      (_, index) => this.buildBarLine(bar, point, space, index, valueLabel, barIndex, totalBars, color, barEndPosition)
    );
  }
  buildBarLine(bar, point, space, index, valueLabel, barIndex, totalBars, color, barEndPosition) {
    const axisChar = this.formatStructure(this.options.structure.axis);
    const linePad = index !== 0 ? this.pad(space) + axisChar : "";
    const shouldShowValue = (this.options.valueLabels || this.options.stackValueLabels) && index === 0;
    const barContent = color ? this.colorify(bar, color) : bar;
    let lineContent;
    if (shouldShowValue) {
      let valueLabelColor;
      if (this.options.fill && this.options.fillColor) {
        if (this.options.fillColor === "auto") {
          const pointColor = point.color || this.options.color;
          valueLabelColor = this.getValueLabelColorForBar(pointColor, barIndex, totalBars, 1);
        } else {
          valueLabelColor = this.options.fillColor;
        }
      } else {
        const pointColor = point.color || this.options.color;
        valueLabelColor = this.getValueLabelColorForBar(pointColor, barIndex, totalBars, barEndPosition);
      }
      const coloredValueLabel = valueLabelColor ? this.colorify(valueLabel, valueLabelColor) : valueLabel;
      lineContent = barContent + this.pad(1) + coloredValueLabel;
    } else {
      lineContent = barContent;
    }
    return linePad + lineContent;
  }
  buildPaddingLines(space, padding) {
    const axisChar = this.formatStructure(this.options.structure.axis);
    const linePad = this.options.labels ? this.pad(space) : "";
    return Array.from({ length: padding }, () => linePad + axisChar);
  }
  formatFill(point, lastBarColor) {
    if (!this.options.fill) return "";
    const diff = this.options.width - point.scaled;
    const fillLength = this.options.fill.length;
    let fillStr = "";
    if (this.options.scale) {
      const width = Math.floor(this.options.width - Math.floor(point.scaled));
      const fillCount = Math.floor(width / fillLength);
      fillStr = fillCount > 0 ? this.options.fill.repeat(fillCount) : "";
    } else {
      const fillCount = Math.floor(diff / fillLength);
      fillStr = fillCount > 0 ? this.options.fill.repeat(fillCount) : "";
    }
    if (!fillStr) return "";
    if (this.options.fillColor) {
      if (this.options.fillColor === "auto") {
        if (lastBarColor) {
          return `\x1B[38;2;${lastBarColor}m${fillStr}\x1B[39m`;
        }
        const barColor = point.color || this.options.color;
        if (barColor && !this.isGradient(barColor)) {
          return this.colorify(fillStr, barColor);
        }
      } else {
        return this.colorify(fillStr, this.options.fillColor);
      }
    }
    return fillStr;
  }
  formatGradientFill(point, gradient, barIndex, totalBars, finalMaxBarLength, currentBarLength) {
    if (!this.options.fill) return "";
    const diff = this.options.width - point.scaled;
    const fillLength = this.options.fill.length;
    let fillCount = 0;
    if (this.options.scale) {
      const width = Math.floor(this.options.width - Math.floor(point.scaled));
      fillCount = Math.floor(width / fillLength);
    } else {
      fillCount = Math.floor(diff / fillLength);
    }
    if (fillCount <= 0) return "";
    const direction = gradient.direction || "horizontal";
    const reverse = gradient.reverse || false;
    let result = "";
    for (let i = 0; i < fillCount; i++) {
      const charIndexInBar = Math.floor(currentBarLength) + i;
      let position;
      if (direction === "vertical") {
        const totalChars = finalMaxBarLength * totalBars;
        const globalCharIndex = barIndex * finalMaxBarLength + charIndexInBar;
        position = totalChars > 1 ? globalCharIndex / (totalChars - 1) : 0;
      } else if (direction === "diagonal") {
        const hPos = finalMaxBarLength > 1 ? charIndexInBar / (finalMaxBarLength - 1) : 0;
        const vPos = totalBars > 1 ? barIndex / (totalBars - 1) : 0;
        position = (hPos + vPos) / 2;
      } else {
        position = finalMaxBarLength > 1 ? charIndexInBar / (finalMaxBarLength - 1) : 0;
      }
      if (reverse) position = 1 - position;
      const [r, g, b] = this.getColorAtPosition(gradient, position);
      result += `\x1B[38;2;${r};${g};${b}m${this.options.fill}\x1B[39m`;
    }
    return result;
  }
  formatLabel(point, key, barIndex, totalBars) {
    const percentage = this.formatPercentage(point);
    const baseLabel = percentage ? `${point.label} ${percentage}` : point.label;
    const formatted = this.options.labelFormat ? this.options.labelFormat(baseLabel) : baseLabel;
    const label = this.applyDecorators(formatted);
    const space = this.formatLabelSpace(label);
    if (!this.options.labels) {
      return this.formatStructure(this.options.structure.axis);
    }
    const pointColor = point.color || this.options.color;
    const labelColor = this.getLabelColorForBar(pointColor, barIndex, totalBars);
    const coloredLabel = this.options.colorLabels && labelColor ? this.colorify(label, labelColor) : label;
    return `${coloredLabel}${space}${this.formatStructure(key)}`;
  }
  formatLabelSpace(label) {
    if (!this.options.max.label) return "";
    const addOne = this.offsetPercentage();
    const space = this.options.max.label - this.stripStyle(label).length + addOne;
    return this.pad(space);
  }
  formatChartLabel(totalWidth) {
    return this.formatTitle(totalWidth);
  }
  formatStructure(structChar) {
    if (this.options.naked) return "";
    return this.colors.colors.reset + structChar;
  }
  formatBottom(labels) {
    if (this.options.naked) return "";
    const strippedLabels = labels.map((l) => this.stripStyle(l));
    const max = Math.max(...strippedLabels.map((label) => label.length - 1));
    return this.pad(max) + this.options.structure.bottomLeft + this.options.structure.x.repeat(this.options.width);
  }
  pad(space) {
    return " ".repeat(space);
  }
  offsetPercentage() {
    return this.options.labels && !this.options.percentage ? 1 : 0;
  }
};
var horizontal_default = HorizontalChartFormatter;

// validator/validator.ts
var ChartValidator = class {
  constructor(options) {
    this.options = options;
  }
  error(text) {
    return new Error(text);
  }
  validate(data) {
    if (!Array.isArray(data)) throw new Error("Input data must be an array");
    if (typeof data[0] === "string") throw new Error("Input values must be numbers. e.g [1, 2, 3] or [{value: 1}, {value: 2}]");
    if (!data.length) throw new Error("No data provided");
    if (this.options.barSize === 0) throw new Error("barSize cannot be 0");
    this.validateStackedData(data);
  }
  isStackedPoint(point) {
    return typeof point !== "number" && Array.isArray(point.value);
  }
  validateStackedData(data) {
    if (this.options.type === "candlestick" || this.options.type === "status") return;
    const stackedPoints = data.filter((d) => this.isStackedPoint(d));
    if (stackedPoints.length === 0) return;
    const segmentCounts = stackedPoints.map((d) => {
      const value = d.value;
      return value.length;
    });
    const uniqueCounts = new Set(segmentCounts);
    if (uniqueCounts.size > 1) {
      throw new Error("All stacked bars must have the same number of segments");
    }
    const segmentCount = segmentCounts[0];
    if (this.options.stackColors && this.options.stackColors.length !== segmentCount) {
      console.warn(`stackColors count (${this.options.stackColors.length}) does not match segment count (${segmentCount})`);
    }
  }
};
var validator_default = ChartValidator;

// processor/processor.ts
var AUTO_COLORS = [
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "cyan",
  "pink",
  "orange",
  "marine"
];
var ChartProcessor = class {
  constructor(options) {
    this.validator = new validator_default(options);
    if (options.color && !Array.isArray(options.color)) {
      options.color = normalizeColor(options.color);
    }
    this.options = options;
  }
  isStackedPoint(point) {
    if (this.isCandlestick()) return false;
    if (this.isStatus()) return false;
    return typeof point !== "number" && Array.isArray(point.value);
  }
  isCandlestick() {
    return this.options.type === "candlestick";
  }
  isStatus() {
    return this.options.type === "status";
  }
  getStatus(point) {
    if (typeof point === "number") return String(point);
    const v = point.value;
    if (typeof v === "number") return String(v);
    if (typeof v === "string") return v;
    return void 0;
  }
  /**
   * Status row mode: when `value` is an array of numbers/strings, return one
   * status key per cell. Used by the status formatter to render a row of
   * colored cells with the point's `label` on the left.
   */
  getStatuses(point) {
    if (typeof point === "number") return void 0;
    const v = point.value;
    if (!Array.isArray(v)) return void 0;
    return v.map((entry) => {
      if (typeof entry === "number" || typeof entry === "string") return String(entry);
      return String(entry.value);
    });
  }
  getOHLC(point) {
    if (typeof point === "number") return void 0;
    const v = point.value;
    if (!Array.isArray(v) || v.length < 4) return void 0;
    const num = (x) => typeof x === "number" ? x : x.value;
    return [num(v[0]), num(v[1]), num(v[2]), num(v[3])];
  }
  isGradient(color) {
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    return isGradientObject(normalized);
  }
  interpolateGradient(gradient, index, total) {
    const result = interpolateGradientColor(gradient, index, total);
    return result || this.options.color || "";
  }
  getSegmentValue(segment) {
    return typeof segment === "number" ? segment : segment.value;
  }
  getPointValue(point) {
    if (this.isStatus()) return 0;
    if (this.isCandlestick()) {
      const ohlc = this.getOHLC(point);
      if (ohlc) return ohlc[3];
    }
    if (typeof point === "number") return point;
    if (this.isStackedPoint(point)) {
      return point.value.reduce(
        (sum, seg) => sum + this.getSegmentValue(seg),
        0
      );
    }
    return point.value;
  }
  getPointLabel(point, value) {
    if (typeof point === "number") {
      return this.isStatus() ? "" : point.toString();
    }
    if (point.label) return point.label;
    if (this.isCandlestick()) return value.toString();
    if (this.isStatus()) return "";
    if (this.isStackedPoint(point)) return value.toString();
    return point.value.toString();
  }
  getPointColor(point) {
    if (typeof point === "number") {
      const color2 = this.options.color;
      if (typeof color2 === "string") return color2 || void 0;
      return void 0;
    }
    if (Array.isArray(point.color)) {
      const optColor = this.options.color;
      return point.color[0] || (typeof optColor === "string" ? optColor : void 0) || void 0;
    }
    if (typeof point.color === "string") return point.color || void 0;
    const color = this.options.color;
    return (typeof color === "string" ? color : void 0) || void 0;
  }
  getPointSegments(point, value) {
    if (!this.isStackedPoint(point)) return void 0;
    const pointColors = this.getPointColorArray(point);
    return this.processSegments(point.value, value, pointColors);
  }
  getPointColorArray(point) {
    if (typeof point === "number") return void 0;
    if (Array.isArray(point.color)) return point.color;
    return void 0;
  }
  calculateTotal(data) {
    return data.reduce((sum, point) => sum + this.getPointValue(point), 0);
  }
  calculateData(data) {
    const total = this.calculateTotal(data);
    if (this.isStatus()) {
      return data.reduce((sum, point) => sum + this.getPointValue(point), 0);
    }
    data.forEach((point) => {
      if (this.isCandlestick()) {
        const ohlc = this.getOHLC(point);
        if (ohlc) {
          const [, high, low] = ohlc;
          this.options.max.value = Math.max(high, this.options.max.value);
          this.options.max.min = this.options.max.min === void 0 ? low : Math.min(low, this.options.max.min);
          return;
        }
      }
      const value = this.getPointValue(point);
      this.options.max.value = Math.max(value, this.options.max.value);
      if (this.options.max.min === void 0) {
        this.options.max.min = value;
      } else {
        this.options.max.min = Math.min(value, this.options.max.min);
      }
    });
    return data.reduce((sum, point) => {
      const value = this.getPointValue(point);
      const label = this.getPointLabel(point, value);
      const percentage = this.percentage(value, total);
      const percentageLength = this.options.percentage ? (isNaN(percentage) ? 3 : percentage.toFixed(2).length) + 5 : 0;
      const decoratorSymbols = /([*~%!^@#])(.+?)\1/g;
      const visualLabel = this.options.richLabels !== false ? label.replace(decoratorSymbols, "$2") : label;
      let baseLabelLength = this.options.percentage ? visualLabel.length + percentageLength : visualLabel.length;
      if (this.options.labelFormat) {
        const fullLabel = this.options.percentage ? `${label} (${percentage.toFixed(2)}%)` : label;
        const formattedLabel = this.options.labelFormat(fullLabel);
        const strippedFormatted = formattedLabel.replace(/\x1b\[[0-9;]*m/g, "");
        baseLabelLength = strippedFormatted.length;
      }
      if (this.options.labels) {
        if (this.options._maxLabel !== void 0) {
          this.options.max.label = this.options._maxLabel;
        } else {
          this.options.max.label = Math.max(baseLabelLength, this.options.max.label);
        }
      }
      this.options.max.scaled = Math.max(this.scale(value), this.options.max.scaled);
      return sum + value;
    }, 0);
  }
  percentage(value, total) {
    if (!this.options.percentage) return 0;
    return value / total * 100;
  }
  scale(value) {
    const size = this.options.orientation === "vertical" ? this.options.height : this.options.width;
    const { scale, max } = this.options;
    if (scale === "auto" || scale === void 0) {
      return Math.ceil(value / max.value * size);
    }
    if (scale === "relative" && max.min !== void 0 && max.min !== max.value) {
      const range = max.value - max.min;
      const normalized = value - max.min;
      return Math.ceil((normalized + 1) / (range + 1) * size);
    }
    if (scale === "relative-zero" && max.min !== void 0 && max.min !== max.value) {
      const range = max.value - max.min;
      const normalized = value - max.min;
      return Math.ceil(normalized / range * size);
    }
    if (typeof scale === "number" && scale > 0) {
      return Math.min(Math.round(value / scale), size);
    }
    return Math.min(value, size);
  }
  processSegments(segments, totalBarValue, pointColors) {
    const totalScaled = this.scale(totalBarValue);
    const rawSegments = segments.map((seg, index) => {
      const value = this.getSegmentValue(seg);
      const color = this.getSegmentColor(seg, index, pointColors);
      const proportion = totalBarValue > 0 ? value / totalBarValue : 0;
      const scaled = Math.floor(proportion * totalScaled);
      const percentage = totalBarValue > 0 ? value / totalBarValue * 100 : 0;
      return { value, color, scaled, percentage };
    });
    const sumScaled = rawSegments.reduce((sum, seg) => sum + seg.scaled, 0);
    const remainder = totalScaled - sumScaled;
    if (remainder > 0) {
      const largestIndex = rawSegments.reduce((maxIdx, seg, idx, arr) => {
        return seg.value > arr[maxIdx].value ? idx : maxIdx;
      }, 0);
      rawSegments[largestIndex].scaled += remainder;
    }
    return rawSegments;
  }
  applyAutoColor(data) {
    return data.map((point, index) => {
      const color = AUTO_COLORS[index % AUTO_COLORS.length];
      if (typeof point === "number") {
        return { value: point, color };
      }
      if (point.color) {
        return point;
      }
      return { ...point, color };
    });
  }
  applyAutoStackColors(data) {
    if (!this.options.stackColors || this.options.stackColors.length === 0) {
      let maxSegments = 0;
      data.forEach((point) => {
        if (this.isStackedPoint(point)) {
          maxSegments = Math.max(maxSegments, point.value.length);
        }
      });
      if (maxSegments > 0) {
        this.options.stackColors = AUTO_COLORS.slice(0, maxSegments);
      }
    }
  }
  applyGradient(data, gradient) {
    return data.map((point, index) => {
      const color = this.interpolateGradient(gradient, index, data.length);
      if (typeof point === "number") {
        return { value: point, color };
      }
      if (point.color) {
        return point;
      }
      return { ...point, color };
    });
  }
  preprocess(data) {
    let workingData = data;
    if (this.options.color === "auto") {
      workingData = this.applyAutoColor(workingData);
      this.applyAutoStackColors(workingData);
      this.options.color = "";
    }
    const sorted = this.sort(workingData);
    const key = this.options.structure.y;
    const total = this.calculateData(workingData);
    const processed = this.options.reverse ? sorted.reverse() : sorted;
    return { processed, key, total };
  }
  process(data) {
    const { processed, total } = this.preprocess(data);
    this.validator.validate(data);
    const chartData = /* @__PURE__ */ new Map();
    processed.forEach((point, index) => {
      chartData.set(index, this.createChartPoint(point, total));
    });
    return [chartData, this.options];
  }
  sort(data) {
    if (!this.options.sort || this.isCandlestick() || this.isStatus()) return data;
    return data.sort((a, b) => this.getPointValue(a) - this.getPointValue(b));
  }
  getSegmentColor(segment, index, pointColors) {
    const segmentColor = typeof segment === "object" ? segment.color : void 0;
    if (segmentColor) return segmentColor;
    if (pointColors?.[index]) return pointColors[index];
    if (this.options.stackColors?.[index]) return this.options.stackColors[index];
    const color = this.options.color;
    return typeof color === "string" ? color : "";
  }
  createChartPoint(point, total) {
    const value = this.getPointValue(point);
    const segments = this.getPointSegments(point, value);
    const ohlc = this.isCandlestick() ? this.getOHLC(point) : void 0;
    const statuses = this.isStatus() ? this.getStatuses(point) : void 0;
    const status = this.isStatus() && !statuses ? this.getStatus(point) : void 0;
    return {
      label: this.getPointLabel(point, value),
      value,
      color: this.getPointColor(point),
      scaled: Number(this.scale(value).toFixed(2)),
      percentage: this.percentage(value, total),
      ...segments && { segments },
      ...ohlc && { ohlc },
      ...status && { status },
      ...statuses && { statuses }
    };
  }
};
var processor_default = ChartProcessor;

// options/options.ts
var defaultOptions = {
  percentage: false,
  colorLabels: true,
  sort: false,
  reverse: false,
  color: void 0,
  title: "",
  labels: true,
  char: "\u2588",
  naked: false,
  width: 100,
  height: 10,
  padding: 0,
  orientation: "horizontal",
  theme: "",
  scale: "auto",
  structure: {
    x: "\u2550",
    y: "\u2562",
    axis: "\u2551",
    topLeft: "\u2554",
    bottomLeft: "\u255A"
  },
  stackColors: void 0,
  stackLabels: void 0,
  stackValueLabels: false,
  alignBars: "justify",
  fillColor: void 0,
  richLabels: true,
  type: "bar",
  variant: "sharp"
};
function createOptions(options) {
  return {
    ...defaultOptions,
    ...options,
    max: {
      label: 0,
      value: 0,
      scaled: 0
    },
    structure: {
      ...defaultOptions.structure,
      ...options?.structure
    }
  };
}

// formatters/vertical.ts
var VerticalChartFormatter = class extends formatter_default {
  constructor(options) {
    super(options);
  }
  calculateDefaultDimensions(barCount, totalSize, charWidth) {
    const defaultBarSize = this.options.barSize || 1;
    const calculatedBarWidth = Math.floor(totalSize / (defaultBarSize * barCount) / charWidth) + 1;
    const barSize = this.options.barSize === void 0 ? calculatedBarWidth : this.options.barSize;
    const calculatedPadding = Math.round(totalSize / barCount / charWidth);
    const defaultPadding = calculatedPadding <= barSize ? 0 : calculatedPadding - barSize;
    const padding = this.options.padding || defaultPadding;
    return { barSize, padding };
  }
  format(chartData) {
    const chart = [...chartData.values()];
    const maxHeight = this.getMaxHeight();
    const charWidth = this.options.char.length;
    const { barSize, padding } = this.calculateBarDimensions(
      chart.length,
      this.options.width,
      charWidth
    );
    const verticalChart = this.buildVerticalChart(chart.length, maxHeight, padding);
    this.formatChart(chart, verticalChart, maxHeight, padding, barSize);
    return this.composeFinalChart(chart, verticalChart, barSize, padding, maxHeight);
  }
  getMaxHeight() {
    return this.options.height + ((this.options.valueLabels || this.options.stackValueLabels) && !this.options.fill ? 1 : 0);
  }
  isLongChar() {
    return this.options.char.length > 1;
  }
  isFillLonger() {
    const length = this.options.fill?.length || 0;
    return length > 0 && length > this.options.char.length;
  }
  getFillChar() {
    const { char, fill } = this.getCharLengths();
    return fill > 0 && fill < char ? this.options.fill.repeat(char) : this.options.fill;
  }
  getCharLengths() {
    return {
      char: this.options.char.length,
      fill: this.options.fill?.length || 0
    };
  }
  getCharWidth() {
    if (this.isLongChar()) return this.options.char.length;
    if (this.isFillLonger()) return this.options.fill.length;
    return 1;
  }
  getScaledBarSize(barSize) {
    const { char, fill } = this.getCharLengths();
    if (fill > 1 && char > 1) return barSize;
    if (this.isFillLonger()) return Math.round(barSize / fill);
    return barSize;
  }
  getHorizontalAlignmentPadding(chartLength, barSize, padding) {
    const alignment = this.options.alignBars || "justify";
    if (alignment === "justify") {
      return { leftPad: 0, rightPad: 0 };
    }
    const charWidth = this.getCharWidth();
    const scaledBarSize = this.getScaledBarSize(barSize);
    const barsWidth = (scaledBarSize * charWidth + padding) * chartLength - padding;
    const { leadingPad, trailingPad } = this.calculateAlignmentPadding(
      barsWidth,
      this.options.width,
      alignment
    );
    return { leftPad: leadingPad, rightPad: trailingPad };
  }
  buildVerticalChart(chartLength, maxHeight, padding) {
    return Array.from(
      { length: maxHeight },
      () => Array.from({ length: chartLength }, () => " ".repeat(padding))
    );
  }
  formatChart(chart, verticalChart, maxHeight, padding, barSize) {
    chart.forEach((point, index) => {
      const isLast = index === chart.length - 1;
      const context = { chart, verticalChart, point, index, maxHeight, padding: isLast ? 0 : padding, barSize };
      if (point.segments?.length) {
        this.formatStackedColumn(context);
      } else {
        this.formatSingleColumn(context);
      }
    });
  }
  formatSingleColumn(ctx) {
    const barHeight = this.calculateBarHeight(ctx.point.scaled, ctx.maxHeight);
    const barStartRow = ctx.maxHeight - barHeight;
    Array.from({ length: ctx.maxHeight }, (_, row) => {
      ctx.verticalChart[row][ctx.index] = this.getCellContent(ctx, row, barStartRow);
    });
  }
  getCellContent(ctx, row, barStartRow) {
    const isValueLabelRow = row === barStartRow - 1 && (this.options.valueLabels || this.options.stackValueLabels) && !this.options.fill;
    const isAboveBar = row < barStartRow;
    const isBarRow = row >= barStartRow;
    if (isValueLabelRow) {
      return this.formatValueLabelCell(ctx.point, ctx.barSize, ctx.padding, ctx.index, ctx.chart.length, ctx.chart, ctx.maxHeight);
    }
    if (isAboveBar) {
      return this.formatEmptyCell(ctx.barSize, ctx.padding, ctx.point.color, row, ctx.index, ctx.chart.length, ctx.maxHeight);
    }
    if (isBarRow) {
      return this.formatBarCellWithContext(ctx, row, barStartRow);
    }
    return this.formatSpace(ctx.barSize, ctx.padding);
  }
  formatBarCellWithContext(ctx, row, barStartRow) {
    const barWidth = this.calculateBarWidth(ctx.barSize);
    const value = this.options.char.repeat(barWidth);
    const padding = " ".repeat(ctx.padding);
    const effectiveColor = ctx.point.color || this.options.color;
    if (this.isGradient(effectiveColor)) {
      const gradient = this.normalizeGradient(effectiveColor);
      const direction = gradient.direction || "horizontal";
      const reverse = gradient.reverse || false;
      const totalBars = ctx.chart.length;
      if (direction === "vertical") {
        const chars = [...value];
        let result = "";
        const charsPerRow = barWidth * totalBars;
        for (let i = 0; i < chars.length; i++) {
          const rowPosition = ctx.maxHeight > 1 ? row / (ctx.maxHeight - 1) : 0;
          const rowSpan = ctx.maxHeight > 1 ? 1 / (ctx.maxHeight - 1) : 1;
          const charIndexInRow = ctx.index * barWidth + i;
          const charFraction = charsPerRow > 1 ? charIndexInRow / (charsPerRow - 1) : 0;
          let position = rowPosition + (charFraction - 0.5) * rowSpan * 0.5;
          position = Math.max(0, Math.min(1, position));
          if (reverse) position = 1 - position;
          const [r, g, b] = this.getColorAtPosition(gradient, position);
          result += `\x1B[38;2;${r};${g};${b}m${chars[i]}\x1B[39m`;
        }
        return result + padding;
      } else if (direction === "diagonal") {
        const chars = [...value];
        let result = "";
        const totalChars = barWidth * totalBars;
        for (let i = 0; i < chars.length; i++) {
          const charIndex = ctx.index * barWidth + i;
          const hPos = totalChars > 1 ? charIndex / (totalChars - 1) : 0;
          const vPos = ctx.maxHeight > 1 ? row / (ctx.maxHeight - 1) : 0;
          let position = (hPos + vPos) / 2;
          if (reverse) position = 1 - position;
          const [r, g, b] = this.getColorAtPosition(gradient, position);
          result += `\x1B[38;2;${r};${g};${b}m${chars[i]}\x1B[39m`;
        }
        return result + padding;
      } else {
        const totalChars = barWidth * totalBars;
        const charIndex = ctx.index * barWidth;
        return this.applyGradientWithContext(value, gradient, charIndex, totalChars, ctx.index, totalBars) + padding;
      }
    }
    return effectiveColor ? this.colorify(value, effectiveColor) + padding : value + padding;
  }
  formatStackedColumn(ctx) {
    const totalHeight = this.calculateBarHeight(ctx.point.scaled, ctx.maxHeight);
    const segments = ctx.point.segments;
    const segmentHeights = segments.map((seg) => this.calculateBarHeight(seg.scaled, ctx.maxHeight));
    this.fillStackedSegments(ctx, segments, segmentHeights);
    this.fillEmptyRows(ctx, totalHeight, segments[0]?.color || ctx.point.color);
    this.addValueLabelIfNeeded(ctx, totalHeight);
  }
  fillStackedSegments(ctx, segments, segmentHeights) {
    let currentRow = ctx.maxHeight - 1;
    segments.forEach((segment, segIdx) => {
      const segmentEndRow = currentRow - segmentHeights[segIdx] + 1;
      for (let row = currentRow; row >= segmentEndRow && row >= 0; row--) {
        ctx.verticalChart[row][ctx.index] = this.formatBarCell(ctx.barSize, ctx.padding, segment.color);
      }
      currentRow = segmentEndRow - 1;
    });
  }
  fillEmptyRows(ctx, totalHeight, color) {
    const emptyStartRow = ctx.maxHeight - totalHeight - 1;
    for (let row = emptyStartRow; row >= 0; row--) {
      ctx.verticalChart[row][ctx.index] = this.formatEmptyCell(ctx.barSize, ctx.padding, color, row, ctx.index, ctx.chart.length, ctx.maxHeight);
    }
  }
  addValueLabelIfNeeded(ctx, totalHeight) {
    const emptyStartRow = ctx.maxHeight - totalHeight - 1;
    const shouldShowLabel = (this.options.valueLabels || this.options.stackValueLabels) && !this.options.fill && emptyStartRow >= 0;
    if (shouldShowLabel) {
      ctx.verticalChart[emptyStartRow][ctx.index] = this.formatValueLabelCell(ctx.point, ctx.barSize, ctx.padding, ctx.index, ctx.chart.length, ctx.chart, ctx.maxHeight);
    }
  }
  calculateBarHeight(scaled, maxHeight) {
    return Math.round(scaled / maxHeight * maxHeight);
  }
  formatValueLabelCell(point, barSize, padding, barIndex, totalBars, chart, maxHeight) {
    const label = this.formatValueLabel(point, barIndex, totalBars, chart, maxHeight);
    const space = Math.max(0, barSize - this.stripStyle(label).length + padding);
    return label + " ".repeat(space);
  }
  formatEmptyCell(barSize, padding, color, row, barIndex, totalBars, maxHeight) {
    return this.options.fill ? this.formatFillCell(barSize, padding, color, row, barIndex, totalBars, maxHeight) : this.formatSpace(barSize, padding);
  }
  formatSpace(barSize, padding) {
    const width = this.isLongChar() ? barSize * this.options.char.length : barSize;
    return " ".repeat(width) + " ".repeat(padding);
  }
  calculateBarWidth(barSize) {
    return this.isFillLonger() ? barSize + (this.options.fill.length - this.options.char.length) : this.getScaledBarSize(barSize);
  }
  formatBarCell(barSize, padding, color) {
    const barWidth = this.calculateBarWidth(barSize);
    const value = this.options.char.repeat(barWidth) + " ".repeat(padding);
    const effectiveColor = color || this.options.color;
    return effectiveColor ? this.colorify(value, effectiveColor) : value;
  }
  formatFillCell(barSize, padding, color, row, barIndex, totalBars, maxHeight) {
    const character = this.getFillChar();
    if (!character) return "";
    const barWidth = this.getScaledBarSize(barSize);
    const paddingStr = " ".repeat(padding);
    const effectiveColor = color || this.options.color;
    if (this.options.fillColor === "auto" && this.isGradient(effectiveColor)) {
      const gradient = this.normalizeGradient(effectiveColor);
      const direction = gradient.direction || "horizontal";
      const reverse = gradient.reverse || false;
      const finalMaxHeight = this.options._finalMaxBarLength ?? maxHeight ?? this.options.height;
      let result = "";
      for (let i = 0; i < barWidth; i++) {
        let position;
        if (direction === "vertical") {
          position = finalMaxHeight > 1 ? (row ?? 0) / (finalMaxHeight - 1) : 0;
        } else if (direction === "diagonal") {
          const charIndex = (barIndex ?? 0) * barWidth + i;
          const totalChars = barWidth * (totalBars ?? 1);
          const hPos = totalChars > 1 ? charIndex / (totalChars - 1) : 0;
          const vPos = finalMaxHeight > 1 ? (row ?? 0) / (finalMaxHeight - 1) : 0;
          position = (hPos + vPos) / 2;
        } else {
          const charIndex = (barIndex ?? 0) * barWidth + i;
          const totalChars = barWidth * (totalBars ?? 1);
          position = totalChars > 1 ? charIndex / (totalChars - 1) : 0;
        }
        if (reverse) position = 1 - position;
        const [r, g, b] = this.getColorAtPosition(gradient, position);
        result += `\x1B[38;2;${r};${g};${b}m${character}\x1B[39m`;
      }
      return result + paddingStr;
    }
    const value = character.repeat(barWidth) + paddingStr;
    let fillColor;
    if (this.options.fillColor === "auto") {
      fillColor = effectiveColor;
    } else if (this.options.fillColor) {
      fillColor = this.options.fillColor;
    } else {
      fillColor = color;
    }
    return fillColor ? this.colorify(value, fillColor) : value;
  }
  formatLabel(point, barIndex, totalBars) {
    const baseLabel = point.percentage ? `${point.label} ${this.formatPercentage(point)}` : point.label;
    const formatted = this.options.labelFormat ? this.options.labelFormat(baseLabel) : baseLabel;
    const label = this.applyDecorators(formatted);
    if (!this.options.colorLabels) return label;
    const pointColor = point.color || this.options.color;
    const labelColor = this.getLabelColorForBar(pointColor, barIndex, totalBars);
    return labelColor ? this.colorify(label, labelColor) : label;
  }
  formatValueLabel(point, barIndex, totalBars, chart, maxHeight) {
    const value = point.segments ? this.formatStackedValueLabel(point.segments) : this.formatValueWithDecimals(point.value);
    if (!this.options.colorLabels) return value;
    const pointColor = point.color || this.options.color;
    let valueLabelColor;
    if (this.options.fill && this.options.fillColor) {
      if (this.options.fillColor === "auto") {
        valueLabelColor = this.getValueLabelColorForBar(pointColor, barIndex, totalBars, 0);
      } else {
        valueLabelColor = this.options.fillColor;
      }
    } else {
      let barEndPosition;
      if (chart && maxHeight && this.isGradient(pointColor)) {
        const gradient = this.normalizeGradient(pointColor);
        if (gradient.direction === "vertical") {
          const barHeight = this.calculateBarHeight(point.scaled, maxHeight);
          const barStartRow = maxHeight - barHeight;
          barEndPosition = maxHeight > 1 ? barStartRow / (maxHeight - 1) : 0;
        }
      }
      valueLabelColor = this.getValueLabelColorForBar(pointColor, barIndex, totalBars, barEndPosition);
    }
    return valueLabelColor ? this.colorify(value, valueLabelColor) : value;
  }
  formatLabels(chart, barSize, padding) {
    if (!this.options.labels) return "";
    const { leftPad } = this.getHorizontalAlignmentPadding(chart.length, barSize, padding);
    const labels = chart.map((point, i) => this.formatLabelEntry(point, barSize, i === chart.length - 1 ? 0 : padding, i, chart.length)).join("");
    return " ".repeat(leftPad) + labels;
  }
  formatLabelEntry(point, barSize, padding, index, totalBars) {
    return this.formatEntryWithLabel(this.formatLabel(point, index, totalBars), barSize, padding, index);
  }
  formatValueLabels(chart, barSize, padding, maxHeight) {
    if (!this.options.labels) return "";
    const { leftPad } = this.getHorizontalAlignmentPadding(chart.length, barSize, padding);
    const labels = chart.map((point, i) => this.formatValueLabelEntry(point, barSize, i === chart.length - 1 ? 0 : padding, i, chart.length, chart, maxHeight)).join("");
    return " ".repeat(leftPad) + labels;
  }
  formatValueLabelEntry(point, barSize, padding, index, totalBars, chart, maxHeight) {
    return this.formatEntryWithLabel(this.formatValueLabel(point, index, totalBars, chart, maxHeight), barSize, padding, index);
  }
  formatEntryWithLabel(formattedLabel, barSize, padding, index) {
    const label = this.stripStyle(formattedLabel);
    const charLength = this.getCharWidth();
    const barWidth = this.isLongChar() ? barSize * charLength + padding : barSize + padding + Math.floor(charLength / 2);
    const rightPad = Math.abs(barWidth - label.length);
    const isFirst = index === 0 && !this.options.naked ? 1 : 0;
    return " ".repeat(isFirst) + formattedLabel + " ".repeat(rightPad);
  }
  composeFinalChart(chart, verticalChart, barSize, padding, maxHeight) {
    const chartRows = this.buildChartRows(chart.length, verticalChart, barSize, padding);
    const header = this.buildHeader(chart.length, barSize, padding);
    const footer = this.buildFooter(chart, barSize, padding);
    const valueLabelsHeader = this.buildValueLabelsHeader(chart, barSize, padding, maxHeight);
    return [...header, ...valueLabelsHeader, ...chartRows, ...footer].join("\n");
  }
  buildChartRows(chartLength, verticalChart, barSize, padding) {
    const { leftPad, rightPad } = this.getHorizontalAlignmentPadding(chartLength, barSize, padding);
    return verticalChart.map((row) => {
      const rowContent = row.join("");
      const alignedContent = " ".repeat(leftPad) + rowContent + " ".repeat(rightPad);
      return this.options.naked ? alignedContent : this.options.structure.axis + alignedContent;
    });
  }
  buildHeader(chartLength, barSize, padding) {
    return this.options.title ? [this.formatChartTitle(chartLength, barSize, padding)] : [];
  }
  buildFooter(chart, barSize, padding) {
    const footer = [];
    if (!this.options.naked) {
      footer.push(this.formatBottom(chart.length, barSize, padding));
    } else if (this.options.labels) {
      footer.push("");
    }
    if (this.options.labels) {
      footer.push(this.formatLabels(chart, barSize, padding));
    }
    return footer;
  }
  buildValueLabelsHeader(chart, barSize, padding, maxHeight) {
    if (!(this.options.valueLabels || this.options.stackValueLabels) || !this.options.fill) return [];
    return [this.formatValueLabels(chart, barSize, padding, maxHeight)];
  }
  formatChartTitle(chartLength, barSize, padding) {
    const alignment = this.options.alignBars || "justify";
    if (alignment === "justify") {
      const charLength = this.getCharWidth();
      const barWidth = this.getScaledBarSize(barSize);
      const barsWidth = (barWidth * charLength + padding) * chartLength - padding;
      return this.formatTitle(barsWidth + 1);
    }
    return this.formatTitle(this.options.width + 1);
  }
  formatBottom(chartLength, barSize, padding) {
    const alignment = this.options.alignBars || "justify";
    const charLength = this.getCharWidth();
    const barWidth = this.getScaledBarSize(barSize);
    const barsWidth = (barWidth * charLength + padding) * chartLength - padding;
    if (alignment === "justify") {
      return this.options.structure.bottomLeft + this.options.structure.x.repeat(barsWidth);
    }
    return this.options.structure.bottomLeft + this.options.structure.x.repeat(this.options.width);
  }
};
var vertical_default = VerticalChartFormatter;

// formatters/line.ts
function labelMinColDiff(L1, L2) {
  if (L1 <= 0 && L2 <= 0) return 1;
  return Math.max(1, Math.ceil(L1 / 2) + Math.floor(L2 / 2) + 1);
}
var LINE_CHARS = {
  flatTop: "\u203E",
  flatBottom: "_",
  up: "\u2571",
  down: "\u2572"
};
var LineChartFormatter = class extends formatter_default {
  constructor(options) {
    super(options);
  }
  calculateDefaultDimensions(barCount, totalSize, charWidth) {
    return { barSize: 1, padding: 0 };
  }
  format(chartData) {
    const chart = [...chartData.values()];
    if (chart.length === 0) return "";
    const height = this.options.height || 10;
    const width = this.options.width || 80;
    const maxValue = this.options.max.value || 1;
    const minValue = this.options.max.min ?? 0;
    const yAxisTicks = this.buildYAxisTicks(minValue, maxValue, height);
    const yLabelWidth = Math.max(...yAxisTicks.map((t) => t.label.length));
    const requestedWidth = width - yLabelWidth - 1;
    if (requestedWidth < 2) return "";
    const points = this.mapPointsToGrid(chart, requestedWidth, height, minValue, maxValue);
    const chartWidth = this.prepareLayout(points, requestedWidth);
    const grid = this.buildGrid(chartWidth, height);
    const seriesColor = this.options._seriesColors?.[0];
    let gridColors;
    let lineBottom;
    if (seriesColor !== void 0) {
      gridColors = Array.from({ length: height }, () => new Array(chartWidth).fill(void 0));
      lineBottom = this.drawLineColored(grid, gridColors, points, chartWidth, seriesColor);
    } else {
      lineBottom = this.drawLine(grid, points, chartWidth);
    }
    if (this.options.fill) {
      this.drawAreaFill(grid, lineBottom, height);
    }
    if (this.shouldDrawPoints()) {
      const pointChar = this.options.pointChar || "\u25CF";
      if (gridColors) {
        this.drawPointsColored(grid, gridColors, points, pointChar, seriesColor);
      } else {
        this.drawPoints(grid, points, pointChar);
      }
    }
    this.applyAnimationClip(grid, gridColors, chartWidth);
    return this.compose(grid, yAxisTicks, yLabelWidth, chartWidth, height, points, gridColors);
  }
  /**
   * Multi-line entry point. Each `ChartData` in `chartDataArr` becomes its
   * own line series, sharing the y-axis scale (global max/min across all
   * series) and x-axis layout (per-segment colDiff = max over series so
   * every series keeps a 45°-continuous line; the series with a smaller
   * row-diff at a segment fills the extra cols with `‾`/`_`). Each series
   * is colored by `options.lineColor[i]`; points (if enabled) inherit the
   * series color.
   */
  formatMulti(chartDataArr) {
    if (chartDataArr.length === 0) return "";
    if (chartDataArr.length === 1) return this.format(chartDataArr[0]);
    const chartArrays = chartDataArr.map((cd) => [...cd.values()]);
    const maxLen = Math.max(...chartArrays.map((a) => a.length));
    if (maxLen === 0) return "";
    const height = this.options.height || 10;
    const width = this.options.width || 80;
    const maxValue = this.options.max.value || 1;
    const minValue = this.options.max.min ?? 0;
    const yAxisTicks = this.buildYAxisTicks(minValue, maxValue, height);
    const yLabelWidth = Math.max(...yAxisTicks.map((t) => t.label.length));
    const requestedWidth = width - yLabelWidth - 1;
    if (requestedWidth < 2) return "";
    const seriesPoints = chartArrays.map(
      (chart) => this.mapPointsToGrid(chart, requestedWidth, height, minValue, maxValue)
    );
    const chartWidth = this.prepareLayoutMulti(seriesPoints, requestedWidth);
    const grid = this.buildGrid(chartWidth, height);
    const gridColors = Array.from(
      { length: height },
      () => new Array(chartWidth).fill(void 0)
    );
    const seriesColors = this.options._seriesColors || [];
    for (let s = 0; s < seriesPoints.length; s++) {
      this.drawLineColored(grid, gridColors, seriesPoints[s], chartWidth, seriesColors[s]);
    }
    if (this.shouldDrawPoints()) {
      const pointChar = this.options.pointChar || "\u25CF";
      for (let s = 0; s < seriesPoints.length; s++) {
        this.drawPointsColored(grid, gridColors, seriesPoints[s], pointChar, seriesColors[s]);
      }
    }
    this.applyAnimationClip(grid, gridColors, chartWidth);
    return this.compose(grid, yAxisTicks, yLabelWidth, chartWidth, height, seriesPoints[0], gridColors);
  }
  /**
   * Whether to render point markers. Subclasses (scatter) can override
   * to render points unconditionally.
   */
  shouldDrawPoints() {
    return Boolean(this.options.points);
  }
  /**
   * Left-to-right reveal for animation. Clears any data-area cells past
   * the visible cutoff so line segments / points beyond the current
   * progress disappear. Only the data grid is touched — y-axis, x-labels,
   * legend, title, and the bottom border still render fully so the layout
   * stays stable across frames.
   */
  applyAnimationClip(grid, gridColors, chartWidth) {
    const progress = this.options._animationProgress;
    if (progress === void 0 || progress >= 1) return;
    const cutoff = Math.max(0, Math.min(chartWidth, Math.ceil(progress * chartWidth)));
    if (cutoff >= chartWidth) return;
    for (let row = 0; row < grid.length; row++) {
      for (let col = cutoff; col < chartWidth; col++) {
        grid[row][col] = " ";
        if (gridColors) gridColors[row][col] = void 0;
      }
    }
  }
  /**
   * Repositions points so each segment's column span is at least its
   * natural 45° width (and the label-spacing minimum), then expands the
   * spacing to fill `requestedWidth` when there's room — `drawLine` emits
   * `‾`/`_` flats to bridge the extra cols inside each segment, so the
   * diagonals stay 45° at peaks/troughs. Returns the effective chart
   * width. Mutates each point's `col` and `anchor` in place. Subclasses
   * (step) may override to drop the 45° constraint entirely.
   */
  prepareLayout(points, requestedWidth) {
    if (points.length === 0) return requestedWidth;
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        let firstNonFlat = 0;
        for (let j = 1; j < points.length; j++) {
          const d = points[j].row - points[j - 1].row;
          if (d !== 0) {
            firstNonFlat = d;
            break;
          }
        }
        points[i].anchor = firstNonFlat < 0 ? 1 : 0;
      } else {
        const d = points[i].row - points[i - 1].row;
        if (d < 0) points[i].anchor = 0;
        else if (d > 0) points[i].anchor = 1;
        else points[i].anchor = points[i - 1].anchor;
      }
    }
    const naturalDiffs = this.computeNaturalDiffs(points);
    const firstLabel = points[0].point?.label ?? "";
    const lastLabel = points[points.length - 1].point?.label ?? "";
    const leadPad = Math.floor(firstLabel.length / 2);
    const trailPad = Math.max(0, lastLabel.length - 1 - Math.floor(lastLabel.length / 2));
    const evenSpan = Math.max(0, requestedWidth - 1 - leadPad - trailPad);
    points[0].col = 0;
    for (let i = 1; i < points.length; i++) {
      const evenCol = points.length > 1 ? Math.round(i * evenSpan / (points.length - 1)) : 0;
      const minCol = points[i - 1].col + naturalDiffs[i];
      points[i].col = Math.max(evenCol, minCol);
    }
    if (leadPad > 0) for (const p of points) p.col += leadPad;
    return Math.max(requestedWidth, points[points.length - 1].col + 1 + trailPad);
  }
  /**
   * Per-segment minimum colDiff for a single line series: max of the 45°
   * natural span (or 1 for flat segments), the label-spacing minimum, and
   * — when points are rendered — a -1 peak/trough shrink so the `●` lands
   * diagonally adjacent to the next change instead of two cols away.
   * Index 0 is unused (segments are between points i-1 and i).
   */
  computeNaturalDiffs(points) {
    const diffs = [0];
    for (let i = 1; i < points.length; i++) {
      const yFrom = points[i - 1].row + (points[i - 1].anchor ?? 0);
      const yTo = points[i].row + (points[i].anchor ?? 0);
      const isFlat = points[i].row === points[i - 1].row;
      let colDiff = isFlat ? 1 : Math.max(Math.abs(yTo - yFrom), 1);
      if (this.options.points && !isFlat) {
        const prev = i - 1;
        if (prev > 0 && prev < points.length - 1) {
          const pr = points[prev].row;
          const beforeRow = points[prev - 1].row;
          const afterRow = points[prev + 1].row;
          const isPrevPeak = beforeRow > pr && afterRow > pr;
          const isPrevTrough = beforeRow < pr && afterRow < pr;
          if (isPrevPeak || isPrevTrough) colDiff = Math.max(1, colDiff - 1);
        }
      }
      const L1 = this.labelLength(points[i - 1].point?.label);
      const L2 = this.labelLength(points[i].point?.label);
      const labelMin = labelMinColDiff(L1, L2);
      if (labelMin > colDiff) colDiff = labelMin;
      diffs.push(colDiff);
    }
    return diffs;
  }
  /**
   * Layout for multi-series. Each series still gets its own anchor
   * sequence (its own rising/falling pattern), but every segment's
   * column span is the max over all series — so the widest natural 45°
   * wins, and every series lines up on shared data-point columns.
   * Series with smaller row-diffs at a segment will use Bresenham stays
   * (`‾`/`_`) to fill the extra cols. When the requested width exceeds
   * the natural minimum, the surplus is distributed evenly so the chart
   * fills the requested width.
   */
  prepareLayoutMulti(seriesPoints, requestedWidth) {
    if (seriesPoints.length === 0) return requestedWidth;
    const maxLen = Math.max(...seriesPoints.map((p) => p.length));
    if (maxLen === 0) return requestedWidth;
    for (const points of seriesPoints) {
      for (let i = 0; i < points.length; i++) {
        if (i === 0) {
          let firstNonFlat = 0;
          for (let j = 1; j < points.length; j++) {
            const d = points[j].row - points[j - 1].row;
            if (d !== 0) {
              firstNonFlat = d;
              break;
            }
          }
          points[i].anchor = firstNonFlat < 0 ? 1 : 0;
        } else {
          const d = points[i].row - points[i - 1].row;
          if (d < 0) points[i].anchor = 0;
          else if (d > 0) points[i].anchor = 1;
          else points[i].anchor = points[i - 1].anchor;
        }
      }
    }
    const naturalDiffs = [0];
    const firstSeries = seriesPoints[0];
    for (let i = 1; i < maxLen; i++) {
      let maxColDiff = 1;
      const L1 = this.labelLength(firstSeries[i - 1]?.point?.label);
      const L2 = this.labelLength(firstSeries[i]?.point?.label);
      const labelMin = labelMinColDiff(L1, L2);
      for (const points of seriesPoints) {
        if (i >= points.length) continue;
        const yFrom = points[i - 1].row + (points[i - 1].anchor ?? 0);
        const yTo = points[i].row + (points[i].anchor ?? 0);
        const isFlat = points[i].row === points[i - 1].row;
        const natural = isFlat ? 1 : Math.max(Math.abs(yTo - yFrom), 1);
        let colDiff = natural;
        if (this.options.points && !isFlat) {
          const prev = i - 1;
          if (prev > 0 && prev < points.length - 1) {
            const pr = points[prev].row;
            const beforeRow = points[prev - 1].row;
            const afterRow = points[prev + 1].row;
            if (beforeRow > pr && afterRow > pr || beforeRow < pr && afterRow < pr) {
              colDiff = Math.max(1, colDiff - 1);
            }
          }
        }
        if (colDiff > maxColDiff) maxColDiff = colDiff;
      }
      if (labelMin > maxColDiff) maxColDiff = labelMin;
      naturalDiffs.push(maxColDiff);
    }
    const firstLabel = firstSeries[0]?.point?.label ?? "";
    const lastLabel = firstSeries[firstSeries.length - 1]?.point?.label ?? "";
    const leadPad = Math.floor(firstLabel.length / 2);
    const trailPad = Math.max(0, lastLabel.length - 1 - Math.floor(lastLabel.length / 2));
    const evenSpan = Math.max(0, requestedWidth - 1 - leadPad - trailPad);
    const sharedCols = [0];
    for (let i = 1; i < maxLen; i++) {
      const evenCol = maxLen > 1 ? Math.round(i * evenSpan / (maxLen - 1)) : 0;
      const minCol = sharedCols[i - 1] + naturalDiffs[i];
      sharedCols.push(Math.max(evenCol, minCol));
    }
    for (const points of seriesPoints) {
      for (let i = 0; i < points.length; i++) {
        if (i < sharedCols.length) points[i].col = sharedCols[i];
      }
    }
    if (leadPad > 0) {
      for (const points of seriesPoints) {
        for (const p of points) p.col += leadPad;
      }
    }
    const lastCol = Math.max(
      ...seriesPoints.map((p) => p[p.length - 1]?.col ?? 0)
    );
    return Math.max(requestedWidth, lastCol + 1 + trailPad);
  }
  /**
   * Draws each segment as pure 45° diagonals using a state machine over
   * (row, pos). `╱` moves the line up one half-step; `╲` moves down; `‾`
   * or `_` keeps the line on its current anchor. When `colDiff > absYDiff`
   * the row changes are placed contiguously (clustered) rather than
   * spread evenly — see `pickClusterAnchor` — so slopes look like a
   * single straight diagonal with a flat plateau on one side, rather
   * than a jagged staircase.
   */
  drawLine(grid, points, chartWidth) {
    const chars = LINE_CHARS;
    const lineBottom = new Array(chartWidth).fill(-1);
    if (points.length === 0) return lineBottom;
    const put = (row, col, ch) => {
      if (row >= 0 && row < grid.length && col >= 0 && col < chartWidth) {
        grid[row][col] = ch;
        lineBottom[col] = row;
      }
    };
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const colDiff = p2.col - p1.col;
      if (colDiff <= 0) continue;
      let p1Override = null;
      const rowDiff = p2.row - p1.row;
      if (this.options.points && rowDiff !== 0 && i > 0 && i < points.length - 1) {
        const beforeRow = points[i - 1].row;
        const afterRow = points[i + 1].row;
        const pr = p1.row;
        if (beforeRow > pr && afterRow > pr) p1Override = 1;
        else if (beforeRow < pr && afterRow < pr) p1Override = 0;
      }
      const startPos = p1Override ?? (p1.anchor ?? 0);
      const yStart = p1.row + startPos;
      const yEnd = p2.row + (p2.anchor ?? 0);
      const yDiff = yEnd - yStart;
      const absYDiff = Math.abs(yDiff);
      const changeCols = this.buildChangeCols(points, i, p1.col, p2.col, absYDiff, colDiff);
      let row = p1.row;
      let pos = startPos;
      for (let col = p1.col + 1; col <= p2.col; col++) {
        if (changeCols.has(col)) {
          if (yDiff < 0) {
            if (pos === 1) {
              put(row, col, chars.up);
              pos = 0;
            } else {
              row -= 1;
              put(row, col, chars.up);
            }
          } else {
            if (pos === 0) {
              put(row, col, chars.down);
              pos = 1;
            } else {
              row += 1;
              put(row, col, chars.down);
            }
          }
        } else {
          put(row, col, pos === 0 ? chars.flatTop : chars.flatBottom);
        }
      }
    }
    return lineBottom;
  }
  /**
   * Decides whether a segment's row changes should cluster at the start
   * (`╱╱╱‾‾‾`, line leaves p_a sharply) or end (`‾‾‾╱╱╱`, line lands on
   * p_b sharply). The rule:
   *   - If p_b is a peak/trough/last point → end (sharp arrival)
   *   - Else if p_a is a peak/trough/first point → start (sharp departure)
   *   - Otherwise (both endpoints are continuing) → end
   * This keeps peaks/troughs sharp `‾‾╱╲‾‾` and avoids the jagged
   * `‾╱‾╱‾╱` staircase that even-spread Bresenham produces when the
   * segment's colDiff exceeds its rowDiff.
   */
  pickClusterAnchor(points, i) {
    if (i + 1 === points.length - 1) return "end";
    const pbRow = points[i + 1].row;
    const pbBefore = points[i].row;
    const pbAfter = points[i + 2].row;
    if (pbBefore > pbRow && pbAfter > pbRow || pbBefore < pbRow && pbAfter < pbRow) {
      return "end";
    }
    if (i === 0) return "start";
    const paRow = points[i].row;
    const paBefore = points[i - 1].row;
    const paAfter = points[i + 1].row;
    if (paBefore > paRow && paAfter > paRow || paBefore < paRow && paAfter < paRow) {
      return "start";
    }
    return "end";
  }
  /**
   * Builds the set of columns where the line drawing should emit a row
   * change (`╱` or `╲`). Cols not in the set get a flat `‾`/`_` filler.
   * Changes are placed contiguously at the segment's start or end based
   * on `pickClusterAnchor`.
   */
  buildChangeCols(points, i, p1Col, p2Col, absYDiff, colDiff) {
    const changeCols = /* @__PURE__ */ new Set();
    if (absYDiff <= 0) return changeCols;
    const steps = Math.min(absYDiff, colDiff);
    const anchor = this.pickClusterAnchor(points, i);
    if (anchor === "start") {
      for (let k = 1; k <= steps; k++) changeCols.add(p1Col + k);
    } else {
      for (let k = 0; k < steps; k++) changeCols.add(p2Col - k);
    }
    return changeCols;
  }
  buildYAxisTicks(min, max, height) {
    const range = max - min || 1;
    const rawStep = range / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const niceSteps = [1, 2, 5, 10];
    const step = niceSteps.find((s) => s * magnitude >= rawStep) * magnitude;
    const tickMin = Math.floor(min / step) * step;
    const tickMax = Math.ceil(max / step) * step;
    const ticks = [];
    for (let value = tickMin; value <= tickMax; value += step) {
      const normalized = (value - min) / range;
      const row = height - 1 - Math.round(normalized * (height - 1));
      if (row < 0 || row >= height) continue;
      const label = Number.isInteger(value) ? String(value) : value.toFixed(1);
      ticks.push({ label, row });
    }
    if (!ticks.some((t) => t.label === String(min))) {
      const label = Number.isInteger(min) ? String(min) : min.toFixed(1);
      ticks.push({ label, row: height - 1 });
    }
    if (!ticks.some((t) => t.label === String(max))) {
      const label = Number.isInteger(max) ? String(max) : max.toFixed(1);
      ticks.push({ label, row: 0 });
    }
    ticks.sort((a, b) => a.row - b.row);
    const seen = /* @__PURE__ */ new Set();
    return ticks.filter((t) => {
      if (seen.has(t.row)) return false;
      seen.add(t.row);
      return true;
    });
  }
  /**
   * Visual length of a label, stripping rich-text decorator markers
   * (`*bold*`, `%italic%`, etc.) which become invisible ANSI codes.
   */
  labelLength(label) {
    if (!label) return 0;
    if (this.options.richLabels === false) return label.length;
    return label.replace(/([*~%!^@#$])(.+?)\1/g, "$2").length;
  }
  mapPointsToGrid(chart, chartWidth, height, minValue, maxValue) {
    const range = maxValue - minValue || 1;
    return chart.map((point, index) => {
      const col = chart.length > 1 ? Math.round(index / (chart.length - 1) * (chartWidth - 1)) : Math.floor(chartWidth / 2);
      const normalizedValue = (point.value - minValue) / range;
      const row = height - 1 - Math.round(normalizedValue * (height - 1));
      return { col, row: Math.max(0, Math.min(height - 1, row)), point };
    });
  }
  buildGrid(width, height) {
    return Array.from(
      { length: height },
      () => Array.from({ length: width }, () => " ")
    );
  }
  drawAreaFill(grid, lineBottom, height) {
    const fillChar = this.options.fill;
    for (let col = 0; col < lineBottom.length; col++) {
      const lineRow = lineBottom[col];
      if (lineRow < 0) continue;
      for (let row = lineRow + 1; row < height; row++) {
        if (grid[row][col] === " ") {
          grid[row][col] = fillChar;
        }
      }
    }
  }
  drawPoints(grid, points, char) {
    for (const { col, row } of points) {
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        grid[row][col] = char;
        const nextCol = col + 1;
        if (nextCol < grid[row].length) {
          const nextCh = grid[row][nextCol];
          if (nextCh === "\u2571" || nextCh === "\u2572" || nextCh === "\u203E" || nextCh === "_") {
            grid[row][nextCol] = " ";
          }
        }
      }
    }
  }
  /**
   * Resolve the cell color at column `col` for a given series color and
   * series x-extent. Returns a flat color string for plain colors, or an
   * RGB-encoded ANSI escape string interpolated from a gradient.
   *
   * For gradients, the position is the cell's normalized progress between
   * the series' first and last cols (`direction: 'vertical'` uses the row
   * within the chart height instead).
   */
  resolveCellColor(color, col, row, seriesStart, seriesEnd, height, reverseDefault = false) {
    if (color === void 0 || color === "") return void 0;
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    if (!isGradientObject(normalized)) {
      return normalized;
    }
    const grad = normalized;
    const { direction = "horizontal", reverse = false } = grad;
    let position;
    if (direction === "vertical") {
      position = height > 1 ? row / (height - 1) : 0;
    } else if (direction === "diagonal") {
      const span = seriesEnd - seriesStart;
      const hPos = span > 0 ? (col - seriesStart) / span : 0;
      const vPos = height > 1 ? row / (height - 1) : 0;
      position = (hPos + vPos) / 2;
    } else {
      const span = seriesEnd - seriesStart;
      position = span > 0 ? (col - seriesStart) / span : 0;
    }
    if (reverse !== reverseDefault) position = 1 - position;
    const [r, g, b] = this.getColorAtPosition(grad, position);
    return `\x1B[38;2;${r};${g};${b}m`;
  }
  /** Variant of drawLine that also writes per-cell colors (for multi-series). */
  drawLineColored(grid, gridColors, points, chartWidth, color) {
    const chars = LINE_CHARS;
    const lineBottom = new Array(chartWidth).fill(-1);
    if (points.length === 0) return lineBottom;
    const seriesStart = points[0].col;
    const seriesEnd = points[points.length - 1].col;
    const height = grid.length;
    const put = (row, col, ch) => {
      if (row >= 0 && row < grid.length && col >= 0 && col < chartWidth) {
        grid[row][col] = ch;
        const cellColor = this.resolveCellColor(color, col, row, seriesStart, seriesEnd, height);
        if (cellColor) gridColors[row][col] = cellColor;
        lineBottom[col] = row;
      }
    };
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const colDiff = p2.col - p1.col;
      if (colDiff <= 0) continue;
      let p1Override = null;
      const rowDiff = p2.row - p1.row;
      if (this.options.points && rowDiff !== 0 && i > 0 && i < points.length - 1) {
        const beforeRow = points[i - 1].row;
        const afterRow = points[i + 1].row;
        const pr = p1.row;
        if (beforeRow > pr && afterRow > pr) p1Override = 1;
        else if (beforeRow < pr && afterRow < pr) p1Override = 0;
      }
      const startPos = p1Override ?? (p1.anchor ?? 0);
      const yStart = p1.row + startPos;
      const yEnd = p2.row + (p2.anchor ?? 0);
      const yDiff = yEnd - yStart;
      const absYDiff = Math.abs(yDiff);
      const changeCols = this.buildChangeCols(points, i, p1.col, p2.col, absYDiff, colDiff);
      let row = p1.row;
      let pos = startPos;
      for (let col = p1.col + 1; col <= p2.col; col++) {
        if (changeCols.has(col)) {
          if (yDiff < 0) {
            if (pos === 1) {
              put(row, col, chars.up);
              pos = 0;
            } else {
              row -= 1;
              put(row, col, chars.up);
            }
          } else {
            if (pos === 0) {
              put(row, col, chars.down);
              pos = 1;
            } else {
              row += 1;
              put(row, col, chars.down);
            }
          }
        } else {
          put(row, col, pos === 0 ? chars.flatTop : chars.flatBottom);
        }
      }
    }
    return lineBottom;
  }
  /** Variant of drawPoints that also writes per-cell colors (for multi-series). */
  drawPointsColored(grid, gridColors, points, char, color) {
    if (points.length === 0) return;
    const seriesStart = points[0].col;
    const seriesEnd = points[points.length - 1].col;
    const height = grid.length;
    for (const { col, row } of points) {
      if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
        grid[row][col] = char;
        const cellColor = this.resolveCellColor(color, col, row, seriesStart, seriesEnd, height);
        if (cellColor) gridColors[row][col] = cellColor;
        const nextCol = col + 1;
        if (nextCol < grid[row].length) {
          const nextCh = grid[row][nextCol];
          if (nextCh === "\u2571" || nextCh === "\u2572" || nextCh === "\u203E" || nextCh === "_") {
            grid[row][nextCol] = " ";
            gridColors[row][nextCol] = void 0;
          }
        }
      }
    }
  }
  compose(grid, yAxisTicks, yLabelWidth, chartWidth, height, points, gridColors) {
    const lines = [];
    const isNaked = this.options.naked;
    const axisChar = isNaked ? " " : this.options.structure.axis;
    const title = this.formatTitle(yLabelWidth + 1 + chartWidth);
    if (title) lines.push(title);
    const legendConfig = this.resolveLegendConfig();
    const legendRows = legendConfig ? this.buildLegendRows(legendConfig, chartWidth) : [];
    const legendPrefix = " ".repeat(yLabelWidth) + axisChar;
    if (legendConfig?.position === "top") {
      for (const row of legendRows) lines.push(legendPrefix + row);
      lines.push(legendPrefix + " ".repeat(chartWidth));
    }
    for (let row = 0; row < height; row++) {
      const tick = yAxisTicks.find((t) => t.row === row);
      const yLabel = tick ? tick.label.padStart(yLabelWidth) : " ".repeat(yLabelWidth);
      const rowContent = this.colorizeRow(grid[row], row, height, chartWidth, gridColors?.[row]);
      lines.push(yLabel + axisChar + rowContent);
    }
    if (legendConfig?.position === "bottom") {
      lines.push(legendPrefix + " ".repeat(chartWidth));
      for (const row of legendRows) lines.push(legendPrefix + row);
    }
    if (!isNaked) {
      lines.push(
        " ".repeat(yLabelWidth) + this.options.structure.bottomLeft + this.options.structure.x.repeat(chartWidth)
      );
    }
    if (this.options.labels !== false) {
      lines.push(this.formatXLabels(points, yLabelWidth + 1, chartWidth));
    }
    return lines.join("\n");
  }
  colorizeRow(row, rowIndex, height, width, perCellColors) {
    if (perCellColors) {
      return row.map((char, colIndex) => {
        if (char === " ") return char;
        const cellColor = perCellColors[colIndex];
        if (!cellColor) return char;
        if (cellColor.startsWith("\x1B[38;2;")) {
          return `${cellColor}${char}\x1B[39m`;
        }
        return this.colorify(char, cellColor);
      }).join("");
    }
    const effectiveColor = this.options.color;
    if (!effectiveColor) return row.join("");
    const normalized = typeof effectiveColor === "string" ? normalizeColor(effectiveColor) : effectiveColor;
    if (isGradientObject(normalized)) {
      return this.colorizeRowGradient(row, rowIndex, height, width, normalized);
    }
    return row.map((char) => {
      if (char === " ") return char;
      return this.colorify(char, effectiveColor);
    }).join("");
  }
  colorizeRowGradient(row, rowIndex, height, width, gradient) {
    const { direction = "horizontal", reverse = false } = gradient;
    return row.map((char, colIndex) => {
      if (char === " ") return char;
      let position;
      if (direction === "vertical") {
        position = height > 1 ? rowIndex / (height - 1) : 0;
      } else if (direction === "diagonal") {
        const hPos = width > 1 ? colIndex / (width - 1) : 0;
        const vPos = height > 1 ? rowIndex / (height - 1) : 0;
        position = (hPos + vPos) / 2;
      } else {
        position = width > 1 ? colIndex / (width - 1) : 0;
      }
      if (reverse) position = 1 - position;
      const [r, g, b] = this.getColorAtPosition(gradient, position);
      return `\x1B[38;2;${r};${g};${b}m${char}\x1B[39m`;
    }).join("");
  }
  formatXLabels(points, offset, chartWidth) {
    const labelLine = Array.from({ length: chartWidth }, () => " ");
    for (const { col, point } of points) {
      const label = point.label;
      const start = Math.max(0, col - Math.floor(label.length / 2));
      for (let i = 0; i < label.length && start + i < chartWidth; i++) {
        labelLine[start + i] = label[i];
      }
    }
    return " ".repeat(offset) + labelLine.join("");
  }
  /**
   * Normalize the user-facing `legend` option. Returns `undefined` when the
   * legend is disabled or the chart is single-series (multi-series only —
   * a single-entry legend would be useless).
   */
  resolveLegendConfig() {
    const seriesCount = this.options._seriesColors?.length ?? 0;
    if (seriesCount <= 1) return void 0;
    const raw = this.options.legend;
    if (!raw) return void 0;
    const config = raw === true ? {} : raw;
    if (config.enabled === false) return void 0;
    return {
      enabled: true,
      values: config.values ?? [],
      position: config.position ?? "top",
      align: config.align ?? "left"
    };
  }
  /**
   * Render legend entries into `chartWidth`-wide rows. Each entry uses the
   * series color as background with an auto-contrasted (luminance-based)
   * foreground. Greedy-wraps to a new row when an entry would overflow,
   * with a single space separator between entries on the same row.
   */
  buildLegendRows(config, chartWidth) {
    const seriesColors = this.options._seriesColors ?? [];
    const labels = seriesColors.map((_, i) => config.values[i] ?? `Series #${i + 1}`);
    const sharedGradient = this.sharedSeriesGradient(seriesColors);
    if (sharedGradient) {
      return this.buildGradientLegendRows(labels, sharedGradient, config, chartWidth);
    }
    const entries = labels.map((label, i) => {
      const bgRgb = this.resolveLegendSwatchRgb(seriesColors[i]);
      if (!bgRgb) return { rendered: label, visualWidth: label.length };
      const [fr, fg, fb] = this.contrastFgRgb(bgRgb);
      const [br, bg, bb] = bgRgb;
      const rendered = `\x1B[48;2;${br};${bg};${bb}m\x1B[38;2;${fr};${fg};${fb}m${label}\x1B[39m\x1B[49m`;
      return { rendered, visualWidth: label.length };
    });
    const rows = [[]];
    let currentWidth = 0;
    for (const entry of entries) {
      const sepWidth = rows[rows.length - 1].length > 0 ? 1 : 0;
      const additional = entry.visualWidth + sepWidth;
      if (currentWidth + additional > chartWidth && rows[rows.length - 1].length > 0) {
        rows.push([entry]);
        currentWidth = entry.visualWidth;
      } else {
        rows[rows.length - 1].push(entry);
        currentWidth += additional;
      }
    }
    return rows.filter((row) => row.length > 0).map((row) => {
      const visualWidth = row.reduce(
        (sum, e, i) => sum + e.visualWidth + (i > 0 ? 1 : 0),
        0
      );
      const content = row.map((e) => e.rendered).join(" ");
      const pad = Math.max(0, chartWidth - visualWidth);
      if (config.align === "right") return " ".repeat(pad) + content;
      if (config.align === "center") {
        const left = Math.floor(pad / 2);
        return " ".repeat(left) + content + " ".repeat(pad - left);
      }
      return content + " ".repeat(pad);
    });
  }
  /**
   * Returns the shared gradient when every series resolves to the same
   * gradient (the chart-wide `color: 'gradient(...)'` case). Mixed colors
   * or per-series-different gradients return undefined.
   */
  sharedSeriesGradient(seriesColors) {
    if (seriesColors.length === 0) return void 0;
    const themeColors = this.getThemeColors();
    const normalize = (c) => typeof c === "string" ? normalizeColor(c) : c;
    const first = normalize(seriesColors[0]);
    if (!isGradientObject(first)) return void 0;
    const firstGrad = first;
    const signature = (g) => g.colors.map((c) => parseColorToRgb(c, themeColors).join(",")).join("|");
    const ref = signature(firstGrad);
    for (let i = 1; i < seriesColors.length; i++) {
      const norm = normalize(seriesColors[i]);
      if (!isGradientObject(norm)) return void 0;
      if (signature(norm) !== ref) return void 0;
    }
    return firstGrad;
  }
  /**
   * Render legend labels as a single combined block painted with the chart's
   * shared gradient. Labels are joined by single spaces and the gradient
   * stretches across the full combined width; rows wrap to `chartWidth`
   * while the gradient continues smoothly across wraps.
   */
  buildGradientLegendRows(labels, gradient, config, chartWidth) {
    const combined = labels.join(" ");
    const total = combined.length;
    if (total === 0) return [];
    const isSeparator = new Array(total).fill(false);
    let cursor = 0;
    for (let i = 0; i < labels.length; i++) {
      cursor += labels[i].length;
      if (i < labels.length - 1) {
        isSeparator[cursor] = true;
        cursor += 1;
      }
    }
    const cells = [];
    for (let i = 0; i < total; i++) {
      if (isSeparator[i]) {
        cells.push(" ");
        continue;
      }
      const position = total > 1 ? i / (total - 1) : 0;
      const [br, bg, bb] = this.getColorAtPosition(gradient, position);
      const [fr, fg, fb] = this.contrastFgRgb([br, bg, bb]);
      cells.push(
        `\x1B[48;2;${br};${bg};${bb}m\x1B[38;2;${fr};${fg};${fb}m${combined[i]}\x1B[39m\x1B[49m`
      );
    }
    const rows = [];
    for (let start = 0; start < total; start += chartWidth) {
      const end = Math.min(start + chartWidth, total);
      const content = cells.slice(start, end).join("");
      const visualWidth = end - start;
      const pad = Math.max(0, chartWidth - visualWidth);
      if (config.align === "right") rows.push(" ".repeat(pad) + content);
      else if (config.align === "center") {
        const left = Math.floor(pad / 2);
        rows.push(" ".repeat(left) + content + " ".repeat(pad - left));
      } else rows.push(content + " ".repeat(pad));
    }
    return rows;
  }
  resolveLegendSwatchRgb(color) {
    if (!color) return void 0;
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    if (isGradientObject(normalized)) {
      const grad = normalized;
      if (grad.colors.length === 0) return void 0;
      return parseColorToRgb(grad.colors[0], this.getThemeColors());
    }
    return parseColorToRgb(normalized, this.getThemeColors());
  }
  contrastFgRgb(rgb) {
    const luminance = 0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2];
    return luminance > 128 ? [0, 0, 0] : [255, 255, 255];
  }
};
var line_default = LineChartFormatter;

// formatters/step.ts
var STEP_SHARP = {
  horizontal: "\u2500",
  vertical: "\u2502",
  cornerTopLeft: "\u250C",
  cornerTopRight: "\u2510",
  cornerBottomLeft: "\u2514",
  cornerBottomRight: "\u2518"
};
var STEP_SMOOTH = {
  horizontal: "\u2500",
  vertical: "\u2502",
  cornerTopLeft: "\u256D",
  cornerTopRight: "\u256E",
  cornerBottomLeft: "\u2570",
  cornerBottomRight: "\u256F"
};
var StepChartFormatter = class extends line_default {
  /**
   * Step charts have no diagonal-spacing constraint, so the natural step
   * width is `requestedWidth / (n-1)`. We only widen the chart to ensure
   * adjacent x-axis labels keep ≥ 1 space.
   */
  prepareLayout(points, requestedWidth) {
    if (points.length === 0) return requestedWidth;
    if (points.length === 1) {
      points[0].col = Math.floor(requestedWidth / 2);
      return requestedWidth;
    }
    const minDiffs = [0];
    for (let i = 1; i < points.length; i++) {
      const L1 = this.labelLength(points[i - 1].point?.label);
      const L2 = this.labelLength(points[i].point?.label);
      minDiffs.push(this.minLabelColDiff(L1, L2));
    }
    const evenStep = (requestedWidth - 1) / (points.length - 1);
    points[0].col = 0;
    for (let i = 1; i < points.length; i++) {
      const evenCol = Math.round(i * evenStep);
      const minCol = points[i - 1].col + minDiffs[i];
      points[i].col = Math.max(evenCol, minCol);
    }
    const firstLabel = points[0].point?.label ?? "";
    const lastLabel = points[points.length - 1].point?.label ?? "";
    const leadPad = Math.floor(this.labelLength(firstLabel) / 2);
    const trailPad = Math.max(0, this.labelLength(lastLabel) - 1 - Math.floor(this.labelLength(lastLabel) / 2));
    if (leadPad > 0) {
      for (const p of points) p.col += leadPad;
    }
    return Math.max(requestedWidth, points[points.length - 1].col + 1 + trailPad);
  }
  prepareLayoutMulti(seriesPoints, requestedWidth) {
    if (seriesPoints.length === 0) return requestedWidth;
    const firstSeries = seriesPoints[0];
    const width = this.prepareLayout(firstSeries, requestedWidth);
    for (let s = 1; s < seriesPoints.length; s++) {
      const points = seriesPoints[s];
      for (let i = 0; i < points.length && i < firstSeries.length; i++) {
        points[i].col = firstSeries[i].col;
      }
    }
    return width;
  }
  minLabelColDiff(L1, L2) {
    if (L1 <= 0 && L2 <= 0) return 1;
    return Math.max(1, Math.ceil(L1 / 2) + Math.floor(L2 / 2) + 1);
  }
  drawLine(grid, points, chartWidth) {
    return this.drawStep(grid, void 0, points, chartWidth, void 0);
  }
  drawLineColored(grid, gridColors, points, chartWidth, color) {
    return this.drawStep(grid, gridColors, points, chartWidth, color);
  }
  drawStep(grid, gridColors, points, chartWidth, color) {
    const chars = this.options.variant === "sharp" ? STEP_SHARP : STEP_SMOOTH;
    const lineBottom = new Array(chartWidth).fill(-1);
    if (points.length === 0) return lineBottom;
    const seriesStart = points[0].col;
    const seriesEnd = points[points.length - 1].col;
    const height = grid.length;
    const put = (row, col, ch) => {
      if (row >= 0 && row < grid.length && col >= 0 && col < chartWidth) {
        grid[row][col] = ch;
        if (gridColors) {
          const c = this.resolveCellColor(color, col, row, seriesStart, seriesEnd, height);
          if (c) gridColors[row][col] = c;
        }
        lineBottom[col] = row;
      }
    };
    const first = points[0];
    const last = points[points.length - 1];
    for (let col = 0; col <= first.col; col++) {
      put(first.row, col, chars.horizontal);
    }
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (p2.col <= p1.col) continue;
      if (p1.row === p2.row) {
        for (let col = p1.col + 1; col <= p2.col; col++) {
          put(p1.row, col, chars.horizontal);
        }
        continue;
      }
      for (let col = p1.col + 1; col < p2.col; col++) {
        put(p1.row, col, chars.horizontal);
      }
      const goingUp = p2.row < p1.row;
      const topRow = Math.min(p1.row, p2.row);
      const bottomRow = Math.max(p1.row, p2.row);
      if (goingUp) {
        put(bottomRow, p2.col, chars.cornerBottomRight);
        put(topRow, p2.col, chars.cornerTopLeft);
      } else {
        put(topRow, p2.col, chars.cornerTopRight);
        put(bottomRow, p2.col, chars.cornerBottomLeft);
      }
      for (let row = topRow + 1; row < bottomRow; row++) {
        put(row, p2.col, chars.vertical);
      }
      lineBottom[p2.col] = bottomRow;
    }
    for (let col = last.col + 1; col < chartWidth; col++) {
      put(last.row, col, chars.horizontal);
    }
    return lineBottom;
  }
};
var step_default = StepChartFormatter;

// formatters/scatter.ts
var ScatterChartFormatter = class extends line_default {
  constructor(options) {
    super(options);
  }
  shouldDrawPoints() {
    return true;
  }
  /**
   * Scatter has no diagonals to align — points map directly to evenly
   * spaced columns from `mapPointsToGrid`. We still enforce ≥1 space
   * between adjacent x-axis labels by widening the chart only as much
   * as the label-spacing constraint requires.
   */
  prepareLayout(points, requestedWidth) {
    if (points.length === 0) return requestedWidth;
    if (points.length === 1) return requestedWidth;
    const minDiffs = [0];
    for (let i = 1; i < points.length; i++) {
      const L1 = this.labelLength(points[i - 1].point?.label);
      const L2 = this.labelLength(points[i].point?.label);
      minDiffs.push(this.minLabelColDiff(L1, L2));
    }
    const evenStep = (requestedWidth - 1) / (points.length - 1);
    let prevCol = 0;
    points[0].col = 0;
    for (let i = 1; i < points.length; i++) {
      const evenCol = Math.round(i * evenStep);
      const minCol = prevCol + minDiffs[i];
      const col = Math.max(evenCol, minCol);
      points[i].col = col;
      prevCol = col;
    }
    const firstLabel = points[0].point?.label ?? "";
    const lastLabel = points[points.length - 1].point?.label ?? "";
    const leadPad = Math.floor(this.labelLength(firstLabel) / 2);
    const trailPad = Math.max(0, this.labelLength(lastLabel) - 1 - Math.floor(this.labelLength(lastLabel) / 2));
    if (leadPad > 0) {
      for (const p of points) p.col += leadPad;
    }
    return Math.max(requestedWidth, points[points.length - 1].col + 1 + trailPad);
  }
  prepareLayoutMulti(seriesPoints, requestedWidth) {
    if (seriesPoints.length === 0) return requestedWidth;
    const firstSeries = seriesPoints[0];
    const width = this.prepareLayout(firstSeries, requestedWidth);
    for (let s = 1; s < seriesPoints.length; s++) {
      const points = seriesPoints[s];
      for (let i = 0; i < points.length && i < firstSeries.length; i++) {
        points[i].col = firstSeries[i].col;
      }
    }
    return width;
  }
  minLabelColDiff(L1, L2) {
    if (L1 <= 0 && L2 <= 0) return 1;
    return Math.max(1, Math.ceil(L1 / 2) + Math.floor(L2 / 2) + 1);
  }
  drawLine(_grid, _points, chartWidth) {
    return new Array(chartWidth).fill(-1);
  }
  drawLineColored(_grid, _gridColors, _points, chartWidth) {
    return new Array(chartWidth).fill(-1);
  }
  /**
   * Single-series scatter always takes the colored path so per-point colors
   * (from `color: 'auto'` cycling the palette, or per-point `{value, color}`)
   * land in `gridColors`. Unlike line/step, scatter has no series-wide line
   * color to fall back on — markers are independent.
   */
  format(chartData) {
    const chart = [...chartData.values()];
    if (chart.length === 0) return "";
    const height = this.options.height || 10;
    const width = this.options.width || 80;
    const maxValue = this.options.max.value || 1;
    const minValue = this.options.max.min ?? 0;
    const yAxisTicks = this.buildYAxisTicks(minValue, maxValue, height);
    const yLabelWidth = Math.max(...yAxisTicks.map((t) => t.label.length));
    const requestedWidth = width - yLabelWidth - 1;
    if (requestedWidth < 2) return "";
    const points = this.mapPointsToGrid(chart, requestedWidth, height, minValue, maxValue);
    const chartWidth = this.prepareLayout(points, requestedWidth);
    const grid = this.buildGrid(chartWidth, height);
    const gridColors = Array.from(
      { length: height },
      () => new Array(chartWidth).fill(void 0)
    );
    const seriesColor = this.options._seriesColors?.[0];
    const pointChar = this.options.pointChar || "\u25C8";
    this.drawPointsColored(grid, gridColors, points, pointChar, seriesColor);
    this.applyAnimationClip(grid, gridColors, chartWidth);
    return this.compose(grid, yAxisTicks, yLabelWidth, chartWidth, height, points, gridColors);
  }
  /**
   * Override: prefer the per-point color (set by the processor's auto-color
   * pass or the user) over the series-level fallback, so single-series
   * scatter with `color: 'auto'` actually cycles the palette per marker.
   */
  drawPointsColored(grid, gridColors, points, char, color) {
    if (points.length === 0) return;
    const seriesStart = points[0].col;
    const seriesEnd = points[points.length - 1].col;
    const height = grid.length;
    for (const { col, row, point } of points) {
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) continue;
      grid[row][col] = char;
      const effective = point.color || color;
      if (effective === void 0 || effective === "") continue;
      const cellColor = this.resolveCellColor(effective, col, row, seriesStart, seriesEnd, height);
      if (cellColor) gridColors[row][col] = cellColor;
    }
  }
  /**
   * Color each x-axis label with its point's color when `colorLabels` is on.
   * Labels are centered on each point's column; we render label-by-label so
   * neighboring labels keep distinct colors instead of bleeding together.
   */
  formatXLabels(points, offset, chartWidth) {
    if (!this.options.colorLabels) {
      return super.formatXLabels(points, offset, chartWidth);
    }
    const seriesColors = this.options._seriesColors ?? [];
    const seriesColor = seriesColors[0];
    const normalizedSeries = typeof seriesColor === "string" ? normalizeColor(seriesColor) : seriesColor;
    const chartGradient = this.sharedSeriesGradient(seriesColors) ?? (isGradientObject(normalizedSeries) ? normalizedSeries : void 0);
    const seriesStart = points[0]?.col ?? 0;
    const seriesEnd = points[points.length - 1]?.col ?? 0;
    const span = seriesEnd - seriesStart;
    const colorForPoint = (col, pointColor) => {
      if (chartGradient) {
        const position = span > 0 ? (col - seriesStart) / span : 0;
        const [r, g, b] = this.getColorAtPosition(chartGradient, position);
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
      }
      if (pointColor) return pointColor;
      return typeof normalizedSeries === "string" ? normalizedSeries : void 0;
    };
    const cells = Array.from({ length: chartWidth }, () => ({ ch: " " }));
    for (const { col, point } of points) {
      const label = point.label;
      const start = Math.max(0, col - Math.floor(label.length / 2));
      const labelColor = colorForPoint(col, point.color);
      for (let i = 0; i < label.length && start + i < chartWidth; i++) {
        cells[start + i] = { ch: label[i], color: labelColor };
      }
    }
    let out = " ".repeat(offset);
    for (const { ch, color } of cells) {
      out += color ? this.colorify(ch, color) : ch;
    }
    return out;
  }
};
var scatter_default = ScatterChartFormatter;

// formatters/candlestick.ts
var WICK_CHAR = "\u2502";
var BODY_CHAR = "\u2588";
var DOJI_CHAR = "\u2500";
var CandlestickChartFormatter = class extends line_default {
  constructor(options) {
    super(options);
  }
  /**
   * Stub — candlestick uses its own `layout()` for column placement
   * (auto-fill or explicit padding). The base `calculateBarDimensions`
   * machinery is bypassed for this chart type.
   */
  calculateDefaultDimensions(_barCount, _totalSize, _charWidth) {
    return { barSize: this.options.barSize ?? 1, padding: this.options.padding ?? 0 };
  }
  format(chartData) {
    const chart = [...chartData.values()];
    if (chart.length === 0) return "";
    const height = this.options.height || 10;
    const width = this.options.width || 80;
    const maxValue = this.options.max.value || 1;
    const minValue = this.options.max.min ?? 0;
    const yAxisTicks = this.buildYAxisTicks(minValue, maxValue, height);
    const yLabelWidth = Math.max(...yAxisTicks.map((t) => t.label.length));
    const requestedWidth = Math.max(2, width - yLabelWidth - 1);
    const { barSize, candleStarts, chartWidth } = this.layout(chart, requestedWidth);
    const grid = this.buildGrid(chartWidth, height);
    const gridColors = Array.from(
      { length: height },
      () => new Array(chartWidth).fill(void 0)
    );
    const points = [];
    for (let i = 0; i < chart.length; i++) {
      const point = chart[i];
      const slotStart = candleStarts[i];
      const candleCenter = slotStart + Math.floor(barSize / 2);
      this.drawCandle(grid, gridColors, point, i, chart.length, slotStart, barSize, height, minValue, maxValue);
      points.push({ col: candleCenter, row: 0, point });
    }
    this.applyAnimationClip(grid, gridColors, chartWidth);
    this.prepareCandlestickLegend();
    return this.compose(grid, yAxisTicks, yLabelWidth, chartWidth, height, points, gridColors);
  }
  /**
   * Determine candle column positions.
   *
   * Two modes:
   *   • **Explicit padding** — `barSize` body cols + `padding` gap cols
   *     per candle, no width-fill. Honors what the user asked for.
   *   • **Auto-fill** (default) — distribute candles evenly across the
   *     full available width. The first candle sits at col `leadPad`,
   *     the last at `chartWidth - barSize - trailPad`; the in-between
   *     are rounded to the nearest col so spacing alternates by ±1.
   *     `leadPad` / `trailPad` reserve room for the first / last
   *     x-axis label to render without clipping.
   */
  layout(chart, requestedWidth) {
    const barCount = chart.length;
    const barSize = this.options.barSize ?? 1;
    if (this.options.padding !== void 0) {
      const padding = this.options.padding;
      const slotWidth = barSize + padding;
      const starts2 = Array.from({ length: barCount }, (_, i) => i * slotWidth);
      const totalDataWidth = barCount > 0 ? slotWidth * barCount - padding : 0;
      return {
        barSize,
        candleStarts: starts2,
        chartWidth: Math.max(totalDataWidth, barSize)
      };
    }
    if (barCount === 0) return { barSize, candleStarts: [], chartWidth: requestedWidth };
    const firstLabel = chart[0]?.label ?? "";
    const lastLabel = chart[barCount - 1]?.label ?? "";
    const leadPad = Math.floor(firstLabel.length / 2);
    const trailPad = Math.max(0, lastLabel.length - 1 - Math.floor(lastLabel.length / 2));
    if (barCount === 1) {
      return {
        barSize,
        candleStarts: [leadPad],
        chartWidth: Math.max(requestedWidth, leadPad + barSize + trailPad)
      };
    }
    const usable = Math.max(barSize, requestedWidth - leadPad - trailPad);
    const step = (usable - barSize) / (barCount - 1);
    const starts = Array.from({ length: barCount }, (_, i) => leadPad + Math.round(i * step));
    const lastStart = starts[barCount - 1];
    const chartWidth = Math.max(requestedWidth, lastStart + barSize + trailPad);
    return { barSize, candleStarts: starts, chartWidth };
  }
  /**
   * Candlestick is single-series. If a caller still routes here, just
   * format the first chart and ignore the rest.
   */
  formatMulti(charts) {
    return this.format(charts[0] ?? /* @__PURE__ */ new Map());
  }
  /**
   * Color each x-axis label with its candle's resolved color so labels
   * track bull/bear, per-candle overrides, and time-decay gradients the
   * same way the bodies do. Falls back to the uncolored base when
   * `colorLabels` is off.
   */
  formatXLabels(points, offset, chartWidth) {
    if (!this.options.colorLabels) {
      return super.formatXLabels(points, offset, chartWidth);
    }
    const cells = Array.from({ length: chartWidth }, () => ({ ch: " " }));
    const total = points.length;
    for (let i = 0; i < points.length; i++) {
      const { col, point } = points[i];
      const label = point.label ?? "";
      if (!label) continue;
      let labelColor;
      if (point.ohlc) {
        const [open, , , close] = point.ohlc;
        labelColor = this.resolveCandleColor(point, close >= open, i, total);
      }
      const start = Math.max(0, col - Math.floor(label.length / 2));
      for (let j = 0; j < label.length && start + j < chartWidth; j++) {
        cells[start + j] = { ch: label[j], color: labelColor };
      }
    }
    let out = " ".repeat(offset);
    for (const { ch, color } of cells) {
      if (!color || ch === " ") {
        out += ch;
      } else if (color.startsWith("\x1B[38;2;")) {
        out += `${color}${ch}\x1B[39m`;
      } else {
        out += this.colorify(ch, color);
      }
    }
    return out;
  }
  drawCandle(grid, gridColors, point, index, total, slotStart, barSize, height, minValue, maxValue) {
    if (!point.ohlc) return;
    const [open, high, low, close] = point.ohlc;
    const range = maxValue - minValue || 1;
    const valueToRow = (v) => {
      const normalized = (v - minValue) / range;
      const row = height - 1 - Math.round(normalized * (height - 1));
      return Math.max(0, Math.min(height - 1, row));
    };
    const lowRow = valueToRow(low);
    const highRow = valueToRow(high);
    const openRow = valueToRow(open);
    const closeRow = valueToRow(close);
    const isBull = close >= open;
    const cellColor = this.resolveCandleColor(point, isBull, index, total);
    const wickCol = slotStart + Math.floor(barSize / 2);
    const gridWidth = grid[0]?.length ?? 0;
    if (wickCol >= 0 && wickCol < gridWidth) {
      for (let row = highRow; row <= lowRow; row++) {
        grid[row][wickCol] = WICK_CHAR;
        if (cellColor) gridColors[row][wickCol] = cellColor;
      }
    }
    const bodyTop = Math.min(openRow, closeRow);
    const bodyBottom = Math.max(openRow, closeRow);
    const isDoji = openRow === closeRow;
    for (let col = slotStart; col < slotStart + barSize && col < gridWidth; col++) {
      for (let row = bodyTop; row <= bodyBottom; row++) {
        grid[row][col] = isDoji ? DOJI_CHAR : BODY_CHAR;
        if (cellColor) gridColors[row][col] = cellColor;
      }
    }
  }
  /**
   * Resolve the body/wick color for one candle to a value the cell
   * colorizer can apply directly. Order of precedence:
   *   1. Per-candle `point.color` override (wins regardless of bull/bear)
   *   2. `_bullColor` / `_bearColor` based on close ≥ open
   *
   * Gradient values (in any of these slots) are pre-interpolated to a
   * single RGB ANSI escape per candle index (time-decay coloring) so the
   * candle paints uniformly rather than stretching the gradient inside
   * each candle.
   */
  resolveCandleColor(point, isBull, index, total) {
    const override = point.color;
    if (override) return this.flattenColor(override, index, total);
    const base = isBull ? this.options._bullColor : this.options._bearColor;
    return this.flattenColor(base, index, total);
  }
  flattenColor(color, index, total) {
    if (color === void 0 || color === "") return void 0;
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    if (!isGradientObject(normalized)) return normalized;
    const grad = normalized;
    const position = total > 1 ? index / (total - 1) : 0;
    const finalPosition = grad.reverse ? 1 - position : position;
    const [r, g, b] = this.getColorAtPosition(grad, finalPosition);
    return `\x1B[38;2;${r};${g};${b}m`;
  }
  /**
   * Hand the inherited legend builder a synthetic two-series setup
   * (`_seriesColors = [bull, bear]`) when the legend is enabled and the
   * bull/bear colors actually differ. Default labels are `Bullish` /
   * `Bearish`; a user-supplied `legend.values` array overrides them.
   *
   * When bull and bear are the same color, a two-entry legend would be
   * meaningless — leave `_seriesColors` empty so the inherited
   * `resolveLegendConfig` skips it.
   */
  prepareCandlestickLegend() {
    if (!this.options.legend) return;
    const bull = this.options._bullColor;
    const bear = this.options._bearColor;
    if (bull === void 0 && bear === void 0) return;
    const sameColor = this.colorsEqual(bull, bear);
    if (sameColor) return;
    this.options._seriesColors = [bull, bear];
    const legend = typeof this.options.legend === "object" ? this.options.legend : {};
    if (!legend.values || legend.values.length === 0) {
      this.options.legend = { ...legend, values: ["Bullish", "Bearish"] };
    }
  }
  colorsEqual(a, b) {
    if (a === b) return true;
    if (typeof a === "string" && typeof b === "string") {
      return normalizeColor(a) === normalizeColor(b);
    }
    if (typeof a !== "string" && typeof b !== "string" && a && b) {
      const themeColors = this.getThemeColors();
      const sig = (g) => g.colors.map((c) => parseColorToRgb(c, themeColors).join(",")).join("|");
      return sig(a) === sig(b);
    }
    return false;
  }
};
var candlestick_default = CandlestickChartFormatter;

// formatters/status.ts
var BLOCK_CHAR = "\u2588";
var StatusChartFormatter = class extends line_default {
  constructor(options) {
    super(options);
  }
  /**
   * Stub — status uses its own grid layout, not the bar dimension model.
   */
  calculateDefaultDimensions(_barCount, _totalSize, _charWidth) {
    return { barSize: this.options.barSize ?? 2, padding: this.options.padding ?? 1 };
  }
  format(chartData) {
    const chart = [...chartData.values()];
    if (chart.length === 0) return "";
    if (chart.some((p) => p.statuses)) {
      return this.formatRows(chart);
    }
    const barSize = this.options.barSize ?? 2;
    const cellHeight = Math.max(1, Math.ceil(barSize / 2));
    const padding = this.options.padding ?? 1;
    const total = chart.length;
    const cols = this.resolveCols(total, barSize, padding);
    const rows = Math.ceil(total / cols);
    const showLabels = this.options.labels !== false;
    const labelRows = showLabels ? 1 : 0;
    const cellRowHeight = cellHeight + labelRows;
    const chartWidth = cols * barSize + Math.max(0, cols - 1) * padding;
    const chartHeight = rows * cellRowHeight + Math.max(0, rows - 1) * padding;
    const grid = this.buildGrid(chartWidth, chartHeight);
    const gridColors = Array.from(
      { length: chartHeight },
      () => new Array(chartWidth).fill(void 0)
    );
    const visibleCount = this.computeVisibleCount(total);
    for (let i = 0; i < total; i++) {
      const point = chart[i];
      const gridRow = Math.floor(i / cols);
      const gridCol = i % cols;
      const xStart = gridCol * (barSize + padding);
      const yStart = gridRow * (cellRowHeight + padding);
      if (i >= visibleCount) continue;
      const cellColor = this.resolveStatusColor(point, i, total);
      for (let dy = 0; dy < cellHeight; dy++) {
        for (let dx = 0; dx < barSize; dx++) {
          const col = xStart + dx;
          const row = yStart + dy;
          if (col < chartWidth && row < chartHeight) {
            grid[row][col] = BLOCK_CHAR;
            if (cellColor) gridColors[row][col] = cellColor;
          }
        }
      }
      if (showLabels && point.label) {
        const label = point.label;
        const labelRow = yStart + cellHeight;
        const cellCenter = xStart + Math.floor(barSize / 2);
        const labelStart = Math.max(xStart, cellCenter - Math.floor(label.length / 2));
        const cellEnd = xStart + barSize;
        for (let j = 0; j < label.length; j++) {
          const col = labelStart + j;
          if (col >= cellEnd || col >= chartWidth) break;
          grid[labelRow][col] = label[j];
          if (this.options.colorLabels !== false && cellColor) {
            gridColors[labelRow][col] = cellColor;
          }
        }
      }
    }
    this.prepareStatusLegend();
    return this.composeStatus(grid, gridColors, chartWidth, chartHeight);
  }
  /**
   * Row mode: render one row per point, with the label on the left (y-axis)
   * and an array of colored cells extending across the x-axis. Scalar points
   * become a single-cell row; ragged arrays are padded with blank space on
   * the right (no cell drawn, no `padding` character either — keeps the
   * x-axis aligned across rows).
   */
  formatRows(chart) {
    const barSize = this.options.barSize ?? 2;
    const cellHeight = Math.max(1, Math.ceil(barSize / 2));
    const padding = this.options.padding ?? 1;
    const showLabels = this.options.labels !== false;
    const cellsPerRow = chart.map((p) => p.statuses ? p.statuses.length : p.status !== void 0 ? 1 : 0);
    const maxCells = Math.max(0, ...cellsPerRow);
    const labelWidth = showLabels ? Math.max(0, ...chart.map((p) => p.label ? p.label.length : 0)) : 0;
    const labelGap = labelWidth > 0 ? 1 : 0;
    const cellsAreaWidth = maxCells * barSize + Math.max(0, maxCells - 1) * padding;
    const chartWidth = labelWidth + labelGap + cellsAreaWidth;
    const rows = chart.length;
    const chartHeight = rows * cellHeight + Math.max(0, rows - 1) * padding;
    const grid = this.buildGrid(chartWidth, chartHeight);
    const gridColors = Array.from(
      { length: chartHeight },
      () => new Array(chartWidth).fill(void 0)
    );
    const totalCells = cellsPerRow.reduce((sum, n) => sum + n, 0);
    const visibleCount = this.computeVisibleCount(totalCells);
    let cellIndex = 0;
    for (let r = 0; r < rows; r++) {
      const point = chart[r];
      const yStart = r * (cellHeight + padding);
      const cells = point.statuses ? point.statuses : point.status !== void 0 ? [point.status] : [];
      if (showLabels && point.label && labelWidth > 0) {
        const labelRow = yStart + Math.floor(cellHeight / 2);
        const padded = point.label.padStart(labelWidth);
        for (let i = 0; i < padded.length; i++) {
          if (i < chartWidth) grid[labelRow][i] = padded[i];
        }
      }
      for (let c = 0; c < cells.length; c++) {
        const xStart = labelWidth + labelGap + c * (barSize + padding);
        const cellPoint = { ...point, status: cells[c] };
        const cellColor = this.resolveStatusColor(cellPoint, cellIndex, totalCells);
        if (cellIndex < visibleCount) {
          for (let dy = 0; dy < cellHeight; dy++) {
            for (let dx = 0; dx < barSize; dx++) {
              const col = xStart + dx;
              const row = yStart + dy;
              if (col < chartWidth && row < chartHeight) {
                grid[row][col] = BLOCK_CHAR;
                if (cellColor) gridColors[row][col] = cellColor;
              }
            }
          }
        }
        cellIndex++;
      }
    }
    this.prepareStatusLegend();
    return this.composeStatus(grid, gridColors, chartWidth, chartHeight);
  }
  /**
   * Status is single-series. If a caller routes here, fall back to the
   * single-chart format with the first dataset.
   */
  formatMulti(charts) {
    return this.format(charts[0] ?? /* @__PURE__ */ new Map());
  }
  /**
   * Pick the column count for the grid. With `width` set, pack as many
   * `barSize`-wide cells as fit (separated by `padding`). Otherwise fall
   * back to a roughly-square grid via `ceil(sqrt(N))`. Always clamped to
   * `[1, total]` — no empty columns, no more columns than items.
   */
  resolveCols(total, barSize, padding) {
    const width = this.options.width;
    if (typeof width === "number" && width > 0) {
      const fit = Math.floor((width + padding) / (barSize + padding));
      return Math.max(1, Math.min(total, fit));
    }
    return Math.max(1, Math.min(total, Math.ceil(Math.sqrt(total))));
  }
  /**
   * Animation reveal works in scan order: at progress p, the first
   * `floor(p * total)` cells are drawn; the rest are blank.
   */
  computeVisibleCount(total) {
    const progress = this.options._animationProgress;
    if (progress === void 0 || progress >= 1) return total;
    if (progress <= 0) return 0;
    return Math.max(0, Math.min(total, Math.floor(progress * total)));
  }
  /**
   * Custom compose for status — no y-axis or bottom rule. Stitches
   * title + legend(top) + grid rows + legend(bottom) in the same order
   * the line formatter does, just without the chart-frame chrome.
   */
  composeStatus(grid, gridColors, chartWidth, chartHeight) {
    const lines = [];
    const title = this.formatTitle(chartWidth);
    if (title) lines.push(title);
    const legendConfig = this.resolveLegendConfig();
    const legendRows = legendConfig ? this.buildLegendRows(legendConfig, chartWidth) : [];
    if (legendConfig?.position === "top") {
      for (const row of legendRows) lines.push(row);
      lines.push(" ".repeat(chartWidth));
    }
    for (let row = 0; row < chartHeight; row++) {
      lines.push(this.colorizeRow(grid[row], row, chartHeight, chartWidth, gridColors[row]));
    }
    if (legendConfig?.position === "bottom") {
      lines.push(" ".repeat(chartWidth));
      for (const row of legendRows) lines.push(row);
    }
    return lines.join("\n");
  }
  /**
   * Resolve the color for a single cell. Order of precedence:
   *   1. Per-point `point.color` override
   *   2. The status's color from the `_statusColors` map
   *
   * Gradients flatten to a single RGB ANSI escape per cell, interpolated
   * across the global cell index (0..total-1) — same pattern candlestick
   * uses for time-decay coloring.
   */
  resolveStatusColor(point, index, total) {
    if (point.color) return this.flattenStatusColor(point.color, index, total);
    const map = this.options._statusColors;
    if (!map || !point.status) return void 0;
    return this.flattenStatusColor(map[point.status], index, total);
  }
  flattenStatusColor(color, index, total) {
    if (color === void 0 || color === "") return void 0;
    const normalized = typeof color === "string" ? normalizeColor(color) : color;
    if (!isGradientObject(normalized)) return normalized;
    const grad = normalized;
    const position = total > 1 ? index / (total - 1) : 0;
    const finalPosition = grad.reverse ? 1 - position : position;
    const [r, g, b] = this.getColorAtPosition(grad, finalPosition);
    return `\x1B[38;2;${r};${g};${b}m`;
  }
  /**
   * Hand the inherited legend builder one entry per status key. Each
   * legend swatch shows the color from the status map. Default values
   * are the status keys themselves; a user-supplied `legend.values`
   * array overrides them.
   */
  prepareStatusLegend() {
    if (!this.options.legend) return;
    const map = this.options._statusColors;
    if (!map) return;
    const statuses = Object.keys(map);
    if (statuses.length === 0) return;
    this.options._seriesColors = statuses.map((s) => map[s]);
    const legend = typeof this.options.legend === "object" ? this.options.legend : {};
    if (!legend.values || legend.values.length === 0) {
      this.options.legend = { ...legend, values: statuses };
    }
  }
};
var status_default = StatusChartFormatter;

// chartscii.ts
var SERIES_AUTO_COLORS = ["red", "green", "yellow", "blue", "purple", "cyan", "pink", "orange", "marine"];
var DEFAULT_BULL_COLOR = "green";
var DEFAULT_BEAR_COLOR = "red";
function isPointChartType(type) {
  return type === "line" || type === "step" || type === "scatter";
}
function supportsArrayColor(type) {
  return isPointChartType(type) || type === "candlestick";
}
function usesProgressReveal(type) {
  return isPointChartType(type) || type === "candlestick" || type === "status";
}
function isStatusColorMap(color) {
  return color !== null && typeof color === "object" && !Array.isArray(color) && color.type !== "gradient";
}
function normalizeStatusInput(data) {
  return data.map((item) => {
    if (typeof item === "number" || typeof item === "string") {
      return { value: item };
    }
    if (item && typeof item === "object" && item.status !== void 0 && item.value === void 0) {
      const { status, label, color } = item;
      return { value: status, label, color };
    }
    return item;
  });
}
function resolveStatusColors(color) {
  if (isStatusColorMap(color)) return color;
  return void 0;
}
function normalizeCandlestickInput(data) {
  return data.map((item) => {
    if (Array.isArray(item)) {
      return { value: item.slice(0, 4) };
    }
    return item;
  });
}
function resolveCandlestickColors(color) {
  if (color === void 0 || color === "auto" || isStatusColorMap(color)) {
    return { bullColor: DEFAULT_BULL_COLOR, bearColor: DEFAULT_BEAR_COLOR };
  }
  if (Array.isArray(color)) {
    return { bullColor: color[0], bearColor: color[1] ?? color[0] };
  }
  return { bullColor: color, bearColor: color };
}
function resolveSeriesColors(color, seriesCount) {
  if (color === "auto") {
    return Array.from({ length: seriesCount }, (_, i) => SERIES_AUTO_COLORS[i % SERIES_AUTO_COLORS.length]);
  }
  if (Array.isArray(color)) {
    return Array.from({ length: seriesCount }, (_, i) => color[i]);
  }
  if (isStatusColorMap(color)) {
    return Array.from({ length: seriesCount }, () => void 0);
  }
  return Array.from({ length: seriesCount }, () => color);
}
function narrowArrayColor(color) {
  if (Array.isArray(color)) return color[0];
  if (isStatusColorMap(color)) return void 0;
  return color;
}
function isMultiSeriesData(data) {
  return Array.isArray(data) && data.length > 0 && Array.isArray(data[0]);
}
var easings = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t),
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
};
function roundValue(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
function getOriginalLabel(item) {
  if (typeof item === "number") {
    return item.toString();
  }
  if (item.label) {
    return item.label;
  }
  if (Array.isArray(item.value)) {
    let total = 0;
    for (const v of item.value) {
      total += typeof v === "number" ? v : v.value;
    }
    return total.toString();
  }
  return item.value.toString();
}
function scaleInputData(data, progress, decimals = 2, preserveLabels = false) {
  return data.map((item) => {
    const originalLabel = preserveLabels ? getOriginalLabel(item) : void 0;
    if (typeof item === "number") {
      const scaledValue = roundValue(item * progress, decimals);
      return preserveLabels ? { value: scaledValue, label: originalLabel } : scaledValue;
    }
    if (Array.isArray(item.value)) {
      return {
        ...item,
        ...originalLabel && { label: originalLabel },
        value: item.value.map(
          (v) => typeof v === "number" ? roundValue(v * progress, decimals) : { ...v, value: roundValue(v.value * progress, decimals) }
        )
      };
    }
    return {
      ...item,
      ...originalLabel && { label: originalLabel },
      value: roundValue(item.value * progress, decimals)
    };
  });
}
function getMaxValue(data) {
  let maxVal = 0;
  for (const item of data) {
    let value;
    if (typeof item === "number") {
      value = item;
    } else if (Array.isArray(item.value)) {
      value = 0;
      for (const v of item.value) {
        value += typeof v === "number" ? v : v.value;
      }
    } else {
      value = item.value;
    }
    if (value > maxVal) maxVal = value;
  }
  return maxVal;
}
var Chartscii = class _Chartscii {
  constructor(data, options) {
    const config = createOptions(options || {});
    this.options = options;
    this.originalRawData = data;
    const chartType = config.type || "bar";
    if (!supportsArrayColor(chartType) && Array.isArray(config.color)) {
      config.color = narrowArrayColor(config.color);
    }
    if (chartType !== "status" && isStatusColorMap(config.color)) {
      config.color = void 0;
    }
    if (chartType === "status") {
      const statusData = normalizeStatusInput(data);
      this.originalData = statusData;
      const statusColors = resolveStatusColors(options?.color);
      const processorConfig = {
        ...config,
        color: void 0,
        padding: options?.padding,
        width: options?.width,
        _statusColors: statusColors
      };
      const processor = new processor_default(processorConfig);
      const [chart, processedOptions] = processor.process(statusData);
      this.chart = chart;
      this.processedOptions = processedOptions;
      const statusFormatter = new status_default(processedOptions);
      this.asciiChart = statusFormatter.format(chart);
      return;
    }
    if (chartType === "candlestick") {
      const candleData = normalizeCandlestickInput(data);
      this.originalData = candleData;
      const { bullColor, bearColor } = resolveCandlestickColors(options?.color);
      const processorConfig = {
        ...config,
        color: void 0,
        padding: options?.padding,
        _bullColor: bullColor,
        _bearColor: bearColor
      };
      const processor = new processor_default(processorConfig);
      const [chart, processedOptions] = processor.process(candleData);
      this.chart = chart;
      this.processedOptions = processedOptions;
      const candleFormatter = new candlestick_default(processedOptions);
      this.asciiChart = candleFormatter.format(chart);
      return;
    }
    if (isPointChartType(chartType) && isMultiSeriesData(data)) {
      const rawPoints = data;
      const seriesCount = rawPoints[0]?.length ?? 0;
      const seriesData = [];
      for (let s = 0; s < seriesCount; s++) {
        seriesData.push(rawPoints.map((point) => point[s]));
      }
      this.originalData = seriesData.flat();
      const seriesColors = resolveSeriesColors(options?.color, seriesCount);
      const processorConfig = { ...config, color: void 0 };
      const processor = new processor_default(processorConfig);
      const charts = [];
      let lastOpts = processorConfig;
      for (const series of seriesData) {
        const [chart, opts] = processor.process(series);
        charts.push(chart);
        lastOpts = opts;
      }
      lastOpts._seriesColors = seriesColors;
      this.chart = charts[0] ?? /* @__PURE__ */ new Map();
      this.processedOptions = lastOpts;
      let multiFormatter;
      if (chartType === "step") {
        multiFormatter = new step_default(lastOpts);
      } else if (chartType === "scatter") {
        multiFormatter = new scatter_default(lastOpts);
      } else {
        multiFormatter = new line_default(lastOpts);
      }
      this.asciiChart = multiFormatter.formatMulti(charts);
    } else {
      const inputData = data;
      this.originalData = inputData;
      let preProcessConfig = config;
      if (isPointChartType(chartType)) {
        const isScatterAuto = chartType === "scatter" && options?.color === "auto";
        if (!isScatterAuto) {
          const seriesColors = resolveSeriesColors(options?.color, 1);
          preProcessConfig = { ...config, color: void 0, _seriesColors: seriesColors };
        }
      }
      const processor = new processor_default(preProcessConfig);
      const [chart, processedOptions] = processor.process(inputData);
      this.chart = chart;
      this.processedOptions = processedOptions;
      let chartFormatter;
      if (chartType === "step") {
        chartFormatter = new step_default(processedOptions);
      } else if (chartType === "line") {
        chartFormatter = new line_default(processedOptions);
      } else if (chartType === "scatter") {
        chartFormatter = new scatter_default(processedOptions);
      } else if (config.orientation === "vertical") {
        chartFormatter = new vertical_default(processedOptions);
      } else {
        chartFormatter = new horizontal_default(processedOptions);
      }
      this.asciiChart = chartFormatter.format(this.chart);
    }
  }
  create() {
    return this.asciiChart;
  }
  createAt(progress) {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const chartType = this.processedOptions.type;
    if (usesProgressReveal(chartType)) {
      const fixedOptions2 = {
        ...this.options,
        _animationProgress: clampedProgress
      };
      const chart2 = new _Chartscii(this.originalRawData, fixedOptions2);
      return chart2.create();
    }
    const scaledData = scaleInputData(this.originalData, clampedProgress, 2, true);
    const originalMax = getMaxValue(this.originalData);
    const size = this.processedOptions.orientation === "vertical" ? this.processedOptions.height || 20 : this.processedOptions.width || 80;
    const fixedScale = originalMax / size;
    const charLength = this.processedOptions.char?.length || 1;
    const finalMaxBarLength = Math.floor(this.processedOptions.max.scaled / charLength);
    const fixedOptions = {
      ...this.options,
      scale: fixedScale,
      width: this.processedOptions.width,
      height: this.processedOptions.height,
      _maxLabel: this.processedOptions.max.label,
      // Internal: preserve label width for animation
      _finalMaxBarLength: finalMaxBarLength
      // Internal: preserve max bar length for gradient fill
    };
    const chart = new _Chartscii(scaledData, fixedOptions);
    return chart.create();
  }
  async animate(options = {}) {
    const { duration = 1e3, fps = 30, easing = "easeOut", step, frames: returnFrames } = options;
    const easingFn = easings[easing];
    const output = this.create();
    const lineCount = output.split("\n").length;
    const collectedFrames = [];
    if (step !== void 0 && step > 0) {
      const steps = Math.ceil(1 / step);
      const frameTime = duration / steps;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const progress = easingFn(t);
        const frameOutput = this.createAt(progress);
        if (returnFrames) {
          collectedFrames.push(frameOutput);
        } else {
          if (i > 0) {
            process.stdout.write(`\x1B[${lineCount}A`);
          }
          process.stdout.write(frameOutput + "\n");
          if (i < steps) {
            await new Promise((resolve) => setTimeout(resolve, frameTime));
          }
        }
      }
    } else {
      const frameTime = 1e3 / fps;
      const totalFrames = Math.ceil(duration / frameTime);
      for (let frame = 0; frame <= totalFrames; frame++) {
        const t = frame / totalFrames;
        const progress = easingFn(t);
        const frameOutput = this.createAt(progress);
        if (returnFrames) {
          collectedFrames.push(frameOutput);
        } else {
          if (frame > 0) {
            process.stdout.write(`\x1B[${lineCount}A`);
          }
          process.stdout.write(frameOutput + "\n");
          if (frame < totalFrames) {
            await new Promise((resolve) => setTimeout(resolve, frameTime));
          }
        }
      }
    }
    if (returnFrames) {
      return collectedFrames;
    }
  }
};
var chartscii_default = Chartscii;

// index.ts
var index_default = chartscii_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);
//# sourceMappingURL=index.cjs.map

/***/ }),

/***/ 3917:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('[".git",".*","*.*~","node_modules","bower_components"]');

/***/ }),

/***/ 8891:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"surge-sdk","version":"0.34.0","description":"JavaScript SDK for surge.sh","main":"lib/sdk.js","repository":{"type":"git","url":"git+https://github.com/sintaxi/surge-sdk.git"},"author":"Brock Whitten <brock@chloi.io>","license":"ISC","engines":{"node":">=18.13"},"bugs":{"url":"https://github.com/sintaxi/surge-sdk/issues"},"homepage":"https://github.com/sintaxi/surge-sdk#readme"}');

/***/ }),

/***/ 6759:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"surge-stream","version":"0.34.0","description":"JavaScript stream library for publishing to surge.sh","main":"lib/stream.js","repository":{"type":"git","url":"git+https://github.com/sintaxi/surge-sdk.git"},"author":"Brock Whitten <brock@chloi.io>","license":"ISC","engines":{"node":">=18.13"},"bugs":{"url":"https://github.com/sintaxi/surge-sdk/issues"},"homepage":"https://github.com/sintaxi/surge-sdk#readme","dependencies":{"ignore":"7.0.5","split":"1.0.1","surge-ignore":"0.3.0"}}');

/***/ }),

/***/ 8342:
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"name":"surge","version":"0.56.0","description":"Static web publishing. One command from a directory or HTML file to a live URL, with free custom domains and SSL.","keywords":["surge","harp","static","deploy","publish","hosting","cdn","cli","web","jamstack","frontend","spa","html","static-hosting","custom-domain","ssl","ci","agent"],"homepage":"https://surge.sh","bugs":{"url":"https://github.com/sintaxi/surge/issues"},"author":"Brock Whitten <brock@chloi.io>","bin":"./bin/surge","dependencies":{"chartscii":"4.0.3","cli-table3":"0.6.5","colors":"1.4.0","human-readable-numbers":"0.9.5","ignore":"7.0.9","is-domain":"0.0.1","minimist":"1.2.8","moniker":"0.1.2","netrc":"0.1.4","progress":"2.0.3","prompts":"2.4.2","read":"1.0.5","surge-ignore":"0.3.0","surge-sdk":"0.34.0","surge-stream":"0.34.0","url-parse-as-address":"1.0.0","xbytes":"1.9.1"},"devDependencies":{"mocha":"12.0.2","nixt":"0.5.1","should":"13.2.3"},"overrides":{"diff":"8.0.3","serialize-javascript":"7.0.7"},"license":"ISC","engines":{"node":">=18.13"},"main":"./lib/surge.js","ignore":["test"],"scripts":{"preversion":"npm test","version":"npm publish","postversion":"git push --no-verify && git push --tags --no-verify && git push --no-verify","test":"npm run test:unit && mocha ./test/basic.js ./test/actions.js -t 60000","test:unit":"mocha ./test/unit -t 8000","test:local":"ENDPOINT=\'surge.lvh.me\' mocha ./test/basic -t 4000"},"repository":{"type":"git","url":"https://github.com/sintaxi/surge.git"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nccwpck_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/asset-relocator-loader */
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__nccwpck_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__nccwpck_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__nccwpck_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__nccwpck_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__nccwpck_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__nccwpck_require__.f).reduce((promises, key) => {
/******/ 				__nccwpck_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__nccwpck_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".index.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			792: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__nccwpck_require__.o(moreModules, moduleId)) {
/******/ 					__nccwpck_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__nccwpck_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__nccwpck_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __nccwpck_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
const surge = __nccwpck_require__(3932);
const publish = __nccwpck_require__(5703);

__nccwpck_require__.e(/* import() */ 421).then(__nccwpck_require__.bind(__nccwpck_require__, 6421))
  .then((core) => publish(core, surge))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

module.exports = __webpack_exports__;
/******/ })()
;