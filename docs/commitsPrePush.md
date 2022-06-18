# 👊 Commits pre push

## Overview

Following up on the [commitMsg](./commitMsg.md) tool, we now require a more
restrictive tool to be used on pre-push. This means that developers can do their
intermediate commits but then need to amend them in order to push them to the
repository.

With this, we ensure that the repository stays clean and compliant with the
guidelines. Additionally, this tool can be used as a CI check, so that devs
that use the `--no-verify` flag to skip git hooks are blocked on their PRs and
cannot merge their changes.

## How it works

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*" \
  | grep -v "$(git rev-parse --abbrev-ref HEAD)" \
  | head -n1 \
  | sed "s/^.*\[//" \
  | xargs -n 1 yarn commitlint --from
```

The command has several pipes and calls to other commands, but in reality is
pretty simple:

1. `git show-branch` returns the commit's ancestry graph. First it breaks down
   into branches and then the proper commit tree.
2. The `sed` command searches everything after the `]` and deletes it
3. Then we search for the results starting with `*`
4. From those results, we search for the lines that do not match (hence the `-v`)
   with the name of the current branch (got by `git rev-parse`)
5. We take the first result using `head -n1` which is the first ancestor (and is
   the parent or target branch).
6. We use `sed` again to clean-up the string and just leave everything after `[`
   (name of the branch)
7. This command is just the `yarn commitlint` command using the `--from` flag to
   looking into the commits from the given argument until `HEAD`. To pass the
   parent branch to the command, we use `xargs -n 1` that takes the argument from
   `stdin` and injects it at the end of the command (resulting in `--from <parent-branch>`)


### Example

```bash
➜ git log --oneline

* 65e436d (HEAD -> test/second-branch) test: this should pass
* 6066ec8 (test/first-branch) wip: this should not pass pre-push
* 14b2226 test: this one passes
* 096c54c (origin/main, origin/HEAD, main) feat: create pre push commit checker script
* b802f56 fix: add specific rules for branch naming linting
```

```bash
➜ git show-branch
! [chore/add-documentation] fixup: branch name
 ! [main] feat: create pre push commit checker script
  ! [test/first-branch] wip: this should not pass pre-push
   * [test/second-branch] test: this should pass
----
+    [chore/add-documentation] fixup: branch name
+    [chore/add-documentation^] chore: add commitsPrePush script documentation
+    [chore/add-documentation~2] chore: add branchName script documentation
+    [chore/add-documentation~3] chore: add commitMsg script documentation
+    [chore/add-documentation~4] chore: add debugging script documentation
+    [chore/add-documentation~5] chore: add husky documentation
+    [chore/add-documentation~6] chore: add commitlint documentation
   * [test/second-branch] test: this should pass
  +* [test/first-branch] wip: this should not pass pre-push
  +* [test/first-branch^] test: this one passes
+++* [main] feat: create pre push commit checker script
```

See how working on a separated branch to add the documentation, `git show-branch`
shows everything linked to `main` (see the `+` signs that link branches).

```bash
➜ git show-branch \
  | sed "s/].*//"

! [chore/add-documentation
 ! [main
  ! [test/first-branch
   * [test/second-branch
----
+    [chore/add-documentation
+    [chore/add-documentation^
+    [chore/add-documentation~2
+    [chore/add-documentation~3
+    [chore/add-documentation~4
+    [chore/add-documentation~5
+    [chore/add-documentation~6
   * [test/second-branch
  +* [test/first-branch
  +* [test/first-branch^
+++* [main
```

As explained, the first `sed` command cleans up everything after the `]` char
(included).

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*"

   * [test/second-branch
   * [test/second-branch
  +* [test/first-branch
  +* [test/first-branch^
+++* [main
```

With grep, we put keep just the branches that relate with `HEAD`.

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*" \
  | grep -v "$(git rev-parse --abbrev-ref HEAD)"

  +* [test/first-branch
  +* [test/first-branch^
+++* [main
```

Grep again to remove every mention of the base branch.

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*" \
  | grep -v "$(git rev-parse --abbrev-ref HEAD)" \
  | head -n1

  +* [test/first-branch
```

At this point, picking up the first non-base branch, we have our parent branch
fetched! Now just a bit more work and we are almost done.

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*" \
  | grep -v "$(git rev-parse --abbrev-ref HEAD)" \
  | head -n1 \
  | sed "s/^.*\[//"

test/first-branch
```

`sed` for a head cut and having the branch name clean.

```bash
➜ git show-branch \
  | sed "s/].*//" \
  | grep "\*" \
  | grep -v "$(git rev-parse --abbrev-ref HEAD)" \
  | head -n1 \
  | sed "s/^.*\[//" \
  | xargs -n 1 yarn commitlint --from

$ commitlint -g .commitlint/commitlint.config.ts --from test/first-branch
✨  Done in 1.25s.
```

Everything worked! See how the linter went okay for `test/second-branch` since
its commits were okay. However, let's try the same but placing ourselves on
`test/first-branch`:

```bash
➜ yarn commitlint:commitsPrePush

$ commitlint -g .commitlint/commitlint.config.ts --from main
⧗   input: wip: this should not pass pre-push
✖   type must be one of [build, chore, devops, docs, feat, fix, perf, refactor, style, spike, test] [type-enum]

✖   found 1 problems, 0 warnings
ⓘ   Get help: https://github.com/conventional-changelog/commitlint/#what-is-commitlint

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

As you can see, the commitsPrePush broke for `test/first-branch` because it had
a permissive but not fully compliant commit.

## Configuration

The configuration of this tool is pretty simple, the complexity lies in the
command itself. For the `commitlint` config we used:
- `baseRules` as script's rules
- Our own's default `parserPreset` as parserPreset

Won't be going through these configurations, since they are the base of the other
ones. But in short, this is the most restrictive commitlint configuration, since
it's tightly coupled with the contributing guidelines.
