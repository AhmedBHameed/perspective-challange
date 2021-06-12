module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  overrides: [
    {
      files: '*.handlebars',
      options: {
        singleQuote: false,
      },
    },
  ],
  ...require('gts/.prettierrc.json'),
};
