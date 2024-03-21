let express = require('express');
let router = express.Router();
let User = require('../modal').User;

// POST /users/signup
router.post('/signup', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  let user = new User({ username: username, password: password });
  if (user.password.length <4 ) {
    return res.status(400).send('Password must be at least 8 characters long');
  }
  if(user.username.exists){
    return res.status(400).send('Username already exists');
  }
  user.save()
    .then(savedUser => {
      res.status(201).json({message: username+' signed up successfully'});
    })
    .catch(err => {
      next(err);
    });
});

// POST /users/login
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  User.findOne({ username: username })
    .then(user => {
      if (!user || password !== user.password) {
        res.status(401).send('Invalid username or password');
      } else {
        res.json({message: username+' logged in successfully'});
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
