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
    
    /*  ******* Data types *******
        image objects must have at least the following attributes:
            - (String) _id 
            - (String) title
            - (String) author
            - (Date) date
    
        comment objects must have the following attributes
            - (String) _id
            - (String) imageId
            - (String) author
            - (String) content
            - (Date) date
    
    ****************************** */ 
    
    /**
     * Sign up to webgallery
     * 
     * @param   {string}  username     username
     * @param   {string}  password     password
     * 
     * sends a signup message to backend to create user object
     * 
     */
    module.signup = function(username, password){
        send("POST", "/signup/", {username: username, password: password}, function(err, res){
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
    module.signin = function(username, password){
        send("POST", "/signin/", {username: username, password: password}, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyUserListeners(getUsername());
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
            notifyUserListeners(getUsername());
       });
    };
    
    /**
     * Add image to gallery
     * 
     * @param   {string}  title     title of image
     * @param   {string}  file      file of image
     * 
     * sends a message to backend to create image object
     * 
     * Needs to notify:
     *      1. Image listeners
     *      2. Comment listeners
     *      3. Error listener if error
     * 
     */
    module.addImage = function(title, file){
        // TODO: Change author here
        sendFiles("POST", "/api/images/" + user_gallery + "/", {title: title, picture: file}, function(err, res){
            if (err) return notifyErrorListeners(err);
            module.set_current_image(res._id);
            notifyImageListeners();
            notifyCommentListeners();
       });
    };
    
    /**
     * Delete an image from gallery
     * 
     * @param   {string}  imageId       imageId to delete
     * 
     * sends a message to backend to delete the image from the gallery given its imageId
     * 
     * Needs to notify:
     *      1. Image listeners
     *      2. Comment listeners
     *      3. Error listener if error
     * 
     */
    module.deleteImage = function(imageId){
        send("DELETE", "/api/images/" + user_gallery + "/" + imageId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            notifyImageListeners();
            notifyCommentListeners();
       });
    };
    
    /** Add a comment to gallery
     * 
     * @param   {string}  imageId       imageId commenting on
     * @param   {string}  content       content of comments
     * 
     * sends a message to backend to add a comment to the image from the gallery given its imageId
     * 
     * Needs to notify:
     *      1. Comment listeners
     *      2. Error listener if error
     * 
     * Also needs to update comment page of front end to newest page(page = 0);
     * 
     */
    // TODO: REMOVE AUTHOR FROM PARAMETER
    module.addComment = function(imageId, content){
        // TODO: Change author here
        send("POST", "/api/comments/", {imageId: imageId, content: content}, function(err, res){
            if (err) return notifyErrorListeners(err);
            comment_page = 0;
            notifyCommentListeners();
       });
    };
    
    /** Delete a comment from gallery
     * 
     * @param   {string}  commentId     commentId to delete
     * 
     * sends a message to backend to delete the comment from the gallery given its commentId
     * 
     * Needs to notify:
     *      1. Comment listeners
     *      2. Error listener if error
     * 
     * Also needs to update comment page of front end to either next or previous;
     * 
     */
    module.deleteComment = function(commentId){
        send("DELETE", "/api/comments/" + commentId + "/", null, function(err, res){
            if (err) return notifyErrorListeners(err);
            send("GET", "/api/comments/"+image+"/pagesize/", null, (function(err, max_page) {
                if (err) return notifyErrorListeners(err);
                if (comment_page == max_page) (comment_page -= 1);
                notifyCommentListeners();
            }));
       });
    };



    /**     Check if password is safe           **/
    module.check_password = function(password1, password2) {
        if (password1 != password2)  {
            notifyErrorListeners("Passwords do not match");
            return false;
        }
        return true;
    };




    /**     Local Variables     **/
    let image = null;
    let comment_page = 0;
    let user_page = 0;
    let user_alpha = null;
    let user_gallery = null;

    /** Local Variable Getters and Setters */
    module.set_current_image = function(imageId, refresh) {
        image = imageId;
        if (refresh == 1) {
            notifyImageListeners();
            notifyCommentListeners();
        }
    };

    module.get_current_image = function() {
        return image;
    };

    module.set_comment_page = function(new_comment_page) {
        comment_page = new_comment_page;
        notifyCommentListeners();
    };

    module.get_comment_page = function() {
        return comment_page;
    };

    module.set_user_page = function(new_user_page) {
        user_page = new_user_page;
        notifyUserListListeners();
    };

    module.get_user_page = function() {
        return user_page;
    };

    module.set_user_alpha = function(new_user_alpha) {
        user_alpha = new_user_alpha;
        notifyUserListListeners();
    };

    module.get_user_alpha = function() {
        return user_alpha;
    };

    module.set_user_gallery = function(new_user_gallery) {
        user_gallery = new_user_gallery;
    };

    module.get_user_gallery = function() {
        return user_gallery;
    };



    /**     AJAX Get Function   **/
    let getImage = function(callback){
        if (image == null) {
            send("GET", "/api/images/" + user_gallery + "/", null, callback);
        } else {
            send("GET", "/api/images/" + user_gallery +"/?imageId="+image, null, callback);
        }
    };
    
    let getComments = function(callback){
        if (image == null) {
            callback(null);
        } else {
            send("GET", "/api/comments/"+image+"/?page=" + comment_page, null, callback);
        }
    };

    let getUsers = function(callback){
        let url = "/api/users/"+"?page="+user_page;
        if (user_alpha != null) (url += "&letter="+user_alpha);
        send("GET", url, null, callback);
    };

    // Public getter for straightforward access
    module.getNeighbours = function(callback){
        send("GET", "/api/images/" + user_gallery + "/" + image + "/neighbours/", null, callback);
        // Looking for neighbour means image has been added, notify comment listeners
        notifyCommentListeners();
    };

    module.get_max_comment_page = function(callback) {
        if (image == null) {
            callback(0);
        } else {
            send("GET", "/api/comments/"+image+"/pagesize/", null, callback);
        }
    };

    module.get_max_user_page = function(callback) {
        let url = "/api/users/pagesize/"+"?page="+user_page;
        if (user_alpha != null) (url += "&letter="+user_alpha);
        send("GET", url, null, callback);
    };
    


    /**      Listeners          **/
    let imageListeners = [];
    let commentListeners = [];
    let errorListeners = [];
    let userListeners = [];
    let userListListener = [];
    


    /**    Private Notifiers     **/
    function notifyImageListeners(){
        getImage(function(err, imageObj){
            if (err) return notifyErrorListeners(err);
            imageListeners.forEach(function(listener){
                listener(imageObj);
            });
        });
    }

    function notifyCommentListeners(){
        getComments(function(err, comments){
            if (err) return notifyErrorListeners(err);
            commentListeners.forEach(function(listener){
                listener(comments);
            });
        });
    }

    function notifyErrorListeners(err){
        errorListeners.forEach(function(listener){
            listener(err);
        });
    }

    function notifyUserListeners(username){
        userListeners.forEach(function(listener){
            listener(username);
        });
    }

    function notifyUserListListeners(){
        getUsers(function(err, user_list){
            if (err) return notifyErrorListeners(err);
            userListListener.forEach(function(listener){
                listener(user_list);
            });
        });
    }



    /**    Local function for username    **/
    let getUsername = function(){
        return document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    };



    /**    Add Listeners       **/
    module.onImageUpdate = function(listener){
        imageListeners.push(listener);
        getImage(function(err, imageObj) {
            if (err) return notifyErrorListeners(err);
            listener(imageObj);
        });
    };

    module.onCommentUpdate = function(listener){
        commentListeners.push(listener);
        getComments(function(err, comments) {
            if (err) return notifyErrorListeners(err);
            listener(comments);
        });
    };

    module.onError = function(listener){
        errorListeners.push(listener);
    };

    module.onUserUpdate = function(listener){
        userListeners.push(listener);
        listener(getUsername());
    };

    module.onUserListUpdate = function(listener){
        userListListener.push(listener);
        getUsers(function(err, user_list){
            if (err) return notifyErrorListeners(err);
            listener(user_list);
        });
    };

    /**     Automatic Refresher     **/
    module.homepage_refresh = function(){
        setTimeout(function(e){
            notifyUserListListeners();
            notifyUserListeners();
            module.homepage_refresh();
        }, 2000);
    };

    module.gallery_refresh = function(){
        setTimeout(function(e){
            notifyImageListeners();
            notifyCommentListeners();
            module.gallery_refresh();
        }, 2000);
    };
    
    return module;
})();