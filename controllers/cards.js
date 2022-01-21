const express = require('express')
const cardsRouter = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')


// DELETE
cardsRouter.delete('/cards/:id', auth.isAuthenticated, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    user.cards.pull(req.params.id)
    user.save((err) => {
      res.redirect('/dashboard')
    })
  })
})

// UPDATE
cardsRouter.put('/cards/:id', auth.isAuthenticated, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    const card = user.cards.id(req.params.id)
    card.overwrite(req.body)
    user.save((err) => {
      res.redirect('/dashboard')
    })
  })
})

// EDIT
cardsRouter.get('/:id/edit', auth.isAuthenticated,(req, res) => {
  User.findById(req.user._id, (err, user) => {
    const card = user.cards.id(req.params.id)
    res.render('../views/cards/edit', { card })
  })
})

// SHOW
cardsRouter.get('/cards/:id', auth.isAuthenticated,(req, res) => {
  User.findById(req.user._id, (err, user) => {
    const card = user.cards.id(req.params.id)
    res.render('cards/show', { card })
  })
})


module.exports = cardsRouter