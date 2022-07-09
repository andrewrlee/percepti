import { describe } from './cli.js'
import { render } from '../__shared/utils.js'
import gatherTickets from './gatherDeployedTickets.js'


export default async function run(config) {
  const projects = await Promise.all(Object.keys(config.projects).map(project => gatherTickets(config, project)))

  render({
    name: 'CURRENTLY_DEPLOYED_TICKETS',
    items: projects.map(({ name, builds }) => describe(name, builds))
  })
}
