'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');



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

exports.new_project_title = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this project");
        project['title'] = req.body.newTitle;
        project.save();
    })
}

exports.user_project_list = function(req, res, next) {
    Project.find({author: req.session.passport.user},{_id:1,title:1}, function(err, proj_list) {
        if (err) return res.status(500).end(err);
        return res.json(proj_list);
    });
}

exports.project_track_list = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("Project: " + req.body.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You can't edit other user's projects");
        Track.find({projectId: req.params.projectId}, function(err, track_list) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(track_list);
        });
    });
}

exports.get_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        return res.status(200).json(project);
    })
}

exports.delete_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You can't edit other user's projects");

        if (project.isPublic) {
            pubProj_Chunks.deleteMany({files_id: project.pubFile_id}, function(err, n) {
                if (err) return res.status(500).end(err);
                pubProj_Files.deleteOne({_id:  project.pubFile_id}, function(err, n) {
                    if (err) return res.status(500).end(err);
                });
            });
        }
    });

    Track.find({projectId: req.params.projectId}, function(err, track_list) {
        if (err) return res.status(500).end(err);
        track_list.forEach(function(track) {
            Upload_Chunks.deleteMany({files_id: track._id}, function(err, n) {
                if (err) return res.status(500).end(err);
                Upload_Files.deleteOne({_id: track._id}, function(err, n) {
                    if (err) return res.status(500).end(err);
                });
            });
        });
    });

    Track.deleteMany({projectId: req.params.projectId}, function(err) {
        if (err) return res.status(500).end(err);
        Project.deleteOne({_id: req.params.projectId}, function(err) {
            if (err) return res.status(500).end(err);
            return res.status(200).json("ProjectId: " + req.params.projectId +" has been deleted");
        });
    })
}