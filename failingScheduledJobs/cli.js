import c from 'ansi-colors'
import { formatRelative } from 'date-fns'

const describeRun = (name, run) => {
  const status = (status) => (status === 'failed' ? c.bgRedBright(' ') : c.bgGreen(' '))
  const [workflow, jobs] = run
  const output = `${c.bold(name)}: ${jobs.map((job) => status(job.status)).join('')}`
  const date = formatRelative(workflow.started, new Date())
  const url = c.gray(workflow.url)
  return [output, date, url].join('\n')
}

export const describe = ([name, run]) => ({
  description: describeRun(name, run),
  isSuccess: run[0].status === 'success'
})
