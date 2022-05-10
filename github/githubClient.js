import superagent from 'superagent'

const apiRoot = 'https://api.github.com'

export class GithubClient {
  constructor({ owner, token }) {
    this.owner = owner
    this.token = token
  }

  get = async (path) =>
    await superagent
      .get(`${apiRoot}${path}`)
      .auth(this.owner, this.token)
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', 'superagent')
      .then((res) => res.body)
  getAbsolute = async (url) =>
    await superagent
      .get(url)
      .auth(this.owner, this.token)
      .set('Accept', 'application/vnd.github.v3+json')
      .set('User-Agent', 'superagent')
      .then((res) => res.body)

  #getStatuses = async (statusUrl) => {
    const statuses = await this.getAbsolute(statusUrl)

    return statuses.reduce((acc, s) => {
      const status = acc[s.context] || []
      acc[s.context] = [
        ...status,
        {
          id: s.id,
          context: s.context,
          created_at: s.created_at,
          state: s.state,
          description: s.description,
        },
      ]
      return acc
    }, {})
  }

  #toPr = async ({
    user,
    html_url: url,
    title,
    created_at: createdAt,
    updated_at: updatedAt,
    statuses_url: statusUrl,
  }) => {
    const statuses = await this.#getStatuses(statusUrl)
    return { title, user: user.login, url, createdAt, updatedAt, statuses }
  }

  getPullRequests = async (repo, owner = this.owner) => {
    const body = await this.get(`/repos/${owner}/${repo}/pulls`)
    const prs = await Promise.all(body.map(this.#toPr))
    return [repo, prs]
  }

  getPullRequestsForProjects = async (projects, slugPrefix) => {
    const pullRequests = await Promise.all(projects.map((p) => this.getPullRequests(p, slugPrefix)))
    const byName = ([name1], [name2]) => name1.localeCompare(name2)
    return pullRequests.filter(([, prs]) => prs.length).sort(byName)
  }
}
