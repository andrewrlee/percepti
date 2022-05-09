import superagent from 'superagent'

const apiRoot = 'https://circleci.com/api/v2'

const get = async (path) => await superagent.get(`${apiRoot}${path}`).set('Accept', 'application/json').then(res => res.body)

export class CircleClient {

    constructor({ slugPrefix }) {
        this.slugPrefix = slugPrefix
    }

    getWorkflow = async (id) => await get(`/pipeline/${id}/workflow`)
        .then(body => {
            const { id, name, status, pipeline_number: number, created_at: started, stopped_at: stopped, project_slug: slug } = body.items[0]
            const url = `https://app.circleci.com/pipelines/${slug}/${number}/workflows/${id}`
            return { id, name, status, number, started, stopped, url }
        })

    getJobs = async (id) => await get(`/workflow/${id}/job`)
        .then(body => body.items
            .map(({ id, job_number: number, started_at: started, stopped_at: stopped, name, status }) => ({
                id, name, status, number, started, stopped
            })))

    getScheduledJobs = async (name, previous = 1, slugPrefix = this.slugPrefix) => {
        const { items, next_page_token } = await get(`/project/${slugPrefix}${name}/pipeline`)

        const pipelines = items
            .filter((p) => p.trigger.type === 'schedule')
            .map(({ id, createdAt, number, status }) => ({ id, createdAt, number, status }))
            .slice(0, previous)

        const runs = await Promise.all(
            pipelines.map(async pipeline => {
                const workflow = await this.getWorkflow(pipeline.id)
                const jobs = await this.getJobs(workflow.id)
                return [workflow, jobs]
            }))

        return [name, runs]
    }

    getScheduledJobsForProjects = async (projects, previous = 1, slugPrefix) => {
        const jobs = await Promise.all(projects.map(p => this.getScheduledJobs(p, previous, slugPrefix)))
        const byName = ([name1], [name2]) => name1.localeCompare(name2)
        return jobs.sort(byName)
    }
}