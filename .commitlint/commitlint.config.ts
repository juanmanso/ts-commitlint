import type { UserConfig } from '@commitlint/types';
import { baseRules, parserPreset } from './consts';

const config: UserConfig = {
  rules: baseRules,
  parserPreset,
};

module.exports = config;
