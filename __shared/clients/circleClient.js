import { parseISO } from 'date-fns'
import superagent from 'superagent'

const apiRoot = 'https://circleci.com/api/v2'

const get = async (path) =>
  await superagent
    .get(`${apiRoot}${path}`)
    .set('Accept', 'application/json')
    .then((res) => res.body)

export class CircleClient {
  constructor({ slugPrefix }) {
    this.slugPrefix = slugPrefix
  }

  getWorkflow = async (id) =>
    await get(`/pipeline/${id}/workflow`).then((body) => {
      if (!body.items.length) return null
      const {
        id,
        name,
        status,
        pipeline_number: number,
        created_at: started,
        stopped_at: stopped,
        project_slug: slug
      } = body.items[0]
      const url = `https://app.circleci.com/pipelines/${slug}/${number}/workflows/${id}`
      return { id, name, status, number, started: parseISO(started), stopped, url }
    })

  getJobs = async (id) =>
    await get(`/workflow/${id}/job`).then((body) =>
      body.items.map(({ id, job_number: number, started_at: started, stopped_at: stopped, name, status }) => ({
        id,
        name,
        status,
        number,
        started,
        stopped
      }))
    )

  getScheduledJobs = async (name, slugPrefix = this.slugPrefix) => {
    const { items, next_page_token } = await get(`/project/${slugPrefix}/${name}/pipeline`)

    const pipeline = (items || [])
      .filter((p) => p.trigger.type === 'schedule')
      .map(({ id }) => ({ id }))[0]

    const workflow = await this.getWorkflow(pipeline.id)
    const jobs = await this.getJobs(workflow.id)
    return [name, [workflow, jobs]]
  }

  getScheduledJobsForProjects = async (projects, slugPrefix) => {
    const jobs = await Promise.all(projects.map((p) => this.getScheduledJobs(p, slugPrefix)))
    const byName = ([name1], [name2]) => name1.localeCompare(name2)
    return jobs.sort(byName)
  }

  async * getDeployableBuilds(name, slugPrefix = this.slugPrefix) {
    const baseUrl = `/project/${slugPrefix}/${name}/pipeline`
    let url = baseUrl

    while (url) {
      const { items, next_page_token } = await get(url)
      url = `${baseUrl}?page-token=${next_page_token}`
      const pipeline = (items || [])
        .filter((p) => p.trigger.type !== 'schedule')
        .filter((p) => p.vcs.branch === 'main')

      const pipelines = pipeline.flatMap(async pipeline => {
        const workflow = await this.getWorkflow(pipeline.id)
        if (!workflow) return []
        const jobs = await this.getJobs(workflow.id)
        const docker = jobs.find(j => j.name === 'build_docker')

        var ticket = /([A-Z]+)-(\d+)/g
          .exec(pipeline.vcs.commit.subject + pipeline.vcs.commit.body)
          ?.[0]
          ?.toUpperCase()

        return [{
          ticket,
          tag: `${docker.started.substring(0, 10)}.${docker.number}.${pipeline.vcs.revision.substring(0, 7)}`,
          subject: pipeline.vcs.commit.subject,
          body: pipeline.vcs.commit.body.replace(/(\r\n|\n|\r)/gm, " "),
        }]
      })
      yield await Promise.all(pipelines)
    }
  }
}
