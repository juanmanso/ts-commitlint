# 🐶 Husky

[Husky](https://typicode.github.io/husky/#/) is an enabler for git hooks on our
npm projects.
This npm package helps us manage git hooks by configuring them on a separate
file to be tracked by Git or even configured inside the `package.json` file!

The most common usage of Husky is alongside packages such as `lint-staged` or
`commitlint`, that help run tasks after certain git commands.
The tool is super powerful, because it gives the developer the control over the
git flow and to share it easily across the team.

In our case, we are using Husky alongside `commitlint` to lint version control
usage. Please head to the main [README.md](../README.md) document to access the
documentation of the toolset built on this repository.
