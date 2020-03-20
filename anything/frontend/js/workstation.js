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
    document.getElementById('credits').addEventListener('click', (function(e) {
        window.location.href = '/credits.html';
    }));
    document.getElementById('github').addEventListener('click', (function(e) {
        window.location.href = 'https://github.com/UTSCC09/project-anything';
    }));
    document.getElementById('about').addEventListener('click', (function(e) {
        window.location.href = '/about.html';
    }));
    document.getElementById("signout_button").addEventListener('click', function (e) {
        api.signout();
        window.location.href = '/';
    });

    api.onLoginUpdate(function(username){
        if (!username) {
            window.location.href = '/';
        }
    });
}
