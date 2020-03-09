/**     Required Node Libraries     **/
const express = require('express');
const app = express();

app.use(express.static('frontend'));

/**     Creating object methods     **/



/**     Output HTTPS request to terminal    **/
app.use(function (req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
});

app.get('/', function (req, res) {
    res.send('An alligator approaches!');
});



/**     Create      **/




/**     Read        **/




/**     Update      **/




/**     Delete      **/




const http = require('http');
const PORT = 3000;

// TODO: Generate key & certificate
var privateKey = null;
var certificate = null;
var config = {
        key: privateKey,
        cert: certificate
};

http.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on http://localhost:%s", PORT);
});