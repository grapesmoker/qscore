/**
 * New node file
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var PlayerSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	scoreEntries: Array,
	tournament: ObjectId,
	team: ObjectId
});

var Player = mongoose.model('Player', PlayerSchema);

module.exports = {
	Player: Player
};