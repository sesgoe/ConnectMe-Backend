// app/models/resume

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Resumes
//email = email that submitted the resume

var ResumeSchema = new Schema({
	email: 		String,
	fileName:   String,
	path:       String,
	uploadDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Resume', ResumeSchema);