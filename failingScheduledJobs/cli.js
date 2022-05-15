import c from 'ansi-colors'

const describeRun = (run) => {
  const status = (status) => (status === 'failed' ? c.bgRedBright(` `) : c.bgGreen(` `))
  const [workflow, jobs] = run
  const output = `${workflow.started} ${jobs.map((job) => `${status(job.status)}`).join('')}`

  if (workflow.status !== 'success') {
    return (
      output + `\n${c.gray(workflow.url)}`
    )
  }
  return output
}

export const describe = ([name, run]) => ({
  description: `${c.bold(name)}: ${describeRun(run)}`,
  isSuccess: run[0].status === 'success'
})
