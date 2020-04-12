'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');



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
}


exports.upload_audio_track = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("Project: " + req.body.projectId + " does not exist");
        Track.create({
            _id: req.file.id,
            projectId: req.body.projectId,
            author: req.session.passport.user,
            name: req.body.name
        }, function (err, new_track) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(new_track);
        });
    })
}


exports.track_info = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("TrackId: " + req.params.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
        return res.status(200).json(track);
    })
}


exports.get_track = function(req, res, next) {
    Track.findOne({_id: req.params.trackId}, function(err, trackObj) {
        if (err) return res.status(500).end(err);
        if (!trackObj) return res.status(404).end("Trackid: "+req.params.trackId+" does not exist");
        if (trackObj.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
    });
    Upload_Files.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("TrackId: " + req.params.trackId + " does not exist");
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
        })
    })
}


exports.update_track_option = function(req, res, next) {
    // Todo: validate the option is within the option list
    Track.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(404).end("TrackId: " + req.params.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
        track[req.body.option] = req.body.newValue;
        track.save();
        return res.status(200).json("Succesfully change option");
    })
}
