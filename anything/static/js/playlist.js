const WFP = require("waveform-playlist");

let playlist = WFP.init({
    // DOM container element REQUIRED
    container: document.querySelector("#playlist"),

    // control panel on left side of waveform
    controls: {
        // whether or not to include the track controls
        show: true,

        // width of controls in pixels
        width: 150
    }
});

// eventually we playlistapi.onProjectUpdate and onTrackUpdate
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
    //can do stuff with the playlist.
    //initialize the WAV exporter.
    playlist.initExporter();
});
  

  
/*
 * This script is provided to give an example how the playlist can be controlled using the event emitter.
 * This enables projects to create/control the useability of the project.
*/











var ee = playlist.getEventEmitter();

var $container = $("body");

let timeBox = document.querySelector(".audio-pos");

var format = "hh:mm:ss.uuu";
var startTime = 0;
var endTime = 0;
var audioPos = 0;
var downloadUrl = undefined;
var isLooping = false;
var playoutPromises;

function toggleActive(node) {
  var active = node.parentNode.querySelectorAll('.active');
  var i = 0, len = active.length;

  for (; i < len; i++) {
    active[i].classList.remove('active');
  }

  node.classList.toggle('active');
}

function cueFormatters(format) {

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

function updateSelect(start, end) {
  if (start < end) {
    document.querySelector(".btn-trim-audio").classList.remove('disabled');
    document.querySelector(".btn-loop").classList.remove('disabled');
  }
  else {
    document.querySelector(".btn-trim-audio").classList.add('disabled')
    document.querySelector(".btn-loop").classList.add('disabled');
  }
  startTime = start;
  endTime = end;
}

function updateTime(time) {
    
  timeBox.innerHTML = cueFormatters(format)(time);
  audioPos = time;
}

updateSelect(startTime, endTime);
updateTime(audioPos);

/*
document.querySelector(".btn-annotations-download").addEventListener('click', function(e){
    ee.emit("annotationsrequest");
});
*/
/*
$container.on("click", ".btn-loop", function() {
  isLooping = true;
  playoutPromises = playlist.play(startTime, endTime);
});
*/

document.querySelector(".btn-play").addEventListener('click', function(e){
    ee.emit("play");
});


document.querySelector(".btn-pause").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("pause");
});


document.querySelector(".btn-stop").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("stop");
});


document.querySelector(".btn-rewind").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("rewind");
});

document.querySelector(".btn-fast-forward").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("fastforward");
});

/*
document.querySelector(".btn-clear").addEventListener('click', function(e){
    isLooping = false;
    ee.emit("clear");
});

document.querySelector(".btn-record").addEventListener('click', function(e){
    ee.emit("record");
});*/

//track interaction states
document.querySelector(".btn-cursor").addEventListener('click', function(e){
    ee.emit("statechange", "cursor");
  toggleActive(this);
});

document.querySelector(".btn-select").addEventListener('click', function(e){
    ee.emit("statechange", "select");
  toggleActive(this);
});

document.querySelector(".btn-shift").addEventListener('click', function(e){
    ee.emit("statechange", "shift");
  toggleActive(this);
});

document.querySelector(".btn-fadein").addEventListener('click', function(e){
    ee.emit("statechange", "fadein");
  toggleActive(this);
});

document.querySelector(".btn-fadeout").addEventListener('click', function(e){
    ee.emit("statechange", "fadeout");
  toggleActive(this);
});

document.querySelector(".btn-trim-audio").addEventListener('click', function(e){
    ee.emit("trim");
});

document.querySelector(".btn-download").addEventListener('click', function(e){
  ee.emit('startaudiorendering', 'wav');
});

/*
$container.on("click", ".btn-seektotime", function () {
  var time = parseInt(document.getElementById("seektime").value, 10);
  ee.emit("select", time, time);
});

$container.on("change", ".select-seek-style", function (node) {
  playlist.setSeekStyle(node.target.value);
});*/

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
    ee.emit("newtrack", dropEvent.dataTransfer.files[i]);
  }
});


//$container.on("input change", ".master-gain", function(e){
let gainChangeEvents = ["input", "change"];
for (event of gainChangeEvents){
    document.querySelector(".master-gain").addEventListener(event, function(e){
        ee.emit("mastervolumechange", e.target.value);
    });
}

/*
$container.on("change", ".continuous-play", function(e){
  ee.emit("continuousplay", $(e.target).is(':checked'));
});*/

document.querySelector(".automatic-scroll").addEventListener('change', function(e){
  ee.emit("automaticscroll", document.querySelector(".automatic-scroll").checked);
});


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


/*
* Code below receives updates from the playlist.
*/
ee.on("select", updateSelect);

ee.on("timeupdate", updateTime);


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