/**     Required Node Libraries     **/
const bodyParser = require('body-parser');
const cookie = require('cookie');
const crypto = require('crypto');
const datastore = require('nedb');
const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

/**     Load External Files      **/
const users = require('./users/users');


/**     Initializing app      **/
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**     Initializing app - Cookie     **/
app.use(function(req, res, next){
    var username = (req.session.username)? req.session.username : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', username, {
          path : '/', 
          maxAge: 60 * 60,
          secure: true,
          sameSite: true
    }));
    next();
});
/**     Initializing app - Session   **/
app.use(session({
    secret: 'cats are secretly planning to rule the world',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true, secure: true}
}));
/**     Initializing app - Output to console req   **/
app.use(function (req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
});



/**     Initializing Databases      **/



/**     Method to authenticate session      **/
var isAuthenticated = function(req, res, next) {
    if ((!req.session.tokens) || (!req.session.username)) return res.status(401).end("access denied");
    next();
};



/**     Create      **/
app.post('/sign_in_google/', users.signin_google);
app.post('/sign_up/', users.sign_in);
app.post('/sign_in/', users.sign_in);



/**     Read        **/
app.get('/oauth2callback', users.signin_google_callback); // TODO: Set the callback url on google developer console and configure back here
app.get('/signout/', users.sign_out);


/**     Update      **/




/**     Delete      **/




const https = require('https');
const PORT = 3000;

// TODO: Generate key & certificate
var privateKey = null;
var certificate = null;
var config = {
        key: privateKey,
        cert: certificate
};

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});