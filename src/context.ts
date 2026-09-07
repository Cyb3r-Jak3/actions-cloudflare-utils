import * as os from 'os'
import * as semver from 'semver'
import * as core from '@actions/core'
import * as github from '@actions/github'

export const osPlat: string = os.platform()
export const osArch: string = os.arch()

export interface Inputs {
  version: string
  github_client: ReturnType<typeof github.getOctokit>
  skip_token_check: string
  args: string
}

export async function getInputs(): Promise<Inputs> {
  const githubToken = core.getInput('github_token', {required: true})
  // Normalize comma-separated ranges (e.g. '>=1.8.0,<2') to the
  // space-separated syntax that node-semver expects.
  let version = core.getInput('version').replace(/,/g, ' ').trim()
  if (
    version &&
    version !== 'latest' &&
    !/^v/.test(version) &&
    semver.valid(version)
  ) {
    version = 'v' + version
  }
  const args = core.getInput('args')
  const skip_token_check = core.getInput('skip_token_check')

  return {
    version: version,
    github_client: github.getOctokit(githubToken),
    args: args,
    skip_token_check: skip_token_check
  }
}
