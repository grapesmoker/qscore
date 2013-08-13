/**
 * New node file
 */

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
}