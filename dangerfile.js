import { danger, fail, warn } from "danger"

if (!danger.github.pr.assignee) {
  fail("This pull request needs an assignee, and optionally include any reviewers.")
}