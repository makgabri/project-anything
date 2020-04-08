(function(){

    "use strict";
    window.onload = function(){

        /** Error Handlers **/
        api.onError(function(err){
            console.error("[error]", err);
        });
        
        api.onError(function(err){
            var error_box = document.querySelector('#error_box');
            error_box.innerHTML = err;
            error_box.style.display = "block";
        });

        /**     UI Navigation    **/
        document.getElementById("signout_button").addEventListener('click', function (e) {
            api.signout();
            window.location.href = '/';
        })
    

        /** Basic functionality if logged in **/
        api.onLoginUpdate(function(username){
            if (!username) {
                window.location.href = '/';
            }

            document.querySelector("#signout_button").style.display = (username)? 'block' : 'none';
            if (username){
                let elmt = document.querySelector('#welcome_message');
                elmt.innerHTML = `
                    <h3>Hello ${username.familyName} ${username.givenName}</h3>
                    <h3>These are your tracks</h3>
                `
            }

            document.querySelector("#complex_form").addEventListener("submit", function(e){
                e.preventDefault();
                let title = document.querySelector("#project-name").value;
                document.querySelector("#complex_form").reset();
                api.addProject(title);
            });
        });

        /** Loading Prjects **/
        api.onProjListUpdate(function(projList) {
            let projDiv = document.querySelector("#projects");
            projDiv.innerHTML = '';

            projList.forEach(function(project) {
                let elmt = document.createElement('button');
                elmt.className = 'project_btn';
                elmt.innerHTML = project.title;

                projDiv.append(elmt);

                elmt.addEventListener('click', function(e) {
                    api.setCurrProj(project._id);
                    window.location.href = '/workstation.html';
                })
            })
        })

        document.querySelector("#pagination .prev-arrow").addEventListener("click", function(e){
            api.navComments(-1);
        });

        document.querySelector("#pagination .next-arrow").addEventListener("click", function(e){
            api.navComments(1);
        });
        


    }
}());
