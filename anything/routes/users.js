'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const crypto = require('crypto');



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
                name: req.body.name,
                salt: salt,
                hashed_password: saltedHash,
                password: req.body.password
            }).then(function(new_local_user) {
                return res.status(200).json("user " + username + " signed up");
            });
        });
    });
};

// Sign in for local
exports.sign_in_local = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/fail');
        req.session.key = user.key;
        res.setHeader('Set-Cookie', cookie.serialize('key', user.key, {
            path : '/', 
            maxAge: 60 * 60 * 2     // maxAge is 2 hours
        }));
        res.redirect('/');
    });
};

// Sign in for google
exports.sign_in_google = function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/fail');
        req.session.key = user.key;
        res.setHeader('Set-Cookie', cookie.serialize('key', user.key, {
            path : '/', 
            maxAge: 60 * 60 * 2     // maxAge is 2 hours
        }));
        res.redirect('/');
    });
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
