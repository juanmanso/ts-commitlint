import type { UserConfig } from '@commitlint/types';
import { baseRules, branchParserPreset } from './consts';

const config: UserConfig = {
  rules: baseRules,
  parserPreset: branchParserPreset,
};

module.exports = config;
