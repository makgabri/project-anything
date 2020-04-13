/*jslint node: true */
'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');



/**
 * @api {post} /project/:projectId/file/ Create a public project
 * @apiVersion 1.0.0
 * @apiName upload_public_project
 * @apiGroup Public Project
 * @apiPermission user authenticated
 *
 * @apiDescription Through our web application, you can publish your project publically. This will automatically generate the complete audio file and upload that audio file so that other user's can listen to your project.
 * 
 * @apiParam {File}     pubProj         File of the project
 * @apiParam {String}   projectId       Project ID of public project
 *
 * @apiExample {curl} Curl example
 * curl -X POST -F "pubProj=@/path/to/picture/drums.mp3" -b cookie.txt https://https://project-anything.herokuapp.com/project/:projectId/file/
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
 * @apiError (400) ProjectIDNotFound Project ID must exist
 * @apiError (400) ProjectIDInvalid Project ID must be alphanumeric
 * @apiError (404) ProjectNotFound Project: xxxxxxxxxxxx does not exist
 * @apiError (404) NotYourProject ProjectId: xxxxxxxxxx does not belong to you
 *
 * @apiErrorExample Response (example):
 *     HTTP/1.1 404 Bad Request
 *     "You are not the owner of this project"
 */
exports.prep_upload_public_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: "+req.params.projectId+" does not exist");
        if (project.isPublic) {
            if (project.author != req.session.passport.user) return res.status(401).end("ProjectId: "+req.params.projectId+" does not belong to you");
            pubProj_Chunks.deleteMany({files_id: project.pubFile_id}, function(err, n) {
                if (err) return res.status(500).end(err);
                pubProj_Files.deleteOne({_id: project.pubFile_id}, function(err, n) {
                    if (err) return res.status(500).end(err);
                    next();
                });
            });
        } else {
            next();
        }
    });
};

exports.upload_public_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        project.pubFile_id = req.file.id;
        project.isPublic = true;
        project.publicDate = new Date();
        project.save();
        return res.status(200).json(project);
    });
};


/**
 * @api {get} /project/user/ Gets list of public projects
 * @apiVersion 1.0.0
 * @apiName get_pubProj_list
 * @apiGroup Public Project
 * @apiPermission user authenticated
 *
 * @apiDescription Gets a list of public projects that can be viewed
 * 
 * @apiParam {String} [page] page to index public files 
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/public_project/
 *
 * @apiSuccess {Object[]}     pubProjs         List of public projects containing author, title, publicDate and pubFileId     
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "[
 *      {
 *          "author": "Foobar",
 *          "title": "Funny Vibes",
 *          "publicDate": "2020-04-11T17:48:30.049+00:00"
 *          "pubFile_id": "123xasd"
 *      },
 *      {
 *          "author": "Thierry",
 *          "title": "CSCC09 Lecture 999",
 *          "publicDate": "2020-04-11T17:48:30.049+00:00"
 *          "pubFile_id": "aaaaaaaaaa"
 *      }]"
 *
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (400) PageIsNotInt Page must be integer
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Bad Request
 *     "You are not logged in"
 */
exports.get_pubProj_list = function (req, res, next) {
    let page = (req.query.page === undefined) ? 0 : req.query.page;

    // Mongoose: Weak API for sort & limit b/c need to query whole thing before limit.
    Project.find({isPublic: true})
        .sort({publicDate: -1})
        .skip(page*3)
        .limit(3)
        .select({author: 1, title: 1, publicDate: 1, pubFile_id: 1})
        .exec(function(err, pubProjs) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(pubProjs);
        });
};


/**
 * @api {get} /public_project/size/ Get Max Homepage size
 * @apiVersion 1.0.0
 * @apiName get_pubProj_pageSize
 * @apiGroup Public Project
 * @apiPermission user authenticated
 *
 * @apiDescription Gets the maximmum number of pages at homepage. Each page can display 3 audio files. So The number of pages is number of public projects divided by 3.
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/public_project/size/
 *
 * @apiSuccess {Integer}     size         Number of maximum homepages    
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "3"
 *
 * @apiError (401) NotSignedIn You are not logged in
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 401 Bad Request
 *     "You are not logged in"
 */
