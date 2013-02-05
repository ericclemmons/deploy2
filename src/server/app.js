
/**
 * Module dependencies.
 */

var express   = require('express');
var path      = require('path');
var api       = require('./lib/api');
var app       = module.exports = express();
var child     = require('child_process');

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
  console.log(req.params.payload);

  var payload = req.params.payload;
  var repo    = payload.repository.url.split('/').slice(-2).join('/');
  var branch  = payload.ref.split('/').pop();
  var commit  = payload.after;
  var bin     = __dirname + '/../../bin';
  var command = [bin + '/deploy.sh', repo, branch, commit];

  console.log(command.join(' '));

  var deploy = child.exec(command.join(' '), function(error, stdout, stderr) {
    console.log(stdout);
    res.send(200, stdout);
  });
});
