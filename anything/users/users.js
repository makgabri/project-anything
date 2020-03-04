const secrets = require('./google_client_secret.json');
var google = require('googleapis');

var oauth2Client = new google.auth.OAuth2(
    secrets.web.client_id,
    secrets.web.client_secret,
    secrets.web.redirect_uris[0] // TODO: Update this on console and regenerate json
);

exports.signin_google = function(req, res, next) {
    var options = {
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
      };
      var generatedUrl = oauth2Client.generateAuthUrl(options);
      res.redirect(generatedUrl);
      // TODO: Insert into database new user object if not inserted
}

exports.signin_google_callback = function(req, res, next) {
    var code = req.query.code;
    if(code) {
        req.session.code = code;
        oauth2Client.getToken(code, function(err, tokens) {
        if(err) console.log(err);

        req.session.tokens = tokens;
        oauth2Client.setCredentials(tokens);
        res.redirect('/');
        });
    }
    else {
        res.redirect('/');
    }
}

exports.sign_up = function(req, res, next) {
    //TODO
}

exports.sign_in = function(req, res, next) {
    //TODO
}

exports.sign_out = function(req, res, next) {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/', 
          maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    res.redirect('/');
}