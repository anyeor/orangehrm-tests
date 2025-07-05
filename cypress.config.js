const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    specPattern: 'cypress/integration/*.js',
    retries: {
      runMode: 3,
      openMode: 3,
      },
  },
  env: {
    url: "https://opensource-demo.orangehrmlive.com/"
  }
});
