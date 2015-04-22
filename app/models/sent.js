// app/models/sent

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//sent resumes
//Sent resumes to a certain tag, links filename w/ tag since filenames are unique

var SentSchema = new Schema({
	fileName: 	String,
	tag:		String
});

module.exports = mongoose.model('Sent', SentSchema);