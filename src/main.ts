import * as core from '@actions/core'
import {getInputs} from './context'
import {install} from './download'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const context = await getInputs()

    core.info(`cloudflare-utils Version: ${context.version}`)
    const bin = await install(context)

    if (context.command) {
      const full_command = `cloudflare-utils ${context.command}`
      core.info(`Running command: ${full_command}`)
      await exec.exec(bin, [context.command])
    } else {
      core.info('Installation complete.')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
