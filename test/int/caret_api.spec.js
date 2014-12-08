module.exports = {
  "step one" : function (browser) {
    browser
      .url("http://localhost:8080/examples/caret_api.html")
      .waitForElementVisible('body', 1000)
      .setValue('#caret_api_testa', 'nightwatch').end();
  }
};
