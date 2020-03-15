'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const Google = mongoose.model('google_users');
const crypto = require('crypto');
const cookie = require('cookie');



// Sign up for local
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
                return res.status(200).json("user " + username + " signed up");
            });
        });
    });
};

// Success sign in for local
exports.sign_in_local = function(req, res, next) {
    req.session.save(function(err) {
        if (err) console.log(err);
        res.status(200).json('success');
    })
}

// Success sign in for google
exports.sign_in_google = function(req, res, next) {
    req.session.save(function(err) {
        if (err) console.log(err);
        res.redirect('/homepage.html');
    })
}

// Sign out for all
exports.sign_out = function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('key', '', {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
};

// Sets cookie so we have a user reference
// Note: Consider the actual uses of this might not be much since everything can be collected
//       from a user's session
exports.set_cookie = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json('You are not logged in');
    res.setHeader('Set-Cookie', cookie.serialize('username', req.session.passport.user, {
        path : '/', 
        maxAge: 60 * 60 * 2     // maxAge is 2 hours, hopefully enough time for TA to mark
    }));
    next();
};

// Gets current session key
exports.get_user_key = function(req, res, next) {
    if (!req.session.passport) return res.status(401).json('You are not logged in');
    return res.status(200).json(req.session.passport.user);
}

// Get current session's user's first name
exports.get_user_givenName = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json('You are not logged in');
    User.findOne({key : req.session.passport.user}, function(err, user) {
        if (err) return res.status(500).json("Database error");
        if (!user) return res.status(500).json("Database could not find user with key: " + req.session.passport.user);
        if (user.provider == "google") {
            // Look at google db
            Google.findOne({googleId : user.key}, function(err, google_user) {
                if (err) return res.status(500).json("Database error");
                if (!google_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json(google_user.givenName);
            });
        }
        if (user.provider == "local") {
            // Look at local db
            Local.findOne({username : user.key}, function(err, local_user) {
                if (err) return res.status(500).json("Database error");
                if (!local_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json(local_user.givenName);
            });
        }
    })
}

// Get current session's user's last name
exports.get_user_familyName = function(req, res, next) {
    if (!req.isAuthenticated()) return res.status(401).json('You are not logged in');
    User.findOne({key : req.session.passport.user}, function(err, user) {
        if (err) return res.status(500).json("Database error");
        if (!user) return res.status(500).json("Database could not find user with key: " + req.session.passport.user);
        if (user.provider == "google") {
            // Look at google db
            Google.findOne({googleId : user.key}, function(err, google_user) {
                if (err) return res.status(500).json("Database error");
                if (!google_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json(google_user.givenName);
            });
        }
        if (user.provider == "local") {
            // Look at local db
            Local.findOne({username : user.key}, function(err, local_user) {
                if (err) return res.status(500).json("Database error");
                if (!local_user) res.status(500).json("Database not properly synced. Contact admin.");
                return res.status(200).json(local_user.familyName);
            });
        }
    })
}