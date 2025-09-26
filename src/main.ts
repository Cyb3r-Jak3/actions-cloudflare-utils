import * as core from '@actions/core'
import {getInputs} from './context'
import {install} from './download'
import * as exec from '@actions/exec'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const context = await getInputs()

    core.info(`cloudflare-utils Version: ${context.version}`)
    const bin = await install(context)

    core.addPath(path.dirname(bin))

    if (context.args) {
      const full_command = `cloudflare-utils ${context.args}`
      core.info(`Running command: ${full_command}`)
      await exec.exec(bin, context.args.split(' '))
    } else {
      core.info('Installation complete.')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
