'use strict';

global.fs = require('fs');
global._ = require('lodash');
global.async = require('async');

/* This is a nasty hack to overwrite globalAuth.json with environment variables
   because atlasboard isn't configurable in any other way */
var globalAuth;
try {
  globalAuth = JSON.parse(process.env.GLOBAL_AUTH || '{}');
  fs.writeFileSync('./globalAuth.json', JSON.stringify(globalAuth));
}
catch(e) {
  globalAuth = {};
  console.log(e);
}

console.log('AAA', globalAuth);

/* This is a nasty hack to hijack into the express middlewares
   because atlasboard doesn't expose express */
if (globalAuth.basic && globalAuth.basic.username && globalAuth.basic.password) {
}

// Start atlasboard server
var atlasboard = require('./node_modules/atlasboard/lib/atlasboard');
atlasboard({ port: process.env.PORT || 5000 }, function (err) {
  fs.unlink('./globalAuth.json');
  if (err) {
    console.log(err);
  }
});
