'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const Project = mongoose.model('project');
const Track = mongoose.model('track');
const Upload_Files = mongoose.model('uploads.files');
const Upload_Chunks = mongoose.model('uploads.chunks');
const pubProj_Files = mongoose.model('public.files');
const pubProj_Chunks = mongoose.model('public.chunks');

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

/** Public Project Operations **/
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
        .limit(page*10)
        .select({author: 1, title: 1, publicDate: 1, pubFile_id: 1})
        .exec(function(err, pubProjs) {
            if (err) return res.status(500).end(err);
            return res.status(200).json(pubProjs);
        });
};

exports.get_pubProj = function(req, res, next) {
    Project.findOne({pubFile_id: req.params.projectId}, function(err, project) {
        if (err) return res.status(500).end(err);
        if (!project) return res.status(404).end("ProjectId: "+req.params.projectId+" does not exist");
        if (project.author != req.session.passport.user) return res.status(401).end("You are not the owner of this track");
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




/**     Track Operations    **/
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

