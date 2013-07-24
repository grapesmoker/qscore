
/*
 * GET home page.
 */

exports.index = function(req, res){
	
	console.log('Authentication: ' + req.isAuthenticated());
	
	if (req.isAuthenticated()) {
		var userId = req.user[0]._id.toString();
		console.log(req.user);
		console.log(userId);
		db.tournaments.find({createdBy: db.ObjectId(userId)}, function(err, tournaments) {
			if (err) {
				res.render('index', {title: 'QScore', state: 'error', message: 'An error occurred!'});
			}
			else if (!tournaments) {
				res.render('index', {title: 'QScore', state: 'error', message: 'Could not retrieve tournaments!'});
			}
			else {
				res.render('index', {title: 'QScore', state: 'success', tournaments: tournaments})
			}
		});
	}
	else {
		res.render('index', { title: 'QScore', tournaments: []});
	}
};

exports.addteam = function(req, res) {
	console.log(req.body.teamName);
	console.log(req.body.teamRoster);
	
	var teamName = req.body.teamName,
		teamRoster = req.body.teamRoster;
		tournament = req.body.tournament;
	
	console.log(tournament)
		
	var message = '';
	var state = '';
	var saved_roster = [];
	
	if (req.method == 'POST') {
		
		teamRoster.split('\r\n').forEach(function (player) {
			var split_name  = player.split(' ');
			var first_name  = split_name[0];
			var last_name   = split_name[split_name.length - 1];
			
			db.players.findAndModify({query: {firstName: first_name, lastName: last_name, tournament: db.ObjectId(tournament)}, 
				sort: [],
				update: {$set: { firstName: first_name, lastName: last_name }},
				upsert: true,
				'new': true},
				function(err, rec) {
					if (err || !rec) {
						console.log(err);
						console.log(first_name + ' ' + last_name + ' was not saved!');
						var message = "There was an error saving the team roster!";
						var state   = 'error';
						res.render('addteam', {title: 'Add Team', state: state, message: message});
					}
					else {
						console.log(rec);
						console.log(rec._id);
						console.log(first_name + ' ' + last_name + ' was saved!');
						db.teams.update({teamName: teamName, tournament: db.ObjectId(tournament)},
							{$set: {teamName: teamName},
							$push: {teamRoster: {firstName: first_name, lastName: last_name, _id: rec._id}}},
							{upsert: true},
							function(err, saved) {
								if (err || !saved) {
									console.log("Team not saved!");
									var message      = "There was an error saving the team!";
									var state        = "error";
									res.render('addteam', {title: 'Add Team', state: state, message: message});
								}
								else {
									console.log("Team saved in database");
									var message = "Team saved successfully!";
									var state = "ok";
									res.render('addteam', {title: 'Add Team', state: state, message: message});
								}
							});
					}
				});
		});
		
	}
	else {
		db.tournaments.find({}, function(err, tournaments) {
			if (err) {
				console.log('Error retrieving tournaments!');
				state = 'error';
				message = 'An error occurred! Could not retrieve tournaments!';
				res.render('addteam', {title: 'Add Team', state: state, message: message});
			}
			else {
				res.render('addteam', {title: 'Add Team', state: '', message: '', tournaments: tournaments});
			}
		});
	}
	
	console.log(state);
	console.log(message);
	
};

exports.savegame = function(req, res) {
	
	var team_scores = req.body.teamScores;
	var player_scores = req.body.playerScores;
	var gameId = req.body.gameId;
	
	console.log(gameId);
	
	player_scores.forEach(function(score_entry) {
		
		db.players.update({_id: db.ObjectId(score_entry.playerId)},
						  {$pull: {scoreEntries: {gameId: gameId}}},
			function(err, saved) {
				if (err) {
					console.log(err);
					res.json({result: 'failure'});
				}
				else {
					db.players.update({_id: db.ObjectId(score_entry.playerId)},
							  {$push: {scoreEntries: {score: score_entry.score,
												   	  questionNum: score_entry.questionNum,
												   	  gameId: score_entry.gameId}}},
							function(err, saved) {
				
								if (err) {
									console.log(err);
									res.json({result: 'failure'});
								}
								else {
									//console.log(score_entry.questionNum + ' ' + score_entry.score);
									res.json({result: 'success'});
								}
							});
					}
		});
	});
}

