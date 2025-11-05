import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}'],
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off'
    },
    settings: { react: { version: 'detect' } }
  }
]