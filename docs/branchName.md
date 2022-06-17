# 🌳 Branch Name

## Overview

Branch naming is generally also a part of the contributing guidelines. Since
they follow similar rules as a commit header, we use `commitlint` to lint branch
names.

As we developed this tool, we did so considering two important use cases:

1. By name of branches, we can link PRs with their JIRA tickets (if properly setup).
2. If we follow the guideline, we could automate parts of the PR creation that
   could rely on that information.
3. Help enforcing the guideline so we can have a more consistent DX.

For the point 2. an example would be to add a link to the JIRA ticket inside PR's
description. It's a silly step, but it would take off the burden of getting the
ticket's link or the root url and changing the ticket it links to.

## How it works

```bash
➜ git rev-parse --abbrev-ref HEAD | commitlint -g .commitlint/branchName.config.ts
```

The script share above is the one that should be ran after a checkout (via Huksy).
It consists of two commands:

1. Getting the branch name
2. Linting it with `commitlint`

We have already talked a lot about `commitlint` and also the configuration for
this tool can be found [below](#configuration).

However, a new command comes into the game now which is `git rev-parse`. This
command is used to "pick out and transform parameters" (documentation says
"massage" but that is not very explanatory 😂). You could get commit's SHA1
hash of a commit, or the latest commit on a branch or (our current use case) to
output current's branch name.

We use `git rev-parse --abbrev-ref HEAD` to get current's branch name. Instead
of using `git branch` for that we use `git rev-parse` because it's a plumbing
command (pipe-friendly) whereas `git branch` is not as stable (often times called
porcelain commands). There are some other porcelain commands in git which have
a specific flag to make them more stable, but we chose to go with the plumbing
ones for reliability.

## Configuration

As we explained in [the document on commitlint](./commitlint.md), the two main
components of the configuration are: rules and parserPreset. For these we choose:
- `branchNameRules` as script's rules
- `branchParserPreset` as parserPreset

From these configurations, there are a few important ones.

### Branch Name Type String Array

This array extends the array that is the base of our convention and adds the
following two types:
- main
- staging

These types (that we call `branchReservedNames`) are core branches of the project
that are not meant to be worked on directly, but through PRs and CI/CD pipelines
(following the Git Flow workflow).

Thus, these branch names are exceptions to the general contributing rule.

### Subject empty

To achieve the exception rules for `main` and `staging`, we need to allow the
subject to be empty. This rule is a clear breach on the contributing guidelines
but we are good with the exception because we contemplated the following:

1. Users might never have a branch be named `feat` or `fix` because they won't
   differentiate those changes with the ones of a fellow teammate. In general,
   people tend to add a subject, regardless if it's following the strict
   convention or not.
2. The rule is set to *warning* so that if anyone creates a branch without
   subject, they will be warned. Additionally, it will happen the same if anyone
   commits directly to those reserved branches and it should be enough warning
   to make them understand that it's a protected branch and they should be
   careful with it.

### Header Pattern and correspondence

```js
const branchHeaderPattern = /^(\w*)(\/([\w$.\-* ]*))?$/;
```

The regex is simpler and designed to get these two groups:
- type
- subject

The structure that they follow is: `<type>/<subject1>/<subject2>`

