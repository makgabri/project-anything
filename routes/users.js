/*jslint node: true */
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
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Creates a local user account. 
 * 
 * @apiParam {String}   username      Username of the local user created
 * @apiParam {String}   password      Password for the account
 * @apiParam {String}   familyName    Family Name of user
 * @apiParam {String}   givenName     Given Name of user
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X POST -d '{"familyName":"Foo","givenName":"Bar","username":"Foobar","password":"123"}' https://https://project-anything.herokuapp.com/signup/
 *
 * @apiSuccess {String}   username      Username of the local user created
 * @apiSuccess {String}   familyName    Family Name of user
 * @apiSuccess {String}   givenName     Given Name of user
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "Foobar",
 *       "familyName": "Foo",
 *       "givenName": "Bar"
 *     }
 *
 * @apiError (400) FamilyNameNotFound familyName must exist
 * @apiError (400) FamilyNameInvalid family name must be alphanumeric
 * @apiError (400) GivenNameNotFound givenName must exist
 * @apiError (400) GivenNameInvalid given name must be alphanumeric
 * @apiError (400) UsernameNotFound Username must exist
 * @apiError (400) UsernameInvalid Username must be alphanumeric
 * @apiError (409) UsernameExists username Foobar already exists
 * @apiError (400) PasswordNotFound Password must exist
 * @apiError (400) PasswordInvalid Password must be 8 characters, 1 upercase letter, 1 lowercase and 1 number
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
                };
                return res.status(200).json(user_data);
            });
        });
    });
};

/**
 * @api {post} /signin/ Sign in as a local user
 * @apiVersion 1.0.0
 * @apiName sign_in_local
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Signs in as a local user and returns the cookie. If using a web browser, cookie will be saved to browser. Otherwise please save the cookie and send it back when requesting for 'user' level requests.
 *
 * @apiParam {String}   username      Username of the local user created
 * @apiParam {String}   password      Password for the account
 * 
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X POST -d '{"username":"Foobar","password":"123"}' -c cookie.txt  https://https://project-anything.herokuapp.com/signin/
 *
 * @apiSuccess {String} success successfully logged in
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "success"
 *
 * @apiError (400) UsernameNotFound Username must exist
 * @apiError (400) UsernameInvalid Username must be alphanumeric
 * @apiError (400) PasswordNotFound Password must exist
 * @apiError (401) InvalidCredentials Incorrect username or password
 * @apiError (400) PasswordInvalid Password must be 8 characters, 1 upercase letter, 1 lowercase and 1 number
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     "Incorrect username or password"
 */
// Method removed here. Work needs to be done when passport and app are alive -> transferred to routes.js



/**
 * @api {get} /auth/google/ Sign in via google
 * @apiVersion 1.0.0
 * @apiName sign_in_google
 * @apiGroup User
 * @apiPermission public
 *
 * @apiDescription Signs in as a google user. In order to properly utilize this, you will need to log in through the homepage of the web application. Google log in cannot be done by console because they have a user interface that guides you through logging into google. Upon curling, you will recieve a re-direct url along with cookies that need to be used for google to confirm communication.
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET https://https://project-anything.herokuapp.com/auth/google/
 *
 * @apiSuccess {String} success redirect to homepage.html
 * 
 */
exports.sign_in_google = function(req, res, next) {
    req.session.save(function(err) {
        if (err) return res.status(500).end(err);
        res.redirect('/homepage.html');
    });
};

/**
 * @api {get} /signout/ Sign out of current account
 * @apiVersion 1.0.0
 * @apiName sign_out
 * @apiGroup User
 * @apiPermission user authenticated
 *
 * @apiDescription Signs out of any logged in user. This means that if you were signed in through local or google, you will sign out of the current session. Provide the cookie and it will be destroyed.
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt -c cookie.txt https://https://project-anything.herokuapp.com/signout/
 *
 * @apiSuccess {String} success succesfully logged out
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "succesfully logged out"
 *
 * @apiError (401) NotSignedIn You are not logged in
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Unauthorized
 *     "Incorrect username or password"
 */
exports.sign_out = function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.status(200).json("succesfully logged out");
};


/**
 * @api {get} /user_name/ Gets full name of user
 * @apiVersion 1.0.0
 * @apiName get_user_name
 * @apiGroup User
 * @apiPermission user authenticated
 *
 * @apiDescription Retrieves the full name of the currently logged in user. This is specified at register and if you signed in through google, this retrieves your family and given name from your google account.
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/user_name/
 *
 * @apiSuccess {String} givenName Given name of user
 * @apiSuccess {String} familyName Family name of user
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "familyName": "Foo",
 *       "givenName": "Bar"
 *     }
 */
exports.get_user_name = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(200).json('');
    User.findOne({key : req.session.passport.user}, function(err, user) {
        if (err) return res.status(500).json("Database error");
        if (!user) return res.status(500).json("Database could not find user with key: " + req.session.passport.user);
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
    });
};
