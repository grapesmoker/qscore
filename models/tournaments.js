/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TournamentSchema = new mongoose.Schema({
	tourName: String,
	tourAddress: String,
	tourLocation: String,
	tourDate: Date,
	createdBy: ObjectId,
	teams: [{type: ObjectId, ref: 'Team'}],
	games: [{type: ObjectId, ref: 'Game'}]
});

var Tournament = mongoose.model('Tournament', TournamentSchema);

module.exports = {
	Tournament: Tournament
};