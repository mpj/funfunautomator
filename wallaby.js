module.exports = function () {

  return {
    files: [
      'src/**/*.js',
      'package.json',
      '!src/**/test.js'
      ],

    tests: [
      'src/**/test.js'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',

    setup: function (wallaby) {
      const jestConfig = require('./package.json').jest
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig)
    }
  };
};