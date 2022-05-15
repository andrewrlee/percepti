import c from 'ansi-colors'

export const describe = ({ number, summary, updated }) =>
  `${c.whiteBright(number)} ${c.gray(`(${updated})`)}\n${summary}`
