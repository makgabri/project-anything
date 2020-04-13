/*jslint node: true */
'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**     User Schema     **/

const UserSchema = new Schema({
    key: {
        type: String,
        unique: true,
        required: true
    },
    provider: {
        type: String,
        enum: ['local', 'google']
    }
});

const GoogleSchema = new Schema({
    googleId: {
        type: String,
        required: true
    },
    familyName: {
        type: String
    },
    givenName: {
        type: String
    }
});

const LocalSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 1
    },
    familyName: {
        type: String
    },
    givenName: {
        type: String
    },
    salt: {
        type: String,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    }
});



/**     Schema Methods     */
LocalSchema.methods.verifyPassword = function(password) {
    let hash = crypto.createHmac('sha512', this.salt);
    hash.update(password);
    return (hash.digest('base64') == this.hashed_password);
};

/**     Virtuals    **/

LocalSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = crypto.randomBytes(16).toString('base64');
        var hash = crypto.createHmac('sha512', this.salt);
        hash.update(password);
        this.hashed_password = hash.digest('base64');
    })
    .get(function() {
        return this._password;
    });


module.exports = {
    User: UserSchema,
    Google: GoogleSchema,
    Local: LocalSchema
};