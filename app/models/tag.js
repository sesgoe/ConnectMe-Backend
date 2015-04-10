// app/models/tag

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Users
//title = Undergrad / grad / etc.
//jobSearchType = full time / part time / etc.

var TagSchema = new Schema({
	tagText: 		String,
	
	
});

module.exports = mongoose.model('Tag', TagSchema);