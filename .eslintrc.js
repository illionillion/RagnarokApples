module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  // extends: 'standard',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
    }
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    // no-mixed-spaces-and-tabsルールをoffに設定する
    'no-mixed-spaces-and-tabs': 'off',
    // // インデントはスペースで統一
    indent: ['error', 2, { SwitchCase: 1 }]
  }
};
