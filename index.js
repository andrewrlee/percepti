import fs from "fs";

import listPrs from "./outstandingPrs/index.js";
import listSheduledJobs from "./failingScheduledJobs/index.js";
import listTicketsToTest from "./ticketsToTest/index.js";

const config = JSON.parse(fs.readFileSync("./config.json"));

const projects = config.projects;

// await listSheduledJobs(config, projects);
// await listPrs(config, projects);
// await listTicketsToTest(config, projects);
