const express = require('express')
const indexRouter = express.Router()
const Post = require('../models/post')


indexRouter.get('/', (req, res) => {
  Post.find({}, (err, posts) => {
    res.render('home', { posts })
  })
})

module.exports = indexRouter