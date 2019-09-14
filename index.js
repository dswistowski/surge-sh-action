const core = require('@actions/core');

const surge = require('surge');
try {
  const domain = core.getInput('domain');
  const project = core.getInput('project');
  process.env.SURGE_LOGIN = core.getInput('login');
  process.env.SURGE_TOKEN = core.getInput('token');
  surge({ default: "publish" })([project, domain]);
} catch (error) {
  core.setFailed(error.message);
}
