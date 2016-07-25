var Jasmine = require('jasmine');
var jasmine = new Jasmine();

//jasmine.loadConfigFile( 'jasmine.json' );

// Mock browser
/*
var MockBrowser = require('mock-browser').mocks.MockBrowser;
var mock = new MockBrowser();
global.document = mock.getDocument();
*/

var jsdom = require( 'jsdom' ).jsdom;
global.document = jsdom( '<html><body></body></html>' );

jasmine.loadConfig({
  "spec_dir": "./src",
  "spec_files": [ "**/*.spec.ts" ],
  "stopSpecOnExpectationFailure": true,
  "random": false
});
jasmine.configureDefaultReporter({});

jasmine.onComplete(function(passed) {
    if(passed) {
        console.log( 'Ola Kala' );
    }
    else {
    }
});

jasmine.execute();