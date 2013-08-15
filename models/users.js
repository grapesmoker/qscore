/**
 * New node file
 */

var mongoose = require('mongoose');
	
var UserSchema = mongoose.Schema({
	username: String,
	email: String,
	firstName: String,
	lastName: String,
	password: String
});
	
	
var User = mongoose.model('User', UserSchema);
	

module.exports = {
	User: User
};

/*User.findOne(function(err, user) {
	if (err) {
		console.log(err);
	}
	else {
		console.log(user);
	}
});*/
