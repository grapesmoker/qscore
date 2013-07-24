
/**
 * Module dependencies.
 */

var flash = require('connect-flash')
  , express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

bcrypt = require('bcrypt');
und = require('underscore');

databaseUrl = "localhost/qscore_db";
collections = ['players', 'teams', 'games', 'tournaments', 'users', 'playerScores', 'teamScores'];
mongojs = require('mongojs');
db = mongojs(databaseUrl, collections);
step = require('step')

//console.log(db);
//db = require('mongojs').connect(databaseUrl, collections);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.cookieParser());
app.use(express.session({secret: '1234567890qwerty'}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	db.users.find({_id: db.ObjectId(id)}, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	db.users.findOne({username: username}, function(err, user) {
		if (err) {
			return done(err);
		}
		else if (!user) {
			return done(null, false, {message: 'User ' + username + ' not found.'});
		}
		else {
			bcrypt.compare(password, user.password, function(err, isMatch){
				console.log(user.username + ' ' + user.password);
				console.log(password);
				if (err) {
					console.log('Authenticated');
					return done(err);
				}
				else if (!isMatch) {
					console.log('Wrong password');
					return done(null, false, {message: 'Incorrect password!'});
				}
				else if (isMatch) {
					return done(null, user);
				}
			});
		}
	});
}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/addteam', routes.addteam);
app.post('/addteam', routes.addteam);
app.get('/users', user.list);
app.get('/newgame', routes.newgame);
app.all('/newtour', ensureAuthenticated, routes.newtour);
app.all('/playgame', routes.playgame);
app.get('/login', user.login);
app.all('/register', user.register);
app.post('/login', 
		  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
		  function(req, res) {
		    res.redirect('/');
		  });
app.get('/viewtour/:id', routes.viewtour);
app.post('/savegame', routes.savegame);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}
