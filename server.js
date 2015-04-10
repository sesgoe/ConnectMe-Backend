//server.js

//BASE SETUP
//---------------------------------------


var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 18081;
var counter = 0;


var mongoose = require('mongoose');
mongoose.connect('mongodb://connectme:correcthorsebatterystaple@proximus.modulusmongo.net:27017/nyg3uGyg'); //companies


//var mongoose2 = require('mongoose');
//mongoose2.connect('mongodb://connectme:incorrecthorsebatterystaple@proximus.modulusmongo.net:27017/Ahe4wiri'); //users

var Company = require('./app/models/company');
var User = require('./app/models/user');

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
	
router.route('/users/')

	.get(function(req, res) {
	
		User.find(function(err, users) {
			if(err)
				res.send(err);
			
			res.json(users);
		});
	})
	
	.post(function(req, res) {
		
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