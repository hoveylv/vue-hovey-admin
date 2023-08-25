module.exports = {
  root: true,
  extends: ['@hovey/eslint-config-vue', './.eslintrc-auto-import.json'],
  rules: {
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/ban-types': 'off',
    'operator-linebreak': 'off',
  },
}
