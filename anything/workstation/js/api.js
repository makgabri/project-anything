let api = (function(){
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

    let pageReduce = 0;
    let addIndex = 0;    
    let userIndex = 0;
    let currUser = "";

    /*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) imageId 
            - (String) title
            - (String) author
            - (String) url
            - (Date) date
    
        comment objects must have the following attributes
            - (String) commentId
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */ 
    
    // add an image to the gallery
    module.addImage = function(title, file){
       addIndex = 0;
       userIndex = 0;
       sendFiles(
        "POST", "/api/images/",
        {
            title: title,
            file: file,
            date: getCurrentDate(false)
        },
        function(err,res){
            if (err){
                console.log("error");
                return notifyErrorListeners(err);
            }
            currUser = "";
            notifyImageListeners();
        });
    };

    // delete a comment to an image
    module.deleteComment = function(commentId){
        send("DELETE", "/api/comments/" + commentId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyCommentListeners();
        });
    }; 
    // delete an image from the gallery given its imageId
    module.deleteImage = function(imageId){
        
        send("DELETE", "/api/allcomments/" + imageId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyCommentListeners();
        });
        
        send("DELETE", "/api/images/" + imageId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            currUser = "";
            notifyImageListeners();
            this.navigate(-1);        

        });
    };

    let getImage = function(callback){
        let query = "/api/images/?add="+addIndex+"&userId="+userIndex;
        if (currUser != ""){
            return send("GET", query+"&username="+currUser, null, callback);
        }
        return send("GET", query, null, callback);
    };


    module.changeGallery = function(username){
        currUser = username;
        addIndex = 0;
        userIndex = 0;
        notifyImageListeners();
    };

    let getUsers = function(callback){
        return send("GET", "/api/users/", null, callback);
    };
    module.onUserLoadUpdate = function(handler){
        userListeners.push(handler);
        getUsers(function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });
    };

    let getComments = function(currentId, callback){
        send("GET", "/api/comments/current/?page="+pageReduce, null, callback);
    };

    module.navigatePage = function(pageDecrement){
        pageReduce = pageDecrement*10;
        notifyCommentListeners();
    };


    let imageListeners = [];
    function notifyImageListeners(){
        getImage(function(err, res){
            if (err) return notifyErrorListeners(err);
            imageListeners.forEach(function(listener){
                listener(res);
            });
        });  
    }


    let commentListeners = [];
    function notifyCommentListeners(){
        getComments('current',function(err, res){
            if (err) return notifyErrorListeners(err);
            commentListeners.forEach(function(listener){
                listener(res);
            });
        }); 
    }

    module.navigate = function(add){
        // change the imageIndex
        addIndex += add;
        notifyCommentListeners();
        notifyImageListeners();
    };

    module.navigateUser = function(add){
        // change the imageIndex
        userIndex += add;
        currUser = "";
        notifyCommentListeners();
        notifyImageListeners();
    };
    
    // add a comment to an image
    module.addComment = function(imageId, content){
        send(
        "POST", "/api/comments/",
        {  
            imageId: imageId,
            content: content,
            date: getCurrentDate(true)
        },
        function(err,res){
            if (err){
                console.log("error");
                return notifyErrorListeners(err);
            }
            pageReduce = 0;
            notifyCommentListeners();
        });
    };
    
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
    
    // call handler when an image is added or deleted from the gallery
    module.onImageUpdate = function(handler){
        imageListeners.push(handler);
        getImage(function(err, res){
            if (err) return notifyErrorListeners(err);
            handler(res);
        });  
    };

    
    // call handler when a comment is added or deleted to an image
    module.onCommentUpdate = function(imageId, handler){
        commentListeners.push(handler);
        getComments(imageId, function(err, res){
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

    module.onError = function(listener){
        errorListeners.push(listener);
    };


    /**
     * User Stuff 
     */

    let userListeners = [];
    
    let getUsername = function(){
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };
    
    function notifyUserListeners(username){
        userListeners.forEach(function(listener){
            listener(username);
        });
    }
    let userLoadListeners = [];

    function notifyUserLoadListeners(){
        getUsers(function(err, res){
            if (err) return notifyErrorListeners(err);
            userLoadListeners.forEach(function(listener){
                listener(res);
            });
        });  
    }
    
    module.onUserUpdate = function(listener){
        userListeners.push(listener);
        listener(getUsername());
    };
    
    module.signin = function(username, password){
        send("POST", "/signin/", {username, password}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyUserListeners(getUsername());
             notifyUserLoadListeners();

        });
    };
    
    module.signup = function(username, password){
        send("POST", "/signup/", {username, password}, function(err, res){
             if (err) return notifyErrorListeners(err);
             notifyUserListeners(getUsername());
             notifyUserLoadListeners();
        });
    };

    return module;
    
})();