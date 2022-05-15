import { ServiceClient } from '../__shared/clients/serviceClient.js'
import { render } from '../__shared/utils.js'
import { describe } from './cli.js'

export default async function run (config, projects) {
  const radiators = await new ServiceClient().getVersionInfoForProjects(projects)
  render({
    name: 'DEPLOYMENT RADIATOR',
    items: radiators.map(describe),
    display: (radiator) => radiator.description,
    include: (radiator) => radiator.outOfDate
  })
}
