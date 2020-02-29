/**     Required Node Libraries     **/
const express = require('express');
const app = express();


/**     Creating object methods     **/



/**     Output HTTPS request to terminal    **/
app.use(function (req, res, next){
    console.log("HTTPS request", req.method, req.url, req.body);
    next();
});

/**     Create      **/




/**     Read        **/




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