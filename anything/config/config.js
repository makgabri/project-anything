'use strict';

// TODO:
// 1. Generate server key & cert
// 2. Complete mongo db url
// 3. Complete google information


// Configuration for all settings
const config = {
    server: {
        key: null,
        cert: null
    },
    mongo: {
        url: 'mongodb+srv://anything:cscc09@anything-omsw1.mongodb.net/test?retryWrites=true&w=majority',
        options: {
            useNewUrlParser: true,
            keepAlive: 1,
            useUnifiedTopology: true
        }
    },
    google: {
        clientID: "861730907678-ao4imte1fuui41kfe2kvcvl61dgnag7t.apps.googleusercontent.com",
        clientSecret: "Fmfqalc8_Cq2ziF45IpOqePx",
        callbackURL: null
    }
};

module.exports = config;