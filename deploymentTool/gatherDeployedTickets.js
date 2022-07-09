import { JiraClient } from '../__shared/clients/jiraClient.js'
import { CircleClient } from '../__shared/clients/circleClient.js'
import { ServiceClient } from '../__shared/clients/serviceClient.js'

const MAX_PAGES_TO_SEARCH = 10

const getRelevantBuilds = async (buildsIterator, liveVersion) => {
  const test = (build) => build.tag === liveVersion

  const next = async () => (await buildsIterator.next()).value

  const results = []
  for (let i = 0; i < MAX_PAGES_TO_SEARCH; i++) {
    const page = await next()
    for (let builds of page) {
      for (let build of builds) {
        results.push(build)
        if (test(build)) {
          return results
        }
      }
    }
  }
  return results
}

export default async function gatherTickets(config, name) {
  const buildsIterator = new CircleClient(config.circleCi).getDeployableBuilds(name)
  const [dev, preprod, prod] = await new ServiceClient().getVersionInfo(config.projects[name])

  const builds = await getRelevantBuilds(buildsIterator, prod[1].version)

  const ticketIds = builds.filter(b => b.ticket).map(b => b.ticket)

  const tickets = await new JiraClient(config.jira).getTicketInfo(ticketIds)

  return {
    name, builds: builds.map(build => {
      const isInDev = build.tag == dev[1].version
      const isInPreprod = build.tag == preprod[1].version
      const isInLive = build.tag == prod[1].version
      const status = tickets[build.ticket?.toUpperCase()?.replace(' ', '-')]?.status
      return { isInDev, isInPreprod, isInLive, tag: build.tag, status, subject: build.subject }
    })
  }
}
