import * as semver from 'semver'
import {Inputs} from './context'

export interface GitHubRelease {
  tag_name: string
}

export const getRelease = async (inputs: Inputs): Promise<GitHubRelease> => {
  if (inputs.version === 'latest') {
    return getLatestRelease(inputs)
  }
  return getReleaseTag(inputs)
}

export const getReleaseTag = async (inputs: Inputs): Promise<GitHubRelease> => {
  if (semver.valid(inputs.version) == null) {
    throw new Error(`Version ${inputs.version} is not a valid semver version`)
  }
  const response = await inputs.github_client.rest.repos.getReleaseByTag({
    owner: 'Cyb3r-Jak3',
    repo: 'cloudflare-utils',
    tag: inputs.version
  })
  return {tag_name: response.data.tag_name}
}

export const getLatestRelease = async (
  inputs: Inputs
): Promise<GitHubRelease> => {
  const response = await inputs.github_client.rest.repos.getLatestRelease({
    owner: 'Cyb3r-Jak3',
    repo: 'cloudflare-utils'
  })
  return {tag_name: response.data.tag_name}
}