exports.newgame = function(req, res) {
	
	teams = db.teams.find('', function(err, teams) {
		var message = '', state = '';
		
		if (err) {
			console.log('Error retrieving teams!');
			state = 'error';
			message = 'An error occurred! Could not retrieve teams!';
			res.render('newgame', {title: 'New Game', state: state, message: message});
		}
		else {
			tournaments = db.tournaments.find('', function(err, tournaments) {
				if (err) {
					console.log('Error retrieving tournaments!');
					state = 'error';
					message = 'An error occurred! Could not retrieve tournaments!';
					res.render('newgame', {title: 'New Game', state: state, message: message});
				}
				else {
					res.render('newgame', {title: 'New Game', state: '', message: '', 
						teams: teams,
						tournaments: tournaments});
				}
			});
		}
	});
	
};

exports.newtour = function(req, res) {
	
	var message = '';
	var state = '';
	
	/* someone should only be able to get to this page if they're already authenticated
	 * by the passport middleware */
	
	
	if (req.method == 'POST') {
		var tourName = req.body.tourName,
			tourDate = req.body.tourDate,
			tourLocation = req.body.tourLocation,
			tourAddress = req.body.tourAddress,
			//username = req.user[0].username,
			id = req.user[0]._id.toString();
			console.log(req.user);
			
		db.tournaments.findAndModify({query: {tourName: tourName, createdBy: db.ObjectId(id)},
			sort: [],
			update: {$set: {tourName: tourName, tourDate: tourDate, 
							tourLocation: tourLocation, tourAddress: tourAddress,
							createdBy: db.ObjectId(id),
							secret: Math.random().toString(36).substring(6)}},
			upsert: true,
			'new': true},
			function(err, rec) {
				if (err || !rec) {
					console.log('An error occurred:' + err);
					state = 'error';
					message = 'An error occurred in saving this tournament!';
					res.render('newtour', {title: 'New Tournament', state: state, message: message});
				}
				else {
					console.log('Tournament succesfully created!');
					state = 'success';
					message = 'The tournament has been succesfully created!';
					res.render('newtour', {title: 'New Tournament', state: state, message: message});
				}
			});
	}
	else {
		res.render('newtour', {title: 'New Tournament', state: state, message: message});
	}
};

exports.playgame = function(req, res) {
	var message = '';
	var state = '';
	
	if (req.method == 'POST') {
		var team1 = req.body.team1,
			team2 = req.body.team2,
			tour = req.body.tour,
			round = req.body.round,
			room = req.body.room,
			moderator = req.body.moderator;
		
		console.log(team1);
		console.log(team2);
		console.log(tour);
		
		db.games.save({team1: team1, team2: team2, tour: tour,
			round: round, room: room, moderator: moderator},
			function(err, rec) {
				if (err) {
					message = 'Error starting this game!';
					state = 'error';
					res.render('newgame', {title: 'New Game', state: state, message: message});
				}
				else {
					db.teams.find({$or: [{_id: db.ObjectId(team1)}, {_id: db.ObjectId(team2)}]}, function(err, team_rosters) {
						if (err) {
							message = 'Error starting this game!';
							state = 'error';
							res.render('newgame', {title: 'New Game', state: state, message: message});
						}
						else {
							console.log(team_rosters);
							res.render('playgame', {title: 'Play Game', team_rosters: team_rosters, game: rec});
						}
					});
				}
			}
		);
	}
	else {
		res.render('playgame', {title: 'Play Game', state: state, message: message});
	}
};

exports.viewtour = function(req, res) {
	
	var tourId = req.params.id;
	
	db.tournaments.findOne({_id: db.ObjectId(tourId)}, function(err, tournament) {
		if (err) {
			res.render('viewtour', {title: 'View Tournament', state: 'error', message: 'An error occurred in the database!'});
		}
		else if (!tournament) {
			res.render('viewtour', {title: 'View Tournament', state: 'error', message: 'Tournament not found!'});
		}
		else {
			db.teams.find({tournament: db.ObjectId(tourId)}, function(err, teams) {
				if (err) {
					res.render('viewtour', {title: 'View Tournament', state: 'error', message: 'An error occurred in the database!'});
				}
				else if (!tournament) {
					res.render('viewtour', {title: 'View Tournament', state: 'error', message: 'Tournament teams not found!'});
				}
				else {
					res.render('viewtour', {title: 'View Tournament', state: 'success', tournament: tournament, teams: teams});
				}
			});
		}
	});
	
	// res.render('viewtour', {title: 'View Tournament'});
};