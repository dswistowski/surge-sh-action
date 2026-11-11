const assert = require('node:assert/strict');
const test = require('node:test');

const publish = require('../publish');

function runAction({ inputs, surgeDeploy } = {}) {
  const originalLogin = process.env.SURGE_LOGIN;
  const originalToken = process.env.SURGE_TOKEN;
  const failures = [];
  const surgeConfigs = [];
  const surgeArgs = [];
  const secrets = [];

  const core = {
    getInput(name, options) {
      const value = inputs[name] || '';
      if (options?.required && !value) throw new Error(`Input required and not supplied: ${name}`);
      return value;
    },
    setSecret(value) {
      secrets.push(value);
    },
    setFailed(message) {
      failures.push(message);
    },
  };

  const surge = (config) => {
    surgeConfigs.push(config);
    return (args) => {
      surgeArgs.push(args);
      if (surgeDeploy) surgeDeploy(args);
    };
  };

  try {
    publish(core, surge);

    return {
      failures,
      secrets,
      surgeArgs,
      surgeConfigs,
      surgeLogin: process.env.SURGE_LOGIN,
      surgeToken: process.env.SURGE_TOKEN,
    };
  } finally {
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


test('uses the default project and masks the token', () => {
  const result = runAction({ inputs: { domain: 'example.surge.sh', login: 'deploy@example.com', token: 'surge-token' } });
  assert.deepEqual(result.surgeArgs, [['.', 'example.surge.sh']]);
  assert.deepEqual(result.secrets, ['surge-token']);
});

for (const name of ['domain', 'login', 'token']) {
  test(`rejects a missing ${name} before invoking Surge`, () => {
    const inputs = { domain: 'example.surge.sh', login: 'deploy@example.com', token: 'surge-token' };
    delete inputs[name];
    const result = runAction({ inputs });
    assert.deepEqual(result.failures, [`Input required and not supplied: ${name}`]);
    assert.deepEqual(result.surgeArgs, []);
  });
}
