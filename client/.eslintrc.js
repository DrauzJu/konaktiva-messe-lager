module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-vue'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  ignorePatterns: ['.eslintrc.js', 'dist/**/*'],
  overrides: [{
    files: 'src/**/*.vue',
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }],
};
