'use strict';

/**     Required Node Libraries     **/
const fs = require('fs');

// TODO:
// Correctly re-make

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
        callbackURL: 'https://localhost:3000/auth/google/callback/'
    }
};

module.exports = config;