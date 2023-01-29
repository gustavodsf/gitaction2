import {message, danger, fail, warn} from "danger"


const checkReview = () => {
  if (danger.github.pr.reviewers === undefined) {
    fail(':x: Please assign someone to merge this PR.')
  }
}

const addNewFile = () => {
  const newFiles = danger.git.created_files.join("- ")
  message("New Files in this PR: \n - " + newFiles);
}

// Check if JIRA card number is placed in the title
const hasJiraNumberOnTitle = () => {
  const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
  const isGPV = danger.github.pr.title.includes("[GPV-")
  
  if (!isGPV && !isNoCARD){
    fail(':x: No Jira Card -  We can\'t see the jira card number on your PR title (GPV-####).');
  } else if(!isGPV && isNoCARD){
    warn(':exclamation: NO-CARD - this change does not have an associated card, correct?');
  }
  
  // have to add assignee
  if (danger.github.pr.assignee === null) {
    warn(':exclamation: Please assign the PR to someone')
  } 
}

const hasChangedInTheMessage = () => {
  const text = danger.github.pr.body
  const changed = text.split(/\r?\n/).filter(x => x.includes(['- [CHANGED]'])).map(x => x.replaceAll('- [CHANGED]', "").trim());

  if(!changed.includes("")){
    fail("This pull request needs a description.")
  }
}

const checkPRChanges = () => {
  const BIG_PR_THRESHOLD = 10;
  const MEDIUM_PR_THRESHOLD = 20;

  const lineAdded = danger.github.pr.additions;
  const lineRemoved = danger.github.pr.deletions;
  const totalChanges = lineAdded + lineRemoved;

  const method = undefined

  if ( totalChanges  > MEDIUM_PR_THRESHOLD && totalChanges < BIG_PR_THRESHOLD) {
    method = warn;
  } else if (totalChanges > BIG_PR_THRESHOLD) {
    method = fail;
  }

  if (method) {
    method(':exclamation: Big PR (' + totalChanges + ')');
    markdown('> (' + totalChanges + ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.');
  }

}

const checkPkgLockUpdate = () => {
  const packageChanged = danger.git.modified_files.includes('package.json');
  const lockfileChanged = danger.git.modified_files.includes('package-lock.json');
  if (packageChanged && !lockfileChanged) {
      warn(`Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run `npm install`?'</i>`);
  }
}

checkPRChanges();
checkPkgLockUpdate();
checkReview();
addNewFile();
hasJiraNumberOnTitle();
hasChangedInTheMessage();