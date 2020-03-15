'use strict';

/**     Required Node Libraries     **/

const users = require('../routes/users');
const audio = require('../routes/audio');
const auth = require('../routes/authentication');
//const workstation = require('../routes/workstation2');


/**     Properly assign CRUD calls      **/

module.exports = function(app, passport, gfs, track_upload) {

    /**     CRUD for users     **/
    /**     Create     **/
    // Creating users and signing in
    app.post('/signup/', users.sign_up_local);
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"username":"1","password":"1"}' -c cookie.txt https://localhost:3000/signin/
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_local);

    /**     Read     **/
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_google);
    // curl --verbose -k -H "Content-Type: application/json" -X GET -d '{"username":"1","password":"1"}' -c cookie.txt https://localhost:3000/signout/
    app.get('/signout/', users.sign_out);
    app.get('/user_key/', users.get_user_key);
    app.get('/user_firstName/', users.get_user_givenName);
    app.get('/user_lastName/', users.get_user_familyName);

    /**     Update     **/
    /**     Delete     **/


    /**     CRUD for audio     **/
    app.post('/upload_track/', track_upload.single('track'), audio.upload_audio_track);
    app.get('/get_track_file/', audio.get_track_file(gfs));
    app.post('/add_track/', audio.add_track);
    app.get('/get_track/', audio.get_track);
    app.delete('/delete_track/', audio.delete_track);

    /**     CRUD for workshop     **/
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"projectId":"1","title":"1","author":"1","date":"2020-01-01"}' -b cookie.txt https://localhost:3000/add_project/
    app.post('/add_project/', audio.add_project);
    // curl --verbose -k -H "Content-Type: application/json" -X DELETE -d '{"projectId":"1"}' -b cookie.txt https://localhost:3000/delete_project/
    app.get('/get_project/', audio.get_project);
    app.delete('/delete_project/', audio.delete_project);
};
