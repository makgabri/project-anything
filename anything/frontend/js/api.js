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
    

    /**
     * Sign up to the web app
     * 
     * @param   {string}  username     username
     * @param   {string}  password     password
     * @param   {string}  familyName   familyName
     * @param   {string}  givenName    givenName
     * 
     * sends a signup message to backend to create a local user object
     * 
     */
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
    
    /**
     * Sign in to webgallery
     * 
     * @param   {string}  username     username
     * @param   {string}  password     password
     * 
     * sends a signup message to backend to create session
     * 
     */
    module.signin_local = function(username, password){
        send("POST", "/signin/", {username: username, password: password}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyLoginListeners(getUsername());
            if (res == "success") {
                window.location.replace("../homepage.html")
            }
       });
    };
    
    /**
     * Sign out of webgallery
     * 
     * sends a signout message to backend to destroy session
     * 
     */
    module.signout = function(){
        send("GET", "/signout/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyLoginListeners(getUsername());
       });
    };


    /**
     * Front end function to double check password
     * 
     * @param   {string}  password1     first password
     * @param   {string}  password2     second password
     * 
     * Confirms that the re-entered password is the same
     * 
     */
    module.check_password = function(password1, password2) {
        if (password1 != password2)  {
            notifyErrorListeners("Passwords do not match");
            return false;
        }
        return true;
    };


    /** Project and Track Operations **/
    // create new project
    module.addProject = function(title, author){
        send("POST", "/add_project/", {title: title}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyProjectListeners();
         });
    };

    module.updateProjectTitle = function(newTitle) {
        send("PATCH", "/project/"+getCurrProj()+"/title/", {newTitle: newTitle}, function(err, res){
            if (err) return notifyErrorListeners(err);
        });
    }
 
    // delete a track on a project
    module.deleteTrack = function(trackId){
        send("DELETE", "/delete_track/", {trackId: trackId}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyTrackListeners();
        });
    }; 

    // delete an project from the gallery given its projectId
    module.deleteProject = function(projectId){
        send("DELETE", "/delete_project/", {projectId: projectId}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyProjectListeners();
        });      
    };

    module.uploadTrack = function(projectId, file){
        sendFiles(
        "POST", "/upload_track/",
        {  
            projectId: projectId,
            track: file,
            // name is file name. Should make this default and optional parameter for name
            name: file.str.split(/(\\|\/)/g).pop()
        },
        function(err,res){
            if (err) return notifyErrorListeners(err);
            notifyTrackListeners();
        });
    };



    /**     Local Variables     **/

    /** Local Variable Getters and Setters */
    module.setCurrProj = function(newProjId) {
        localStorage.setItem("currProj", newProjId);
    }
    let getCurrProj = function() {
        return localStorage.getItem("currProj");
    }



    /**     AJAX Get Function   **/
    let getUsername = function(callback){
        send("GET", "/user_name/", null, callback);
    }

    let getProjList = function(callback){
        send("GET", "/project/user/", null, callback);
    }

    let getProject = function(callback){
        return send("GET", "/project/"+getCurrProj()+"/", null, callback);
    };

    let getTracks = function(callback){
        send("GET", "/project/"+getCurrProj()+"/tracks/", null, callback);
    };


    /**      Listeners          **/
    let errorListeners = [];
    let loginListeners = [];
    let projListListeners = [];
    let projectListeners = [];
    let trackListeners = [];
    
    /**     Public notifier invokers  **/
    module.invokeError = function(err) {
        notifyErrorListeners(err);
    }

    module.invokeProjList = function() {
        notifyProjListListeners();
    }

    /**    Private Notifiers     **/
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }

    function notifyLoginListeners(username){
        loginListeners.forEach(function(listener){
            listener(username);
        });
    };

    function notifyProjListListeners(){
        getProjList(function(err, projList) {
            if (err) return notifyErrorListeners(err);
            projListListeners.forEach(function(listener) {
                listener(projList);
            });
        });
    }

    function notifyProjectListeners(){
        getProject(function(err, res){
            if (err) return notifyErrorListeners(err);
            projectListeners.forEach(function(listener){
                listener(res);
            });
        });  
    }

    function notifyTrackListeners(){
        getTracks(function(err, res){
            if (err) return notifyErrorListeners(err);
            trackListeners.forEach(function(listener){
                listener(res);
            });
        }); 
    }


    /**     Add Notifiers    **/
    module.onError = function(listener){
        errorListeners.push(listener);
    };

    module.onLoginUpdate = function(listener){
        loginListeners.push(listener);
        getUsername(function(err, user_name) {
            if (err) return notifyErrorListeners(err);
            listener(user_name);
        });
    }

    module.onProjListUpdate = function(listener) {
        projListListeners.push(listener);
        getProjList(function(err, projList) {
            if (err) return notifyErrorListeners(err);
            projListListeners.forEach(function(listener) {
                listener(projList);
            })
        })
    }

    module.onProjectUpdate = function(handler){
        projectListeners.push(handler);
        getProject(function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });  
    };

    module.onTrackUpdate = function(handler){
        trackListeners.push(handler);
        getTracks(function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });
    };




    return module;
})();