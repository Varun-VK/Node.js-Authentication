var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sessions = require('client-sessions');
var cookieParser = require('cookie-parser');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/newnodeauth');

var User = mongoose.model('User', new Schema({
	id : ObjectId,
	firstName : String,
	lastName : String,
	email : {type : String, required : true},
	password : String,
  phone : Number,
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.jade', { message: 'Express', title: 'ExpressTitle' });
});

router.get('/register', function(req, res, next) {
  res.render('register.jade');
});

router.post('/register', function(req, res, next) {
  var user = new User({
  	firstName : req.body.firstName,
  	lastName : req.body.lastName,
  	email : req.body.email,
  	password : req.body.password,
    phone : req.body.phone,
  });

  user.save(function(err){
  	if (err){
  		var error = 'Try again';
  		if (err === 11000){
  			error = 'Not unique';
  		}
  		res.render('register.jade', {error : error});
  		}
  		else{
  		res.redirect('/dashboard');
  		}
  }); 
}); 

router.get('/login', function(req, res, next) {
  res.render('login.jade');
});

router.post('/login', function(req, res, next) {
  User.findOne({email : req.body.email}, function(err, user){
  	if (!user){
  		res.render('login.jade', {error : 'Not Valid'});
  	}else{
  		if (req.body.password === user.password){
  			req.session.user = user;
  			res.redirect('/dashboard');
  		} else{
  			res.render('login.jade', {error : 'Not Valid'});
  		}
  	}
  });
});


router.get('/dashboard', function(req, res, next) {
	if(req.session && req.session.user){
		User.findOne({email : req.session.user.email}, function(err, user){
			if(!user){
				req.session.reset();
				res.redirect('/login');
			} else{
				res.locals.users = user;
				res.render('dashboard.jade');
			}
		}); 
    }else{
      res.redirect('/login');
    }
});


module.exports = router;
