import c from 'ansi-colors'

import { CircleClient } from '../__shared/clients/circleClient.js'
import { describeJobs } from './cli.js'

export default async function run(config, projects) {
  console.log(c.bold('FAILING SCHEDULED JOBS'))
  const jobs = await new CircleClient(config.circleCi).getScheduledJobsForProjects(Object.keys(projects), 1)

  jobs.forEach((jobs) => {
    console.log(describeJobs(jobs))
  })
}
