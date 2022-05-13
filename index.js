import fs from "fs";

import listSheduledJobs from "./github/index.js";
import listPrs from "./circle/index.js";
import listTicketsToTest from "./jira/index.js";

const config = JSON.parse(fs.readFileSync("./config.json"));

const projects = config.projects;

await listSheduledJobs(config, projects);
await listPrs(config, projects);
await listTicketsToTest(config, projects);
