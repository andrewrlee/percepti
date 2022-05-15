import fs from "fs";

import listPrs from "./outstandingPrs/index.js";
import listFailingSheduledJobs from "./failingScheduledJobs/index.js";
import listTicketsToTest from "./ticketsToTest/index.js";
import listFailingHealthchecks from "./failingHealthChecks/index.js";
import showDeploymentRadiator from "./deploymentRadiator/index.js";


const config = JSON.parse(fs.readFileSync("./config.json"));

const projects = config.projects;

await listFailingSheduledJobs(config, projects);
await listPrs(config, projects);
await listTicketsToTest(config, projects);
await listFailingHealthchecks(config, projects)
await showDeploymentRadiator(config, projects)