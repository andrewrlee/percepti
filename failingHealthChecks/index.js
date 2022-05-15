import c from 'ansi-colors'

import { ServiceClient } from '../__shared/clients/serviceClient.js'
import { describeChecks } from './cli.js'

const describe = describeChecks({ showFailingOnly: false })

export default async function run(config, projects) {
  console.log(c.bold('FAILING HEALTH CHECKS'))
  const checks = await new ServiceClient().getHealthChecks(projects)

  checks.forEach((jobs) => {
    const description = describe(jobs)
    if (description)
      console.log(description)
  })
}
