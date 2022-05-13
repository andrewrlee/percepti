import c from 'ansi-colors'

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
\t${c.bold('Created:')} ${createdAt} ${createdAt != updatedAt ? `(${updatedAt})` : ``}
\t${c.bold('Status:')} ${describeStatuses(statuses)}
\t${c.grey(url)}
`
}

export const describePulls = ([name, pulls]) =>
  `\n${c.bold(name)}: ${pulls.map((pull) => describePull(pull)).join('\n')}\n`
