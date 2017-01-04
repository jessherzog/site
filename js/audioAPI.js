var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

var gainNode = audioCtx.createGain();

//toggle delay on/off
var delayNode = audioCtx.createDelay(5.0);
var htmlAudio= document.querySelector('audio');
var source = audioCtx.createMediaElementSource(htmlAudio);

source.connect(delayNode);

delayNode.connect(gainNode);
gainNode.connect(audioCtx.destination);

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

function updateSound(xx, yy){
	gainNode.gain.value = (xx/WIDTH) * 0.1;
	delayNode.delayTime.value = (yy/HEIGHT) *0.03;
}