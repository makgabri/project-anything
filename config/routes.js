'use strict';

/**     Required Node Libraries     **/
const multer = require("multer");

const users = require('../routes/users');
const project = require('../routes/project');
const track = require('../routes/track');
const public_project = require('../routes/public_project');
const auth = require('../routes/authentication');
const trackGFS = require('./gridfs').trackGFS;
const pubProjGFS = require('./gridfs').pubProjGFS;

let track_upload = null;
let pubProj_upload = null;



module.exports = function(app, passport) {

    /** CRUD for Users **/
    app.post('/signup/', auth.validate('signup'), auth.validate_errors, users.sign_up_local);
    app.post('/signin/', auth.validate('signin'), auth.validate_errors, function(req,res,next) {
        passport.authenticate('local', function(err, user, info) {
            if (info) return res.status(401).end(info.message);
            req.login(user, function(err) {
                if (err) return res.status(500).end(err);
                return res.status(200).json('success');
            });
        })(req,res,next)});
    app.get('/auth/google/', passport.authenticate('google', { scope: ['profile']}));
    app.get('/auth/google/callback/', passport.authenticate('google',   {failureRedirect: '/'}), users.sign_in_google);
    app.get('/signout/', auth.isLoggedIn, users.sign_out);
    app.get('/user_name/', users.get_user_name);


    /** CRUD for Tracks **/
    trackGFS.on('connection', function(db) {
        console.log("GridFS track connection successful");
        track_upload = multer({ storage: trackGFS });
        app.post('/upload_track/', auth.isLoggedIn, track_upload.single('track'), auth.validate('add_track'), auth.validate_errors, track.upload_audio_track);
    });
    app.get('/track/:trackId/file/', auth.isLoggedIn, auth.validate('get_track'), auth.validate_errors, track.get_track);
    app.get('/track/:trackId/info/', auth.isLoggedIn, auth.validate('get_track'), auth.validate_errors, track.track_info);
    app.delete('/track/:trackId/', auth.isLoggedIn, auth.validate('delete_track'), auth.validate_errors, track.delete_track);
    app.patch('/track/:trackId/', auth.isLoggedIn, auth.validate('update_track'), auth.validate_errors, track.update_track_option);



    /** CRUD for Workshop **/
    app.post('/add_project/', auth.isLoggedIn, auth.validate('add_project'), auth.validate_errors, project.add_project);
    app.get('/project/user/', auth.isLoggedIn, project.user_project_list);
    app.get('/project/:projectId/', auth.isLoggedIn, auth.validate('get_project'), auth.validate_errors, project.get_project);
    app.patch('/project/:projectId/title/', auth.isLoggedIn, auth.validate('new_title_project'), auth.validate_errors, project.new_project_title);
    app.get('/project/:projectId/tracks/',auth.isLoggedIn, auth.validate('get_project'), project.project_track_list);
    app.delete('/project/:projectId/', auth.isLoggedIn, auth.validate('delete_project'), auth.validate_errors, project.delete_project);
    


    /** CRUD for Public Projects **/
    pubProjGFS.on('connection', function(db) {
        console.log("GridFS public project connection successful");
        pubProj_upload = multer({ storage: pubProjGFS });
        app.post('/project/:projectId/file/', auth.isLoggedIn, auth.validate('upload_public_project'), auth.validate_errors,
            public_project.prep_upload_public_project, pubProj_upload.single('pubProj'), public_project.upload_public_project);
    });
    app.get('/public_project/', auth.isLoggedIn, auth.validate('public_project_list'), public_project.get_pubProj_list);
    app.get('/public_project/size/', auth.isLoggedIn, public_project.get_pubProj_pageSize);
    app.get('/project/:projectId/file/', auth.isLoggedIn, auth.validate('public_project_file'), auth.validate_errors, public_project.get_pubProj);
    app.delete('/project/:projectId/file/', auth.isLoggedIn, auth.validate('delete_public_project'), auth.validate_errors, public_project.delete_pubProj);
};
