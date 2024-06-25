import afc from '@antfu/eslint-config';
import jest from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';

export default afc({
  /* Files */
  ignores: ['docs/*'],
  gitignore: true,
  /* Languages & Features */
  javascript: true,
  typescript: true,
  jsx: true,
  yaml: true,
  jsonc: true,
  markdown: true,
  /* Frameworks & Libraries */
  react: false,
  test: false,
  stylistic: false
}).then((opts) => [
  ...opts,
  prettier,
  jest.configs['flat/recommended'],
  {
    rules: {
      /* ROOT */
      'prefer-template': 0,
      'no-console': 1,
      'no-warning-comments': [
        1,
        { terms: ['fixme', 'todo', 'refactor', 'xxx'] }
      ],
      /* JSONC */
      'jsonc/sort-keys': 0,
      /* Typescript */
      'ts/no-redeclare': 0,
      'ts/no-namespace': [
        2,
        { allowDeclarations: true, allowDefinitionFiles: true }
      ]
    }
  }
]);