exports.get_pubProj_pageSize = function(req, res, next) {
    pubProj_Files.countDocuments({}, function(err, n){ 
        if (err) return res.status(500).end(err);
        return res.status(200).json(Math.ceil(n/3));
    });
};

/**
 * @api {get} /project/:projectId/file/ Get the public project file
 * @apiVersion 1.0.0
 * @apiName get_pubProj
 * @apiGroup Public Project
 * @apiPermission user authenticated
 *
 * @apiDescription Gets the public project file and downloads it.
 * 
 * @apiParam {String} projectId ID of public project file to get
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X GET -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/file/
 *
 * @apiSuccess {File}   final_file      The file of the track    
 * 
 *
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (400) ProjectIDNotFound trackId must exist
 * @apiError (400) ProjectIDNotValid trackId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not logged in"
 */
exports.get_pubProj = function(req, res, next) {
    Project.findOne({pubFile_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: "+req.params.projectId+" does not exist");
        pubProj_Files.findOne({_id: project.pubFile_id}, function(err, projectFile) {
            if (err) return res.status(500).end(err);
            if (!projectFile) return res.status(404).end("ProjectFile: " + req.params.projectId + " does not exist");
            pubProj_Chunks.find({files_id: project.pubFile_id}, null, {sort:{n: 1}}, function(err,chunks) {
                if (err) return res.status(500).end(err);
                if (!chunks) return res.status(500).end("Chunks of file not found");
                let fileData = [];
                for (let i=0; i<chunks.length; i++) {
                    fileData.push(chunks[i].data.toString('base64'));
                }
    
                let final_file = Buffer.from(fileData.join(''), 'base64');
    
                res.writeHead(200, {
                    'Content-Type': projectFile.contentType,
                    'Content-Length': final_file.length
                });
                return res.end(final_file);
            });
        });
    });
};

/**
 * @api {delete} /project/:projectId/file/ Deletes a public project
 * @apiVersion 1.0.0
 * @apiName delete_pubProj
 * @apiGroup Public Project
 * @apiPermission user authenticated
 *
 * @apiDescription Deletes the public project. Removes public files from database.
 * 
 * @apiParam {String} projectId ID of public project to delete
 *
 * @apiExample {curl} Curl example
 * curl -H "Content-Type: application/json" -X DELETE -b cookie.txt https://https://project-anything.herokuapp.com/project/xxxxxxxxxx/file/
 *
 * @apiSuccess {String}     message         Successfully removed pubProject File     
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     "Successfully removed pubProject File"
 *
 * 
 * @apiError (404) ProjectNotFound ProjectId: xxxxxxxxxxxx does not exist
 * @apiError (401) NotSignedIn You are not logged in
 * @apiError (401) NotYourProject ProjectId: xxxxxxxxx does not belong to you
 * @apiError (400) ProjectIDNotFound projectId must exist
 * @apiError (400) ProjectIDInvalid projectId must be alphanumeric
 * 
 * @apiErrorExample Response (example):
 *     HTTP/1.1 400 Bad Request
 *     "You are not the owner of this project"
 */
exports.delete_pubProj = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " not found");
        if (project.author != req.session.passport.user) return res.status(401).end("ProjectId: "+req.params.projectId+" does not belong to you");
        project.isPublic = false;
        project.save();
        pubProj_Chunks.deleteMany({files_id: project.pubFile_id}, function(err, n) {
            if (err) return res.status(500).end(err);
            pubProj_Files.deleteOne({_id: project.pubFile_id}, function(err, n) {
                if (err) return res.status(500).end(err);
                return res.status(200).json("Successfully removed pubProject File");
            });
        });
    });
};