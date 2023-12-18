const express = require('express')
const usersRouter = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')


// login routes
usersRouter.get('/login', (req, res) => {
  res.render('login', { error: '' });
});

usersRouter.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    }).select('+password').exec();
    
    if (!user) {
      return res.render('login', {
        error: 'invalid credentials'
      });
    }

    const isMatched = bcrypt.compareSync(req.body.password, user.password);
    
    if (!isMatched) {
      return res.render('login', {
        error: 'invalid credentials'
      });
    }

    req.session.user = user._id;
    res.redirect('/dashboard');
  } catch(err) {
    console.error(err);
    res.status(500).render('error', { error: err });
  }
});


// sign up routes

usersRouter.get('/signup', (req, res) => {
  res.render('signup');
});

usersRouter.post('/signup', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    
    const user = await User.create(req.body);
    
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});



usersRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

usersRouter.get('/dashboard', auth.isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({
      createdBy: req.user._id
    }).exec();

    res.render('dashboard', {
      posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving posts');
  }
});

usersRouter.post('/users/:id/cards', auth.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).exec();

    user.cards.push(req.body);
    await user.save();

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving card');
  }
});


usersRouter.post('/guest-login', async (req, res) => {
  try {
      let user = await User.findOne({ email: "guest@email.com" });
      if (!user) {
          // If the guest user doesn't exist, create it (or handle accordingly)
          user = new User({
              // Populate with guest user details
              firstName: "Guest",
              lastName: "User",
              email: "guest@email.com",
              password: bcrypt.hashSync("guest123", 12),
          });
          await user.save();
      }
      
      // Log the user in
      req.session.user = user._id;
      res.redirect('/dashboard');
  } catch (err) {
      console.error(err);
      res.status(500).send('Error logging in as guest');
  }
});



module.exports = usersRouter;