var api = (function(){
    "use strict";

    // Prepare send method via ajax
    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }

    // Prepare send file method via ajax
    function sendFiles(method, url, data, callback){
        let formdata = new FormData();
        Object.keys(data).forEach(function(key){
            let value = data[key];
            formdata.append(key, value);
        });
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        xhr.send(formdata);
    }

    var module = {};
    


    module.signup_local = function(username, password, familyName, givenName){
        send("POST", "/signup/", {
            username: username,
            password: password,
            familyName: familyName,
            givenName: givenName
        }, function(err, res){
        if (err) return notifyErrorListeners(err);
        location.reload();
       });
    };
    


    module.signin_local = function(username, password){
        send("POST", "/signin/", {username: username, password: password}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyLoginListeners(getUsername());
            if (res == "success") {
                window.location.replace("../homepage.html")
            }
       });
    };
    


    module.signout = function(){
        send("GET", "/signout/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyLoginListeners(getUsername());
       });
    };



    module.check_password = function(password1, password2) {
        if (password1 != password2)  {
            notifyErrorListeners("Passwords do not match");
            return false;
        }
        return true;
    };

    let loginListeners = [];
    
    let getUsername = function(callback){
        send("GET", "/user_firstName/", null, callback);
    }

    function notifyLoginListeners(username){
        loginListeners.forEach(function(listener){
            listener(username);
        });
    };

    module.onLoginUpdate = function(listener){
        loginListeners.push(listener);
        listener(getUsername());
    }


    /**     Local Variables     **/

    /** Local Variable Getters and Setters */



    /**     AJAX Get Function   **/
    


    /**      Listeners          **/
    let errorListeners = [];
    


    /**    Private Notifiers     **/
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }



    module.onError = function(listener){
        errorListeners.push(listener);
    };



    return module;
})();