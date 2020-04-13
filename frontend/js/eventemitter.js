/*jslint -W083 */

/** Helper Functions **/
/**
 * cueFormatters
 * @param {String} format - string format of time
 * @returns the formated time
 */
function cueFormatters(format) {
    // Function to convert time into string
    function clockFormat(seconds, decimals) {
        let hours,
            minutes,
            secs,
            result;
  
        hours = parseInt(seconds / 3600, 10) % 24;
        minutes = parseInt(seconds / 60, 10) % 60;
        secs = seconds % 60;
        secs = secs.toFixed(decimals);
        result = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (secs < 10 ? "0" + secs : secs);
        return result;
    }
    // Dictionary to convert corresponding time
    let formats = {
        "seconds": function (seconds) {
            return seconds.toFixed(0);
        },
        "thousandths": function (seconds) {
            return seconds.toFixed(3);
        },
        "hh:mm:ss": function (seconds) {
            return clockFormat(seconds, 0);   
        },
        "hh:mm:ss.u": function (seconds) {
            return clockFormat(seconds, 1);   
        },
        "hh:mm:ss.uu": function (seconds) {
            return clockFormat(seconds, 2);   
        },
        "hh:mm:ss.uuu": function (seconds) {
            return clockFormat(seconds, 3);   
        }
    };
    return formats[format];
}

/**
 * updateTime
 * @param {Decimal} time 
 * Function to be called when time is updated
 */
function updateTime(time) {
    timeBox.innerHTML = cueFormatters(format)(time);
    audioPos = time;
}

/**
 * toggleActive
 * @param {DOM node} node 
 * Toggles a node as active
 */
function toggleActive(node) {
    let active = node.parentNode.querySelectorAll('.active');
    let i = 0, len = active.length;

    for (; i < len; i++) {
        active[i].classList.remove('active');
    }

    node.classList.toggle('active');
}

/**
 * updateSelect
 * @param {Decimal} start 
 * @param {Decimal} end 
 * Used to update time
 */
function updateSelect(start, end) {
    if (start < end) {
      document.querySelector(".btn-trim-audio").classList.remove('disabled');
      document.querySelector(".btn-loop").classList.remove('disabled');
    }
    else {
      document.querySelector(".btn-trim-audio").classList.add('disabled');
      document.querySelector(".btn-loop").classList.add('disabled');
    }
    audioStart.value = cueFormatters(format)(start);
    audioEnd.value = cueFormatters(format)(end);
    startTime = start;
    endTime = end;
}

/**
 * displayDownloadLink
 * @param {href} link 
 * Used to prepare link to download audio
 */
function displayDownloadLink(link) {
    let $link = $("<a/>", {
        'href': link,
        'download': document.querySelector(".title").innerHTML + '.wav',
        'text': 'Download mix ' + document.querySelector(".title").innerHTML,
        'class': 'btn btn-small btn-download-link'
    });

    $('.btn-download-link').remove();
    $('.btn-download').after($link);
}

function displayLoadingData(info) {
    if (info){
        document.querySelector(".load-progress").innerHTML = `
            <img class='loading' src='../media/loading.gif'><br>
            ${info}
        `;
    } else {
        document.querySelector(".load-progress").innerHTML = '';
    }
}

function getTrackIdBySrc(src) {
    let src_split = src.split("/");
    return (src_split[src_split.length-3]);
}

function blobToFile(blob, fileName){
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
}

function stopRecording() {
    ee.emit("stop");

    let recordingDOM = document.querySelector("#record_button");
    recordingDOM.classList.add('btn-record');
    recordingDOM.classList.remove('btn-record-live');

    recording = false;
    let recordedBlob = playlist.mediaRecorder.requestData();
    recordedBlob = blobToFile(recordedBlob, 'Recording.oog');
    api.uploadTrack(recordedBlob);
}

function changeLoopState(state) {
    isLooping = state;
    if (state) {
        document.getElementById('loop_button').classList.remove('btn-loop');
        document.getElementById('loop_button').classList.add('btn-loop-red');
    } else {
        document.getElementById('loop_button').classList.remove('btn-loop-red');
        document.getElementById('loop_button').classList.add('btn-loop');
    }
}
/** End of Helper Functions **/

