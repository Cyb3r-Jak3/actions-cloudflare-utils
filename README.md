# Cloudflare Utils Action

This repository contains a GitHub Action that installs [cloudflare-utils](https://github.com/Cyb3r-Jak3/cloudflare-utils) and provides a set of utility functions for working with Cloudflare's API.

## Using the Action

To use this action in your GitHub workflow, add the following step to your workflow file:

```yaml
- name: Cloudflare Utils Action
  uses: Cyb3r-Jak3/actions-cloudflare-utils@v1
  with:
    version: 'latest' # or specify a version like '1.2.3'
```

and `cloudflare-utils` will be installed and available for use in subsequent steps.
You can then use the installed `cloudflare-utils` commands in your workflow steps.

If you want to run a specific command, you can do so like this:

```yaml
- name: Run Cloudflare Utils Command
  run: cloudflare-utils <command> [options]
```

you can also pass the command directly to the action like this:

```yaml
- name: Cloudflare Utils Action with Command
  uses: Cyb3r-Jak3/actions-cloudflare-utils@v1
  with:
    version: 'latest' # or specify a version like '1.2.3'
    args: 'your-command-here'
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## Inputs

- `version`: The version of `cloudflare-utils` to install. Default is `latest`
- `github_token`: GitHub token for authentication. Default is `${{ github.token }}`
- `command`: (Optional) The specific command to run after installation. If not provided the action will just install cloudflare-utils.
