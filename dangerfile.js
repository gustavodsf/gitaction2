const hasChangelog = danger.git.modified_files.includes("changelog.md");
const isTrivial = (danger.github.pr.body + danger.github.pr.title).includes(
  "#trivial"
);
if (!hasChangelog && !isTrivial) {
  warn("Please add a changelog entry for your changes.");
}