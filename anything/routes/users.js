'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
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



exports.get_user_key = function(req, res, next) {
    if (!req.session.passport) return res.status(401).json('You are not logged in');
    return res.status(200).json(req.session.passport.user);
}


exports.set_cookie = function(req, res, next) {
    if (!req.session.passport) return res.status(401).json('You are not logged in');
    res.setHeader('Set-Cookie', cookie.serialize('username', req.session.passport.user, {
        path : '/', 
        maxAge: 60 * 60 * 2     // maxAge is 2 hours, hopefully enough time for TA to mark
    }));
    next();
};



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
