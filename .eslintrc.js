const off   = 0
const warn  = 1
const error = 2

module.exports = {
  'env': {
    'node': true,
  },
  'extends': [
    // 'plugin:@typescript-eslint/recommended',
    // 'google',
    // "oclif",
    "oclif-typescript",
    'plugin:prettier/recommended',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 11,
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    'unicorn/no-abusive-eslint-disable': off,
    'no-template-curly-in-string': off,
    'no-multi-assign': off,
    '@typescript-eslint/no-use-before-define': off,
    '@typescript-eslint/interface-name-prefix': off,
  },
};
