let express = require('express');
let router = express.Router();
let User = require('../modal').User;

// POST /users/signup
router.post('/signup', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  if (username.length < 4) {
    return res.status(400).send('Username must be at least 4 characters long');
  }

  if (password.length < 4 ) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  let userExists = await User.findOne({ username: username });
  if(userExists){
    return res.status(400).send('Username already exists');
  }

  let user = new User({ username: username, password: password });
  user.save()
    .then(savedUser => {
      res.status(201).json({message: username+' signed up successfully'});
    })
    .catch(err => {
      next(err);
    });
});

// POST /users/login
router.post('/login', async function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  let user = await User.findOne({ username: username });
  //console.log(user);
  if (!user || password !== user.password) {
    return res.status(401).send('Invalid username or password');
  }
  req.session.userId = user._id;
  console.log(req.session);

  res.json({message: username+' logged in successfully'});
});

module.exports = router;
