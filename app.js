
/**
 * Module dependencies.
 */

var flash = require('connect-flash')
  , express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , qscore_ajax = require('./routes/qscore_ajax')
  , mongoose = require('mongoose')
  , http = require('http')
  , path = require('path')
  , forms = require('forms')
  , fields = forms.fields
  , validators = forms.validators
  , cons = require('consolidate')
  , fs = require('fs');

var app = express();

mongoose.connect('mongodb://localhost/qscore_db');

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

bcrypt = require('bcrypt');
und = require('underscore');
moment = require('moment');
async = require('async');
hb = require('handlebars');
swag = require('swag');

databaseUrl = "localhost/qscore_db";
collections = ['players', 'teams', 'games', 'tournaments', 'users', 'playerScores', 'teamScores'];
mongojs = require('mongojs');
db = mongojs(databaseUrl, collections);
swag.registerHelpers(hb);

//console.log(db);
//db = require('mongojs').connect(databaseUrl, collections);

var User = require('./models/users.js').User;

// all environments
app.engine('html', cons.handlebars);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
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
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({username: username}, function(err, user) {
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
app.get('/alltours', routes.alltournaments);
app.get('/addteam/:id', ensureAuthenticated, routes.addteam);
app.post('/addteam', ensureAuthenticated, routes.addteam);
app.get('/users', user.list);
app.get('/newgame', routes.newgame);
app.get('/newgame/:id', routes.newgame2);
app.all('/newtour', ensureAuthenticated, routes.newtour);
app.post('/playgame', routes.playgame);
app.get('/playgame/:id', routes.playgame);
app.get('/login', user.login);
app.all('/register', user.register);
app.post('/login', 
		  passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
		  function(req, res) {
		    res.redirect('/');
		  });
app.get('/viewtour/:id', routes.viewtour);
app.post('/savegame', routes.savegame);
app.get('/edittour/:id', routes.edittour);
app.post('/edittour', routes.edittour);
app.get('/viewteam/:id', routes.viewteam);
app.post('/saveteam', routes.saveteam);
app.post('/deleteplayer', routes.deleteplayer);
app.post('/get_team_from_id', qscore_ajax.get_team_from_id);
app.all('/finduser', qscore_ajax.find_user);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/* Helper functions */

function checkForNullScore(entry) {
	
	if (und.isUndefined(entry) || und.isNull(entry) || und.isNull(entry['score'])) {
		return 0;
	} else { return entry['score'];}
};

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}

/* Handlebars partials */

hb.registerPartial('header', fs.readFileSync('./views/header.html', 'utf8'));
hb.registerPartial('sidebar', fs.readFileSync('./views/sidebar.html', 'utf8'));
hb.registerPartial('menubar', fs.readFileSync('./views/menubar.html', 'utf8'));
hb.registerPartial('errormsg', fs.readFileSync('./views/errormsg.html', 'utf8'));

/* Handlebars helpers 
 * 
 * (probably should be broken out into own file?)
 * 
 */

var Player = require('./models/players').Player;

hb.registerHelper('momentFormat', function(date_time, format_string) {
	return moment(date_time).format(format_string);
});

hb.registerHelper('dotimes', function(i, options) {
	var buffer = '';
	
	for (var n = 0; n < i; n++) {
		buffer += options.fn(n);
	}
	
	return buffer;
});

hb.registerHelper('scoreTable', function(game, teams){
	
	var ret = '';
	
	var numPlayers1 = game.team1.teamRoster.length;
	var numPlayers2 = game.team2.teamRoster.length;
						
	console.log("current game" + game);
	
	console.log(numPlayers1);
	console.log(numPlayers2);
	
	
	var runningScore1 = 0;
	var runningScore2 = 0;
	
	for (var i = 1; i < 31; i++) {
		ret += '<tr><td>' + i + '</td>';
		
		var lineScore1 = 0;
		var lineScore2 = 0;
		
		for (var j = 1; j < numPlayers1 + 1; j ++) {
			var player = teams[0].teamRoster[j - 1];
			//console.log(player);
			
			var scoreEntry = und.findWhere(player.scoreEntries, {questionNum: i.toString()});
			// console.log(scoreEntry);
			
			ret += '<td align="center" class="player-score player-id-' + player._id + '"\
					data-question-num="' + i + '" id="player_score_A_' + i + '_' + j + '"\
					data-score="' + checkForNullScore(scoreEntry) + '">';
			
			ret += '<p>';
			if (checkForNullScore(scoreEntry) > 0) {
				ret += scoreEntry['score'];
				lineScore1 += parseInt(scoreEntry['score']);
			};
			ret += '</p></td>';
		}
		
			
		var teamScoreEntry = und.findWhere(teams[0].scoreEntries, {questionNum: i.toString()});
			
		ret += '<td align="center" class="bonus-score team-id-' + game.team1._id + '"\
				data-question-num="' + i + '" id="bonus_score_A_' + i + '"\
				data-score="' + checkForNullScore(teamScoreEntry) + '">';
				
		ret += '<p>';
		if (checkForNullScore(teamScoreEntry) > 0) {
			ret += teamScoreEntry['score'];
			lineScore1 += parseInt(teamScoreEntry['score']);
		}
		
		runningScore1 += lineScore1;
							
		ret += '</p></td>';
		
		if (lineScore1 > 0) {
			ret += '<td align="center" class="running-total" id="running_total_A_' + i +'">' + runningScore1 + '</td>';
		}
		else {
			ret += '<td align="center" class="running-total" id="running_total_A_' + i +'"></td>';
		}
		
		for (var j = 1; j < numPlayers2 + 1; j ++) {
			var player = teams[1].teamRoster[j - 1];
			var scoreEntry = und.findWhere(player.scoreEntries, {questionNum: i.toString()});
			
			ret += '<td align="center" class="player-score player-id-' + player._id + '"\
					data-question-num="' + i + '" id="player_score_B_' + i + '_' + j + '"\
					data-score="' + checkForNullScore(scoreEntry) + '">';
			
			ret += '<p>';
			if (checkForNullScore(scoreEntry) > 0) {
				ret += scoreEntry['score'];
				lineScore2 += parseInt(scoreEntry['score']);
			};
			ret += '</p></td>';
		}
		
		var teamScoreEntry = und.findWhere(game.team1.scoreEntries, {questionNum: i.toString()});
		
		ret += '<td align="center" class="bonus-score team-id-' + game.team2._id + '"\
				data-question-num="' + i + '" id="bonus_score_B_' + i + '"\
				data-score="' + checkForNullScore(teamScoreEntry) + '">';
				
		ret += '<p>';
		if (checkForNullScore(teamScoreEntry) > 0) {
			ret += teamScoreEntry['score'];
			lineScore2 += parseInt(teamScoreEntry['score']);
		}
				
		runningScore2 += lineScore2;
					
		ret += '</p></td>';
		
		if (lineScore2 > 0) {
			ret += '<td align="center" class="running-total" id="running_total_B_' + i +'">' + runningScore2 + '</td>';
		}
		else {
			ret += '<td align="center" class="running-total" id="running_total_B_' + i +'"></td>';
		}
		
		
		ret += '</tr>';
	}
	
	return ret;
});
