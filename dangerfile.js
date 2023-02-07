import {message, danger, fail, warn} from "danger"

const regex = new RegExp(/^GPV-\d{3,6}/i);

const addNewFile = () => {
  const newFiles = danger.git.created_files.join("- ")
  message("New Files in this PR: \n - " + newFiles);
}

// Check if JIRA card number is placed in the title
const isJiraNumberOnTitle = () => {
  const isNoCARD = danger.github.pr.title.includes("[NO-CARD]")
 
  const isGPV = regex.test(danger.github.pr.title);
  
  if (!isGPV && !isNoCARD){
    warn(':x: No Jira Card -  We can\'t see the jira card number on your PR title (GPV-####).');
  } else if(!isGPV && isNoCARD){
    warn(':exclamation: NO-CARD - this change does not have an associated card, correct?');
  } 
}

const isPRassignee = () => {
  // have to add assignee
  if (danger.github.pr.assignee === null) {
    warn(':exclamation: Please assign the PR to someone')
  }
}

const existChangedInTheMessage = () => {
  const text = danger.github.pr.body

  const changed = text.split(/\r?\n/).filter(x => x.includes(['- [CHANGED]'])).map(x => x.replaceAll('- [CHANGED]', "").trim());
  if(changed.includes('')){
    fail(":x: inform your [CHANGED] inside the CHANGELOG section.")
  }
}

const checkPRChanges = () => {
  const BIG_PR_THRESHOLD = 1000;
  const MEDIUM_PR_THRESHOLD = 2000;

  const lineAdded = danger.github.pr.additions;
  const lineRemoved = danger.github.pr.deletions;
  const totalChanges = lineAdded + lineRemoved;

  let msg = ''

  if ( totalChanges  > MEDIUM_PR_THRESHOLD && totalChanges < BIG_PR_THRESHOLD) {
    msg = ':exclamation: Big PR (Changes: ' + totalChanges + ')';
  } else if (totalChanges > BIG_PR_THRESHOLD) {
    msg = ':x: Giant PR (Ghanges' + totalChanges + ')';
    markdown('> (' + totalChanges + ') : Pull Request size seems relatively large. If Pull Request contains multiple changes, think in split each into separate PR will helps faster, easier review.');
  }

  warn(msg)

}

const isPkgLockUpdate = () => {
  const packageChanged = danger.git.modified_files.includes('package.json');
  const lockfileChanged = danger.git.modified_files.includes('package-lock.json');
  if (packageChanged && !lockfileChanged) {
      warn("Changes were made to package.json, but not to package-lock.json - <i>'Perhaps you need to run `npm install`?'</i>");
  }
}

const existMoreTests = () => {
  const hasAppChanges = modifiedAppFiles.length > 0;

  const testChanges = modifiedAppFiles.filter(filepath =>
    filepath.includes('test'),
  );
  const hasTestChanges = testChanges.length > 0;

  // Warn if there are library changes, but not tests
  if (hasAppChanges && !hasTestChanges) {
    warn(
      "There are library changes, but not tests. That's OK as long as you're refactoring existing code",
    );
  }
}

const existJiraCardCommitMessage = () => {
  const noJiraCommits = danger.git.commits.filter( commit =>
    !regex.test(commit.message)
  );
  if ( noJiraCommits.length > 0 ) {
    warn( 'Good practice add the jira card you are working on yout commig message' );
    markdown('> Suggestion add at the begining of your commit, the following prefix `[GPV-####]`');
  }
}


isPRassignee();
checkPRChanges();
isPkgLockUpdate();
addNewFile();
isJiraNumberOnTitle();
existChangedInTheMessage();
existMoreTests();
checkTestCreation();
existJiraCardCommitMessage();