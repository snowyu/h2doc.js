module.exports = {
  'env': {
    'node': true,
  },
  'extends': [
    // 'plugin:@typescript-eslint/recommended',
    // 'google',
    "oclif",
    "oclif-typescript",
    // 'plugin:prettier/recommended',
  ],
  // 'parser': '@typescript-eslint/parser',
  // 'parserOptions': {
  //   'ecmaVersion': 11,
  //   'sourceType': 'module',
  // },
  // 'plugins': [
  //   '@typescript-eslint',
  // ],
  'rules': {
    'unicorn/no-abusive-eslint-disable': false,
    'no-template-curly-in-string': false,
    'no-multi-assign': false,
    '@typescript-eslint/no-use-before-define': false,
  },
};
