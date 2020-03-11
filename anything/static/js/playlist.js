const WFP = require("waveform-playlist");

var playlist = WFP.init({
    // webaudio api AudioContext
    ac: new (window.AudioContext || window.webkitAudioContext)(),
  
    // DOM container element REQUIRED
    container: document.querySelector("#playlist"),
  
    // number of audio samples per waveform peak.
    // must be an entry in option: zoomLevels.
    samplesPerPixel: 4096,
  
    // whether to draw multiple channels or combine them.
    mono: true,
  
    // enables "exclusive solo" where solo switches between tracks
    exclSolo: false,
  
    // default fade curve type.
    fadeType: "logarithmic", // (logarithmic | linear | sCurve | exponential)
  
    // whether or not to include the time measure.
    timescale: true,
  
    // control panel on left side of waveform
    controls: {
      // whether or not to include the track controls
      show: true,
  
      // width of controls in pixels
      width: 150
    },
  
    colors: {
      // color of the wave background
      waveOutlineColor: "white",
  
      // color of the time ticks on the canvas
      timeColor: "grey",
  
      // color of the fade drawn on canvas
      fadeColor: "black"
    },
  
    // height in pixels of each canvas element a waveform is on.
    waveHeight: 128,
  
    // interaction state of the playlist
    // (cursor | select | fadein | fadeout | shift)
    state: "cursor",

    // Array of zoom levels in samples per pixel.
    // Smaller numbers have a greater zoom in.
    zoomLevels: [512, 1024, 2048, 4096],
  
    // Whether to automatically scroll the waveform while playing
    isAutomaticScroll: false,
  });


playlist.load([
    {
      src: "audio-2.mp3",
      name: "Drums",
      start: 8.5,
      fadeIn: {
        duration: 0.5
      },
      fadeOut: {
        shape: "logarithmic",
        duration: 0.5
      }
    },
    {
      src: "audio-file.mp3",
      name: "Guitar",
      start: 23.5,
      fadeOut: {
        shape: "linear",
        duration: 0.5
      },
      cuein: 15
      
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

var $time = $container.find('.audio-pos');

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
    $('.btn-trim-audio').removeClass('disabled');
    $('.btn-loop').removeClass('disabled');
  }
  else {
    $('.btn-trim-audio').addClass('disabled');
    $('.btn-loop').addClass('disabled');
  }



  startTime = start;
  endTime = end;
}

function updateTime(time) {
  $time.html(cueFormatters(format)(time));

  audioPos = time;
}

updateSelect(startTime, endTime);
updateTime(audioPos);


$container.on("click", ".btn-annotations-download", function() {
  ee.emit("annotationsrequest");
});

$container.on("click", ".btn-loop", function() {
  isLooping = true;
  playoutPromises = playlist.play(startTime, endTime);
});

$container.on("click", ".btn-play", function() {
  ee.emit("play");
});

$container.on("click", ".btn-pause", function() {
  isLooping = false;
  ee.emit("pause");
});

$container.on("click", ".btn-stop", function() {
  isLooping = false;
  ee.emit("stop");
});

$container.on("click", ".btn-rewind", function() {
  isLooping = false;
  ee.emit("rewind");
});

$container.on("click", ".btn-fast-forward", function() {
  isLooping = false;
  ee.emit("fastforward");
});

$container.on("click", ".btn-clear", function() {
  isLooping = false;
  ee.emit("clear");
});

$container.on("click", ".btn-record", function() {
  ee.emit("record");
});

//track interaction states
$container.on("click", ".btn-cursor", function() {
  ee.emit("statechange", "cursor");
  toggleActive(this);
});

$container.on("click", ".btn-select", function() {
  ee.emit("statechange", "select");
  toggleActive(this);
});

$container.on("click", ".btn-shift", function() {
  ee.emit("statechange", "shift");
  toggleActive(this);
});

$container.on("click", ".btn-fadein", function() {
  ee.emit("statechange", "fadein");
  toggleActive(this);
});

$container.on("click", ".btn-fadeout", function() {
  ee.emit("statechange", "fadeout");
  toggleActive(this);
});

//fade types
$container.on("click", ".btn-logarithmic", function() {
  ee.emit("fadetype", "logarithmic");
  toggleActive(this);
});


//zoom buttons
$container.on("click", ".btn-zoom-in", function() {
  ee.emit("zoomin");
});

$container.on("click", ".btn-zoom-out", function() {
  ee.emit("zoomout");
});

$container.on("click", ".btn-trim-audio", function() {
  ee.emit("trim");
});

$container.on("click", ".btn-info", function() {
  console.log(playlist.getInfo());
});

$container.on("click", ".btn-download", function () {
  ee.emit('startaudiorendering', 'wav');
});

$container.on("click", ".btn-seektotime", function () {
  var time = parseInt(document.getElementById("seektime").value, 10);
  ee.emit("select", time, time);
});

$container.on("change", ".select-seek-style", function (node) {
  playlist.setSeekStyle(node.target.value);
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
    ee.emit("newtrack", dropEvent.dataTransfer.files[i]);
  }
});

$container.on("change", ".time-format", function(e) {
  format = $timeFormat.val();
  ee.emit("durationformat", format);

  updateSelect(startTime, endTime);
  updateTime(audioPos);
});

$container.on("input change", ".master-gain", function(e){
  ee.emit("mastervolumechange", e.target.value);
});

$container.on("change", ".continuous-play", function(e){
  ee.emit("continuousplay", $(e.target).is(':checked'));
});

$container.on("change", ".link-endpoints", function(e){
  ee.emit("linkendpoints", $(e.target).is(':checked'));
});

$container.on("change", ".automatic-scroll", function(e){
  ee.emit("automaticscroll", $(e.target).is(':checked'));
});

function displaySoundStatus(status) {
  $(".sound-status").html(status);
}

function displayLoadingData(data) {
  var info = $("<div/>").append(data);
  $(".loading-data").append(info);
}

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

ee.on("mute", function(track) {
  displaySoundStatus("Mute button pressed for " + track.name);
});

ee.on("solo", function(track) {
  displaySoundStatus("Solo button pressed for " + track.name);
});

ee.on("volumechange", function(volume, track) {
  displaySoundStatus(track.name + " now has volume " + volume + ".");
});

ee.on("mastervolumechange", function(volume) {
  displaySoundStatus("Master volume now has volume " + volume + ".");
});


var audioStates = ["uninitialized", "loading", "decoding", "finished"];

ee.on("audiorequeststatechange", function(state, src) {
  var name = src;

  if (src instanceof File) {
    name = src.name;
  }

  displayLoadingData("Track " + name + " is in state " + audioStates[state]);
});

ee.on("loadprogress", function(percent, src) {
  var name = src;

  if (src instanceof File) {
    name = src.name;
  }

  displayLoadingData("Track " + name + " has loaded " + percent + "%");
});

ee.on("audiosourcesloaded", function() {
  displayLoadingData("Tracks have all finished decoding.");
});

ee.on("audiosourcesrendered", function() {
  displayLoadingData("Tracks have been rendered");
});

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