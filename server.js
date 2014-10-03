'use strict';

var atlasboard = require('./node_modules/atlasboard/lib/atlasboard');
atlasboard({ port: process.env.PORT || 5000 }, function (err) {
  if (err) {
    console.log(err);
  }
});