// Begin Event Emitter Methods
let ee = playlist.getEventEmitter();

/** Load timebox **/
let timeBox = document.querySelector(".audio-pos");
let audioStart = document.querySelector(".audio-start");
let audioEnd = document.querySelector(".audio-end");
let format = "hh:mm:ss.uuu";
let audioPos = 0;
let startTime = 0;
let endTime = 0;
updateSelect(startTime, endTime);
updateTime(audioPos);
ee.on("select", updateSelect);
ee.on("timeupdate", updateTime);



/** letiables for playlist **/
let downloadUrl;
let isLooping = false;
let playoutPromises;
let recording = false;



/** Below are event emitters for playlist actions **/
// Play Button
document.querySelector(".btn-play").addEventListener('click', function(e){
    ee.emit("play");
});

// Pause Button
document.querySelector(".btn-pause").addEventListener('click', function(e){
    if (isLooping) {
        document.getElementById('loop_button').classList.remove('btn-loop-red');
        document.getElementById('loop_button').classList.add('btn-loop');
        isLooping = false;
    }
    ee.emit("pause");
});

// Stop Button
document.querySelector(".btn-stop").addEventListener('click', function(e){
    if (isLooping) {
        document.getElementById('loop_button').classList.remove('btn-loop-red');
        document.getElementById('loop_button').classList.add('btn-loop');
        isLooping = false;
    }
    if (recording) {
        let recordingDOM = document.querySelector("#record_button");
        recordingDOM.classList.add('btn-record');
        recordingDOM.classList.remove('btn-record-live');
        recording = false;
    }
    ee.emit("stop");
});

// Zoom in
document.querySelector(".btn-zoom-in").addEventListener('click', function(e) {
    ee.emit('zoomin');
});

// Zoom out
document.querySelector(".btn-zoom-out").addEventListener('click', function(e) {
    ee.emit('zoomout');
});

// Record Button
document.querySelector(".btn-record").addEventListener('click', function(e) {
    if (recording) {
        ee.emit("stop");
        this.classList.add('btn-record');
        this.classList.remove('btn-record-live');
        recording = false;
    } else {
        recording = true;
        this.classList.remove('btn-record');
        this.classList.add('btn-record-live');
        ee.emit("record");
    }
});

// Rewind Button
document.querySelector(".btn-rewind").addEventListener('click', function(e){
    if (isLooping) {
        document.getElementById('loop_button').classList.remove('btn-loop-red');
        document.getElementById('loop_button').classList.add('btn-loop');
        isLooping = false;
    }
    ee.emit("rewind");
});

// Fastforward Button
document.querySelector(".btn-fast-forward").addEventListener('click', function(e){
    if (isLooping) {
        document.getElementById('loop_button').classList.remove('btn-loop-red');
        document.getElementById('loop_button').classList.add('btn-loop');
        isLooping = false;
    }
    ee.emit("fastforward");
});

// Change to Looping State
document.querySelector(".btn-loop").addEventListener('click', function(e) {
    isLooping = true;
    document.getElementById('loop_button').classList.remove('btn-loop');
    document.getElementById('loop_button').classList.add('btn-loop-red');
    playoutPromises = playlist.play(startTime, endTime);
});

// Change Cursor State Button
document.querySelector(".btn-cursor").addEventListener('click', function(e){
    ee.emit("statechange", "cursor");
    toggleActive(this);
});

// Change Cursor Select Button
document.querySelector(".btn-select").addEventListener('click', function(e){
    ee.emit("statechange", "select");
    toggleActive(this);
});

// Shift Button
document.querySelector(".btn-shift").addEventListener('click', function(e){
    ee.emit("statechange", "shift");
    toggleActive(this);
});

// Undo Option
document.querySelector('.btn-undo').addEventListener('click', function(e) {
    api.undoUpdate();
});

// Fade in Button
document.querySelector(".btn-fadein").addEventListener('click', function(e){
    ee.emit("statechange", "fadein");
    toggleActive(this);
});

// Fade out Button
document.querySelector(".btn-fadeout").addEventListener('click', function(e){
    ee.emit("statechange", "fadeout");
    toggleActive(this);
});

