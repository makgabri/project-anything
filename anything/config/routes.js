'use strict';

/**     Required Node Libraries     **/

const users = require('../routes/users');
const auth = require('../routes/authentication');

/**     Properly assign CRUD calls      **/

module.exports = function(app, passport) {

    /**     CRUD for users     **/
    /**     Create     **/
    // Creating users and signing in
    app.post('/signup/', users.sign_up_local);
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/'}), users.sign_in_local);

    /**     Read     **/
    // Google authentication
    app.get('/auth/google/', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            , 'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}));
    app.get( '/auth/google/callback/',  function(req, res, next) {
        passport.authenticate('google', function(err, user, info) {
          if (err) return next(err);
          if (!user) return res.redirect('/login_failed');
          req.logIn(user, function(err) {
            if (err) return next(err);
            console.log(req.user);
            return res.redirect('/');
          });
        })(req, res, next);
        });
    // Signout for all passport
    app.get('/signout/', users.sign_out);
    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    /**     CRUD for workshop     **/
};
