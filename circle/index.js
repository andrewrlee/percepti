import c from 'ansi-colors'

import { CircleClient } from "./circleClient.js"
import { describeJobs } from "./cli.js"

export default async function run(config, projects) {
    console.log(c.bold('SCHEDULED JOBS'))
    const jobs = await new CircleClient(config.circleCi).getScheduledJobsForProjects(projects, 1)
    
    jobs.forEach(jobs => {
        console.log(describeJobs(jobs))
    })
    
}