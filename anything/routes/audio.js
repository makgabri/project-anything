'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');

// Note: assumption is that the required fields are sent within request
//       Therefor in validation, we check if the fields exists
// Todo: validation
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

exports.get_project = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(project);
    })
}

exports.delete_project = function(req, res, next) {
    Track.deleteMany({projectId: req.body.projectId}, function(err) {
        if (err) return res.status(500).end(err);
        Project.deleteOne({projectId: req.body.projectId}, function(err) {
            if (err) return res.status(500).end(err);
            return res.status(200).json("Project: " + req.body.projectId +" has been deleted");
        });
    })
}

exports.add_track = function(req, res, next) {
    Project.findOne({projectId: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(400).json("Project: " + req.body.projectId + " does not exist");
        
        Track.create({
            //trackId: req.body.trackId,
            projectId: req.body.projectId,
            src: req.body.src,
            name: req.body.name
        }), function (err, new_track) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(new_track);
        }
    })
}

exports.get_track = function(req, res, next) {
    Track.findOne({trackId: req.body.trackId}, function(err, track) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(track);
    })
}

exports.delete_track = function(req, res, next) {
    Track.deleteOne({trackId: req.body.trackId}, function(err) {
        if (err) return res.status(500).end(err);
        return res.status(200).json("Track: " + req.body.trackId + " has been deleted");
    })
}

exports.delete_all_tracks = function(req, res, next) {
    Track.deleteOne({trackId: req.body.trackId}, function(err) {
        if (err) return res.status(500).end(err);
        return res.status(200).json("Track: " + req.body.trackId + " has been deleted");
    })
}
exports.upload_audio_track = function(req, res, next) {
    Project.findOne({_id: req.body.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(400).json("Project: " + req.body.projectId + " does not exist");
        Track.create({
            projectId: req.body.projectId,
            src: req.body.src,
            name: req.body.name
        }, function (err, new_track) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(new_track);
        });
    })
}

exports.get_track_file = function(gfs) {
    return (function (req, res, next) {
        gfs.files.findOne({ filename: req.body.filename }, (err, file) => {
            // Check if file
            if (!file || file.length === 0) {
              return res.status(404).json('no file exists');
            }
        
            // Check if track
            if (file.contentType === 'audio/mpeg' || file.contentType === 'audio/aac') {
              const readstream = gfs.createReadStream(file.filename);
              readstream.pipe(res);
            } else {
              res.status(404).json('file is not audio type');
            }
          })
    });
}