// Trim Audio Button
document.querySelector(".btn-trim-audio").addEventListener('click', function(e){
    ee.emit("trim");
});

// Download Audio Button
document.querySelector(".btn-render").addEventListener('click', function(e){
    if (playlist.tracks.length == 0) return api.invokeError("Project musn't be empty");
    ee.emit('startaudiorendering', 'wav');
});

//track drop
document.querySelector(".track-drop").addEventListener('dragenter', function(e){
  e.preventDefault();
  e.target.classList.add("drag-enter");
});

document.querySelector(".track-drop").addEventListener('dragover', function(e){
  e.preventDefault();
});

document.querySelector(".track-drop").addEventListener('dragleave', function(e){
  e.preventDefault();
  e.target.classList.remove("drag-enter");
});

document.querySelector(".track-drop").addEventListener('drop', function(e){
  e.preventDefault();
  e.target.classList.remove("drag-enter");

  let dropEvent = e;

  for (let i = 0; i < dropEvent.dataTransfer.files.length; i++) {
    //ee.emit("newtrack", dropEvent.dataTransfer.files[i]);
    api.uploadTrack(dropEvent.dataTransfer.files[i]);
  }
});


let gainChangeEvents = ["input", "change"];
for (let event of gainChangeEvents){
    document.querySelector(".master-gain").addEventListener(event, function(e){
        ee.emit("mastervolumechange", e.target.value);
    });
}

document.querySelector(".automatic-scroll").addEventListener('change', function(e){
    ee.emit("automaticscroll", document.querySelector(".automatic-scroll").checked);
});


/*
* Code below responds to updates from the playlist.
*/
ee.on("loadprogress", function(percent, src) {
    let name = src;

    if (src instanceof File) {
        name = src.name;
    }

    displayLoadingData("Track " + name + " has loaded " + percent + "%");
});

ee.on("audiosourcesloaded", function() {
    displayLoadingData('');
});

ee.on('audiorenderingfinished', function (type, data) {
  if (type == 'wav'){

    let downloadBtn = document.querySelector("#download_button");

    if (!downloadUrl) {
        downloadBtn.classList.remove('btn-download-notready');
        downloadBtn.classList.add('btn-download-ready');
    } else {
        window.URL.revokeObjectURL(downloadUrl);
    }

    downloadUrl = window.URL.createObjectURL(data);
    downloadBtn.href = downloadUrl;
    downloadBtn.download = document.querySelector(".title").innerHTML + '.wav';
  }
});

ee.on('finished', function () {
  console.log("The cursor has reached the end of the selection !");

  if (isLooping) {
    playoutPromises.then(function() {
        playoutPromises = playlist.play(startTime, endTime);
    });
  }
});

ee.on('solo', function(track) {
    let soloed_status = false;

    playlist.soloedTracks.forEach(function(iter_track) {
        if (getTrackIdBySrc(iter_track.src) == getTrackIdBySrc(track.src)) {
            soloed_status = true;
        }
    });
    api.setChangedItems(['soloed']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'soloed', soloed_status);
});

ee.on('mute', function(track) {
    let mute_status = false;

    playlist.mutedTracks.forEach(function(iter_track) {
        if (getTrackIdBySrc(iter_track.src) == getTrackIdBySrc(track.src)) {
            mute_status = true;
        }
    });
    api.setChangedItems(['muted']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'muted', mute_status);
});

ee.on('delete', function(track) {
    api.deleteTrack(getTrackIdBySrc(track.src));
});

ee.on('volumechange', function(volume, track) {
    api.setChangedItems(['gain']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'gain', (volume/100));
});

ee.on('fadein', function (duration, track) {
    api.setChangedItems(['fadeIn_duration']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'fadeIn_duration', duration);
});

ee.on('fadeout', function (duration, track) {
    api.setChangedItems(['fadeOut_duration']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'fadeOut_duration', duration);
});

ee.on('shift', function (deltaTime, track) {
    api.setChangedItems(['start']);
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'start', track.getStartTime() + deltaTime);
});

ee.on('trim', function () {
    let activeTrack = playlist.getActiveTrack();
    api.setChangedItems(['cuein', 'cueout', 'start']);
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'cuein', startTime);
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'cueout', endTime);
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'start', startTime);
});