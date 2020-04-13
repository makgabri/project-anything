/*jslint node: true */
'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');



/**
 * @api {delete} /track/:trackId/ Deletes a track
 * @apiVersion 1.0.0
 * @apiName delete_track
 * @apiGroup Track
 * @apiPermission user authenticated
 *
 * @apiDescription Deletes the Track. Removes all tracks files as well.
 * 
 * @apiParam {String} trackId Id of track to delete
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/
 *
 * @apiSuccess {String}     message         Track: xxxxxxxxxx has been deleted          
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Track: xxxxxxxxxx has been deleted"
 *
 * 
 * @apiError (404) TrackNotFound Track: xxxxxxxxxxxx not found
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourTrack TrackId: xxxxxxxxx does not belong to you
 * @apiError (400) TrackIDNotFound trackId must exist
 * @apiError (400) TrackIDNotValid trackId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "TrackId: xxxxxxxxx does not belong to you"
 */
exports.delete_track = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("Track: " + req.params.trackId + " not found");
        if (track.author != req.session.passport.user) return res.status(401).end("TrackId: "+req.params.trackId+" does not belong to you");
        Upload_Chunks.deleteMany({files_id: track._id}, function(err, n) {
            if (err) return res.status(500).end(err);
            Upload_Files.deleteOne({_id: track._id}, function(err, n) {
                if (err) return res.status(500).end(err);
            });
        });
    });
    Track.deleteOne({_id: req.params.trackId}, function(err, n) {
        if (err) return res.status(500).end(err);
        return res.json("Track: " + req.params.trackId + " has been deleted");
    });
};

/**
 * @api {post} /upload_track/ Create a track
 * @apiVersion 1.0.0
 * @apiName upload_audio_track
 * @apiGroup Track
 * @apiPermission public
 *
 * @apiDescription Upload a track for the project. To upload this, you will need to create a form data through curl or use our web app to upload the track into a project.
 * 
 * @apiParam {File}     track           file of the track
 * @apiParam {String}   projectId       Project ID of track to be attatched to
 * @apiParam {String}   name            Name for track
 *
 * @apiExample {curl} Curl example
 * curl -X POST -F "name=Drums" -F "track=@/path/to/picture/drums.mp3" -F "projectId:xxxx" -b cookie.txt https://https://project-anything.herokuapp.com/upload_track/
 *
 * @apiSuccess {String}   _id               ID of track
 * @apiSuccess {String}   projectId         ID of project for track
 * @apiSuccess {String}   author            User that uploaded the track
 * @apiSuccess {String}   name              Name of track
 * @apiSuccess {String}   gain              Volume of track in project
 * @apiSuccess {String}   muted             Mute status of track in project
 * @apiSuccess {String}   soloed            Solo status of track in project
 * @apiSuccess {String}   start             Start time of track in project
 * @apiSuccess {String}   fadeIn_shape      Fade in shape of track in project
 * @apiSuccess {String}   fadeIn_duration   Fade in duration of track in project
 * @apiSuccess {String}   fadeOut_shape     Fade out shape of track in project
 * @apiSuccess {String}   fadeOut_duration  Fade out duration of track in project
 * @apiSuccess {String}   cuein             Start time of track in track
 * @apiSuccess {String}   cueout            End time of track in track
 * @apiSuccess {String}   waveOutLineColor  Color of track wave in project
 * @apiSuccess {String}   stereoPan         StereoPan of track in project
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "_id": "yyyyyyyy",
 *          "projectId": "xxxxxxx",
 *          "author": "Foobar",
 *          "name": "Track1",
 *          "gain": 1,
 *          ...
 *          "stereoPan": 0.5
 *      }
 *
 * @apiError (400) ProjectIDNotFound Project ID must exist
 * @apiError (400) ProjectIDInvalid Project ID must be alphanumeric
 * @apiError (400) NameNotFound Name must exist
 * @apiError (400) NameInvalid Name must be alphanumeric
 * @apiError (404) ProjectNotFound Project: xxxxxxxxxxxx does not exist
 * @apiError (404) NotYourProject You are not the owner of this project
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Bad Request
 *     "You are not the owner of this project"
 */
exports.upload_audio_track = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("Project: " + req.body.projectId + " does not exist");
        if (project.author != req.session.passport.user) {
            Upload_Chunks.deleteMany({files_id: req.file.id}, function(err, n) {
                if (err) return res.status(500).end(err);
                Upload_Files.deleteOne({_id: req.file.id}, function(err, n) {
                    if (err) return res.status(500).end(err);
                    return res.status(401).end("You are not the owner of this project");
                });
            });
        }
        Track.create({
            _id: req.file.id,
            projectId: req.body.projectId,
            author: req.session.passport.user,
            name: req.body.name
        }, function (err, new_track) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(new_track);
        });
    });
};

