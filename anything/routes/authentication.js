'use strict'

module.exports = function isLoggedIn(req, res, next) {
    // Check if authenticated by google login
    if (req.isAuthenticated()) return next();
    // Redirect to login page or prevent access
    res.redirect('/');
}

module.exports = function validate(req, res,next) {
    switch(method) {
        // Validating signup
        case 'signup': {
            return [
                check('familyName').exists().withMessage("familyName must exist"),
                check('familyName').isAlphanumeric().withMessage('family name must be alphanumeric'),
                check('givenName').exists().withMessage("givenName must exist"),
                check('givenName').isAlphanumeric().withMessage('given name must be alphanumeric'),
                check('username').exists().withMessage('Username must exist'),
                check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
                check('password').exists().withMessage('Password must exist'),
                check('password').matches(/^[a-zA-Z0-9!@#$%^&*()=_+,.?]*$/).withMessage("Password must contain only alphanumeric and certain special characters")
            ]
        }

        // Validating signin
        case 'signin': {
            return [
                check('username').exists().withMessage('Username must exist'),
                check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),
                check('password').exists().withMessage('Password must exist'),
                check('password').matches(/^[a-zA-Z0-9!@#$%^&*()=_+,.?]*$/).withMessage("Password must contain only alphanumeric and certain special characters")
            ]
        }

        // Validating post message
        case 'postMessage': {
            return [
                check('content').escape()
            ]
        }

        // Validating patch upvote/downvote
        case 'patch': {
            return [
                check('id').isAlphanumeric().withMessage('id must be alphanumeric'),
                check('action').isAlphanumeric().withMessage('action must be alphanumeric')
            ]
        }

        // Validating delete message
        case 'delete': {
            return [
                check('id').isAlphanumeric().withMessage('id must be alphanumeric'),
            ]
        }
    }
}