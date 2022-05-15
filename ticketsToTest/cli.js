import c from 'ansi-colors'
import { formatRelative } from 'date-fns'

export const describe = ({ number, summary, updated, url }) =>
  `${c.whiteBright(number)} ${c.gray(`(${formatRelative(updated, new Date())})`)}\n${summary}\n${c.gray(url)}`
