import c from 'ansi-colors'

export const describeChecks = ({ showFailingOnly = false }) => ([name, checks]) => {
  if (showFailingOnly && checks.status) {
    return ""
  }
  const components = checks.components.filter(check => !showFailingOnly || !check.status)
  const status = (status) => (!status ? c.bgRedBright(` `) : c.bgGreen(` `))
  
  const headline = `\n${c.bold(name)} ${components.map((check) => `${status(check.status)}`).join('')}`
  
  const failingChecks = components.map((check) => `\t${status(check.status)} ${check.name}`).join('\n')
  
  const url = c.gray(checks.url)
  
  return `${headline}\n${failingChecks}\n${url}`
}