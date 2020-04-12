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
    api.onLoginUpdate(function(username){
        if (username) {
            let elmt = document.createElement('div');
            elmt.className = 'nav';
            elmt.id = 'signout_button';
            elmt.innerHTML = 'Signout'

            elmt.addEventListener('click', (function(e) {
                api.signout();
                window.location.href = '/';
            }));

            document.getElementById('navigator').prepend(elmt);

            document.getElementById('title').addEventListener('click', (function(e) {
                window.location.href = '/homepage.html';
            }));
        } else {
            document.getElementById('title').addEventListener('click', (function(e) {
                window.location.href = '/';
            }));
        }
    });
}
