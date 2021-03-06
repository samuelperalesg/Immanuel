const express = require('express')
const usersRouter = express.Router()
const User = require('../models/user')
const Post = require('../models/post')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')
const cloudinary = require('cloudinary')
const expressFileUpload = require('express-fileupload')


// login routes
usersRouter.get('/login', (req, res) => {
  res.render('login', {error: ''})
})

usersRouter.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email}).select('+password').exec((err, user) => {
    if (!user) return res.render('login', {
      error: 'invalid credentials'
    })

    const isMatched = bcrypt.compareSync(req.body.password, user.password);
    if (!isMatched) return res.render('login', {
      error: 'invalid credentials'
    })

    req.session.user = user._id
    res.redirect('/dashboard')
  })
})

// sign up routes

usersRouter.get('/signup', (req, res) => {
  res.render('signup');
});

usersRouter.post('/signup', (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12));

  User.create(req.body, (err, user) => {
    res.redirect('/login');
  })
})



usersRouter.get('/logout', (req, res) => {
  req.session.destroy(function () {
    res.redirect('/');
  });
});

usersRouter.get('/dashboard', auth.isAuthenticated, (req, res) => {
  Post.find({
    createdBy: req.user._id
  }, (err, posts) => {
    res.render('dashboard', {
      posts
    });
  });
});

usersRouter.post('/users/:id/cards', auth.isAuthenticated, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    user.cards.push(req.body)
    user.save(function (err) {
      res.redirect('/dashboard')
    })
  })
})



module.exports = usersRouter;