"use strict";
let userMediaStream;
let constraints = { audio: true };

navigator.getUserMedia = (navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);

function gotStream(stream) {
  userMediaStream = stream;
  playlist.initRecorder(userMediaStream);
  $(".btn-record").removeClass("disabled");
}

function logError(err) {
  console.error(err);
}

if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia(constraints)
  .then(gotStream)
  .catch(logError);
} else if (navigator.getUserMedia && 'MediaRecorder' in window) {
  navigator.getUserMedia(
    constraints,
    gotStream,
    logError
  );
}

/**     Waveform Playlist init    **/
let playlist = WaveformPlaylist.init({
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

    // Responsible for loading playlist
    api.onTrackUpdate(function(trackList) {
        playlist.getEventEmitter().emit("clear");

        let to_load = [];
        trackList.forEach(function(track) {
            track['src'] = '/track/'+track._id+"/file/";
            track['stereoPan'] = track['stereoPan'].$numberDecimal;
            track['gain'] = track['gain'].$numberDecimal;
            track['fadeIn'] = {
                'duration': track['fadeIn_duration'].$numberDecimal,
                'shape': track['fadeIn_shape']
            };
            track['fadeOut'] = {
                'duration': track['fadeOut_duration'].$numberDecimal,
                'shape': track['fadeOut_shape']
            };
            to_load.push(track);
        })
        playlist.load(to_load).then(function(){
            playlist.initExporter();
        });
    });

    // Responsible for adding "change name" track option
    api.onTrackUpdate(function(trackList) {
        let changeNameDOM = document.querySelector("#change-track-name");
        changeNameDOM.innerHTML = '';

        trackList.forEach(function(track) {
            let elmt = document.createElement('div');
            elmt.className = 'track_option_action';

            let name_elmt = document.createElement('div');
            name_elmt.innerHTML = track.name;
            name_elmt.style.width = '55%';
        
            let new_name_elmt = document.createElement('input');
            new_name_elmt.type = 'text';
            new_name_elmt.style.width = '20%';

            let exec = document.createElement('button');
            exec.innerHTML = 'change name';
            exec.className = 'exec_btn';
            
            elmt.append(name_elmt);
            elmt.append(new_name_elmt);
            elmt.append(exec);

            exec.addEventListener('click', function(e) {
                api.updateTrack(track._id, 'name', new_name_elmt.value);
            });

            changeNameDOM.append(elmt);
        });
    });

    // Responsible for changing fade in shape
    api.onTrackUpdate(function(trackList) {
        let changeFadeInShapeDOM = document.querySelector("#fadein-shape-name");
        changeFadeInShapeDOM.innerHTML = '';

        trackList.forEach(function(track) {
            let elmt = document.createElement('div');
            elmt.className = 'track_option_action';

            let name_elmt = document.createElement('div');
            name_elmt.innerHTML = track.name;
            name_elmt.style.width = '55%';
        
            let new_fadeInShape_elmt = document.createElement('select');
            new_fadeInShape_elmt.innerHTML = `
                <option value="logarithmic">Logarithmic</option>
                <option value="linear">Linear</option>
                <option value="sCurve">sCurve</option>
                <option value="exponential">Exponential</option>
            `;
            new_fadeInShape_elmt.value = track.fadeIn_shape;
            new_fadeInShape_elmt.style.width = '20%';

            let exec = document.createElement('button');
            exec.innerHTML = 'change fadeIn shape';
            exec.className = 'exec_btn';
            
            elmt.append(name_elmt);
            elmt.append(new_fadeInShape_elmt);
            elmt.append(exec);

            exec.addEventListener('click', function(e) {
                api.updateTrack(track._id, 'fadeIn_shape', new_fadeInShape_elmt.value);
            });

            changeFadeInShapeDOM.append(elmt);
        });
    });

    // Responsible for changing fade out shape
    api.onTrackUpdate(function(trackList) {
        let changeFadeOutShapeDOM = document.querySelector("#fadeout-shape-name");
        changeFadeOutShapeDOM.innerHTML = '';

        trackList.forEach(function(track) {
            let elmt = document.createElement('div');
            elmt.className = 'track_option_action';

            let name_elmt = document.createElement('div');
            name_elmt.innerHTML = track.name;
            name_elmt.style.width = '55%';
        
            let new_fadeOutShape_elmt = document.createElement('select');
            new_fadeOutShape_elmt.innerHTML = `
                <option value="logarithmic">Logarithmic</option>
                <option value="linear">Linear</option>
                <option value="sCurve">sCurve</option>
                <option value="exponential">Exponential</option>
            `;
            new_fadeOutShape_elmt.value = track.fadeOut_shape;
            new_fadeOutShape_elmt.style.width = '20%';

            let exec = document.createElement('button');
            exec.innerHTML = 'change fadeOut shape';
            exec.className = 'exec_btn';
            
            elmt.append(name_elmt);
            elmt.append(new_fadeOutShape_elmt);
            elmt.append(exec);

            exec.addEventListener('click', function(e) {
                api.updateTrack(track._id, 'fadeOut_shape', new_fadeOutShape_elmt.value);
            });

            changeFadeOutShapeDOM.append(elmt);
        });
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

   

}
