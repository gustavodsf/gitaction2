import {message, danger, warn} from "danger"
import * as spellcheck from 'danger-plugin-spellcheck'

spellcheck()

const newFiles = danger.git.created_files.join("- ")
message("New Files in this PR: \n - " + newFiles);


const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
const isGPV = danger.github.pr.title.includes("[GPV-")

if (!isGPV && !isNoCARD){
  danger(':exclamation: No Jira Card');
  markdown(">  We can't see the jira card number on your PR title **(GPV-####).**");
} else if(!isGPV && isNoCARD){
  warn(':exclamation: NO-CARD');
  markdown("> We inform you that this change does not have an associated card, correct?");
}


var bigPRThreshold = 2;
const linesCount = await danger.git.linesOfCode("**/*");
const excludeLinesCount = await danger.git.linesOfCode("**/*mock*");
const totalLinesCount = linesCount - excludeLinesCount;
if (totalLinesCount > bigPRThreshold) {
  warn("Big PR, break down into smaller PRs.");
}

