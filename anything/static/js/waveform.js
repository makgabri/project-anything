const WaveSurfer = require("wavesurfer.js");


let buttons = {
    play: document.querySelector("#btn-play"),
    pause: document.querySelector("#btn-pause"),
    stop: document.querySelector("#btn-stop")
};

let Spectrum = WaveSurfer.create({
    container: "#audio-spectrum",
    progressColor: "#03a9f4",
});
let Spectrum2 = WaveSurfer.create({
    container: "#audio-spectrum2",
    progressColor: "#03a9f4",
});

buttons.play.addEventListener("click", function(){
    Spectrum.play();
    Spectrum2.play();
    buttons.stop.disabled = false;
    buttons.pause.disabled = false;
    buttons.play.disabled = true;
}, false);

buttons.pause.addEventListener("click", function(){
    Spectrum.pause();
    Spectrum2.pause();

    //buttons.stop.disabled = false;
    buttons.pause.disabled = true;
    buttons.play.disabled = false;
}, false);

buttons.stop.addEventListener("click", function(){
    Spectrum.stop();
    Spectrum2.stop();

    buttons.stop.disabled = true;
    buttons.pause.disabled = false;
    buttons.play.disabled = false;
}, false);

Spectrum.on("ready", function(){
    buttons.play.disabled = false;
});

Spectrum2.on("ready", function(){
    buttons.play.disabled = false;
});

/*
window.addEventListener("resize", function(){
    let currentProgress = Spectrum.getCurrentTime() / Spectrum.getDuration();

    Spectrum.empty();
    Spectrum.drawBuffer();
    Spectrum.seekTo(currentProgress);

    buttons.pause.disabled = true;    
    buttons.play.disabled = false;
    buttons.stop.disabled = false;


    Spectrum2.empty();
    Spectrum2.drawBuffer();
    Spectrum2.seekTo(currentProgress);

    buttons.pause.disabled = true;    
    buttons.play.disabled = false;
    buttons.stop.disabled = false;

}, false);
*/


Spectrum.load("audio-file.mp3");
Spectrum2.load("audio-2.mp3")
