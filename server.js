//server.js

//BASE SETUP
//---------------------------------------


var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var bodyParser = require('body-parser');
var request = require('request');
var pathP = require('path');
var mime = require('mime');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer({ dest: './uploads/',
				
				 rename: function(fieldname, filename, req, res) {
					 return filename;
				 }

}));

var port = process.env.PORT || 18081;
var counter = 0;


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ConnectMeDB'); //database now local for massive storage potential*
														   //*: storage potential not actually that massive

var Company = require('./app/models/company');
var User = require('./app/models/user');
var Resume = require('./app/models/resume');
var Sent = require('./app/models/sent');

//ROUTES FOR API CALLS

var router = express.Router();

//all requests at all do this
router.use(function(req, res, next) {
	//log stuff
	console.log("Something happened: " + counter);
	counter++;
	next();
});

router.get('/', function(req, res) {
	res.json({message: 'hooray! this works!'});
});

router.route('/companies')

	.post(function(req, res) {
		
		var company = new Company();
		company.name = req.body.name;
		
		company.save(function(err) {
			if(err)
				res.send(err);
			
			res.json({ message: 'Company created!' });
		});
	})
	
	.get(function(req, res) {
	
		Company.find(function(err, companies) {
			if(err)
				res.send(err);
			
			res.json(companies);
		});
	});

router.route('/companies/:company_id')

    .get(function(req, res) {
        Company.findById(req.params.company_id, function(err, company) {
            if (err)
                res.send(err);
            res.json(company);
        });
    })
	
	.put(function(req, res) {
	
		Company.findById(req.params.company_id, function(err, company) {
		
			if (err)
				res.send(err);
				
			company.name = req.body.name;
			
			company.save(function(err) {
			
				if(err)
					res.send(err);
					
				res.json({ message: 'Company Updated!' });
			});
			
		});
	})
	
	.delete(function(req, res) {
        Company.remove({
            _id: req.params.company_id
        }, function(err, company) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
	
router.route('/companies/:company_id/tags')

	.get(function(req, res) {
        Company.findById(req.params.company_id, function(err, company) {
            if (err)
                res.send(err);
            res.json(company.tags);
        });
    })

	.post(function(req, res) {
	
		Company.findById(req.params.company_id, function(err, company) {
		
			if (err)
				res.send(err);
				
			company.tags.push(req.body.tag);
			
			
			company.save(function(err) {
			
				if(err)
					res.send(err);
					
				res.json({ message: 'Tag Added!' });
			});
			
		});
	})
	
	.delete(function(req, res) {
	
		Company.findById(req.params.company_id, function(err, company) {
		
			if (err)
				res.send(err);
				
			for(i = 0; i<company.tags.length; i++) {
				if(company.tags[i] == req.body.tag) {
					company.tags.splice(i, 1);
					break;
				}
			}
			
			
			company.save(function(err) {
			
				if(err)
					res.send(err);
					
				res.json({ message: 'Tag removed!' });
			});
			
		});
	});
	
router.route('/resumes')

	.get(function(req, res) {
		
		Resume.find(function(err, resumes) {
			if(err)
				res.send(err);
			
			res.json(resumes);
		});
	})
	
	.post(function(req, res) {
		
		
		if(req.body.fileURL) {
			var arr = req.body.fileURL.split("/");
			request(req.body.fileURL).pipe(fs.createWriteStream('./uploads/' + arr[arr.length-1]));
			
			console.log('request body: ' + req.body);
			
			var resume = new Resume();
			resume.email = req.body.email;
			resume.fileName = arr[arr.length-1];
			resume.path = '/uploads/' + arr[arr.length-1];
			
			resume.save(function(err) {
				if(err)
					res.send(err);
				res.json({ message: "Resume uploaded!"});
			});
			
			console.log('resume uploaded!');
				
		} else {
			
			var file = req.files.file;
			
			if(file.mimetype != 'application/pdf') {
				res.json({message: 'File type must be PDF! Received: ' + file.mimetype});
			} else if(file.mimetype == 'application/pdf') {
				
				
				var resume = new Resume();
				resume.email = req.body.email;
				resume.fileName = file.name;
				
				var newPath = '/uploads/' + file.name;
				resume.path = newPath;
				
				resume.save(function(err) {
					if(err)
						res.send(err);
					res.json({ message: 'Resume submitted!'});
				});
				
				fs.readFile(file.path, function(err, data) {
					
					if(err)
						res.send(err);
					
					fs.writeFile(newPath, data, function(err) {
						if(err)
							res.send(err);
					});
					
				});
				
			}
			
		}
		
		
	});
	
router.route('/resumes/:resume_id')

	.get(function(req, res) {
        Resume.findById(req.params.resume_id, function(err, resume) {
            if (err)
                res.send(err);
			
			var file = __dirname + '/uploads/' + resume.fileName;
			
			var filename = pathP.basename(file);
			var mimetype = mime.lookup(file);
			
			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			res.setHeader('Content-type', mimetype);
			
			var filestream = fs.createReadStream(file);
			filestream.pipe(res);
			
        });
    });

router.route('/sent')

	.get(function(req, res) {
		
		Sent.find(function(err, sents) {
			if(err)
				res.send(err);
			
			res.json(sents);
		});
	})
	
	.post(function(req, res) {
		
		var sent = new Sent();
		sent.fileName = req.body.fileName;
		sent.tag = req.body.tag;
		
		sent.save(function(err) {
			if(err)
				res.send(err);
			
			res.json({ message: 'Sent created!' });
		});
	});
	
router.route('/users')

	.get(function(req, res) {
	
		User.find(function(err, users) {
			if(err)
				res.send(err);
			
			res.json(users);
		});
	})
	
	.post(function(req, res) {
		
		User.findOne({"email": req.body.email}, function(err, data) {
			if(err)
				res.send(err);
			if(data) {
				res.json({ message: 'User exists'});
			} else {
				
				var user = new User();
				user.firstName = req.body.firstName;
				user.lastName  = req.body.lastName;
				user.phoneNumber = "";
				user.email = req.body.email;
				user.title = "";
				user.jobSearchType = "";
				
				user.save(function(err) {
					if(err)
						res.send(err);
					
					res.json({ message: 'User created!' });
				});
				
			}
		});
	});
	
router.route('/users/:user_id')

    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
	
	.put(function(req, res) {
	
		User.findById(req.params.user_id, function(err, user) {
		
			if (err)
				res.send(err);
				
			if(req.body.firstName)
				user.firstName = req.body.firstName;
			if(req.body.lastName)
				user.lastName = req.body.lastName;
			if(req.body.phoneNumber)
				user.phoneNumber = req.body.phoneNumber;
			if(req.body.email)
				user.email = req.body.email;
			if(req.body.title)
				user.title = req.body.title;
			if(req.body.jobSearchType)
				user.jobSearchType = req.body.jobSearchType;
			
			user.save(function(err) {
			
				if(err)
					res.send(err);
					
				res.json({ message: 'User Updated!' });
			});
			
		});
	})
	
	.delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
	

app.use('/api', router);


app.listen(port);
console.log('Magic happens on port ' + port);