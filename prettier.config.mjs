/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  $schema: 'https://json.schemastore.org/prettierrc',
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 95,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: 'avoid',
  proseWrap: 'never',
  bracketSameLine: true,
  objectWrap: 'collapse',
};

export default config;
