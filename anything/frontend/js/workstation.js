"use strict";

/**     Load Waveform Playlist    **/
var playlist = WaveformPlaylist.init({
    // DOM for playlist
    container: this.document.querySelector('#playlist'),
    state: 'cursor',
    colors: {
      waveOutlineColor: '#E0EFF1',
      timeColor: 'grey',
      fadeColor: 'black'
    },
    timescale: true,
    // control panel on left side
    controls: {
        show: true,
        width: 150
    },
    waveHeight: 123
});


/** Helper Functions **/
let editTitle = function(e) {
    document.querySelector("#edit_title").removeEventListener('click', editTitle);
    document.querySelector("#edit_title").className = "hidden";
    document.querySelector("#save_title").addEventListener('click', saveTitle);
    document.querySelector("#save_title").className = "save_title";
    let titleDOM = document.querySelector(".title");
    titleDOM.innerHTML = '<input value="'+titleDOM.innerText+'">';
}

let saveTitle = function(e) {
    document.querySelector("#save_title").className = "hidden";
    document.querySelector("#save_title").removeEventListener('click', saveTitle);
    document.querySelector("#edit_title").className = "edit_title";
    document.querySelector("#edit_title").addEventListener('click', editTitle);
    let titleDOM = document.querySelector(".title");
    let newTitle = titleDOM.childNodes[0].value;
    titleDOM.innerHTML = newTitle;
    api.updateProjectTitle(newTitle);
}

/**     Load Website Functionality    **/
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

    /** Project Handlers **/
    api.onProjectUpdate(function(project) {
        document.querySelector(".title").innerHTML = project.title;
    });

    document.querySelector("#edit_title").className = 'edit_title';
    document.querySelector("#edit_title").addEventListener('click', editTitle);

    /**     UI Navigation    **/
    document.getElementById("signout_button").addEventListener('click', function(e) {
        api.signout();
        window.location.href = '/';
    });

    api.onLoginUpdate(function(username){
        if (!username) {
            window.location.href = '/';
        }
    });

    playlist.load([
        {
            src: "audio-2.mp3",
            name: "Track1"
        },
        {
            src: "audio-file.mp3",
            name: "Track2",      
        }
      ]).then(function() {
        //initialize the WAV exporter.
        playlist.initExporter();
    });
    
   

}
