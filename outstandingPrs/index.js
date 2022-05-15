import { describe } from './cli.js'
import { GithubClient } from '../__shared/clients/githubClient.js'
import { render } from '../__shared/utils.js'

export default async function run (config) {
  const prs = await new GithubClient(config.github).getPullRequestsForProjects(Object.keys(config.projects))
  render({
    name: 'OUTSTANDING PULL REQUESTS',
    items: prs.map(describe)
  })
}
