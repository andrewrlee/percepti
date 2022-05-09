import fs from 'fs'
import c from 'ansi-colors'

import { CircleClient } from './circle/circleClient.js'
import { describeJobs } from './circle/cli.js'
import { GithubClient } from './github/githubClient.js'
import { describePulls } from './github/cli.js'

const config = JSON.parse(fs.readFileSync('./config.json'))

const projects = config.projects

console.log(c.bold('OUTSTANDING PULL REQUESTS'))
const prs = await new GithubClient(config.github).getPullRequestsForProjects(projects)

prs.forEach(pr => {
    console.log(describePulls(pr))
})

console.log(c.bold('SECURITY JOBS'))
const jobs = await new CircleClient(config.circleCi).getScheduledJobsForProjects(projects, 1)

jobs.forEach(jobs => {
    console.log(describeJobs(jobs))
})
