import * as core from '@actions/core'
import {getInputs} from './context.js'
import {install} from './download.js'
import * as exec from '@actions/exec'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const context = await getInputs()
    core.startGroup('Installing cloudflare-utils')
    const bin = await install(context)
    core.addPath(path.dirname(bin))
    core.endGroup()


    core.startGroup('cloudflare-utils version')
    await exec.exec(bin, ['--version'])
    core.endGroup()

    if (context.args) {
      const full_command = `cloudflare-utils ${context.args}`
      const args = context.args.split(' ')
      if (context.skip_token_check === 'true') {
        core.info('Skipping permission check for the Cloudflare API token.')
        args.push('--skip-token-check')
      }
      core.info(`Running command: ${full_command}`)
      await exec.exec(bin, args)
    } else {
      core.info('Installation complete.')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
