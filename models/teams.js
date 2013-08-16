/**
 * Teams schema and model
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var TeamSchema = new mongoose.Schema({
	teamName: String,
	teamRoster: [{type: ObjectId, ref: 'Player'}],
	tournament: {type: ObjectId, ref: 'Tournament'},
	allowedToEdit: [{type: ObjectId, ref: 'User'}]
});

var Team = mongoose.model('Team', TeamSchema);

module.exports = {
	Team: Team
};