// app/models/user

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Users
//title = Undergrad / grad / etc.
//jobSearchType = full time / part time / etc.

var UserSchema = new Schema({
	firstName: 		String,
	lastName: 		String,
	phoneNumber: 	String,
	email: 			String,
	title: 			String,
	jobSearchType: 	String
});

module.exports = mongoose.model('User', UserSchema);