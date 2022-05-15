import c from 'ansi-colors'

import { ServiceClient } from '../__shared/clients/serviceClient.js'
import { describe } from './cli.js'

export default async function run(config, projects) {
  console.log(c.bold('DEPLOYMENT RADIATOR'))
  const checks = await new ServiceClient().getVersionInfoForProjects(projects)

  checks.forEach((jobs) => {
    const radiator = describe(jobs)
    if (radiator.outOfDate)
      console.log(radiator.description)
  })
}
