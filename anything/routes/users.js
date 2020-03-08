'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const crypto = require('crypto');

// Sign up for local
exports.sign_up = function(req, res, next) {
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
                name: req.body.name,
                salt: salt,
                hashed_password: saltedHash,
                password: req.body.password
            }), function(err, new_local_user) {
                if (err) return res.status(500).end(err);
                return res.status(200).json("user " + username + " signed up");
            }
        });
    });
};

// Sign in success
exports.sign_in = function(req, res, next) {
    res.redirect('/');
}

// Sign out for all
exports.sign_out = function(req, res, next) {
    req.logout();
    res.redirect('/');
};
