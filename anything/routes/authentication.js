'use strict'

const { check, validationResult } = require('express-validator');

exports.isLoggedIn = function(req, res, next) {
    // Check if authenticated by google login
    if (req.isAuthenticated()) return next();
    // Redirect to login page or prevent access
    return res.redirect('/');
}

exports.validate = function validate(method) {
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
                check('projectId').exists().withMessage('projectId must exist'),
                check('projectId').isAlphanumeric().withMessage('projectId must be alphanumeric'),
                check('title').exists().withMessage('title must exist'),
                check('title').isAlphanumeric().withMessage('title must be alphanumeric'),
                check('author').exists().withMessage('author must exist'),
                check('author').isAlphanumeric().withMessage('author must be alphanumeric'),
                check('date').exists().withMessage('date must exist'),
                check('date').isAlphanumeric().withMessage('date must be alphanumeric')
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
                check('trackId').exists().withMessage('trackId must exist'),
                check('trackId').isAlphanumeric().withMessage('trackId must be alphanumeric'),
                check('src').exists().withMessage('src must exist'),
                check('src').isAlphanumeric().withMessage('src must be alphanumeric'),
                check('name').exists().withMessage('name must exist'),
                check('name').isAlphanumeric().withMessage('name must be alphanumeric'),
            ]
        }
        
        // Validating get track
        case 'get_project': {
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