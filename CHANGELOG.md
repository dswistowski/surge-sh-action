# Changelog

## 1.3.0 — 2026-11-11

- Run the action and CI tests on Node 24.
- Update Surge to 0.56.0 and `@actions/core` to 3.0.1; refresh the lockfile.
- Ship a compiled action bundle instead of committed `node_modules`.
- Validate required inputs and mask the Surge token in GitHub Actions logs.
- Update checkout, setup-node, and CodeQL actions; pin workflow actions to commits.
- Add weekly Dependabot updates for npm and GitHub Actions dependencies.
- Check dependency security and bundle freshness in CI.
- Test the standalone release bundle, including successful uploads and failures.
- Move the floating `v1` tag to this release.
