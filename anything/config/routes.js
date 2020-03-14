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
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/failed'}), users.set_cookie,
    function(req, res) {
        req.session.save(function(err) {
            if (err) console.log(err);
            res.status(200).json('success');
        })
    });

    /**     Read     **/
    // Google authentication
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}), users.set_cookie,
    function(req, res) {
        req.session.save(function(err) {
            if (err) console.log(err);
            res.redirect('/homepage.html');
        })
    });
    app.get('/user_key/', users.get_user_key);
    app.get('/user_firstName/', users.get_user_givenName);
    app.get('/user_lastName/', users.get_user_familyName);
    // Signout for all passport
    app.get('/signout/', users.sign_out);
    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    /**     CRUD for workshop     **/
};
