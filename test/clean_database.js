'use strict'

/*
 * This file is used to completely restart database(excluding users).
 * Use this if tests are constantly causing glitches. This is most likely due to
 * a large number of api's being incompatible.
 */



// Change true to reset
const reset = true;

if (reset) {
    /**     Required Node Libraries     **/
    const mongoose = require('mongoose');


    /**     Load External Files      **/
    const config = require('../config/config');
    const audioSchemas = require('../config/models/audio');
    const gridfsSchemas = require('../config/models/gridfs');

    mongoose.connect(config.mongo.url, config.mongo.options);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'mongoDB connection error:'));
    db.once('open', function() {console.log('mongoDB connection successful')});
    let project_model = mongoose.model('project', audioSchemas.Project);
    let track_model = mongoose.model('track', audioSchemas.Track);
    let upload_file_model = mongoose.model('uploads.files', gridfsSchemas.File);
    let upload_chunks_model = mongoose.model('uploads.chunks', gridfsSchemas.Chunks);
    let pubProj_Files = mongoose.model('public.files', gridfsSchemas.PubProj);
    let pubProj_Chunks = mongoose.model('public.chunks', gridfsSchemas.PubChunk);

    project_model.collection.drop();
    track_model.collection.drop();
    upload_file_model.collection.drop();
    upload_chunks_model.collection.drop();
    pubProj_Files.collection.drop();
    pubProj_Chunks.collection.drop();
    console.log("Done dropping");

}