import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/dist/*'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  stylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
  }),
  { rules: {
    '@typescript-eslint/no-unused-vars': 0,
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
  } },
];
