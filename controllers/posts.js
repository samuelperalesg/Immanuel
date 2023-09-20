const express = require('express')
const postsRouter = express.Router()
const auth = require('../middleware/auth')
const Post = require('../models/post')
const User = require('../models/user')

// READ
postsRouter.get('/posts/new', auth.isAuthenticated, (req, res) => {
  res.render('posts/new')
})

// DELETE
postsRouter.delete('/posts/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (req.user._id.equals(post.createdBy._id)) {
      await Post.findByIdAndDelete(req.params.id);
    }
    
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send(err);
  }
});


// UPDATE
postsRouter.post('/posts/:id', async (req, res) => {
  try {
    // Find the post by its _id
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Update the post with new data
    post.title = req.body.title;
    post.link = req.body.link;
    post.scripture = req.body.scripture;
    post.description = req.body.description;

    await post.save();

    // Redirect to some page, like a dashboard or the edited post
    res.redirect('/posts/' + post._id);
  } catch (err) {
    console.error('An error occurred:', err);
    res.status(500).send(err);
  }
});


// CREATE/POST
postsRouter.post('/posts', async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const post = await Post.create(req.body);
    res.redirect('/dashboard');
  } catch(err) {
    res.status(500).send(err);
  }
});


// EDIT
postsRouter.get('/posts/:id/edit', auth.isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post });
  } catch (err) {
    res.status(500).send(err);
  }
});



// SHOW
postsRouter.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy').exec();
    res.render('posts/show', { post });
  } catch(err) {
    res.status(500).send(err);
  }
});



module.exports = postsRouter