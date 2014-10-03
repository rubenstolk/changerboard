'use strict';

var fs = require('fs');
var globalAuth = {};
try {
  globalAuth = JSON.parse(process.env.GLOBAL_AUTH || '{}');
  fs.writeFileSync('./globalAuth.json', JSON.stringify(globalAuth));
}
catch(e) {}

var atlasboard = require('./node_modules/atlasboard/lib/atlasboard');
atlasboard({ port: process.env.PORT || 5000 }, function (err) {
  fs.unlink('./globalAuth.json');
  if (err) {
    console.log(err);
  }
});
