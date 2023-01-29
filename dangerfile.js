import {message, danger, fail, warn} from "danger"

// Check if some file is added.
const newFiles = danger.git.created_files.join("- ")
message("New Files in this PR: \n - " + newFiles);


// Check if JIRA card number is placed in the title
const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
const isGPV = danger.github.pr.title.includes("[GPV-")

if (!isGPV && !isNoCARD){
  fail(':exclamation: No Jira Card -  We can\'t see the jira card number on your PR title (GPV-####).');
} else if(!isGPV && isNoCARD){
  warn(':exclamation: NO-CARD - this change does not have an associated card, correct?');
}


// Check the number of lines changed.
const WARN_PR_THRESHOLD = 2;
const FAIL_PR_THRESHOLD = 10;

const linesCount = danger.git.linesOfCode("**/*");
const excludeLinesCount = danger.git.linesOfCode("**/*test*");
const totalLinesCount = linesCount - excludeLinesCount;

if (totalLinesCount > WARN_PR_THRESHOLD  &&  totalLinesCount < FAIL_PR_THRESHOLD) {
  warn("Big PR, break down into smaller PRs.");
} else if (totalLinesCount > FAIL_PR_THRESHOLD) {
  fail("Big PR, break down into smaller PRs.");
}

message(`Total the lines changed: ${totalLinesCount}`);
