import c from 'ansi-colors'
import Table from 'cli-table3'

export const describe = (project, builds) => {
  var table = new Table({
    head: ['Env', 'Build', 'Status', 'Subject']
    , colWidths: [15, 25, 15, 55]
  });

  const env = (isInDev, isInPreprod, isInLive) => [isInDev ? 'DEV' : '', isInPreprod ? 'PREPROD' : '', isInLive ? 'PROD' : ''].filter(e => e).join(" ")

  builds.forEach(({ tag, status, subject, isInDev, isInPreprod, isInLive }) => {
    table.push([env(isInDev, isInPreprod, isInLive), tag || '', status || '', subject || ''])
  });
  return `${c.whiteBright(project)}\n${table.toString()}`

}