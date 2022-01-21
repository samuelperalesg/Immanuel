const express = require('express')
const postsRouter = express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/post')
const User = require('../models/user')

// NEW
postsRouter.get('/posts/new', auth.isAuthenticated, (req, res) => {
  res.render('posts/new')
})

// DELETE
postsRouter.delete('/posts/:id', auth.isAuthenticated, (req, res) => {
  Post.findById(req.params.id, (err, post) => {
  if(req.user._id.equals(post.createdBy._id)) {
      Post.findByIdAndDelete(req.params.id, (err, post) => {
        res.redirect('/dashboard')
      })
    } else {
      res.redirect('/dashboard')
    }
  })
})

// UPDATE
postsRouter.put('/posts/:id', auth.isAuthenticated, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    const post = user.posts.id(req.params.id)
    note.overwrite(req.body)
    user.save((err) => {
      res.redirect('/dashboard')
    })
  })
})

// CREATE/POST
postsRouter.post('/posts', auth.isAuthenticated, (req, res) => {
  req.body.createdBy = req.user._id
  Post.create(req.body, (err, post) => {
    res.redirect('/dashboard')
  })
})

// EDIT
postsRouter.get('posts/:id/edit', auth.isAuthenticated, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    const post = user.posts.id(req.params.id)
    res.render('posts/edit', { post })
  })
})


// SHOW
postsRouter.get('/posts/:id', (req, res) => {
  Post.findById(req.params.id).populate('createdBy').exec((err, post) => {
    res.render('posts/show', { post })
  })
}) 


module.exports = postsRouter