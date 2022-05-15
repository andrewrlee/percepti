import fs from 'fs'
import enquirer from 'enquirer'

import listPrs from './outstandingPrs/index.js'
import listFailingSheduledJobs from './failingScheduledJobs/index.js'
import listTicketsToTest from './ticketsToTest/index.js'
import listFailingHealthchecks from './failingHealthChecks/index.js'
import showDeploymentRadiator from './deploymentRadiator/index.js'

const config = JSON.parse(fs.readFileSync('./config.json'))

const operations = {
  'List failing scheduled builds': () => listFailingSheduledJobs(config),
  'List PRs': () => listPrs(config),
  'List tickets to test': () => listTicketsToTest(config),
  'List failing health checks': () => listFailingHealthchecks(config),
  'Show deployment radiator': () => showDeploymentRadiator(config)
}

const askForOperation = () => new enquirer.AutoComplete({
  name: 'operation',
  message: 'Run:',
  limit: 10,
  initial: 0,
  choices: Object.keys(operations)
})

const askForAgain = () => new enquirer.Confirm({ message: 'Again?', initial: true })

while (true) {
  try {
    const answer = await askForOperation().run()
    await operations[answer]()

    const again = await askForAgain().run()
    if (!again) {
      break
    }
  } catch (error) {
    console.log(error)
    break
  }
}
