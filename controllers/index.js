const express = require('express')
const indexRouter = express.Router()
const Post = require('../models/post')


indexRouter.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { posts });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = indexRouter