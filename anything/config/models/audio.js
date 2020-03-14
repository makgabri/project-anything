'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**     User Schema     **/
// Note: author->key would be better reference to user schema
const ProjectSchema = new Schema({
    projectId: {
        type: String,
        unique: true,
        require: true
    },
    title: {
        type: String
    },
    author: {
        type: String
    },
    date: {
        type: Date
    }
});

const TrackSchema = new Schema({
    trackId: {
        type: String,
        unique: true,
        require: true
    },
    projectId: {
        type: String
    },
    src: {
        type: String
    },
    name: {
        type: String
    }
});





/**     Schema Methods     */
// SchemaVar.methods.functionName

/**     Virtuals    **/
// SchemaVar.virtual('name').set(function(name)).get(

module.exports = {
    Project: ProjectSchema,
    Track: TrackSchema
}