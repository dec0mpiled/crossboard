var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Post = require('../models/post');
var router = express.Router();

router.get('/register', function(req, res) {
  res.render('/register', { active: 'register', title: 'Register' });
});

router.get('/login', function(req, res) {
  res.render('/login', { active: 'login', title: 'Login', user:req.user });
});

router.post('/register', function(req, res, next) {
var username=req.body.username.replace(/[^\x00-\x7F]/g, "");
   if (username=="" || username==" " || username=="  " || username=="   "){
    return res.render("register", {
        info: "Username cannot be blank!",
        active: 'index',
        title: 'Register - XBoard'
      });
    }

  User.register(new User({
    username: username,
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render("register", {
        info: "That username is not available, sorry.",
        active: 'index',
        title: 'Register - XBoard'
      });
    } else {
      
      res.redirect('/');
      
    }
    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }

      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }

    if (!user) { return res.render("index", { info: "Username or password incorrect!", active: 'login', title: 'Login - XBoard'}); }

    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.session.cookie.maxAge = 2592000000; //1 Month
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// update
router.post('/update', function (req, res, next) {
  User.findOneAndUpdate({ _id: req.user.id }, {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username
  }, function (err, account) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;