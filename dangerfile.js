import {message, danger, fail, warn} from "danger"

// Check if some file is added.
const newFiles = danger.git.created_files.join("- ")
message("New Files in this PR: \n - " + newFiles);


// Check if JIRA card number is placed in the title
const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
const isGPV = danger.github.pr.title.includes("[GPV-")

if (!isGPV && !isNoCARD){
  fail(':x: No Jira Card -  We can\'t see the jira card number on your PR title (GPV-####).');
} else if(!isGPV && isNoCARD){
  warn(':exclamation: NO-CARD - this change does not have an associated card, correct?');
}

// have to add assignee
if (danger.github.pr.assignee === null) {
  fail(':x: Please assign someone to merge this PR, and optionally include people who should review.')
}