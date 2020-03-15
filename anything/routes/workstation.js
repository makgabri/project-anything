'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const cookie = require('cookie');

// Note: assumption is that the required fields are sent within request
//       Therefor in validation, we check if the fields exists
// Todo: validation
exports.add_project = function(req, res, next) {
    // Do I need to convert date string into date object?
    Project.create({
        //projectId: req.body.projectId,
        title: req.body.title,
        author: req.body.author,
        date: req.body.date
    }), function (err, new_project) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(new_project);
    }
}

exports.get_project = function(req, res, next) {
    Project.findOne({projectId: req.body.projectId}, function(err, project) {
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