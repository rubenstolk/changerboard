'use strict';

global.fs = require('fs');
global._ = require('lodash');
global.async = require('async');

/* This is a nasty hack to overwrite globalAuth.json with environment variables
   because atlasboard isn't configurable in any other way */
var globalAuth = {};
try {
  globalAuth = JSON.parse(process.env.GLOBAL_AUTH || '{}');
  fs.writeFileSync('./globalAuth.json', JSON.stringify(globalAuth));
}
catch(e) {}

/* This is a nasty hack to hijack into the express middlewares
   because atlasboard doesn't expose express */
var express = require('./node_modules/atlasboard/node_modules/express');
var methodOverride = express.methodOverride;
express.__defineGetter__('methodOverride', function () {
  return function (key) {
    return function (req, res, next) {
      if (globalAuth.basic) {
        return express.basicAuth(globalAuth.basic.username, globalAuth.basic.password)(req, res, function () {
          return methodOverride(key)(req, res, next);
        });
      }
      return methodOverride(key)(req, res, next);
    };
  };
});

// Start atlasboard server
var atlasboard = require('./node_modules/atlasboard/lib/atlasboard');
atlasboard({ port: process.env.PORT || 5000 }, function (err) {
  fs.unlink('./globalAuth.json');
  if (err) {
    console.log(err);
  }
});
