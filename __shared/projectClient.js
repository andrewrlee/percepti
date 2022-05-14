import superagent from 'superagent'

const get = async (url) =>
  await superagent
    .get(url)
    .set('Accept', 'application/json')
    .then((res) => res.body)

export class ProjectClient {

  #isHealth = (check) => check.healthy === true || check.status === 'UP'

  #getComponents = (check) => {
    const components = check.checks || check.api || check.components
    return Object.entries(components).map(([name, value]) => {
      const status = value.status || value
      return { name, status: status === 'OK' || status === 'UP' }
    })
  }

  getHealthCheck = async (url) => {
    const healthCheckUrl = `${url}/health`
    const check = await get(healthCheckUrl)
    return { url: healthCheckUrl, status: await this.#isHealth(check), components: await this.#getComponents(check) }
  }

  getHealthChecks = async (projects) => {
    const checks = Object.entries(projects).map(async ([name, { envs: { prod } }]) => [name, await this.getHealthCheck(prod)])

    return Promise.all(checks)
  }
}
