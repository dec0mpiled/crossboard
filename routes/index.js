var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var mongoose = require('mongoose');


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.user) {
        
            Post.find({author:req.user.username}, function(err, myposts) {
      if (err) throw err;
      
      myposts = myposts.reverse();
        
        res.render('board', { title: 'My XBoard', posts:myposts});
        
            });
        
    } else {
  res.render('index', { title: 'Login - XBoard' });
    }
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register - XBoard' });
});

router.post("/create", function(req, res, next) {
   
   var NewPost = new Post ({
       
       author:req.user.username,
       content:req.body.text
       
   });
   
   NewPost.save();
   
   res.redirect("/");
    
});

module.exports = router;
