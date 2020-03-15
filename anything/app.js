/**     Required Node Libraries     **/
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const Grid = require("gridfs-stream");
const passport = require('passport');
const session = require('express-session');



/**     Load External Files      **/
const config = require('./config/config');
const userSchemas = require('./config/models/user');
const audioSchemas = require('./config/models/audio');
const gridFsStorage = require('./config/gridfs');



/**     Starting Mongoose       **/
mongoose.connect(config.mongo.url, config.mongo.options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));
db.once('open', function() {console.log('mongoDB connection successful')});
let gfs = Grid(db, mongoose.mongo);
gfs.collection('uploads');
const track_upload = multer({gridFsStorage});
let user_model = mongoose.model('users', userSchemas.User);
let google_model = mongoose.model('google_users', userSchemas.Google);
let local_model = mongoose.model('local_users', userSchemas.Local);
let project_model = mongoose.model('project', audioSchemas.Project);
let track_model = mongoose.model('track', audioSchemas.Track);



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



/**     Initializing Passport        **/
app.use(passport.initialize());
app.use(passport.session());



/**     Loading route re-direction   **/
require('./config/passport')(passport);
require('./config/routes')(app, passport, gfs, track_upload);



/**     Listen to server    **/
app.use(function (req, res, next){
    req.username = (req.session.passport)? req.session.passport : null;
    console.log("HTTP request", req.username, req.method, req.url, req.body);
    next();
});

app.use(express.static('frontend'));

const https = require('https');
const PORT = 3000;

/**     Start Server     **/
let server = https.createServer(config.server, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on http://localhost:%s", PORT);
});

// Export used for testing
module.exports = server;