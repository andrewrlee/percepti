# Percepti

A CLI tool to run scripts to help with situational awareness

DONE
* List failing scheduled builds
* List outstanding PRs
* List Jira tickets to test
* List failing health checks
* Show Deployment radiator
* Show where inflight tickets are deployed

TODO
* typescript?
* check everything
* tidy!
* better cli - allow running single projects

???
* Querying app insights?

# To Run

`npm start`

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
    "baseUrl": "https://someorg.atlassian.net",
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


### Known issues

deployment radiator current only compares build numbers where really it should check pipelines?