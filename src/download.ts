import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as github from './github'
import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import {osPlat, osArch, Inputs} from './context'

export async function install(inputs: Inputs): Promise<string> {
  const release: github.GitHubRelease = await github.getRelease(inputs)
  const filename = getFilename(release.tag_name)
  const downloadUrl = util.format(
    'https://github.com/Cyb3r-Jak3/cloudflare-utils/releases/download/%s/%s',
    release.tag_name,
    filename
  )

  core.info(`Downloading ${downloadUrl}`)
  const downloadPath: string = await tc.downloadTool(downloadUrl)
  core.debug(`Downloaded to ${downloadPath}`)

  core.info('Extracting Cloudflare Utils')
  let extPath: string
  if (osPlat == 'win32') {
    if (!downloadPath.endsWith('.zip')) {
      const newPath = downloadPath + '.zip'
      fs.renameSync(downloadPath, newPath)
      extPath = await tc.extractZip(newPath)
    } else {
      extPath = await tc.extractZip(downloadPath)
    }
  } else {
    extPath = await tc.extractTar(downloadPath, undefined, ['xJ'])
  }
  core.debug(`Extracted to ${extPath}`)

  const cachePath: string = await tc.cacheDir(
    extPath,
    'cloudflare-utils',
    release.tag_name.replace(/^v/, '')
  )
  core.debug(`Cached to ${cachePath}`)

  const exePath: string = path.join(
    cachePath,
    osPlat == 'win32' ? 'cloudflare-utils.exe' : 'cloudflare-utils'
  )
  core.debug(`Exe path is ${exePath}`)

  return exePath
}

const getFilename = (version: string): string => {
  version = version.replace(/^v/, '')
  let arch: string
  switch (osArch) {
    case 'x64': {
      arch = 'amd64'
      break
    }
    case 'x32': {
      arch = '386'
      break
    }
    case 'arm': {
      arch = 'arm64'
      break
    }
    default: {
      arch = osArch
      break
    }
  }
  const platform: string =
    osPlat == 'win32' ? 'windows' : osPlat == 'darwin' ? 'darwin' : 'linux'
  const ext: string = osPlat == 'win32' ? 'zip' : 'tar.xz'
  return util.format(
    'cloudflare-utils_%s_%s_%s.%s',
    version,
    platform,
    arch,
    ext
  )
}
