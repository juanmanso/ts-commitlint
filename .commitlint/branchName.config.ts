import type { UserConfig } from '@commitlint/types';
import { branchNameRules, branchParserPreset } from './consts';

const config: UserConfig = {
  rules: branchNameRules,
  parserPreset: branchParserPreset,
};

module.exports = config;
