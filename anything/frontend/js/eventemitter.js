/** Helper Functions **/
/**
 * cueFormatters
 * @param {String} format - string format of time
 * @returns the formated time
 */
function cueFormatters(format) {
    // Function to convert time into string
    function clockFormat(seconds, decimals) {
        var hours,
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
    var formats = {
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
    var active = node.parentNode.querySelectorAll('.active');
    var i = 0, len = active.length;

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
      document.querySelector(".btn-trim-audio").classList.add('disabled')
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
    var dateString = (new Date()).toISOString();
    var $link = $("<a/>", {
        'href': link,
        'download': 'waveformplaylist' + dateString + '.wav',
        'text': 'Download mix ' + dateString,
        'class': 'btn btn-small btn-download-link'
    });

    $('.btn-download-link').remove();
    $('.btn-download').after($link);
}

function displayLoadingData(info) {
    document.querySelector(".load-progress").innerHTML = info;
}

function getTrackIdBySrc(src) {
    let src_split = src.split("/");
    return (src_split[src_split.length-3]);
}
/** End of Helper Functions **/

// Begin Event Emitter Methods
var ee = playlist.getEventEmitter();
var $container = $("body");

/** Load timebox **/
let timeBox = document.querySelector(".audio-pos");
let audioStart = document.querySelector(".audio-start");
let audioEnd = document.querySelector(".audio-end");
let format = "hh:mm:ss.uuu";
let audioPos = 0;
var startTime = 0;
var endTime = 0;
updateSelect(startTime, endTime);
updateTime(audioPos);
ee.on("select", updateSelect);
ee.on("timeupdate", updateTime);



/** Variables for playlist **/
var downloadUrl;
var isLooping = false;
var playoutPromises;



/** Below are event emitters for playlist actions **/
// Play Button
document.querySelector(".btn-play").addEventListener('click', function(e){
    ee.emit("play");
});

// Pause Button
document.querySelector(".btn-pause").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("pause");
});

// Stop Button
document.querySelector(".btn-stop").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("stop");
});

// Rewind Button
document.querySelector(".btn-rewind").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("rewind");
});

// Fastforward Button
document.querySelector(".btn-fast-forward").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("fastforward");
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
document.querySelector(".btn-download").addEventListener('click', function(e){
    ee.emit('startaudiorendering', 'wav');
});

//track drop
$container.on("dragenter", ".track-drop", function(e) {
  e.preventDefault();
  e.target.classList.add("drag-enter");
});

$container.on("dragover", ".track-drop", function(e) {
  e.preventDefault();
});

$container.on("dragleave", ".track-drop", function(e) {
  e.preventDefault();
  e.target.classList.remove("drag-enter");
});

$container.on("drop", ".track-drop", function(e) {
  e.preventDefault();
  e.target.classList.remove("drag-enter");

  var dropEvent = e.originalEvent;

  for (var i = 0; i < dropEvent.dataTransfer.files.length; i++) {
    //ee.emit("newtrack", dropEvent.dataTransfer.files[i]);
    api.uploadTrack(dropEvent.dataTransfer.files[i]);
  }
});


let gainChangeEvents = ["input", "change"];
for (event of gainChangeEvents){
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
})

ee.on('audiorenderingfinished', function (type, data) {
  if (type == 'wav'){
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl);
    }
    downloadUrl = window.URL.createObjectURL(data);
    displayDownloadLink(downloadUrl);
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
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'soloed', soloed_status);
});

ee.on('mute', function(track) {
    let mute_status = false;

    playlist.mutedTracks.forEach(function(iter_track) {
        if (getTrackIdBySrc(iter_track.src) == getTrackIdBySrc(track.src)) {
            mute_status = true;
        }
    });
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'muted', mute_status);
});

ee.on('volumechange', function(volume, track) {
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'gain', (volume/100));
});

ee.on('fadein', function (duration, track) {
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'fadeIn_duration', duration);
});

ee.on('fadeout', function (duration, track) {
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'fadeOut_duration', duration);
});

ee.on('shift', function (deltaTime, track) {
    api.silentUpdateTrack(getTrackIdBySrc(track.src), 'start', track.getStartTime() + deltaTime);
});

ee.on('trim', function () {
    let activeTrack = playlist.getActiveTrack();
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'cuein', startTime);
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'cueout', endTime);
    api.silentUpdateTrack(getTrackIdBySrc(activeTrack.src), 'start', startTime);
});