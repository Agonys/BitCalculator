import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint
  .config(
    { ignores: ['dist'] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
        'prettier/prettier': 'off',
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
            disallowTypeAnnotations: false,
          },
        ],
        'prettier/prettier': ['error', {}, { usePrettierrc: true }],
        'object-curly-newline': [
          'error',
          {
            ObjectExpression: {
              multiline: true,
              minProperties: 2,
            },
            ObjectPattern: {
              multiline: true,
              minProperties: 2,
            },
            ImportDeclaration: {
              multiline: true,
              minProperties: 2,
            },
            ExportDeclaration: {
              multiline: true,
              minProperties: 2,
            },
          },
        ],
        'comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
          },
        ],
      },
    },
  )
  .concat(eslintPluginPrettier);
