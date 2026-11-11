# surge.sh publish action

This action deploys your project with [surge.sh](https://surge.sh).

The action runs on Node 24 and includes its runtime dependencies. Self-hosted
runners must support Node 24 JavaScript actions. The `v1` tag tracks the latest
compatible v1 release; use `v1.3.0` or a commit SHA to pin a specific release.

## Inputs

### `domain`

**Required** Domain set for your service.

### `project`

Path to your build project. Default: `.`

### `login`

**Required** Your user login

### `token`

**Required** Token obtained with `surge token` command

## Example usage

```yaml
name: My workflow

on: push

jobs:
  my-job:
    name: My job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      # Build your site here if needed, then set project to the build directory.
      - name: Deploy to foo-bar.surge.sh
        uses: dswistowski/surge-sh-action@v1
        with:
          domain: 'foo-bar.surge.sh'
          project: '.'
          login: ${{ secrets.surge_login }}
          token: ${{ secrets.surge_token }}
```

## Development and maintenance

Use Node 24. Run `npm ci`, `npm run build`, and `npm test` before committing.
Commit the generated `dist/` files whenever source or dependencies change;
consumers execute that bundle without installing packages. Do not commit
`node_modules/`. CI checks that the bundle matches the source and lockfile,
runs tests on Node 24, and audits dependencies. Dependabot checks npm packages
and workflow actions weekly. Rebuild `dist/` when merging npm dependency updates.

The bundle tests run the real Surge CLI with mocked network responses to check
authentication, archive creation, publishing, and failure exit codes. They do
not publish to a live Surge account.
