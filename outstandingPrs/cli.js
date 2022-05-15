import c from 'ansi-colors'
import { format } from 'date-fns'

const levelToColor = { success: 'bgGreen', pending: 'bgYellow', failure: 'bgRedBright', error: 'bgRedBright' }

const describeStatuses = (statuses) =>
  Object.entries(statuses)
    .map(([_, statuses]) => {
      return c[levelToColor[statuses[0].state]](' ')
    })
    .join('')

const describePull = (pull) => {
  const { title, user, url, createdAt, updatedAt, statuses } = pull
  return `
\t${c.bold('Title:')} ${title}
\t${c.bold('By:')} ${user}
\t${c.bold('Created:')} ${format(createdAt, 'yyyy-MM-dd HH:mm')} ${createdAt.getTime() !== updatedAt.getTime() ? `(Updated: ${format(updatedAt, 'yyyy-MM-dd HH:mm')})` : ''}
\t${c.bold('Status:')} ${describeStatuses(statuses)}
\t${c.grey(url)}`
}

export const describe = ([name, pulls]) =>
  `${c.bold(name)}: ${pulls.map((pull) => describePull(pull)).join('\n')}`
