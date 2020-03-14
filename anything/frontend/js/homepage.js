(function(){

    "use strict";
    window.onload = function(){

        api.onError(function(err){
            console.error("[error]", err);
        });
        
        api.onError(function(err){
            var error_box = document.querySelector('#error_box');
            error_box.innerHTML = err;
            error_box.style.display = "block";
        });

        api.onLoginUpdate(function(username){
            document.querySelector("#signin_button").style.display = (username)? 'none' : 'block';
            document.querySelector("#signout_button").style.display = (username)? 'block' : 'none';
            document.querySelector('#image-form').style.display = (username)? 'block' : 'none';
            document.querySelector('#image-display').style.display = (username)? 'flex' : 'none';
            document.querySelector('#comment-form').style.display = (username)? 'block' : 'none';
            document.querySelector('#comments').style.display = (username)? 'flex' : 'none';
            document.querySelector('#pagination').style.display = (username)? 'flex' : 'none';

            api.onUserUpdate(function(user) {
                document.querySelector('#gallery-author').innerHTML = '';
                document.getElementById("image-form").innerHTML = '';
                if (user != undefined && user != null){
                    //create a new image element
                    let elmt = document.querySelector('#gallery-author');
                    elmt.innerHTML=`
                        <div class="prev-arrow"></div>
                        <div class="gallery-owner">
                            <p>${user._id}</p>
                        </div>
                        <div class="next-arrow"></div>
                    `;
                    elmt.querySelector(".prev-arrow").addEventListener("click", function(e){
                        api.navUsers(-1);
                    });
                    elmt.querySelector(".next-arrow").addEventListener("click", function(e){
                        api.navUsers(1);
                    });
                    
                    if (username == user._id){
                        let imgForm = document.createElement('form');
                        imgForm.className = "complex_form";
                        imgForm.id = "add-image";
                        imgForm.innerHTML = `
                            <div class="form_title">Post an image</div>
                            <div class="hide-form">Hide Form</div>
                            <input type="text" id="image_title" class="form_element" placeholder="Enter your title" name="image_title" required/>
                            <input type="file" id="image_file" class="form_element" name="file" accept="image/*" required/>
                            <button type="submit" class="btn">Post your image</button>
                        `
                        imgForm.addEventListener("submit", function(e){
                            // prevent from refreshing the page on submit
                            e.preventDefault();
                            // read form elements
                            let title = document.getElementById("image_title").value;
                            let file= document.getElementById("image_file").files[0];
                            // clean form
                            document.getElementById("add-image").reset();
                            api.addImage(title, file);
                        });
                        document.getElementById("image-form").prepend(imgForm);
                    }

                    api.onImageUpdate(function(image){
                        document.querySelector('#image-display').innerHTML = '';
                        document.getElementById("comment-form").innerHTML = '';
                        if (image != undefined && image != null){
                            //create a new image element
                            let elmt = document.createElement('div');
                            elmt.className = "image-post";
                            elmt.innerHTML=`
                                <div class="image-title">${image.title}</div>
                                <div class="image-author">By ${image.author}</div>
                                <div class="prev-arrow"></div>
                                <div class="image-block">
                                    <img class="image" src="/api/images/${image._id}/">
                                    <div class="delete-icon icon"></div>
                                </div>
                                <div class="next-arrow"></div>
                            `;
                            elmt.querySelector(".delete-icon").addEventListener("click", function(e){
                                api.deleteImage(image._id);
                            });
                            elmt.querySelector(".prev-arrow").addEventListener("click", function(e){
                                api.navImages(-1);
                            });
                            elmt.querySelector(".next-arrow").addEventListener("click", function(e){
                                api.navImages(1);
                            });
                            // add this element to the document
                            document.getElementById("image-display").prepend(elmt);
            
                            let comForm = document.createElement('form');
                            comForm.className = "complex_form";
                            comForm.id = "create_comment_form";
                            comForm.innerHTML = `
                                <div class="form_title">Post a comment</div>
                                <textarea rows="5" id="post_content" class="form_element" name="user_comment" placeholder="Enter your comment" required></textarea>
                                <button type="submit" class="btn">Post your comment</button>
                            `
                            comForm.addEventListener("submit", function(e){
                                // prevent from refreshing the page on submit
                                e.preventDefault();
                                // read form elements
                                let content = document.getElementById("post_content").value;
                                // clean form
                                document.getElementById("create_comment_form").reset();
                                api.addComment(image._id, content);
                            });
                            document.getElementById("comment-form").prepend(comForm);
            
                            api.onCommentUpdate(function(comments){
                                document.querySelector('#comments').innerHTML = '';
                                if (comments != undefined && comments != null){
                                    comments.forEach(function(comment){
                                        // create a new comment element
                                        let elmt = document.createElement('div');
                                        elmt.className = "comment";
                                        elmt.innerHTML=`
                                            <div class="comment_user">
                                                <img class="comment_picture" src="media/user.png" alt="${comment.author}">
                                                <div class="comment_username">${comment.author}</div>
                                            </div>
                                            <div class="comment_content">${comment.content}</div>
                                            <div class="comment_date">${comment.date}</div>
                                            <div class="delete-icon icon"></div>
                                        `;
                                        elmt.querySelector(".delete-icon").addEventListener("click", function(e){
                                            api.deleteComment(comment._id);
                                        });
                                        // add this element to the document
                                        document.getElementById("comments").prepend(elmt);
                                    });
                                }
                                if (document.querySelector('#comments').innerHTML == '' ||
                                        document.querySelector('#comments').style.display == "none"){
                                    document.querySelector('#pagination').style.display = "none";
                                }
                                else{
                                    document.querySelector('#pagination').style.display = "flex";
                                }
                            });
                        }
                    });
                }
            });
        });

        document.querySelector("#pagination .prev-arrow").addEventListener("click", function(e){
            api.navComments(-1);
        });

        document.querySelector("#pagination .next-arrow").addEventListener("click", function(e){
            api.navComments(1);
        });

        document.getElementById("signout_button").addEventListener('click', function (e) {
            api.signout();
        })

    }
}());
