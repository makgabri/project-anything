let playlistApi = (function(){
    "use strict";
    let module = {};

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


    /**     Local Variables     **/
    let currProjectID = "";
    /** Local Variable Getters and Setters */
    module.setCurrProj = function(newProjId) {
        currProjectID = newProjId;
        localStorage.setItem("currProj", newProjId);
    }
    module.getCurrProj = function() {
        return localStorage.getItem("currProj");
    }


    /*  ******* Data types *******
        Project objects must have at least the following attributes:
            - (String) _id
            - (String) title
            - (String) author
            - (Date) date
    
        Track objects must have the following attributes
            - (String) trackId
            - (String) projectId
            - (String) author
            - (String) src
            - (String) name
    
    ****************************** */ 


    
    // create new project
    module.addProject = function(title, author){
       send("POST", "/add_project/", {title: title}, function(err, res){
            if (err) return api.notifyErrorListeners(err);
            notifyProjectListeners();
            api.invokeProjList();
        });
    };

    // delete a track on a project
    module.deleteTrack = function(trackId){
        send("DELETE", "/delete_track/", {trackId: trackId}, function(err, res){
            if (err) return api.notifyErrorListeners(err);
            notifyTrackListeners();
        });
    }; 

    // delete an project from the gallery given its projectId
    module.deleteProject = function(projectId){
        send("DELETE", "/delete_project/", {projectId: projectId}, function(err, res){
            if (err) return api.notifyErrorListeners(err);
            notifyProjectListeners();
        });
        //this.navigate(-1);        
    };

    /**     AJAX Get Function   **/
    let getProject = function(projectId, callback){
        currProjectID = projectId;
        return send("GET", "/get_project/", {projectId: currProjectID}, callback);
    };

    // get tracks for projectID
    let getTracks = function(callback){
        send("GET", "/api/tracks/project/"+currProjectID, null, callback);
    };


    /**     Listeners      **/
    let projectListeners = [];
    let trackListeners = [];

    /**     Private Notifiers   **/
    function notifyProjectListeners(){
        getProject(currProjectID, function(err, res){
            if (err) return api.notifyErrorListeners(err);
            projectListeners.forEach(function(listener){
                listener(res);
            });
        });  
    }

    function notifyTrackListeners(){
        getTracks(function(err, res){
            if (err) return api.notifyErrorListeners(err);
            trackListeners.forEach(function(listener){
                listener(res);
            });
        }); 
    }


    
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
            if (err) return api.notifyErrorListeners(err);
            notifyTrackListeners();
        });
    };
    
    // call handler when an Project is added or deleted
    module.onProjectUpdate = function(handler){
        projectListeners.push(handler);
        getProject(currProjectID,function(err, res){
            if (err) return api.notifyErrorListeners(err);
            handler(res);
        });  
    };

    
    // call handler when a track is added or deleted to a project
    module.onTrackUpdate = function(handler){
        trackListeners.push(handler);
        getTracks(function(err, res){
            if (err) return api.notifyErrorListeners(err);
            handler(res);
        });
    };



    return module;
    
    
})();