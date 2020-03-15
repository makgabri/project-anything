'use strict';

/**     Required Node Libraries     **/

const users = require('../routes/users');
const workstation = require('../routes/workstation');
const auth = require('../routes/authentication');
//const workstation = require('../routes/workstation2');


/**     Properly assign CRUD calls      **/

module.exports = function(app, passport) {

    /**     CRUD for users     **/
    /**     Create     **/
    // Creating users and signing in
    app.post('/signup/', users.sign_up_local);
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"username":"1","password":"1"}' -c cookie.txt https://localhost:3000/signin/
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_local);

    /**     Read     **/
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_google);
    app.get('/signout/', users.sign_out);
    app.get('/user_key/', users.get_user_key);
    app.get('/user_firstName/', users.get_user_givenName);
    app.get('/user_lastName/', users.get_user_familyName);

    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    /**     CRUD for workstation     **/
    
    /** Projects */
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"projectId":"1","title":"1","author":"1","date":"2020-01-01"}' -b cookie.txt https://localhost:3000/api/projects/
    app.post('/api/projects/', workstation.add_project);
    app.get('/api/projects/:projectId', workstation.get_project);
    app.delete('/api/projects/:projectId', workstation.delete_project);

    /** Tracks */
    app.post('/api/tracks/', workstation.add_track);
    app.get('/api/tracks/project/:projectId', workstation.get_track);
    app.delete('/api/tracks/:trackId', workstation.delete_track);
    app.delete('/api/tracks/project/:projectId', workstation.delete_all_tracks);

};
