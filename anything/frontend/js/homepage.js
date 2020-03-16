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
            document.querySelector("#signout_button").style.display = (username)? 'block' : 'none';
            if (username){
                let elmt = document.querySelector('#welcome_message');
                elmt.innerHTML = `
                    <h3>Hello ${username}</h3>
                    <h3>These are your tracks</h3>
                `
            }

            document.querySelector("#complex_form").addEventListener("submit", function(e){
                e.preventDefault();
                let title = document.querySelector("#project-name").value;
                let author = username;
                document.querySelector("complex_form").reset();
                playlistApi.addProject(title, author);
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
