const surge = require('surge');
const publish = require('./publish');

import('@actions/core')
  .then((core) => publish(core, surge))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
