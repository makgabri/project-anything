'use strict';

/**     Required Node Libraries     **/
const multer = require("multer");

const users = require('../routes/users');
const audio = require('../routes/audio');
const auth = require('../routes/authentication');
const gridFsStorage = require('./gridfs');

let track_upload = null;


/**     Properly assign CRUD calls      **/

module.exports = function(app, passport) {

    /**     CRUD for users     **/
    /**     Create     **/
    // Creating users and signing in
    // curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"familyName":"Ben","givenName":"10","username":"1","password":"1"}' https://localhost:3000/signup/
    app.post('/signup/', users.sign_up_local);
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"username":"1","password":"1"}' -c cookie.txt https://localhost:3000/signin/
    app.post('/signin/', passport.authenticate('local', {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_local);

    /**     Read     **/
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/failed'}), users.set_cookie, users.sign_in_google);
    // curl --verbose -k -H "Content-Type: application/json" -X GET -d '{"username":"1","password":"1"}' -c cookie.txt https://localhost:3000/signout/
    app.get('/signout/', users.sign_out);
    app.get('/user_key/', auth.isLoggedIn, users.get_user_key);
    // curl --verbose -k -H "Content-Type: application/json" -X GET -b cookie.txt https://localhost:3000/user_name/
    app.get('/user_name/', users.get_user_name);


    /**     CRUD for audio     **/
    gridFsStorage.on('connection', function(db) {
        console.log("GridFS connection successful");
        track_upload = multer({ storage: gridFsStorage });
        app.post('/upload_track/', auth.isLoggedIn, track_upload.single('track'), audio.upload_audio_track);
    })
    app.get('/get_track_file/', auth.isLoggedIn, audio.get_track_file);
    app.get('/get_track_list/', auth.isLoggedIn, audio.get_track_list);
    app.delete('/delete_track/', auth.isLoggedIn, audio.delete_track);



    /**     CRUD for workshop     **/
    //  curl --verbose -k -H "Content-Type: application/json" -X POST -d '{"projectId":"1","title":"1","author":"1","date":"2020-01-01"}' -b cookie.txt https://localhost:3000/add_project/
    app.post('/add_project/', auth.isLoggedIn, audio.add_project);
    app.get('/get_project_list/', auth.isLoggedIn, audio.user_project_list);
    // curl --verbose -k -H "Content-Type: application/json" -X DELETE -d '{"projectId":"1"}' -b cookie.txt https://localhost:3000/delete_project/
    app.get('/get_project/', auth.isLoggedIn, audio.get_project);
    app.delete('/delete_project/', auth.isLoggedIn, audio.delete_project);
};
