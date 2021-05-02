// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
const imageIn = document.getElementById("image-input");
const generate = document.getElementById("generate-meme");
const toptext = document.getElementById("text-top");
const bottomtext = document.getElementById("text-bottom");
const resetbutton = document.querySelector("[type='reset']");
const readbutton = document.querySelector("[type='button']");

var synth = window.speechSynthesis;
var voiceSelect = document.getElementById('voice-selection');
var voices = [];
var volume = 1;

function populateVoiceList() {
  voiceSelect.disabled = false;
  voices = synth.getVoices();
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);

});

imageIn.addEventListener('change', () => {
  var file = imageIn.files[0]
  img.src = URL.createObjectURL(file);
  var name = file.name;
  img.alt = name;
});


generate.addEventListener('submit', () => {
  resetbutton.disabled = false;
  readbutton.disabled = false;
  ctx.font = "30px Arial";
  ctx.fillText(toptext.value, 10, 50);
  ctx.fillText(bottomtext.value, 10, canvas.height-10);
  event.preventDefault();
});

resetbutton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetbutton.disabled = true;
  readbutton.disabled = true;
});

readbutton.addEventListener('click', () => {
  event.preventDefault();
  var utterThis = new SpeechSynthesisUtterance(toptext.value + " " + bottomtext.value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = volume;
  synth.speak(utterThis);
  
});

const slider = document.querySelector("[type='range']");
slider.addEventListener('input', () => {
  var vol = slider.valueAsNumber; 
  var icon = document.querySelector("[alt='Volume Level 3']");
  if(vol == 0){
    volume = 0; 
    icon.src = "icons/volume-level-0.svg";
  } else if (vol > 0 && vol <=33){
    volume = 0.33;
    icon.src = "icons/volume-level-1.svg";
  } else if (vol > 33 && vol <= 66){
    volume = 0.66;
    icon.src = "icons/volume-level-2.svg";
  } else {
    volume = 1;
    icon.src = "icons/volume-level-3.svg";
  }
});




/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
