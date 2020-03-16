'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const User = mongoose.model('users');
const Local = mongoose.model('local_users');
const Google = mongoose.model('google_users');
const crypto = require('crypto');
const cookie = require('cookie');
const Projects = mongoose.model('projects');



let Project = function(project){
    this.title = project.title;
    this.author = project.author;
    this.date = project.date;  
};


let Track = function(track){
    this.projectId = track.projectId;
    this.src = track.src;
    this.name = track.name;
};



/** Create a new project */
exports.addProject = function(req, res, next) {
    let new_project = new Project(req.body);
    // insert the new project


    Projects.create({key: id, provider: 'projects'}, function(err, project) {
        if (err) return res.status(500).end(err);
        Local.create(new_project).then(function(new_project) {
            return res.status(200).json("Project " + new_project.id + " created");
        });
    });


};

/** Return a project given id in req.param */
exports.getProject = function(req, res, next) {

};

/** Delete a project given id in req.param */
exports.deleteProject = function(req, res, next) {

};

/** Add track to project given id in req.param */
exports.addTrack = function(req, res, next) {

};

/** Get all tracks for project given id in req.param */
exports.getTracks = function(req, res, next) {

};

/** Delete a track given id in req.param */
exports.deleteTrack = function(req, res, next) {

};

/** Delete all of project's tracks given id in req.param */
exports.deleteAllTracks = function(req, res, next) {

};