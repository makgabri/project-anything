'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const Google = mongoose.model('google_users');
const crypto = require('crypto');
const cookie = require('cookie');



/*  ******* Data types *******
        USER:
            - (ObjectId) _id
            - (String) key[References username or googleid]
            - (String) provider[local, google]
    
        LOCAL:
            - (ObjectId) _id
            - (String) username
            - (String) familyName
            - (String) givenName
            - (String) salt
            - (String) hashed_password
    
        GOOGLE:
            - (ObjectId) _id
            - (String) googleid
            - (String) familyName
            - (String) givenName
    ****************************** */ 


/**
 * @api {post} /signup/ Create a local user
 * @apiVersion 1.0.0
 * @apiName sign_up_local
 * @apiPermission public
 *
 * @apiDescription Creates a local user account. 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X POST -d '{"familyName":"Foo","givenName":"Bar","username":"Foobar","password":"123"}' https://localhost:3000/signup/
 *
 * @apiSuccess {String}   username      username of the local user created
 * @apiSuccess {String}   familyName    Family Name of user
 * @apiSuccess {String}   givenName     Given Name of user
 *
 * @apiError FamilyNameNotFound familyName must exist
 * @apiError FamilyNameInvalid family name must be alphanumeric
 * @apiError GivenNameNotFound givenName must exist
 * @apiError GivenNameInvalid given name must be alphanumeric
 * @apiError UsernameNotFound Username must exist
 * @apiError UsernameInvalid Username must be alphanumeric
 * @apiError UsernameExist username Foobar already exists
 * @apiError PasswordNotFound Password must exist
 * @apiError PasswordInvalid Password must contain only alphanumeric and certain special characters
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "familyName must exist"
 */
exports.sign_up_local = function(req, res, next) {
    var username = req.body.username;
    // Check if username exists
    User.findOne({ key: username }, function(err, user){
        if (err) return res.status(500).end(err);
        if (user) return res.status(409).end("username " + username + " already exists");

        // Generate random salt, and hash the salt and password
        var salt = crypto.randomBytes(16).toString('base64');
        var hash = crypto.createHmac('sha512', salt);
        hash.update(req.body.password);
        var saltedHash = hash.digest('base64');

        // Insert new user infomration into database
        User.create({key: username, provider: 'local'}, function(err, new_user) {
            if (err) return res.status(500).end(err);
            Local.create({
                username: username,
                familyName: req.body.familyName,
                givenName: req.body.givenName,
                salt: salt,
                hashed_password: saltedHash,
                password: req.body.password
            }).then(function(new_local_user) {
                let user_data = {
                    'username': new_local_user.username,
                    'familyName': new_local_user.familyName,
                    'givenName': new_local_user.givenName
                }
                return res.status(200).json(user_data);
            });
        });
    });
};

/**
 * Sign in to local account
 * 
 * Authentication has already successed here. Ensure session is saved
 * and return succeess message.
 * 
 * Errors include:
 *      1. (500) - Serverside Error
 * 
 */
exports.sign_in_local = function(req, res, next) {
    req.session.save(function(err) {
        if (err) return res.status(500).end(err);
        return res.status(200).json('success');
    })
}

/**
 * Sign in to google account
 * 
 * Authentication has already successed here. Ensure session is saved
 * and return succeess message.
 * 
 * Errors include:
 *      1. (500) - Serverside Error
 * 
 */
exports.sign_in_google = function(req, res, next) {
    req.session.save(function(err) {
        if (err) return res.status(500).end(err);
        res.redirect('/homepage.html');
    })
}

/**
 * Sign out of all accounts
 * 
 * Signs out of current account and destroys session
 * 
 * Errors include:
 *      2. (400) - Not signed in at all so cannot signout
 * 
 */
exports.sign_out = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(400).end("You are not signed in");
    req.logout();
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('key', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
};

/**
 * Get current user's key
 * 
 * Get session's key
 * 
 */
exports.get_user_key = function(req, res, next) {
    return res.status(200).json(req.session.passport.user);
}

/**
 * Get user's name
 * 
 * Errors include:
 *      1. (500) - Error on inserting comment object into database
 *      2. (400) - User does not exist in database
 * 
 */
exports.get_user_name = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(200).json('');
    User.findOne({key : req.session.passport.user}, function(err, user) {
        if (err) return res.status(500).json("Database error");
        if (!user) return res.status(400).json("Database could not find user with key: " + req.session.passport.user);
        if (user.provider == "google") {
            // Look at google db
            Google.findOne({googleId : user.key}, function(err, google_user) {
                if (err) return res.status(500).json("Database error");
                if (!google_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json({
                    givenName: google_user.givenName,
                    familyName: google_user.familyName
                });
            });
        }
        if (user.provider == "local") {
            // Look at local db
            Local.findOne({username : user.key}, function(err, local_user) {
                if (err) return res.status(500).json("Database error");
                if (!local_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json({
                    givenName: local_user.givenName,
                    familyName: local_user.familyName
                });
            });
        }
    })
}
