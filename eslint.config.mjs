import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/dist', '**/node_modules', '**/.env*.local'],
  },
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      'no-console': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
];