/**
 * @api {get} /track/:trackId/info/ Get the track object
 * @apiVersion 1.0.0
 * @apiName track_info
 * @apiGroup Track
 * @apiPermission user authenticated
 *
 * @apiDescription Gets the track details including all the settings and name.
 * 
 * @apiParam {String} trackId Id of track 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/info/
 *
 * @apiSuccess {String}   _id               ID of track
 * @apiSuccess {String}   projectId         ID of project for track
 * @apiSuccess {String}   author            User that uploaded the track
 * @apiSuccess {String}   name              Name of track
 * @apiSuccess {String}   gain              Volume of track in project
 * @apiSuccess {String}   muted             Mute status of track in project
 * @apiSuccess {String}   soloed            Solo status of track in project
 * @apiSuccess {String}   start             Start time of track in project
 * @apiSuccess {String}   fadeIn_shape      Fade in shape of track in project
 * @apiSuccess {String}   fadeIn_duration   Fade in duration of track in project
 * @apiSuccess {String}   fadeOut_shape     Fade out shape of track in project
 * @apiSuccess {String}   fadeOut_duration  Fade out duration of track in project
 * @apiSuccess {String}   cuein             Start time of track in track
 * @apiSuccess {String}   cueout            End time of track in track
 * @apiSuccess {String}   waveOutLineColor  Color of track wave in project
 * @apiSuccess {String}   stereoPan         StereoPan of track in project         
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "{
 *          "_id": "zzzzzzz",
 *          "projectId": "xxxxxxx",
 *          "author": "Foobar",
 *          "name": "Track2",
 *          "gain": 1,
 *          ...
 *          "stereoPan": 0.5
 *      }"
 *
 * 
 * @apiError (404) TrackNotFound TrackId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourTrack You are not the owner of this track
 * @apiError (400) TrackIDNotFound trackId must exist
 * @apiError (400) TrackIDNotValid trackId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this track"
 */
exports.track_info = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("TrackId: " + req.params.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
        return res.status(200).json(track);
    });
};


/**
 * @api {get} /track/:trackId/file/ Get the track file
 * @apiVersion 1.0.0
 * @apiName get_track
 * @apiGroup Track
 * @apiPermission user authenticated
 *
 * @apiDescription Gets the track file and downloads it. Also references the src for project to load the tracks.
 * 
 * @apiParam {String} trackId Id of track 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/file/
 *
 * @apiSuccess {File}   final_file      The file of the track    
 * 
 *
 * @apiError (404) TrackNotFound TrackId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourTrack You are not the owner of this track
 * @apiError (400) TrackIDNotFound trackId must exist
 * @apiError (400) TrackIDNotValid trackId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this track"
 */
exports.get_track = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, trackObj) {
        if (err) return res.status(500).end(err);
        if (!trackObj) return res.status(404).end("Trackid: "+req.params.trackId+" does not exist");
        if (trackObj.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
    });
    Upload_Files.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(500).end("TrackId: " + req.params.trackId + " not found in files");
        Upload_Chunks.find({files_id: req.params.trackId}, null, {sort:{n: 1}}, function(err,chunks) {
            if (err) return res.status(500).end(err);
            if (!chunks) return res.status(500).end("Chunks of file not found");
            let fileData = [];
            for (let i=0; i<chunks.length; i++) {
                fileData.push(chunks[i].data.toString('base64'));
            }
            
            // How to turn chunks into base64 encoded string:
            // let audio_string = 'data:' + track.contentType + ';base64' + fileData.join('');

            let final_file = Buffer.from(fileData.join(''), 'base64');

            res.writeHead(200, {
                'Content-Type': track.contentType,
                'Content-Length': final_file.length
            });
            return res.end(final_file);
        });
    });
};


/**
 * @api {patch} /track/:trackId/ Update track settings
 * @apiVersion 1.0.0
 * @apiName update_track_option
 * @apiGroup Track
 * @apiPermission user authenticated
 *
 * @apiDescription Updates a tracks information. The option must be one of: [name, gain, muted, soloed, start, fadeIn_shape, fadeIn_duration, fadeOut_shape, fadeOut_duration, cuein, cueout, waveOutlineColor, stereoPan].
 * 
 * @apiParam {String} trackId Id of track 
 * @apiParam {String} option Option to be updated 
 * @apiParam {String} newValue New value of the option
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X PATCH -d '{"muted": "true"}' -b cookie.txt https://https://project-anything.herokuapp.com/track/xxxxxxxxxx/
 *
 * @apiSuccess {String}     message         Succesfully changed option  
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Succesfully changed option"
 *
 * @apiError (404) TrackNotFound TrackId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourTrack You are not the owner of this track
 * @apiError (400) TrackIDNotFound trackId must exist
 * @apiError (400) TrackIDNotValid trackId must be alphanumeric
 * @apiError (400) OptionNotFound option must exist
 * @apiError (400) OptionNotValid option type is invalid, refer to API for valid option types
 * @apiError (400) NewValueNotFound newValue must exist
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this track"
 */
exports.update_track_option = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("TrackId: " + req.params.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
        track[req.body.option] = req.body.newValue;
        track.save();
        return res.status(200).json("Succesfully changed option");
    });
};
