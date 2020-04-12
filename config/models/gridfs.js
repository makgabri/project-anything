'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**     Gridfs Schema     **/
const FileSchema = new Schema({
    length: {
        type: Schema.Types.Number
    },
    chunkSize: {
        type: Schema.Types.Number
    },
    uploadDate: {
        type: Schema.Types.Date
    },
    md5: {
        type: Schema.Types.String
    },
    filename: {
        type: Schema.Types.String
    },
    contentType: {
        type: Schema.Types.String
    }
});

const ChunksSchema = new Schema({
    data: {
        type: Schema.Types.Buffer
    },
    files_id: {
        type: Schema.Types.ObjectId
    },
    n: {
        type: Schema.Types.Number
    }
});

const PublicProjectFileSchema = new Schema({
    length: {
        type: Schema.Types.Number
    },
    chunkSize: {
        type: Schema.Types.Number
    },
    uploadDate: {
        type: Schema.Types.Date
    },
    md5: {
        type: Schema.Types.String
    },
    filename: {
        type: Schema.Types.String
    },
    contentType: {
        type: Schema.Types.String
    }
});

const PublicProjectChunksSchema = new Schema({
    data: {
        type: Schema.Types.Buffer
    },
    files_id: {
        type: Schema.Types.ObjectId
    },
    n: {
        type: Schema.Types.Number
    }
})



/**     Schema Methods     */
// SchemaVar.methods.functionName

/**     Virtuals    **/
// SchemaVar.virtual('name').set(function(name)).get(

module.exports = {
    File: FileSchema,
    Chunks: ChunksSchema,
    PubProj: PublicProjectFileSchema,
    PubChunk: PublicProjectChunksSchema
}