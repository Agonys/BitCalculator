import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import reactDom from 'eslint-plugin-react-dom';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default tseslint
  .config(
    { ignores: ['dist'] },
    {
      // Base and TypeScript recommended configs
      extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        prettier, // disables formatting rules in favor of Prettier
      ],
      files: ['**/*.{ts,tsx,js,jsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        globals: globals.browser,
      },
      plugins: {
        react: react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        ...react.configs.recommended.rules,
        ...reactDom.configs.recommended.rules,
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'prettier/prettier': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  )
  .concat(eslintPluginPrettier);
