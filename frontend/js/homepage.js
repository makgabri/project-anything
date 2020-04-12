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
                    <h3>Welcome ${username.familyName} ${username.givenName} to anything</h3>
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
                let singleProjDiv = document.createElement('div');
                singleProjDiv.className = 'project_div';

                let elmt = document.createElement('button');
                elmt.className = 'project_btn';
                elmt.innerHTML = project.title;

                let delProj = document.createElement('div');
                delProj.className = 'project_delete';

                singleProjDiv.append(elmt);
                singleProjDiv.append(delProj);
                projDiv.append(singleProjDiv);

                elmt.addEventListener('click', function(e) {
                    api.setCurrProj(project._id);
                    window.location.href = '/workstation.html';
                });

                delProj.addEventListener('click', function(e) {
                    let r = confirm("Are you sure you want to delete project: " + project.title);
                    if (r == true) {
                        api.deleteProject(project._id);
                    }
                });
            });
        });

        api.onPubProjectUpdate(function(pubProjList) {
            let publicProjectDOM = document.getElementById("public_project_container");
            publicProjectDOM.innerHTML = '';
            pubProjList.forEach(function(pubProject) {
                let elmt = document.createElement('div');
                elmt.className = 'container-audio';
                elmt.innerHTML = `
                    <div class="track-title">${pubProject.title}</div>
                    <div class="track-author">Uploaded By: ${pubProject.author}</div>
                    <audio controls loop preload="auto">
                        <source src="/project/${pubProject.pubFile_id}/file/" type="audio/wav"> 
                    </audio>
                    <div class="track-date">Last Published: ${api.dateToPrettyString(pubProject.publicDate)}</div>
                `;
                publicProjectDOM.append(elmt);
            });

            let prevDOM = document.querySelector(".prev-arrow");
            let nextDOM = document.querySelector(".next-arrow");
            let curr_page = api.getHomePage();

            api.get_max_home_page(function(err, n) {
                if ((curr_page+1) < n) {
                    nextDOM.classList.remove('nav-empty');
                    nextDOM.style.cursor = 'pointer';
                    nextDOM.addEventListener('click', function(e) {
                        api.setHomePage(curr_page+1);
                    }, {once: true});
                } else {
                    nextDOM.classList.add('nav-empty');
                    nextDOM.style.cursor = 'not-allowed';
                }
            });

            if (curr_page > 0) {
                prevDOM.classList.remove('nav-empty');
                prevDOM.style.cursor = 'pointer';
                prevDOM.addEventListener('click', function(e) {
                    if (curr_page == 1) prevDOM.classList.add('nav-empty');
                    api.setHomePage(curr_page-1);
                }, {once: true});
            } else {
                prevDOM.style.cursor = 'not-allowed';
            }
        });
        
        api.homepage_refresh();

    }
}());

