import c from 'ansi-colors'

import { describeOpenTickets } from './cli.js'
import { JiraClient } from '../__shared/jiraClient.js'

export default async function run(config) {
  console.log(c.bold('LIST TICKETS TO TEST'))
  const ticketsToTest = await new JiraClient(config.jira).getTicketsToTest()
  console.log(describeOpenTickets(ticketsToTest))
}
