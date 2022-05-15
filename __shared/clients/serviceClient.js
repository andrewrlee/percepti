import { intervalToDuration } from 'date-fns'
import superagent from 'superagent'
import { zipWithPrevious } from '../utils.js'

const get = async (url) =>
  await superagent
    .get(url)
    .set('Accept', 'application/json')
    .then((res) => res.body)

export class ServiceClient {
  #isHealthy = (check) => check.healthy === true || check.status === 'UP'

  #getComponents = (check) => {
    const components = check.checks || check.api || check.components
    return Object.entries(components).map(([name, value]) => {
      const status = value.status || value
      return { name, isHealthy: status === 'OK' || status === 'UP' }
    })
  }

  getHealthCheck = async (url) => {
    const healthCheckUrl = `${url}/health`
    const check = await get(healthCheckUrl)
    return { url: healthCheckUrl, isHealthy: await this.#isHealthy(check), components: await this.#getComponents(check) }
  }

  getHealthChecks = async (projects) => {
    const checks = Object.entries(projects).map(async ([name, { envs: { prod } }]) => [name, await this.getHealthCheck(prod)])

    return Promise.all(checks)
  }

  getVersionInfo = async (urls, path) => {
    const versions = Object.entries(urls).map(async ([name, url]) => {
      const info = await get(`${url}${path}`)
      const versionNumber = info.build.version || info.build.buildNumber
      const [, date, number, gitRef] = versionNumber.match(/^(.*?)\.(.*?)\.(.*)$/)
      return [name, { version: versionNumber, date: Date.parse(date), number: parseInt(number, 10), gitRef }]
    })
    const result = await Promise.all(versions)

    return zipWithPrevious(result).map(([prevEnv, thisEnv]) => {
      if (!prevEnv) return thisEnv
      const [name, thisEnvVersion] = thisEnv
      const [, prevEnvVersion] = prevEnv
      return [name, {
        ...thisEnvVersion,
        buildsSince: prevEnvVersion.number - thisEnvVersion.number,
        daysSince: intervalToDuration({
          start: prevEnvVersion.date,
          end: thisEnvVersion.date
        }).days
      }]
    })
  }

  getVersionInfoForProjects = async (projects) => {
    const checks = Object.entries(projects).map(async ([name, { pathToInfo, envs }]) => [name, await this.getVersionInfo(envs, pathToInfo)])

    return Promise.all(checks)
  }
}
