module.exports = {
  "Open example page" : function (browser) {
    browser.url("http://localhost:8080/examples/tag_editor.example.html")
      .maximizeWindow()
      .waitForElementVisible('body', 1000).click('body');
      
  },
  "Click On Wrapper - focus and select" : function (browser) {
    browser
          // click outside the wrapper
          .click('#link-test')
          // check for the editing class
          .assert.cssClassNotPresent('#tag-editor-box', 'editing')
          // click on the wrapper
          .click('#tag-editor-box') 
          // expect now that the wrapper has the editing class
          .assert.cssClassPresent("#tag-editor-box", "editing") 
          .assert.elementPresent(".selected")
          // TODO: how to check where is the  
  },
  "Tag editor - basic" : function (browser) {
    browser.setValue('input[class="tag-editor-input"]', ['A1', ','])
          // check the tag
          .getText("div.tag-item-wrapper:nth-child(1) span.tag-label", function(result) {
            this.assert.equal(typeof result, "object");
            this.assert.equal(result.status, 0);
            this.assert.equal(result.value, "A1");
          })
  },
  "Close example page" : function (browser) {
    browser.end();
  }
};
