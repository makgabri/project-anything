'use strict';
/**     Required Node Libraries     **/

const mongoose = require('mongoose');
const Google = mongoose.model('google_users');
const Local = mongoose.model('local_users');
const User = mongoose.model('users');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

const config = require('./config');
  

/**     Loading passport     **/
module.exports = function(passport) {
    // Passport Strategy for local account
    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ key: username }, function (err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);

            Local.findOne({username: username}, function(err, local_user) {
                if (err) return done(err);
                if (!local_user) return done(null, false);
                if (!local_user.verifyPassword(password)) return done(null, false);
                return done(null, local_user);
            });
          });
        }
    ));

    // Passport Strategy for google
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ key: profile.id }, function(err, user) {
                if (err) return done(err);
                if (!user) {
                    User.create({
                        key: profile.id,
                        provider: 'google'
                    }, function (err, new_user) {
                        if (err) return done(err);
                    });
                    Google.create({
                        googleId: profile.id,
                        name: profile.name
                    }), function(err, new_google_user) {
                        if (err) return done(err);
                        return done(null, new_google_user);
                    }
                }
                Google.findOne( {googleId: profile.id }, function(err, google_user) {
                    if (err) return done(err);
                    if (!google_user) return done('Initialization error');
                    return done(null, google_user);
                })
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
      
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
};
