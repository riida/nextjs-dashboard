const styleguide = require('@vercel/style-guide/prettier')

module.exports = {
  ...styleguide,
  plugins: [
    ...styleguide.plugins,
    'prettier-plugin-tailwindcss',
    'prettier-plugin-organize-imports',
  ],
  trailingComma: 'all',
  semi: false,
  jsxSingleQuote: false,
  arrowParens: 'always',
  overrides: [
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
