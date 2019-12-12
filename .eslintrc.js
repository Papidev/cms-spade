module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    //'eslint:recommended',
    // "plugin:vue/essential",
    'plugin:vue/recommended',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {}
}
