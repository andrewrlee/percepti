import { ServiceClient } from '../__shared/clients/serviceClient.js'
import { render } from '../__shared/utils.js'
import { describe } from './cli.js'

export default async function run (config) {
  const checks = await new ServiceClient().getHealthChecks(config.projects)
  render({
    name: 'FAILING HEALTH CHECKS',
    items: checks.map(describe),
    display: (check) => check.description,
    include: () => true
  })
}
