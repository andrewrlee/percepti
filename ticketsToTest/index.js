import { describe } from './cli.js'
import { JiraClient } from '../__shared/clients/jiraClient.js'
import { render } from '../__shared/utils.js'

export default async function run(config) {
  const ticketsToTest = await new JiraClient(config.jira).getTicketsToTest()
  render({
    name: `LIST TICKETS TO TEST`,
    items: ticketsToTest.map(describe),
  })
}
