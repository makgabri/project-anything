'use strict'

module.exports = function isLoggedIn(req, res, next) {
    // Check if authenticated by google login
    if (req.isAuthenticated()) return next();
    // Redirect to login page or prevent access
    res.redirect('/login');
}

module.exports = function validate(req, res,next) {
    // TODO: Validation as per lab7
}