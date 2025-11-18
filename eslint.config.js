module.exports = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
      }
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_' }]
    },
    ignores: ['dist/', 'coverage/', 'docs/']
  },
  {
    files: ['**/*/*.test.js'],
    plugins: ['jest'],
    rules: {
      'jest/prefer-expect-assertions': 'off',
    },
  },
];