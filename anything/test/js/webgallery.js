window.onload = function(){
    // Enabling "use strict" mode
    "use strict";
    
    /**     Error handlers      **/
    // Error displayed on console
    api.onError(function(err) {
        console.error("[error]", err);
    });
    // Error displayed on webpage
    api.onError(function(err){
        let error_box = document.getElementById("error_box");
        error_box.innerHTML = err;
        error_box.style.visibility = "visible";
    });

    /**     UI navigation       **/
    // Redirect user to login page if signed out
    api.onUserUpdate(function(username){
        if (username == '') window.location.replace("/");
    });
    // Add listener to signout
    document.getElementById("signout").addEventListener('click', (function(e){
        api.signout();
    }));
    // Add listener to direct to mygallery
    document.getElementById("mygallery").addEventListener('click', (function(e){
        let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        window.location.replace("../webgallery.html?user="+username);
    }));
    // Add listener to direct "homepage" properly. If singed in, show homepage, if not, go to login screen
    document.getElementById("title").addEventListener('click', (function(e){
        let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (username == '') {
            window.location.replace("/");
        } else {
            window.location.replace("../homepage.html");
        }
    }));

    /**     UI Display      **/
    // Prepare owner's name and display
    let params = (new URL(document.location)).searchParams;
    let owner_name = params.get("user");
    api.set_user_gallery(owner_name);
    this.document.getElementById("gallery_owner").innerHTML= owner_name + "'s Gallery";

    /**     Gallery Display     **/
    // Image handlers that draws the proper image onto the Webgallery
    api.onImageUpdate((function(image) {
        document.getElementById("image_gallery").innerHTML = '';
        if (image == null) {
            // No image in gallery
            document.getElementById("image_gallery").className = "hidden";
        } else {
            // Prepare image gallery and append to webpage
            api.set_current_image(image._id, 0);
            document.getElementById("image_gallery").classList.remove("hidden");
            document.getElementById("image_gallery").className = "image_container";
            let date = new Date(image.createdAt);
            let dateStr = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
            let elmt = document.createElement('div');
            elmt.className = 'image_container';
            elmt.innerHTML =`
            <div class="image_title">
                <div id="image_title_topleft"></div>
                ${image.title}
                <div id="delete_image"></div>
            </div>
            <div class="image_date">uploaded by ${image.author} on ${dateStr}</div>
            <div class="image_gallery">
                <div id="prev_image">previous</div>
                <div class="image_display"><img src="/api/images/${image._id}/picture/" onError="this.onerror=null;this.src='/media/image_not_found.png';"></div>
                <div id="next_image">next</div>
            </div>`
            ;
            document.getElementById("image_gallery").append(elmt);

            // Prepare neighbours for further futures
            api.getNeighbours((function(err, neighbours) {
                if (err) (console.log("[error] Loading neighbours failure"));
                let prev_neighbour = neighbours[0];
                let next_neighbour = neighbours[1];

                // Adds event listener for delete so that the image is deleted if user is owner of gallery
                if (image.author != document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
                    document.getElementById("delete_image").className = "hidden";
                    document.getElementById("image_title_topleft").className = "hidden";
                } else {
                    document.getElementById("image_title_topleft").className = "empty";
                    document.getElementById("delete_image").className = "image_delete";
                    document.getElementById("delete_image").addEventListener('click', (function(e){
                        let to_delete = image._id;
                        if (prev_neighbour != null) {
                            api.set_current_image(prev_neighbour, 1);
                        } else if (next_neighbour != null) {
                            api.set_current_image(next_neighbour, 1);
                        } else {
                            api.set_current_image(null, 0);
                        }
                        api.deleteImage(to_delete);
                    }));
                }

                // Add next image feature
                let next_node = document.getElementById('next_image');
                if (next_neighbour == null) {
                    next_node.className = "arrow right_arrow_empty";
                } else {
                    next_node.className = "arrow right_arrow";
                    next_node.addEventListener('click', (function(e) {
                        api.set_current_image(next_neighbour, 1);
                    }));
                }

                // Add prev image feature
                let prev_node = document.getElementById('prev_image');
                if (prev_neighbour == null) {
                    prev_node.className = "arrow left_arrow_empty";
                } else {
                    prev_node.className = "arrow left_arrow";
                    prev_node.addEventListener('click', (function(e) {
                        api.set_current_image(prev_neighbour, 1);
                    }));
                }
        }));
    }}));

    /**     Comment Display      **/
    // Comment handlers that draws the proper comments onto the Webgallery
    api.onCommentUpdate((function(comments) {
        document.getElementById("user_comments").innerHTML = '';
        if (comments == null) {
            document.getElementById("comment_section").className = "hidden";
        } else {
            document.getElementById("comment_section").classList.remove("hidden");
            comments.forEach((function(comment) {
                // Prepare a comment div and add the proper elements
                let elmt = document.createElement('div');
                let date = new Date(comment.createdAt);
                let dateStr = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
                elmt.className = "comment";
                elmt.innerHTML = `
                    <div class="comment_user">
                        <div class="comment_user_name">${comment.author}</div>
                        <div class="delete_comment" id="deleteComment${comment._id}"></div>
                    </div>
                    <div class="comment_contents">
                        <div class="comment_content">${comment.content}</div>
                        <div class="comment_date">${dateStr}</div>
                    </div>
                `;
                document.getElementById("user_comments").append(elmt);

                // Adds event listener for delete so that the comment is deleted
                document.getElementById("deleteComment"+comment._id).addEventListener('click', (function(e){
                    api.deleteComment(comment._id);
                }));
            }));

            let page = api.get_comment_page();

            // Prepare prev page feature
            let old_prev_node = document.getElementById("prev_10");
            // Erase previous event listeners at this node
            let new_prev_node = old_prev_node.cloneNode(true);
            old_prev_node.parentNode.replaceChild(new_prev_node, old_prev_node);
            if (page > 0) {
                new_prev_node.className = "navigate prev_10";
                new_prev_node.addEventListener('click', (function(e) {
                    api.set_comment_page(page-1);
                }));
            } else {
                new_prev_node.className = "navigate prev_10_empty";
            }

            // Prepare next page feature
            let old_next_node = document.getElementById("next_10");
            // Erase previous event listeners at this node
            let new_next_node = old_next_node.cloneNode(true);
            old_next_node.parentNode.replaceChild(new_next_node, old_next_node);
            api.get_max_comment_page((function(err, max_page) {
                if (err) (console.log("[error] Loading number of pages failure"));
                if (page+1 < max_page) {
                    new_next_node.className = "navigate next_10";
                    new_next_node.addEventListener('click', (function(e){
                        api.set_comment_page(page+1);
                    }));
                } else {
                    new_next_node.className = "navigate next_10_empty";
                }
            }));
        }
    }));


    /**     Action(upload image/add comment) Form       **/
    // Add event listener to comment section
    this.document.getElementById("add_comment_form").addEventListener('submit', (function(e){
        // prevent page from refreshing on submit
        e.preventDefault();
        // read from elements
        let comment_contents = document.getElementById('new_comment_content').value;
        // clean form
        document.getElementById('add_comment_form').reset();
        // add comment to api
        api.addComment(api.get_current_image(), comment_contents);
    }));

    // Check if current user is gallery's owner. If so, add upload image form, otherwise remove it
    if (api.get_user_gallery() == document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1")) {
        // Add event listener to hide/show upload/insert image to webgallery form
        this.document.getElementById("checked").addEventListener('change', (function(e){
            if (this.checked){
                document.getElementById('upload_info').style.display = 'none';
                document.getElementById('add_image_form').style.border = 'none';
            } else {
                document.getElementById('upload_info').style.display = 'block';
                document.getElementById('add_image_form').style.border = '2px #3C3D3F solid';
            }
        }));
        // Add submit image listener and add images to api
        this.document.getElementById('add_image_form').addEventListener('submit', (function(e){
            // prevent page from refreshing on submit
            e.preventDefault();
            // read from elements;
            let image_title = document.getElementById('image_title').value;
            let image = document.getElementById('image').files[0];
            // clean form
            document.getElementById('add_image_form').reset();
            // add image to api
            api.addImage(image_title, image);
        }));
    } else {
        document.getElementById("add_image_form").innerHTML= '';
        document.getElementById("add_image_form").className= 'hidden';
    }

    

    api.gallery_refresh();



};