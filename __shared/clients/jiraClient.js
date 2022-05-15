import superagent from 'superagent'

export class JiraClient {
  constructor ({ username, token, baseUrl, project }) {
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
    updated,
    summary
  })

  getTicketsToTest = async () => {
    const body = await this.post('/2/search', {
      jql: `project = ${this.project} AND status = "Ready for Test" order by updatedDate ASC`,
      maxResults: 3
    })

    return body.issues.map(this.transformIssue)
  }
}
