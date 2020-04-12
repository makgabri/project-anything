'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');



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
}

exports.upload_public_project = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        project['pubFile_id'] = req.file.id;
        project['isPublic'] = true;
        project['publicDate'] = new Date();
        project.save();
        return res.status(200).json(project);
    });
}

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

exports.get_pubProj_pageSize = function(req, res, next) {
    pubProj_Files.countDocuments({}, function(err, n){ 
        if (err) return res.status(500).end(err);
        return res.status(200).json(Math.ceil(n/3));
    });
}

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
            })
        })
    });
}


exports.delete_pubProj = function(req, res, next) {
    Project.findOne({_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: " + req.params.projectId + " not found");
        if (project.author != req.session.passport.user) return res.status(401).end("ProjectId: "+req.params.projectId+" does not belong to you");
        project['isPublic'] = false;
        project.save();
        pubProj_Chunks.deleteMany({files_id: project.pubFile_id}, function(err, n) {
            if (err) return res.status(500).end(err);
            pubProj_Files.deleteOne({_id: project.pubFile_id}, function(err, n) {
                if (err) return res.status(500).end(err);
                return res.status(200).json("Successfully removed pubProject File")
            });
        });
    });
}