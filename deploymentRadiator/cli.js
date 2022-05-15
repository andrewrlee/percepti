import c from 'ansi-colors'

const isOutOfDateWarning = (env) => env.buildsSince > 0 || env.daysSince > 0
const isOutOfDateError = (env) => env.daysSince > 5

const statusSquare = (env) => {
  if (isOutOfDateError(env)) {
    return c.bgRedBright(` `)
  }
  if (isOutOfDateWarning(env)) {
    return c.bgYellowBright(` `)
  }
  return c.bgGreenBright(` `)
}

const describeEnv = ([name, env]) => `${c.white(name.padEnd(8))} ${statusSquare(env)} (${env.daysSince || 0} Days, ${env.buildsSince || 0} Builds)`

export const describe = ([name, versionInfo]) => ({
  description: `${c.whiteBright(name)}:\n${versionInfo.map(info => describeEnv(info)).join("\n")}\n`,
  outOfDate: versionInfo.some(([, info]) => isOutOfDateWarning(info))
})
