/**     Required Node Libraries     **/
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');



/**     Load External Files      **/
const config = require('./config/config');
const schemas = require('./config/models/user');



/**     Starting Mongoose       **/
mongoose.connect(config.mongo.url, config.mongo.options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log('connection successful')});
let user_model = mongoose.model('users', schemas.User);
let google_model = mongoose.model('google_users', schemas.Google);
let local_model = mongoose.model('local_users', schemas.Local);



/**     Initializing app      **/
const app = express();
app.use(bodyParser.json());
app.set('trust proxy', 1);
app.use(cookieParser('cats are secretly planning to rule the world'));
const cookieExpirationDate = new Date();
const cookieExpirationDays = 365;
cookieExpirationDate.setDate(cookieExpirationDate.getDate() + cookieExpirationDays);
app.use(bodyParser.urlencoded({ extended: false }));
/**     Initializing app - Session   **/
app.use(session({
    secret: 'cats are secretly planning to rule the world',
    resave: false,
    saveUninitialized: true,
    cookie: {httpOnly: true, sameSite: true, secure: true, expires: cookieExpirationDate}
}));
/**     Initializing app - Cookie     **/
// app.use(function(req, res, next){
//     var key = (req.session.key)? req.session.key : '';
//     res.setHeader('Set-Cookie', cookie.serialize('key', key, {
//           path : '/', 
//           maxAge: 60 * 60,
//           secure: true,
//           sameSite: true
//     }));
//     next();
// });



/**     Initializing Passport        **/
app.use(passport.initialize());
app.use(passport.session());



/**     Loading route re-direction   **/
require('./config/passport')(passport);
require('./config/routes')(app, passport);



/**     Listen to server    **/
app.use(function (req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    //console.log(req.session);
    console.log(req.isAuthenticated());
    next();
});

app.use(express.static('frontend'));

const https = require('https');
const PORT = 3000;

/**     Start Server     **/
https.createServer(config.server, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on http://localhost:%s", PORT);
});