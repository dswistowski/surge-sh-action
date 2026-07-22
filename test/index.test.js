const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
const test = require('node:test');

const actionPath = path.join(__dirname, '..', 'index.js');

function runAction({ inputs, surgeDeploy } = {}) {
  const originalLoad = Module._load;
  const originalLogin = process.env.SURGE_LOGIN;
  const originalToken = process.env.SURGE_TOKEN;
  const failures = [];
  const surgeConfigs = [];
  const surgeArgs = [];

  const core = {
    getInput(name) {
      return inputs[name] || '';
    },
    setFailed(message) {
      failures.push(message);
    },
  };

  Module._load = function load(request, parent, isMain) {
    if (request === '@actions/core') {
      return core;
    }

    if (request === 'surge') {
      return (config) => {
        surgeConfigs.push(config);
        return (args) => {
          surgeArgs.push(args);
          if (surgeDeploy) {
            surgeDeploy(args);
          }
        };
      };
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    delete require.cache[actionPath];
    require(actionPath);

    return {
      failures,
      surgeArgs,
      surgeConfigs,
      surgeLogin: process.env.SURGE_LOGIN,
      surgeToken: process.env.SURGE_TOKEN,
    };
  } finally {
    Module._load = originalLoad;
    delete require.cache[actionPath];

    if (originalLogin === undefined) {
      delete process.env.SURGE_LOGIN;
    } else {
      process.env.SURGE_LOGIN = originalLogin;
    }

    if (originalToken === undefined) {
      delete process.env.SURGE_TOKEN;
    } else {
      process.env.SURGE_TOKEN = originalToken;
    }
  }
}

test('publishes the requested project and domain with Surge credentials', () => {
  const result = runAction({
    inputs: {
      domain: 'example.surge.sh',
      login: 'deploy@example.com',
      project: 'dist',
      token: 'surge-token',
    },
  });

  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.surgeConfigs, [{ default: 'publish' }]);
  assert.deepEqual(result.surgeArgs, [['dist', 'example.surge.sh']]);
  assert.equal(result.surgeLogin, 'deploy@example.com');
  assert.equal(result.surgeToken, 'surge-token');
});

test('marks the action as failed when Surge throws', () => {
  const result = runAction({
    inputs: {
      domain: 'example.surge.sh',
      login: 'deploy@example.com',
      project: 'dist',
      token: 'surge-token',
    },
    surgeDeploy() {
      throw new Error('deploy failed');
    },
  });

  assert.deepEqual(result.failures, ['deploy failed']);
});
