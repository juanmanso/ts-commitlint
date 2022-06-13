import type { UserConfig } from '@commitlint/types';
import { parserPreset, permissiveCommitRules } from './consts';

const config: UserConfig = {
  rules: permissiveCommitRules,
  parserPreset,
};

module.exports = config;
