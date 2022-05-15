import { CircleClient } from '../__shared/clients/circleClient.js'
import { render } from '../__shared/utils.js'
import { describe } from './cli.js'

export default async function run (config, projects) {
  const jobs = await new CircleClient(config.circleCi).getScheduledJobsForProjects(Object.keys(projects))
  render({
    name: 'FAILING SCHEDULED JOBS',
    items: jobs.map(describe),
    display: job => job.description,
    include: (check) => !check.isSuccess
  })
}
