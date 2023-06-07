const express = require('express')
const cardsRouter = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')


// DELETE
cardsRouter.delete('/cards/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cards.pull(req.params.id);
    await user.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send(err);
  }
});


// UPDATE
cardsRouter.put('/cards/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const card = user.cards.id(req.params.id);
    card.overwrite(req.body);
    await user.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send(err);
  }
});


// EDIT
cardsRouter.get('/:id/edit', auth.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const card = user.cards.id(req.params.id);
    res.render('../views/cards/edit', { card });
  } catch(err) {
    res.status(500).send(err);
  }
});


// SHOW
cardsRouter.get('/cards/:id', auth.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const card = user.cards.id(req.params.id);
    res.render('cards/show', { card });
  } catch (err) {
    res.status(500).send(err);
  }
});



module.exports = cardsRouter