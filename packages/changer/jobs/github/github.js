var github = require('octonode');

module.exports = function(config, dependencies, job_callback) {

  if (!config.globalAuth.github) {
    return job_callback(null, { title: config.widgetTitle });
  }

  var client = github.client(config.globalAuth.github.auth);
  var ghorg = client.org(config.globalAuth.github.organization);
  async.parallel([function (cb) {
    ghorg.repos({ type: 'private', page: 1, per_page: 100 }, function (err, repos) {
      async.parallel(repos.filter(function (repo) {
        return config.globalAuth.github.repositories.indexOf(repo.name) >= 0;
      }).map(function (repo) {
        return function (fn) {
          var ghrepo = client.repo(config.globalAuth.github.organization.concat('/', repo.name));
          ghrepo.prs(function (err, pulls) {
            fn(err, (pulls || []).map(function (pull) {
              return {
                repo: repo.name,
                number: pull.number,
                user: pull.user.login,
                created_at: pull.created_at,
                updated_at: pull.updated_at
              };
            }));
          });
        }
      }), cb);
    });
  }], function(err, results) {
    job_callback(null, {
      title: config.widgetTitle,
      pulls: _.flatten(results).sort(function (a, b) {
        return new Date(a.created_at) < new Date(b.created_at);
      })
    });
  });

};
