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



    let currProjectID = "";


    /*  ******* Data types *******
        Project objects must have at least the following attributes:
            - (String) projectId 
            - (String) title
            - (String) author
            - (Date) date
    
        Track objects must have the following attributes
            - (String) trackId
            - (String) projectId
            - (String) src
            - (String) name
    
    ****************************** */ 


    
    // create new project
    module.addProject = function(title, author){
       send(
        "POST", "/api/projects/",
        {
            title: title,
            author: author,
            date: getCurrentDate(false)
        },
        function(err,res){
            if (err){
                console.log("error");
                return notifyErrorListeners(err);
            }
            notifyProjectListeners();
        });
    };

    // delete a track on a project
    module.deleteTrack = function(trackId){
        send("DELETE", "/api/tracks/" + trackId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyTrackListeners();
        });
    }; 
    // delete an project from the gallery given its projectId
    module.deleteProject = function(projectId){
        // have to delete all the tracks for the project first
        send("DELETE", "/api/alltracks/" + projectId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyTrackListeners();
        });
        
        // then delete this project
        send("DELETE", "/api/projects/" + projectId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyProjectListeners();
        });
        //this.navigate(-1);        
    };

    let getProject = function(projectId, callback){
        currProjectID = projectId;
        return send("GET", "/api/projects/"+projectId, null, callback);
    };

    // get tracks for projectID
    let getTracks = function(callback){
        send("GET", "/api/tracks/", null, callback);
    };



    let projectListeners = [];
    function notifyProjectListeners(){
        getProject(currProjectID, function(err, res){
            if (err) return notifyErrorListeners(err);
            projectListeners.forEach(function(listener){
                listener(res);
            });
        });  
    }


    let trackListeners = [];
    function notifyTrackListeners(){
        getTracks(function(err, res){
            if (err) return notifyErrorListeners(err);
            trackListeners.forEach(function(listener){
                listener(res);
            });
        }); 
    }


    
    // add a track to a project
    module.addTrack = function(projectId, src, name){
        send(
        "POST", "/api/tracks/",
        {  
            projectId: projectId,
            src: src,
            name: name
        },
        function(err,res){
            if (err){
                console.log("error");
                return notifyErrorListeners(err);
            }
            notifyTrackListeners();
        });
    };
  
    
    // call handler when an Project is added or deleted
    module.onProjectUpdate = function(handler){
        projectListeners.push(handler);
        getProject(currProjectID,function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });  
    };

    
    // call handler when a track is added or deleted to a project
    module.onTrackUpdate = function(handler){
        trackListeners.push(handler);
        getTracks(function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });
    };

    let errorListeners = [];
    
    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }


    let getCurrentDate = function(comment){
        /*
        Code for getting date was used from here:
        https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-3.php
        */
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        var hh = today.getHours();
        var mn = today.getMinutes();
        if(dd<10) 
        {
            dd='0'+dd;
        } 
        if(mm<10) 
        {
            mm='0'+mm;
        }
        if(hh<10) 
        {
            hh='0'+hh;
        } 
        if(mn<10) 
        {
            mn='0'+mn;
        }
        // if comment, use time, else use year
        today = mm+'-'+dd+'-';
        if (comment){
            today+=hh+":"+mn;
        }else{
            today+=yyyy;}
        return today;
    };

    return module;
    
    
})();