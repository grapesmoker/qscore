
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res) {
	
	console.log('Authentication: ' + req.isAuthenticated());
	res.render('login', {title: 'Login', message: req.flash('info')});
}

exports.register = function(req, res) {
	
	if (req.method == 'POST') {
		var username = req.body.username;
		var password = req.body.password;
		var email = req.body.email;
		var confirm_password = req.body.confirm_password;
		
		console.log(username + ' ' + password);
		
		if (password != confirm_password) {
			res.render('register', {title: 'Register', message: req.flash('error')});
		}
		
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);
		
		db.users.find({username: username}, function(err, user) {
			if (err) {
				res.render('register', {title: 'Register', message: 'An error occurred in the database!'});
			}
			else if (!und.isEmpty(user)) {
				console.log(user);
				res.render('register', {title: 'Register', message: 'A user with that name already exists!'});
			}
			else {
				db.users.save({username: username, email: email, password: hash}, function(err, user) {
					if (err || !user) {
						res.render('register', {title: 'Register', message: 'An error occurred in the database!'});
					}
					else {
						res.render('index', {title: 'Register', message: 'You are successfully registered!'});
					}
				});
			}
		});
	}
	else {
		res.render('register', {title: 'Register', message: ''});
	}
};