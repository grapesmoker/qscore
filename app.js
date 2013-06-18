
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

databaseUrl = "localhost/qscore_db";
collections = ['players', 'teams', 'games', 'tournaments'];
mongojs = require('mongojs');
db = mongojs(databaseUrl, collections);
step = require('step')

//console.log(db);
//db = require('mongojs').connect(databaseUrl, collections);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/addteam', routes.addteam);
app.post('/addteam', routes.addteam);
app.get('/users', user.list);
app.get('/newgame', routes.newgame);
app.all('/newtour', routes.newtour);
app.all('/playgame', routes.playgame);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
