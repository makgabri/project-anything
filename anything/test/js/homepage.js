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
    // Add listener to signout, will redirect to login screen
    document.getElementById("signout").addEventListener('click', (function(e){
        api.signout();
    }));
    // Add listener to direct to mygallery(user's gallery)
    document.getElementById("mygallery").addEventListener('click', (function(e){
        let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        window.location.replace("../webgallery.html?user="+username);
    }));
    // Add listener to direct "homepage" properly(home page is clicking webgallery). If singed in, show homepage, if not, go to login screen
    document.getElementById("title").addEventListener('click', (function(e){
        let username = document.cookie.replace(/(?:(?:^|.*;\s*)username\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (username == '') {
            window.location.replace("/");
        } else {
            window.location.reload();
        }
    }));

    /**     Pagination      **/
    // Add the pagination to choose name order(a-z)
    let letter_list = Array.prototype.slice.call(document.getElementById("letter_list").getElementsByTagName("li"), 0);
    letter_list.forEach((function(alphabet) {
        alphabet.addEventListener('click', (function() {
            if (alphabet.innerHTML == "no filter") {
                api.set_user_alpha(null);
            } else {
                api.set_user_alpha(alphabet.innerHTML);
            }
        }));
    }));
    // Adds users to choices
    api.onUserListUpdate(function(user_list) {
        let userbox= document.getElementById("users");
        userbox.innerHTML='';
        
        user_list.forEach(function(user){
            let elmt = document.createElement('button');
            elmt.className = "btn";
            elmt.innerHTML = user._id + "'s gallery";
            userbox.append(elmt);

            elmt.addEventListener('click', function(e) {
                api.set_user_gallery(user._id);
                window.location.replace("../webgallery.html?user="+user._id);
            });
        });

        // Current user page
        let page = api.get_user_page();

        // Add previous 10 users navigation button
        let old_prev_10_user = document.getElementById("prev_10");
        let new_prev_10_user = old_prev_10_user.cloneNode(true);
        old_prev_10_user.parentNode.replaceChild(new_prev_10_user, old_prev_10_user);
        if (page > 0) {
            new_prev_10_user.className = "navigate prev_10";
            new_prev_10_user.addEventListener('click', (function(e) {
                api.set_user_page(page-1);
            }));
        } else {
            new_prev_10_user.className = "navigate prev_10_empty";
        }

        // Add next 10 users navigation button
        let old_next_10_user = document.getElementById("next_10");
        let new_next_10_user = old_next_10_user.cloneNode(true);
        old_next_10_user.parentNode.replaceChild(new_next_10_user, old_next_10_user);
            api.get_max_user_page((function(err, max_page) {
                if (err) (console.log("[error] Loading number of pages failure"));
                if (page+1 < max_page) {
                    new_next_10_user.className = "navigate next_10";
                    new_next_10_user.addEventListener('click', (function(e){
                        api.set_user_page(page+1);
                    }));
                } else {
                    new_next_10_user.className = "navigate next_10_empty";
                }
            }));
    });


    // Call automatic refresher to collect new users if new user registered
    api.homepage_refresh();
    


};