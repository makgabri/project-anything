'use strict';

/**     Required Node Libraries     **/

const users = require('../routes/users');
const auth = require('../routes/authentication');

/**     Properly assign CRUD calls      **/

module.exports = function(app, passport) {

    /**     CRUD for users     **/
    /**     Create     **/
    // Creating users and signing in
    app.post('/signup/', users.sign_up);
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/'}), users.sign_in);

    /**     Read     **/
    // Google authentication
    app.get('/auth/google/', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/plus.login',
            , 'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}));
    app.get( '/auth/google/callback/',  passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
        }
    ));
    // Signout for all passport
    app.get('/signout/', users.sign_out);
    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    /**     CRUD for workshop     **/
};
