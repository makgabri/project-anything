'use strict';

/**     Required Node Libraries     **/
const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

/**     User Schema     **/

const UserSchema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    provider: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },
    google: {}
});



/**     Virtuals    **/

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = crypto.randomBytes(16).toString('base64');
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        this.hashed_password = hash.digest('base64');
    })
    .get(function() {
        return this._password;
    });


module.exports = UserSchema;
