(function(){
    "use strict";
    window.addEventListener('load', function(){        
        api.onUserLoadUpdate(function(usernames){
            usernames.forEach(function(username){
                let elmt = document.createElement('option');
                elmt.value = username._id;
                elmt.innerHTML = username._id;
                elmt.className = "user-list-item";
                document.querySelector("#user-list").prepend(elmt);
            });
            let button = document.createElement('button');
            button.className = "select-user btn button";
            button.innerHTML = "Go";
            document.querySelector(".drop-down").append(button);
            document.querySelector('.select-user').addEventListener('click', function(e){
                let userValue = document.querySelector("#user-list").value;
                api.changeGallery(userValue);
            });
            

        });

        api.onImageUpdate(function(item){
           document.querySelector('#image-viewer').innerHTML = '';
            if (item){

                let authorNav = document.createElement('div');
                authorNav.className = "author-nav nav";
                authorNav.innerHTML = `
                <div class="left-icon icon"></div>
                <div class="image_author image_text">${item.author}'s Gallery</div>
                <div class="right-icon icon"></div>
                `;

                let imageTitle = document.createElement('div');
                imageTitle.className = "image_title image_text";
                imageTitle.innerHTML = `${item.title}`;

                let imageNav = document.createElement('div');
                imageNav.className = "image-nav nav";
                imageNav.innerHTML = `
                <div class="left-icon icon"></div>
                <img class="message_picture" src=/api/images/${item._id}/ alt="${item.title}">
                <div class="right-icon icon"></div>
                `;
                let imageInfo = document.createElement('div');
                imageInfo.className = "image-info";
                imageInfo.innerHTML = `
                <div class="image_date image_text">${item.date}</div>                
                <div class="image_author image_text">By ${item.author}</div>
                <div class="delete-icon icon"></div>
                `;
                let comments = document.createElement('div');
                comments.id = "comments";
                comments.innerHTML = '<div id="comments_title"> Comments: 0 </div>';

                let commentForm = document.createElement('form');
                commentForm.className = "complex_form";
                commentForm.id = "comment_form";
                commentForm.innerHTML = `
                <div class="form_title">What would you like to share with ${item.author}?</div>
                <textarea rows="5" id="post_content" class="form_element" name="user_message" placeholder="Enter your message" required></textarea>
                <button type="submit" class="btn button">Post your Comment!</button>
                `;

                imageInfo.querySelector('.delete-icon').addEventListener('click', function(e){
                    api.deleteImage(item._id);
                });
                imageNav.querySelector('.left-icon').addEventListener('click', function(e){
                    api.navigate(1);
                });
                imageNav.querySelector('.right-icon').addEventListener('click', function(e){
                    api.navigate(-1);
                });
                authorNav.querySelector('.left-icon').addEventListener('click', function(e){
                    api.navigateUser(1);
                });
                authorNav.querySelector('.right-icon').addEventListener('click', function(e){
                    api.navigateUser(-1);
                });

                document.querySelector('#image-viewer').prepend(comments);
                document.querySelector('#image-viewer').prepend(commentForm);
                document.querySelector('#image-viewer').prepend(imageInfo);
                document.querySelector('#image-viewer').prepend(imageNav);
                document.querySelector('#image-viewer').prepend(imageTitle);
                document.querySelector('#image-viewer').prepend(authorNav);


                document.querySelector('#comment_form').addEventListener('submit', function(e){
                    // prevent from refreshing the page on submit
                    e.preventDefault();
                    // read form elements
                    let content = document.getElementById("post_content").value;
                    let imageId = item._id;
                    document.querySelector('#comment_form').reset();
                    api.addComment(imageId, content);
                });
                api.onCommentUpdate(item._id, function(items){
                    let commentSection = document.querySelector('#comments');
                    if (commentSection){
                        commentSection.innerHTML = '';
                        if (items){
                            let commentTitle = document.createElement('div');
                            commentTitle.id = "comments_title";
                            commentTitle.innerHTML = `
                            Comments: Showing ${items[items.length-2]} to ${items[items.length-1]} of ${items[items.length-3]}
                            `;
                            let navIcons = document.createElement('div');
                            navIcons.className = "icons";
                            navIcons.innerHTML = `
                            <div class="left-icon icon"></div>    
                            <div class="right-icon icon"></div>
                            `;
                            let comments = items.slice(0,items.length-3);
            
                            comments.forEach(function(item){
                                let element = document.createElement('div');
                                element.className = "message";
                                element.innerHTML = `
                                        <div class="message_user">
                                            <div class="message_username">${item.author}</div>
                                            <div class="message_date">${item.date}</div>
                                        </div>
                                        <div class="message_content"><p>${item.content}</p></div>
                                        <div class="delete-icon icon"></div>
                                `;
                                element.querySelector('.delete-icon').addEventListener('click', function(e){
                                    api.deleteComment(item._id);
                                });
                                document.querySelector('#comments').prepend(element);
                            });
                            document.querySelector('#comments').prepend(navIcons);
                            document.querySelector('#comments').prepend(commentTitle);
            
                            navIcons.querySelector('.left-icon').addEventListener('click', function(e){
                                api.navigatePage(-1);
                            });
                            navIcons.querySelector('.right-icon').addEventListener('click', function(e){
                                api.navigatePage(1);
                            });
            
                        }
                    }
                });
            }
        });

        
        document.querySelector('#add_track').addEventListener('click', function(e){
            let newTrack = document.createElement('div');
            newTrack.className = "track";
            newTrack.innerHTML = `
            <div class="volume_slider"></div>
            <button id="mute_button">Mute</button>
            <button id="solo">Solo</button>
            `;
            document.querySelector('#tracks').append(newTrack);
        });


    });

}());   