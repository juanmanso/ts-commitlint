# 📐 Commitlint

| <img src='https://commitlint.js.org/assets/commitlint.svg'> |
| :--: |
| _Raw dependency demo_ |

As described on [their documentation](https://commitlint.js.org/#/?id=commitlint-nbsp-):

> _`commitlint` helps your team adhering to a commit convention. By supporting
> npm-installed configurations it makes sharing of commit conventions easy._

Version control is the first step of the documentation process of a developer.
Reviewers will be looking into the changes made and commits are the cornerstone
in communicating the thinking process of those changes.

To ensure that the convention is being followed (convention set to ease and
standardize the process), commitlint is an excellent tool to do so.

## 🔑 Key elements to control the tool

The commitlint tool can be configured by a config file and using the `-g` flag.
The configuration can be broken down into [rules](#⚖️-rules) and [parser presets](#🎛-parser-presets)

### ⚖️  Rules

There are [several rules available](https://commitlint.js.org/#/reference-rules?id=available-rules)
to be set. They have two main configurations:

- Severity level of the error (error, warning, nothing/disabled)
- Applicable: either `always` or `never` (the latter inverts the rule)

Then, some rules have a third argument which corresponds to the value of the
specific rule. On this repository, we will only use and focus on 4 main rules:

1. `header-max-length`
2. `subject-empty`
3. `type-empty`
4. `type-enum`

As a general rule, we will have the header amount max to 72 since that's GitHub's
max length. If the header is larger, GitHub breaks the header and adds the remains
to the body of the commit message.

Lastly, for `type-enum` we pass an array of strings with valid types to be
accepted when parsing the header.

### 🎛 Parser presets

The parser preset used to parse commit messages can be configured. The options
to be set are the following:

1. `headerPattern`
  - Regex expression used to parse the header
2. `headerCorrespondence`
  - Array of strings naming the groups captured by the Regex
    - This is then required to apply the rules, mainly on subject and type,
      determined by it.
3. `referenceActions`
  - When these keywords appear on the commit message (header, body, footer, etc.)
    they are parsed separately as specific actions.
4. `noteKeywords`
  - Specific set of keywords that are considered notes
5. `commentChar`
  - Char used to comment on commit messages.
