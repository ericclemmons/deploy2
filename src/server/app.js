
/**
 * Module dependencies.
 */

var express   = require('express');
var path      = require('path');
var api       = require('./lib/api');
var app       = module.exports = express();
var spawn     = require('child_process').spawn;
var moment    = require('moment');

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

app.locals.deployments  = [];
app.locals.output       = '';

app.get('/', function(req, res) {
  res.render('home.twig');
});

app.get('/api/deployments', function(req, res) {
  res.send(app.locals.deployments);
});

app.post('/hooks/github', function(req, res) {
  var payload;

  try {
    payload = JSON.parse(req.body.payload);
  } catch (e) {
    return res.send(400, 'Not a valid payload');
  }

  var start   = moment().unix();
  var repo    = payload.repository.url.split('/').slice(-2).join('/');
  var branch  = payload.ref.split('/').pop();
  var commit  = payload.after;
  var bin     = __dirname + '/../../bin';
  var deploy  = spawn(bin + '/deploy.sh', [repo, branch, commit]);
  var stdout  = '';
  var stderr  = '';
  var raw     = '';

  deploy.stderr.on('data', function(data) { stderr += data; raw += data; });
  deploy.stdout.on('data', function(data) { stdout += data; raw += data; });

  deploy.on('exit', function(code) {
    var deployment = {
      code:     code,
      start:    start,
      finish:   moment().unix(),
      repo:     repo,
      branch:   branch,
      commit:   commit,
      output:   {
        raw:    raw,
        out:    stdout,
        err:    stderr
      },
      payload:  payload
    };

    app.locals.deployments.unshift(deployment);

    res.send(200, deployment);
  });
});
