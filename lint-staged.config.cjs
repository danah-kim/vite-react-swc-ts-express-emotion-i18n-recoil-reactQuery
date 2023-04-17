module.exports = {
  '**/*.{js,ts,tsx}': ['eslint --fix', 'prettier --write --ignore-unknown'],
  '**/*.ts?(x)': () => 'pnpm types',
  '*.json': ['prettier --write --ignore-unknown'],
};
