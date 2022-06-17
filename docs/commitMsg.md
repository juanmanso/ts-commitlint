# 📨 CommitMsg

## Overview

The main functionality of `commitlint` is to directly lint commit messages. The
very first instance of the commit is on the creation of the commit.

There are four git hooks that are triggered on commit: `pre-commit`,
`prepare-commit-msg`, `commitMsg` and `post-commit`. More info can be found
([here](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)).
The `commitMsg` hook is the one we care about because it is triggered last
in the commit process.

Thus, first off, we setup the script to run on the `commitMsg` hook. The script
is called `commitlint:commitMsg`.

> *The approach we are taking for this hook is to have a permissive linting rule
> so that developers can do intermediate commits that would be fixed prior to
> the push. We still need linting to avoid making the fixing of those commits
> a pain for the developers.*

The script is mainly a call to `commitlint` with a specific configuration:

```js
{
  ...,
  "scripts": {
    ...,
    "commitlint:commitMsg": "commitlint -g .commitlint/commitMsg.config.ts"
  },
  ...,
}
```

Then, after having the script setup (configuration walk-through can be found
on [the next section](#configuration)) we need to configure the git hook with
husky.

Since, at the time of the writing we use Husky's 4th version, the configuration
of Husky is made on the `package.json`. For simplicity, we choose to keep it
with the 4th version but the last version is the 8th.

The setup is the following:
```js
{
  ...,
  "husky": {
    "hooks": {
      ...,
      "commitMsg": "yarn commitlint:commitMsg -E HUSKY_GIT_PARAMS"
    }
  },
}
```

where the `-E HUSKY_GIT_PARAMS` is there to pass the commit message to the hook.


## Configuration

As we explained in [the document on commitlint](./commitlint.md), the two main
components of the configuration are: rules and parserPreset. For these we choose:
- `permissiveCommitRules` as script's rules
- Our own's default `parserPreset` as parserPreset

From these configurations, there are a few important ones.

### Permissive Commit Type String Array

This array extends the array that is the base of our convention and adds the
following three types:
- fixup
- stash
- wip

These types are typical while working on a feature before submitting the changes
for review.

### Header Pattern

```js
const commitHeaderPattern = /^(\w*)(?: \(([\w$.\-*/ ]*)\))?: (.+)$/;
```

The regex is designed to get these three groups:
- type
- scope
- subject

The structure that they follow is: `<type>(<scope>): <subject>`
