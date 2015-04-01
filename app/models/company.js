// app/models/company

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CompanySchema = new Schema({
	name: String,
	tags: [ {type: String} ]
});

module.exports = mongoose.model('Company', CompanySchema);