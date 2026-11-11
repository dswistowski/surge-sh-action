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
