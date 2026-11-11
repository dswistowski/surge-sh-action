const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { gunzipSync } = require('node:zlib');

const network = path.join(__dirname, 'fixtures/surge-network.cjs');

function runBundle(t, response = 'success') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'surge-action-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const action = path.join(directory, 'action');
  fs.cpSync(path.resolve(__dirname, '../dist'), action, { recursive: true });
  const bundle = path.join(action, 'index.js');
  const project = path.join(directory, 'site');
  fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, 'index.html'), '<h1>Surge action test</h1>');
  const archive = path.join(directory, 'upload.tar.gz');
  // Running from a separate working directory also checks bundle asset paths.
  const result = spawnSync(process.execPath, ['--require', network, bundle], {
    cwd: directory,
    env: {
      ...process.env,
      CI: 'true',
      INPUT_DOMAIN: 'example.surge.sh',
      INPUT_LOGIN: 'deploy@example.com',
      INPUT_TOKEN: 'test-token',
      INPUT_PROJECT: project,
      TEST_SURGE_RESPONSE: response,
      TEST_SURGE_ARCHIVE: archive,
    },
    encoding: 'utf8',
    timeout: 15000,
  });
  return { result, archive, project };
}

test('bundled action authenticates and uploads the project without node_modules', (t) => {
  const { result, archive, project } = runBundle(t);
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /Success!/);
  assert.match(result.stdout, /::add-mask::test-token/);
  const tar = gunzipSync(fs.readFileSync(archive));
  assert.ok(tar.includes(Buffer.from('index.html')));
  assert.ok(tar.includes(Buffer.from('<h1>Surge action test</h1>')));
  assert.equal(fs.readFileSync(path.join(project, 'CNAME'), 'utf8'), 'example.surge.sh\n');
});

test('bundled action exits nonzero when the upload is rejected', (t) => {
  const { result } = runBundle(t, 'forbidden');
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Test deployment denied/);
});

test('bundled action exits nonzero when authentication fails', (t) => {
  const { result, archive } = runBundle(t, 'unauthorized');
  assert.equal(result.error, undefined);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.match(result.stdout, /Invalid token/);
  assert.equal(fs.existsSync(archive), false);
});
