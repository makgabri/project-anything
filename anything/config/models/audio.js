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
    },
    gain: {
        type: Schema.Types.Decimal128,
        default: 1.0
    },
    muted: {
        type: Boolean,
        default: false
    },
    soloed: {
        type: Boolean,
        default: false
    },
    start: {
        type: Schema.Types.Number,
        default: 0
    },
    fadeIn_duration: {
        type: Schema.Types.Decimal128,
        default: 0.0
    },
    fadeOut_duration: {
        type: Schema.Types.Decimal128,
        default: 0.5
    },
    cuein: {
        type: Schema.Types.Number,
        default: 0
    },
    cueout: {
        type: Schema.Types.Number,
        default: 0
    },
    waveOutlineColor: {
        type: Schema.Types.String,
        default: '#FFFFFF'
    },
    stereoPan: {
        type: Schema.Types.Decimal128,
        default: 0.0
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