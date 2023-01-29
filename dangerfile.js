import {message, danger, fail, warn} from "danger"

const newFiles = danger.git.created_files.join("- ")
message("New Files in this PR: \n - " + newFiles);


const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
const isGPV = danger.github.pr.title.includes("[GPV-")

if (!isGPV && !isNoCARD){
  fail(':exclamation: No Jira Card');
  markdown(">  We can't see the jira card number on your PR title **(GPV-####).**");
} else if(!isGPV && isNoCARD){
  warn(':exclamation: NO-CARD');
  markdown("> We inform you that this change does not have an associated card, correct?");
}


const WARN_PR_THRESHOLD = 2;
const FAIL_PR_THRESHOLD = 10;

const linesCount = danger.git.linesOfCode("**/*");
const excludeLinesCount = danger.git.linesOfCode("**/*mock*");
const totalLinesCount = linesCount - excludeLinesCount;

if (totalLinesCount > WARN_PR_THRESHOLD  &&  totalLinesCount < FAIL_PR_THRESHOLD) {
  warn("Big PR, break down into smaller PRs.");
} else if (totalLinesCount > FAIL_PR_THRESHOLD) {
  fail("Big PR, break down into smaller PRs.");
}

