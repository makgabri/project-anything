/**     Required Node Libraries     **/
const bodyParser = require('body-parser');
const cookie = require('cookie');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');



/**     Load External Files      **/
const config = require('./config/config');
const schemas = require('./config/models/user');



/**     Starting Mongoose       **/
//mongoose.connect(config.mongo.url, config.mongo.options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('connection successful')});
let user_model = mongoose.model('users', schemas.User);
let google_model = mongoose.model('google_users', schemas.Google);
let local_model = mongoose.model('local_users', schemas.Local);



/**     Initializing app      **/
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/**     Initializing app - Cookie     **/
// app.use(function(req, res, next){
//     var username = (req.session.username)? req.session.username : '';
//     res.setHeader('Set-Cookie', cookie.serialize('username', username, {
//           path : '/', 
//           maxAge: 60 * 60,
//           secure: true,
//           sameSite: true
//     }));
//     next();
// });

/**     Initializing app - Session   **/
app.use(session({
    secret: 'cats are secretly planning to rule the world',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true, secure: true}
}));



/**     Initializing Passport        **/
app.use(passport.initialize());
app.use(passport.session());



/**     Loading route re-direction   **/
require('./config/passport')(passport);
require('./config/routes')(app, passport);



/**     Listen to server    **/
app.use(function (req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
});

app.use(express.static('test'));

// const https = require('https');
const http = require('http');
const PORT = 3000;

/**     Start Server     **/
// https.createServer(config.server, app).listen(PORT, function (err) {
//     if (err) console.log(err);
//     else console.log("HTTPS server on https://localhost:%s", PORT);
// });
http.createServer(app).listen(PORT, function(err) {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
});