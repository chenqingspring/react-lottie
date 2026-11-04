// IMPORTANT
// ---------
// This is an auto generated file with React CDK.
// Do not modify this file.
// Use `.scripts/user/pretest.js instead`.

process.env.NODE_ENV = 'development';
require('@babel/register');

// Add jsdom support, which is required for enzyme.
var JSDOM = require('jsdom').JSDOM;

var exposedProperties = ['window', 'navigator', 'document'];

global.document = new JSDOM('', { url: 'http://localhost/' }).window.document;
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// Node >= 21 defines a global `navigator` getter, so it cannot be assigned.
Object.defineProperty(global, 'navigator', {
  value: { userAgent: 'node.js' },
  configurable: true,
  writable: true
});

// React 18's act() checks this flag; enzyme's adapter drives updates through it.
global.IS_REACT_ACT_ENVIRONMENT = true;

var Enzyme = require('enzyme');
var Adapter = require('@cfaester/enzyme-adapter-react-18').default;

Enzyme.configure({ adapter: new Adapter() });

process.on('unhandledRejection', function (error) {
  console.error('Unhandled Promise Rejection:');
  console.error(error && error.stack || error);
});

require('./user/pretest.js');
