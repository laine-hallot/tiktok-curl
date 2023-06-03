module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        allowSeparatedGroups: true,
      },
    ],

    '@typescript-eslint/consistent-type-imports': 'warn',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
};
