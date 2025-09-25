import * as os from 'os'
import * as core from '@actions/core'
import * as github from '@actions/github'

export const osPlat: string = os.platform()
export const osArch: string = os.arch()

export interface Inputs {
  version: string
  github_client: ReturnType<typeof github.getOctokit>
  command?: string
}

export async function getInputs(): Promise<Inputs> {
  const githubToken = core.getInput('github_token', {required: true})
  let version = core.getInput('version')
  if (version && !/^v/.test(version) && version !== 'latest') {
    version = 'v' + version
  }
  const command = core.getInput('command')

  return {
    version: version,
    github_client: github.getOctokit(githubToken),
    command: command
  }
}
