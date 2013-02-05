
/**
 * Module dependencies.
 */

var express   = require('express');
var path      = require('path');
var api       = require('./lib/api');
var app       = module.exports = express();
var spawn     = require('child_process').spawn;

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('change this value to something unique'));
app.use(express.cookieSession());
app.use(express.compress());
app.use(api);
app.use(express.static(path.join(__dirname, '../../dist')));
app.use(app.router);

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res) {
  res.render('home.twig');
});

app.all('/hooks/github', function(req, res) {
  var payload;

  try {
    // payload = JSON.parse(req.body.payload);
  } catch (e) {
    return res.send(400, 'Not a valid payload');
  }

  payload = {
before: "5aef35982fb2d34e9d9d4502f6ede1072793222d",
repository: {
url: "http://github.com/defunkt/github",
name: "github",
description: "You're lookin' at it.",
watchers: 5,
forks: 2,
private: 1,
owner: {
email: "chris@ozmm.org",
name: "defunkt"
}
},
commits: [
{
id: "41a212ee83ca127e3c8cf465891ab7216a705f59",
url: "http://github.com/defunkt/github/commit/41a212ee83ca127e3c8cf465891ab7216a705f59",
author: {
email: "chris@ozmm.org",
name: "Chris Wanstrath"
},
message: "okay i give in",
timestamp: "2008-02-15T14:57:17-08:00",
added: [
"filepath.rb"
]
},
{
id: "de8251ff97ee194a289832576287d6f8ad74e3d0",
url: "http://github.com/defunkt/github/commit/de8251ff97ee194a289832576287d6f8ad74e3d0",
author: {
email: "chris@ozmm.org",
name: "Chris Wanstrath"
},
message: "update pricing a tad",
timestamp: "2008-02-15T14:36:34-08:00"
}
],
after: "de8251ff97ee194a289832576287d6f8ad74e3d0",
ref: "refs/heads/master"
};

  var repo    = payload.repository.url.split('/').slice(-2).join('/');
  var branch  = payload.ref.split('/').pop();
  var commit  = payload.after;
  var bin     = __dirname + '/../../bin';
  var output  = '';

  var deploy = spawn(bin + '/deploy.sh', [repo, branch, commit]);

  deploy.stderr.on('data', function(data) {
    output += '! ' + data;
    console.log(data.toString());
  });

  deploy.stdout.on('data', function(data) {
    output += '> ' + data;
    console.log(data.toString());
  });

  deploy.on('exit', function(code) {
    if (scripts.length === i + 1) {
      res.send(200, output);
    }
  });
});
