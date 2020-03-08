(function(){
    "use strict";
    window.addEventListener('load', function(){        

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