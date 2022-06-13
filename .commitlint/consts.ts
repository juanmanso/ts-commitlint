import type { ParserPreset, RulesConfig } from '@commitlint/types';

// This value is set to 72 due to GitHub's limit of 72 characters for the commit message.
const MAX_AMOUNT_CHARS_ON_COMMIT_HEADER = 72;

const baseTypeStringArray = [
  'build',
  'chore',
  'devops',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'spike',
  'test',
];

const wipAllowedCommitTypeStringArray = ['fixup', 'stash', 'wip'];

const permissiveCommitTypeStringArray = [
  ...baseTypeStringArray,
  ...wipAllowedCommitTypeStringArray,
];

export const baseRules: Partial<RulesConfig> = {
  'header-max-length': [2, 'always', MAX_AMOUNT_CHARS_ON_COMMIT_HEADER],
  'subject-empty': [2, 'never'],
  'type-empty': [2, 'never'],
  'type-enum': [2, 'always', baseTypeStringArray],
};

export const permissiveCommitRules: Partial<RulesConfig> = {
  'header-max-length': [2, 'always', MAX_AMOUNT_CHARS_ON_COMMIT_HEADER],
  'type-empty': [2, 'never'],
  'type-enum': [2, 'always', permissiveCommitTypeStringArray],
};

const commitHeaderPattern = /^(\w*)(?: \(([\w$.\-*/ ]*)\))?: (.+)$/;
const branchHeaderPattern = /^(\w*)(?: \/([\w$.\-*/ ]*))?$/;

export const parserPreset: ParserPreset = {
  parserOpts: {
    headerPattern: commitHeaderPattern,
    headerCorrespondence: ['type', 'scope', 'subject'],
    referenceActions: [
      'close',
      'closes',
      'closed',
      'fix',
      'fixes',
      'fixed',
      'resolve',
      'resolves',
      'resolved',
    ], // Default value
    noteKeywords: ['BREAKING CHANGE'], // Default value
    commentChar: '#',
  },
};

export const branchParserPreset: ParserPreset = {
  parserOpts: {
    headerPattern: branchHeaderPattern,
    headerCorrespondence: ['type', 'subject'],
    referenceActions: [
      'close',
      'closes',
      'closed',
      'fix',
      'fixes',
      'fixed',
      'resolve',
      'resolves',
      'resolved',
    ], // Default value
    noteKeywords: ['BREAKING CHANGE'], // Default value
    commentChar: '#',
  },
};
