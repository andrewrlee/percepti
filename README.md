# Percepti

A few different tools to help with situational awareness

DONE
* List failing scheduled builds
* List outstanding PRs
* List Jira tickets to test
* List failing health checks
* Show Deployment radiator

TODO
* Deployment tools

???
* Querying app insights?


## Config

To run, a `config.json` file needs to be present in project root, with the following format:

```json
{
  "circleCi": {
    "slugPrefix": "gh/some-org"
  },
  "github": {
    "owner": "some org",
    "username": "some username",
    "token": "some token"
  },
  "jira": {
    "username": "some jira email address",
    "token": "some token",
    "baseUrl": "https://someorg.atlassian.net/rest/api",
    "project": "ABC"
  },
  "projects": {
    "some-github-repo-name": {
      "pathToInfo": "/some-path-relative-to-env-url-to-extract-version-info-from",
      "envs": {
        "dev": "https://dev.service.example.com",
        "preprod": "https://preprod.service.example.com",
        "prod": "https://service.example.com"
      }
    },
    ...
  }
}
```