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
    res.status(200).json({ message: 'Card deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});



// UPDATE
cardsRouter.post('/cards/:id', async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assuming req.user._id is available
    const card = user.cards.id(req.params.id); // Find card by id within user's cards
    
    if (!card) {
      return res.status(404).send('Card not found');
    }

    // Update the card
    card.title = req.body.title;
    card.link = req.body.link;
    card.scripture = req.body.scripture;
    card.description = req.body.description;

    // Save the user along with the updated card
    await user.save();

    // Redirect, e.g., to a dashboard or the card details page
    res.redirect('/cards/' + card._id);
  } catch (err) {
    console.error('An error occurred:', err);
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