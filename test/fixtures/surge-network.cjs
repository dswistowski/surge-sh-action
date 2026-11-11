// Replace only the network boundary: the bundled CLI still authenticates,
// reads the project, creates its archive, uploads it, and handles the response.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const { Readable, Writable } = require('node:stream');

globalThis.fetch = async (url, options) => {
  assert.equal(url, 'https://surge.surge.sh/account');
  assert.equal(options.headers.authorization, `Basic ${Buffer.from('token:test-token').toString('base64')}`);
  return new Response(JSON.stringify({ email: 'deploy@example.com' }), {
    status: process.env.TEST_SURGE_RESPONSE === 'unauthorized' ? 401 : 200,
  });
};

http.request = () => { throw new Error('Unexpected HTTP request'); };
https.request = (options, callback) => {
  assert.equal(options.hostname, 'surge.surge.sh');
  assert.equal(options.path, '/example.surge.sh');
  assert.equal(options.method, 'PUT');
  assert.equal(options.auth, 'token:test-token');
  const chunks = [];
  return new Writable({
    write(chunk, encoding, done) {
      chunks.push(chunk);
      done();
    },
    final(done) {
      fs.writeFileSync(process.env.TEST_SURGE_ARCHIVE, Buffer.concat(chunks));
      const response = Readable.from([JSON.stringify({ type: 'info', instances: [] }) + '\n']);
      response.statusCode = process.env.TEST_SURGE_RESPONSE === 'forbidden' ? 403 : 200;
      response.headers = { reason: 'Test deployment denied' };
      callback(response);
      done();
    },
  });
};
