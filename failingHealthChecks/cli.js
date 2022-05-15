import c from 'ansi-colors'

export const describe = ([name, checks]) => {
  const components = checks.components
  const status = (isHealthy) => (!isHealthy ? c.bgRedBright(' ') : c.bgGreen(' '))

  const headline = `${c.bold(name)} ${components.map((check) => `${status(check.isHealthy)}`).join('')}`

  const failingChecks = components.map((check) => `\t${status(check.isHealthy)} ${check.name}`).join('\n')

  const url = c.gray(checks.url)

  return {
    description: `${headline}\n${failingChecks}\n${url}`,
    isHealthy: checks.isHealthy
  }
}
