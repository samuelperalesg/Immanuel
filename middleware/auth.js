const User = require('../models/user')

async function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  } else {
    return next();
  }
}

async function handleLoggedInUser(req, res, next) {
  if (!req.session.user) {
    res.locals.user = null;
    return next();
  }

  try {
    const user = await User.findById(req.session.user);
    req.user = user;
    delete req.user.password;
    res.locals.user = req.user;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
}


module.exports = {
  isAuthenticated,
  handleLoggedInUser
}