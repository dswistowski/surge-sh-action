// ncc emits a separate chunk for the ESM toolkit. Collect license notices
// from the entire runtime dependency tree so both chunks are covered.
const fs = require('node:fs');
const path = require('node:path');
const { packages } = require('../package-lock.json');

const notices = Object.entries(packages)
  .filter(([directory, metadata]) => directory && !metadata.dev)
  .sort(([left], [right]) => left.localeCompare(right, 'en'))
  .map(([directory, metadata]) => {
    const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
    const files = fs.readdirSync(directory)
      .filter((name) => /^(licen[sc]e|copying)(\..*)?$/i.test(name))
      .sort();
    const text = files.map((name) => fs.readFileSync(path.join(directory, name), 'utf8')).join('\n');
    return `${pkg.name}@${pkg.version}\nLicense: ${metadata.license || pkg.license}\n${text}`;
  });

fs.writeFileSync('dist/licenses.txt', notices.join('\n\n---\n\n') + '\n');
