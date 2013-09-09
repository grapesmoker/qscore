/**
 * New node file
 */

var User = require('../models/users').User;
var Team = require('../models/teams').Team;
var Tournament = require('../models/tournaments').Tournament;
var Player = require('../models/players').Player;
var Game = require('../models/games').Game;

exports.get_team_from_id = function(req, res) {
	var teamId = req.body.teamId;
	
	db.teams.findOne({_id: db.ObjectId(teamId)}, function(err, team) {
		if (err) {
			res.json({result: 'failure'});
		}
		else {
			res.json({team: team});
		}
	});
};

exports.find_user = function(req, res) {
	var search_term = req.query['term'];
	
	console.log(req.body);
	console.log(req.query);
	
	console.log(search_term);
	
	res.json([{firstName: 'some', lastName: 'person', username: 'someperson', id: 'abcde'}]);
	//User.find({$or: {first_name }})
};