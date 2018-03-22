const path = require('path')

module.exports = function () {
  return {
    files: [
      'src/**/*.js',
      'package.json',
      '!src/**/test.js',
      '!src/**/sandbox_.js'
      ],

    tests: [
      'src/**/test.js',
      'src/**/sandbox_.js'
    ],

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: [
          'JUNCTION_DIRECTORY_TEMPLATE=' + path.join(__dirname, 'src', '{{module}}', 'snapshots'),

          // Forward bash environment variables
          ...Object.keys(process.env).map(key =>
            key+'='+process.env[key]
          )
        ].join(';')
      }
    },

    testFramework: 'jest',

    setup: function (wallaby) {
      const jestConfig = require('./package.json').jest
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig)
    }
  }
}