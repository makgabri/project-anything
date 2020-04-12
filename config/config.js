'use strict';

/**     Required Node Libraries     **/
const fs = require('fs');

// Public releasing doesn't expose public information. Possible breaches are passwords which are stored as hashes.
// Best practise is to keep this private

// Configuration for all settings
const config = {
    server: {
        key: fs.readFileSync(__dirname + '/server/server.key'),
        cert: fs.readFileSync(__dirname + '/server/server.crt')
    },
    mongo: {
        url: process.env.MONGODB_URI || 'mongodb+srv://anything:cscc09@anything-omsw1.mongodb.net/test?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            keepAlive: 1,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    },
    google: {
        clientID: "861730907678-ao4imte1fuui41kfe2kvcvl61dgnag7t.apps.googleusercontent.com",
        clientSecret: "Fmfqalc8_Cq2ziF45IpOqePx",
        callbackURL: 'https://project-anything.herokuapp.com/auth/google/callback/'
    }
};

module.exports = config;