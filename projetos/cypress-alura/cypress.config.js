const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://alura-fotos.herokuapp.com'
  },
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/report',
    embeddedScreenshots: true,
    json: false
  }
});
