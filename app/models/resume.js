// app/models/resume

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Resumes
//email = email that submitted the resume
//tag = tag the resume corresponds to

var ResumeSchema = new Schema({
	email: 		String,
	tag:		String,
	path:       String,
	uploadDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Resume', ResumeSchema);