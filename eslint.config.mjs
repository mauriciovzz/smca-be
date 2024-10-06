import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.config({
    extends: 'airbnb-base',
    env: {
      es2020: true,
      node: true,
    },
    rules: {
      curly: 'off',
      'nonblock-statement-body-position': 'off',
      'no-param-reassign': 'off',
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-underscore-dangle': 'off',
    },
  }),
];
