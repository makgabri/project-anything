'use strict'

const { check, validationResult } = require('express-validator');

exports.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) return next();
    // Redirect to login page or prevent access
    return res.status(401).json('You are not logged in');
}

exports.validate_errors = function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].msg);
    next();
}

exports.validate = function(method) {
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

        // Validating add project
        case 'add_project': {
            return [
                check('title').exists().withMessage('title must exist'),
                check('title').isAlphanumeric().withMessage('title must be alphanumeric')
            ]
        }

        // Validating get project
        case 'get_project': {
            return [
                check('projectId').exists().withMessage('projectId must exist'),
                check('projectId').isAlphanumeric().withMessage('projectId must be alphanumeric')
            ]
        }

        // Validating delete project
        case 'delete_project': {
            return [
                check('projectId').exists().withMessage('projectId must exist'),
                check('projectId').isAlphanumeric().withMessage('projectId must be alphanumeric')
            ]
        }

        // Validating add_track
        case 'add_track': {
            return [
                check('projectId').exists().withMessage('projectId must exist'),
                check('projectId').isAlphanumeric().withMessage('projectId must be alphanumeric'),
                check('name').exists().withMessage('name must exist'),
                check('name').escape()
            ]
        }
        
        // Validating get track
        case 'get_track': {
            return [
                check('trackId').exists().withMessage('trackId must exist'),
                check('trackId').isAlphanumeric().withMessage('trackId must be alphanumeric')
            ]
        }

        // Validating delete track
        case 'delete_track': {
            return [
                check('trackId').exists().withMessage('trackId must exist'),
                check('trackId').isAlphanumeric().withMessage('trackId must be alphanumeric')
            ]
        }
    }
}