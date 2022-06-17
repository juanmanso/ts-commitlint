# 🛠 Commit debugging tool

To debug the `commitlint` tool, we use [`conventional-commits-parser`](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser)
which takes a commit message string, and outputs the parsed object.

Identical to how `commitlint` works, `conventional-commits-parser` accepts a
configuration file (with the same format as `commitlint`) but instead of returning
an error, the parsed object is returned.

```bash
➜ cat goodCommit.txt
feat(awesome feature): incorporate awesome feature to the repo

This awesome feature required a lot of work from the team and it will launch
the company to the moon. Special thanks to the team: @john, @paul, @george
and @ringo.

BREAKING CHANGE: this feature is so ground breaking, it actually adds breaking changes

Closed #JIRA-1234
```

```bash
➜ yarn commitlint:debug goodCommit.txt | sed -n 4p | jq '.'
{
  "type": "feat",
  "scope": "awesome feature",
  "subject": "incorporate awesome feature to the repo",
  "merge": null,
  "header": "feat(awesome feature): incorporate awesome feature to the repo",
  "body": "This awesome feature required a lot of work from the team and it will launch\nthe company to the moon. Special thanks to the team: @john, @paul, @george\nand @ringo.",
  "footer": "BREAKING CHANGE: this feature is so ground breaking, it actually adds breaking changes\n\nClosed #JIRA-1234",
  "notes": [
    {
      "title": "BREAKING CHANGE",
      "text": "this feature is so ground breaking, it actually adds breaking changes"
    }
  ],
  "references": [
    {
      "action": "Closed",
      "owner": null,
      "repository": null,
      "issue": "JIRA-1234",
      "raw": "#JIRA-1234",
      "prefix": "#"
    }
  ],
  "mentions": [
    "john",
    "paul",
    "george",
    "ringo"
  ],
  "revert": null
}
```
