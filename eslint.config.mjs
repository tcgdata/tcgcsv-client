// @ts-check

import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, { gitignoreResolution: true }),
  {
    files: ['**/*.{js,ts}'],
    plugins: {
      vitest,
    },
    ignores: ['src/7z/*'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    rules: {
      ...vitest.configs.recommended.rules,

      // Possible Problems
      'array-callback-return': 'error',
      'no-constructor-return': 'error',
      'no-duplicate-imports': 'error',
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'no-use-before-define': 'error',
      'require-atomic-updates': 'error',

      // Vitest
      'vitest/consistent-each-for': ['error', { test: 'each' }],
      'vitest/consistent-test-filename': 'error',
      'vitest/consistent-test-it': ['error', { fn: 'test' }],
      'vitest/consistent-vitest-vi': ['error', { fn: 'vi' }],
      'vitest/hoisted-apis-on-top': 'error',
      'vitest/no-alias-methods': 'error',
      'vitest/no-conditional-tests': 'error',
      'vitest/no-done-callback': 'error',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/no-test-return-statement': 'error',
      'vitest/prefer-equality-matcher': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-spy-on': 'error',
      'vitest/prefer-strict-boolean-matchers': 'error',
      'vitest/prefer-strict-equal': 'error',
      'vitest/prefer-to-contain': 'error',
      'vitest/prefer-vi-mocked': 'error',
      'vitest/require-awaited-expect-poll': 'error',
      'vitest/require-to-throw-message': 'error',
      'vitest/require-top-level-describe': 'error',
    },
  },
]);
