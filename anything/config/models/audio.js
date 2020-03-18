'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**     User Schema     **/
const ProjectSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    }
});

const TrackSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    projectId: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
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