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
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/failed', successRedirect: '/success'}));

    /**     Read     **/
    // Google authentication
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}), 
    function(req, res) {
        req.session.save(function(err) {
            console.log(req._passport);
            if (err) console.log(err);
            res.redirect('/');
        })
    });
    // app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}),
    // function(req, res) {
    //     console.log(req.session);
    //   // Explicitly save the session before redirecting!
    //   req.session.save(() => {
    //     res.redirect('/');
    //   })
    // });
    // Signout for all passport
    app.get('/signout/', users.sign_out);
    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    /**     CRUD for workshop     **/
};
