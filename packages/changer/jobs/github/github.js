var github = require('octonode');

module.exports = function(config, dependencies, job_callback) {

  console.log('hey github');

  var client = github.client();

  client.get('/users/pksunkara', {}, function (err, status, body, headers) {
    //console.log(body);
  });

  var client = github.client({
    id: '3c47ccb914f0456b1201',
    secret: 'c7a99805aca71b7489ce9a0ce89a259a830d6682'
  });

  var ghorg = client.org('changer');

  /*ghorg.members(function(err, data, headers) {
    console.log("error: " + err);
    console.log("data: " + JSON.stringify(data));
    console.log("headers:" + headers);
  });*/

  var auth_url = github.auth.config({
    id: '3c47ccb914f0456b1201',
    secret: 'c7a99805aca71b7489ce9a0ce89a259a830d6682'
  }).login(['user', 'repo', 'gist']);

  job_callback(null, { title: config.widgetTitle });
};
