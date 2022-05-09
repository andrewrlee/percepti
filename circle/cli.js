import c from 'ansi-colors'

const describeRun = (run) => {
    const status = (status) => status === 'failed' ? c.redBright(`FAILED`) : c.green(`SUCCESS`)
    const [workflow, jobs] = run
    const output = `
\t* ${workflow.started} ${status(workflow.status)}`

    if (workflow.status !== 'success') {
        return output + `
${jobs.filter(job => job.status !== 'success').map(job => `\t* ${job.name}: ${status(job.status)}`).join("\n")}
${c.gray(`Url: ${workflow.url}`)}`
    }
    return output
}

export const describeJobs = ([name, runs]) =>
    `\n${runs.map(run => `${c.bold(name)}: ${describeRun(run)}`).join("\n")}\n`
