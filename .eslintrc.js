/* eslint sort-keys: "error" */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['prettier', '@typescript-eslint', 'react'],
  root: true,
  rules: {
    /**
     * Eslint config
     */

    'camelcase': 'warn',
    'consistent-this': 'warn',
    'line-comment-position': 'warn',
    'no-inline-comments': 'warn',
    'no-useless-constructor': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-spread': 'warn',

    /* Automatically fixable */
    // eslint-disable-next-line sort-keys
    'arrow-body-style': 'warn',
    'eqeqeq': 'warn',
    'lines-between-class-members': 'warn',
    'no-lonely-if': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-rename': 'warn',
    'no-var': 'warn',
    'object-shorthand': 'warn',
    'operator-assignment': 'warn',
    'padding-line-between-statements': ['warn'],
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'prefer-numeric-literals': 'warn',
    'prefer-object-spread': 'warn',
    'prefer-template': 'warn',
    'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    'spaced-comment': 'warn',

    /**
     * Typescript-eslint config
     */

    /* Automatically fixable */
    // eslint-disable-next-line sort-keys
    '@typescript-eslint/array-type': ['warn'],
    '@typescript-eslint/padding-line-between-statements': ['warn'],

    /**
     * React config
     */

    /* Automatically fixable */
    // eslint-disable-next-line sort-keys
    'react/jsx-boolean-value': 'warn',
    'react/jsx-curly-brace-presence': ['warn', { propElementValues: 'always' }],
    'react/jsx-no-useless-fragment': 'warn',
    'react/jsx-sort-props': 'warn',
    'react/jsx-space-before-closing': 'warn',

    /**
     * Prettier config
     */

    // eslint-disable-next-line sort-keys
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'avoid',
        jsxBracketSameLine: false,
        printWidth: 100,
        quoteProps: 'consistent',
        semi: false,
        singleQuote: true,
        trailingComma: 'none',
        useTabs: false
      }
    ]
  }
}
