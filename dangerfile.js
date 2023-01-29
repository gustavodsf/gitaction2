import {message, danger} from "danger"

const newFiles = danger.git.created_files.join("- ")
message("New Files in this PR: \n - " + newFiles);

var bigPRThreshold = 2;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR (' + ++errorCount + ')');
  markdown('> (' + errorCount + ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.');
}


const isGPV = danger.github.pr.title.includes("[GPV-")
if (!isGPV){
  warn(':exclamation: No Jira Card (' + ++errorCount + ')');
  markdown(">  We can't see the jira card number on your PR title.");
}



