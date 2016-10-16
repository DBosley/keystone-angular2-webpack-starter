exports.config = {
  baseUrl: 'http://localhost:3000/',
  chromeDriver: './node_modules/chromedriver/lib/chromedriver/chromedriver.exe',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: [
    'src/**/*.e2e-spec.js'
  ],
  exclude: [],

  framework: 'jasmine2',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },
  directConnect: true,

  multiCapabilities: [{
    'browserName': 'chrome',
    'chromeOptions': {
                binary: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
                args: [],
                extensions: [],
            }
  }],

  onPrepare: function () {
    var SpecReporter = require('jasmine-spec-reporter');
    // add jasmine spec reporter
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

    browser.ignoreSynchronization = true;
  },


  /**
   * Angular 2 configuration
   *
   * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
   * `rootEl`
   *
   */
  useAllAngular2AppRoots: true
};
