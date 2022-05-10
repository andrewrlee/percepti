import c from 'ansi-colors'

import { describePulls } from './cli.js'
import { GithubClient } from './githubClient.js'

export default async function run(config, projects) {
  console.log(c.bold('OUTSTANDING PULL REQUESTS'))
  const prs = await new GithubClient(config.github).getPullRequestsForProjects(projects)

  prs.forEach((pr) => {
    console.log(describePulls(pr))
  })
}