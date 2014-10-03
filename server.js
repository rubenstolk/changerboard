'use strict';

global.fs = require('fs');
global._ = require('lodash');
global.async = require('async');

/* This is a nasty hack to overwrite globalAuth.json with environment variables
   because atlasboard isn't configurable in any other way */
var globalAuth;
try {
  globalAuth = JSON.stringify(JSON.parse(process.env.GLOBAL_AUTH || '{}'));
  fs.writeFileSync('./globalAuth.json', globalAuth);
}
catch(e) {
  console.log(e);
  globalAuth = {};
}
fs.unlink('./globalAuth.json');

/* This is a nasty hack to hijack into the express middlewares
   because atlasboard doesn't expose express */
if (globalAuth.basic && globalAuth.basic.username && globalAuth.basic.password) {
  var express = require('./node_modules/atlasboard/node_modules/express');
  var methodOverride = express.methodOverride;
  express.__defineGetter__('methodOverride', function () {
    return function (key) {
      return function (req, res, next) {
        return express.basicAuth(globalAuth.basic.username, globalAuth.basic.password)(req, res, function () {
          return methodOverride(key)(req, res, next);
        });
      };
    };
  });
}

// Start atlasboard server
var atlasboard = require('./node_modules/atlasboard/lib/atlasboard');
atlasboard({ port: process.env.PORT || 5000 }, function (err) {
  if (err) {
    console.log(err);
  }
});
