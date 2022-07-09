import { parseISO } from 'date-fns'
import superagent from 'superagent'

export class JiraClient {
  constructor({ username, token, baseUrl, project }) {
    this.username = username
    this.token = token
    this.baseUrl = baseUrl
    this.project = project
  }

  post = async (path, data) =>
    await superagent
      .post(`${this.baseUrl}${path}`)
      .send(data)
      .auth(this.username, this.token)
      .set('Accept', 'application/json')
      .set('User-Agent', 'superagent')
      .then((res) => res.body)

  transformIssue = ({ key: number, fields: { updated, summary } }) => ({
    number,
    updated: parseISO(updated),
    summary,
    url: `${this.baseUrl}/browse/${number}`
  })

  getTicketsToTest = async () => {
    const body = await this.post('/rest/api/2/search', {
      jql: `project = ${this.project} AND status = "Ready for Test" order by updatedDate ASC`,
      maxResults: 3
    })

    return body.issues.map(this.transformIssue)
  }


  getTicketInfo = async (tickets) => {
    if (!tickets.length) return {}
    const body = await this.post('/rest/api/2/search', {
      fields: ["status", "summary"],
      jql: `project = ${this.project} AND issue in (${tickets.join(",")}) order by updatedDate ASC`,
      validateQuery: "warn"
    })

    const issues = body.issues.map(({ key, fields }) => ([key, { summary: fields?.summary, status: fields?.status?.name }]))
    const issueLookup = Object.fromEntries(issues)

    return issueLookup
  }
}
