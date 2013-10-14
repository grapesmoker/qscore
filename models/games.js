/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var GameSchema = new mongoose.Schema({
	team1: {type: ObjectId, ref: 'Team'},
	team2: {type: ObjectId, ref: 'Team'},
	tournament: {type: ObjectId, ref: 'Tournament'},
	round: Number,
	room: String,
	moderator: String,
	tossupsHeard: Number,
	createdBy: {type: ObjectId, ref: 'User'}
});

var Game = mongoose.model('Game', GameSchema);

module.exports = {
	Game: Game
};