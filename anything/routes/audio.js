'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');

/**     Project Operations    **/
exports.add_project = function(req, res, next) {
    Project.create({
        title: req.body.title,
        author: req.session.passport.user,
        date: new Date()
    }, function (err, new_project) {
        if (err) return res.status(500).end(err.errmsg);
        return res.status(200).json(new_project);
    })
}

exports.user_project_list = function(req, res, next) {
    Project.find({author: req.session.passport.user},{_id:1,title:1}, function(err, proj_list) {
        if (err) return res.status(500).end(err);
        return res.json(proj_list);
    });
}

exports.project_track_list = function(req, res, next) {
    Project.findOne({_id: req.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(400).json("Project: " + req.body.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).json("You can't edit other user's projects");
        Track.find({projectId: req.projectId}, {_id:1, name:1},function(err, track_list) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(track_list);
        });
    });
}

exports.get_project = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(project);
    })
}

exports.delete_project = function(req, res, next) {
    Track.find({projectId: req.body.projectId}, function(err, track_list) {
        if (err) return res.status(500).end(err);
        track_list.forEach(function(track) {
            Upload_Chunks.deleteMany({files_id: track._id}, function(err, n) {
                if (err) return res.status(500).end(err);
                Upload_Files.deleteMany({_id: track._id}, function(err, n) {
                    if (err) return res.status(500).end(err);
                })
            })
        })
    })
    Track.deleteMany({projectId: req.body.projectId}, function(err) {
        if (err) return res.status(500).end(err);
        Project.deleteOne({projectId: req.body.projectId}, function(err) {
            if (err) return res.status(500).end(err);
            return res.status(200).json("Project: " + req.body.projectId +" has been deleted");
        });
    })
}



/**     Track Operations    **/
exports.get_track_list = function(req, res, next) {
    Track.find({author: req.session.passport.user},{_id:1,title:1,projectId:1}, function(err, tracks) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(tracks);
    })
}

exports.delete_track = function(req, res, next) {
    Track.deleteOne({_id: req.body.trackId}, function(err, n) {
        if (err) return res.status(500).end(err);
        if (n.deletedCount != 1) return res.status(409).json("Track: " + req.body.trackId + " not found");
        return res.status(200).json("Track: " + req.body.trackId + " has been deleted");
    })
}


exports.upload_audio_track = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(400).json("Project: " + req.body.projectId + " does not exist");
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

exports.get_track = function(req, res, next) {
    Upload_Files.findOne({_id: req.params.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(400).json("TrackId: " + req.params.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).json("You are not the owner of this track");
        Upload_Chunks.find({files_id: req.parms.trackId}, null, {sort:{date: 1}}, function(err,chunks) {
            if (err) return res.status(500).end(err);
            if (!chunks) return res.status(500).json("Chunks of file not found");
            let fileData = [];
            for (let i=0; i<chunks.length; i++) {
                fileData.push(chunks[i].data.toString('base64'));
            }
            let audio_string = 'data:' + track.contentType + ';base64' + fileData.join('');

            let final_file = Buffer.from(audio_string, 'base64');

            res.writeHead(200, {
                'Content-Type': track.contentType,
                'Content-Length': final_file.length
            });
            return res.end(final_file);
        })
    })
}

exports.get_track_file = function(req, res, next) {
    Upload_Files.findOne({_id: req.body.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(400).json("TrackId: " + req.body.trackId + " does not exist");
        Upload_Chunks.find({files_id: req.body.trackId}, null, {sort:{date: 1}}, function(err,chunks) {
            if (err) return res.status(500).end(err);
            if (!chunks) return res.status(500).json("Chunks of file not found");
            let fileData = [];
            for (let i=0; i<chunks.length; i++) {
                fileData.push(chunks[i].data.toString('base64'));
            }
            let finalFile = 'data:' + track.contentType + ';base64' + fileData.join('');
            return res.status(200).json(finalFile);
        })
    })
}

exports.update_track_option = function(req, res, next) {
    // Todo: validate the option is within the option list
    Track.findOne({_id: req.body.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        if (!track) return res.status(400).json("TrackId: " + req.body.trackId + " does not exist");
        if (track.author != req.session.passport.user) return res.status(401).json("You are not the owner of this track");
        track[req.body.option] = req.body.newValue;
        track.save();
    })
}