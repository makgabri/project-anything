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
    // Direct to homepage if logged in
    api.onUserUpdate(function(username){
        if (username) window.location.replace("../homepage.html");
    });

    /**     Adds Listeners to display action box    **/
    // Add/Changes form to login option
    this.document.getElementById("login_btn").addEventListener('click', (function(e){
        let user_info = document.getElementById("user_info");
        user_info.innerHTML = '';

        // Prepare login box
        let elmt = document.createElement('form');
        elmt.className = "submit_form";
        elmt.innerHTML = `
            <input type="text" id="username" class="element" placeholder="Enter your name" required/>
            <input type="password" id="password" class="element" placeholder="Enter your password" required/>
            <div>
                <button id="login_exec" class="btn">Sign in</button>
            </div>
        `;
        user_info.append(elmt);

        // Actual login action
        document.getElementById("login_exec").addEventListener('click', (function(e){
            // prevent page from refreshing on submit
            e.preventDefault();
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            api.signin(username, password);
        }));
    }));

    // Add/Changes form to signup option
    this.document.getElementById("register_btn").addEventListener('click', (function(e){
        let user_info = document.getElementById("user_info");
        user_info.innerHTML = '';

        // Prepare login box
        let elmt = document.createElement('form');
        elmt.className = "submit_form";
        elmt.innerHTML = `
            <input type="text" id="username" class="element" placeholder="Enter your name" required/>
            <input type="password" id="password" class="element" placeholder="Enter a password" required/>
            <input type="password" id="password_repeat" class="element" placeholder="Re-enter your password" required/>
            <div>
                <button id="register_exec" class="btn">Sign up</button>
            </div>
        `;
        user_info.append(elmt);

        // Actual register action
        document.getElementById("register_exec").addEventListener('click', (function(e){
            // prevent page from refreshing on submit
            e.preventDefault();
            let username = document.getElementById("username").value;
            let password = document.getElementById("password").value;
            let password2 = document.getElementById("password_repeat").value;
            if (api.check_password(password, password2)) {
                api.signup(username, password);
            }
        }));
    }));

};