module.exports = {
  rules: {
    'header-max-length': [2, 'always', 120],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
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
      ],
    ],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?: \(([\w$.\-*/ ]*)\))?: (.+)$/,
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
  },
};
