
var flatiron = require('flatiron'),
    _ = require('underscore'),
    path = require('path'),
    routes = require('./lib/plugins/routes'),
    handlebarsPlugin = require('./lib/plugins/handlebars'),
    connect = require('connect'),
    app = flatiron.app;

var port = process.env.PORT || 3050;

app.use(flatiron.plugins.http, {
  
  before: [
    connect.static(__dirname + '/public', {maxAge: 86400000}),
    connect.staticCache()
  ],

  after: [
    // Add post-response middleware here
  ],

  onError: function(err) {
    if(err) {
      this.res.writeHead(404, { "Content-Type": "text/html" });
      this.res.end(app.render('404'));
    }
  }
});

app.use(handlebarsPlugin, {
  templates: __dirname + "/templates",
  defaultLayout: 'layouts/default',
  cacheTemplates: false
});
app.use(routes);

app.start(port, function(err) {
  if(err) throw err;
  app.log.info("TweetYourBracket Version 0.1");
  app.log.info("started at :", Date());
  app.log.info("   on port :", port);
  app.log.info("   in mode :", (process.env.PORT) ? 'production' : app.env);
});