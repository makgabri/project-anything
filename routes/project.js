'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');



/**
 * @api {post} /add_project/ Create a project
 * @apiVersion 1.0.0
 * @apiName add_project
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Creates a project object given the title.
 * 
 * @apiParam {String} title Title of the project
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X POST -d '{"title":"Happy Vibes"}' -b cookie.txt https://https://project-anything.herokuapp.com/add_project/
 *
 * @apiSuccess {String}     _id                 Automatically generated id for project
 * @apiSuccess {String}     title               Title of the just created project
 * @apiSuccess {String}     author              Username/googleId of current user
 * @apiSuccess {Date}       date                Current date specifying the created time of project
 * @apiSuccess {Boolean}    isPublic            Indicates public/private status of project
 * @apiSuccess {String}     [pubFile_id]        References public file id if public
 * @apiSuccess {Date}       [publicDate]        References most recent date public
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": "121321545123",
 *       "title": "Happy Vibes",
 *       "author": "Foobar",
 *       "date": "2020-04-11T17:48:30.049+00:00",
 *       "isPublic": "false",
 *     }
 *
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (400) TitleNotFound title must exist
 * @apiError (400) TitleInvalid title must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "title must be alphanumeric"
 */
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

/**
 * @api {patch} /project/:projectId/title/ Update project name
 * @apiVersion 1.0.0
 * @apiName new_project_title
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Renames the title of a project
 * 
 * @apiParam {String} projectId Id of project to be renamed
 * @apiParam {String} newTitle New title of the project
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X PATCH -d '{"newTitle":"Sad Vibes"}' -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/title/
 *
 * @apiSuccess {String}     message         successfully changed title                 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "successfully changed title"
 *
 * 
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourProject You are not the owner of this project
 * @apiError (400) TitleNotFound title must exist
 * @apiError (400) TitleInvalid title must be alphanumeric
 * @apiError (400) ProjectIDNotFound projectId must exist
 * @apiError (400) ProjectIDInvalid projectId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "title must be alphanumeric"
 */
exports.new_project_title = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this project");
        project['title'] = req.body.newTitle;
        project.save();
        return res.status(200).json("succesfully changed title");
    })
}

/**
 * @api {get} /project/user/ Gets list of projects
 * @apiVersion 1.0.0
 * @apiName user_project_list
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Gets a list of projects that belongs to the user
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/project/user/
 *
 * @apiSuccess {Object[]}     proj_list         List of projects containing their id's and titles                
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "[
 *      {
 *          "_id": "xxxxxxx",
 *          "title": "Funny Vibes"
 *      },
 *      {
 *          "_id": "yyyyyyy",
 *          "title": "Weird Vibes"
 *      }]"
 *
 * @apiError (401) NotSignedIn You are not logged in
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Bad Request
 *     "You are not logged in"
 */
exports.user_project_list = function(req, res, next) {
    Project.find({author: req.session.passport.user},{_id:1,title:1}, function(err, proj_list) {
        if (err) return res.status(500).end(err);
        return res.json(proj_list);
    });
}

/**
 * @api {get} /project/:projectId/tracks/ Get list of tracks
 * @apiVersion 1.0.0
 * @apiName project_track_list
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Collects all the tracks corresponding to the project
 * 
 * @apiParam {String} projectId Id of project 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/tracks/
 *
 * @apiSuccess {Object[]}     track_list         list of tracks corresponding to project                 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "[
 *      {
 *          "_id": "yyyyyyyy",
 *          "projectId": "xxxxxxx",
 *          "author": "Foobar",
 *          "name": "Track1",
 *          "gain": 1,
 *          ...
 *          "stereoPan": 0.5
 *      },
 *      {
 *          "_id": "zzzzzzz",
 *          "projectId": "xxxxxxx",
 *          "author": "Foobar",
 *          "name": "Track2",
 *          "gain": 1,
 *          ...
 *          "stereoPan": 0.5
 *      }]"
 *
 * 
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourProject You are not the owner of this project
 * @apiError (400) ProjectIDNotFound projectId must exist
 * @apiError (400) ProjectIDInvalid projectId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this project"
 */
exports.project_track_list = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("Project: " + req.body.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this project");
        Track.find({projectId: req.params.projectId}, function(err, track_list) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(track_list);
        });
    });
}

/**
 * @api {get} /project/:projectId/ Get the project object
 * @apiVersion 1.0.0
 * @apiName get_project
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Gets the project details of the projectId
 * 
 * @apiParam {String} projectId Id of project 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/
 *
 * @apiSuccess {String}     _id                 Automatically generated id for project
 * @apiSuccess {String}     title               Title of the just created project
 * @apiSuccess {String}     author              Username/googleId of current user
 * @apiSuccess {Date}       date                Current date specifying the created time of project
 * @apiSuccess {Boolean}    isPublic            Indicates public/private status of project
 * @apiSuccess {String}     [pubFile_id]        References public file id if public
 * @apiSuccess {Date}       [publicDate]        References most recent date public         
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "_id": "yyyyyyy",
 *          "author": "Foobar",
 *          "date": "2020-04-11T17:48:30.049+00:00",
 *          "title": "Weird Vibes",
 *          "isPublic": "true",
 *          "pubFile_id": "abcabcabc",
 *          "publicDate": "2020-04-11T17:48:30.049+00:00"
 *      }
 *
 * 
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourProject You are not the owner of this project
 * @apiError (400) ProjectIDNotFound projectId must exist
 * @apiError (400) ProjectIDInvalid projectId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this project"
 */
exports.get_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("Project: " + req.body.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this project");
        return res.status(200).json(project);
    })
}

/**
 * @api {delete} /project/:projectId/ Deletes a project
 * @apiVersion 1.0.0
 * @apiName delete_project
 * @apiGroup Project
 * @apiPermission user authenticated
 *
 * @apiDescription Deletes the project. Removes all tracks corresponding to project. Also removes the public project if it was public.
 * 
 * @apiParam {String} projectId Id of project to delete
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/
 *
 * @apiSuccess {String}     message         ProjectId: xxxxxxxxxx has been deleted          
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "ProjectId: xxxxxxxxxx has been deleted"
 *
 * 
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourProject You are not the owner of this project
 * @apiError (400) ProjectIDNotFound projectId must exist
 * @apiError (400) ProjectIDInvalid projectId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this project"
 */
exports.delete_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this project");

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
    });
}