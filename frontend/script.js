//global variables
var playMode = false;
var tempo = 60;
var namesOn = false;


const intToNote = {
    0: 'G5',
    1: 'F#5',
    2: 'F5',
    3: 'E5',
    4: 'D#5',
    5: 'D5',
    6: 'C#5',
    7: 'C5',
    8: 'B4',
    9: 'A#4',
    10: 'A$',
    11: 'G#4',
    12: 'G4',
    13: 'F#4',
    14: 'F4',
    15: 'E4',
    16: 'D#4',
    17: 'D4',
    18: 'C#4',
    19: 'C4',
    20: 'B3',
    21: 'A#3',
    22: 'A3',
    23: 'G#3',
    24: 'G3',
    25: 'F#3',
    26: 'F3',
    27: 'E3',
    28: 'D#3',
    29: 'D3',
    30: 'C#3',
    31: 'C3',
    32: 'B2',
    33: 'A#2',
    34: 'A2',
    35: 'G#2',
    36: 'G2',
};





//document.addEventListener('DOMContentLoaded', function () {
    const gridContainer = document.getElementById('grid-container');
  
    // Variable to track painting or erasing
    let isPainting = false;
    let isErasing = false;
  
    // Add event listeners for painting and erasing
    gridContainer.addEventListener('mousedown', function (event) {
      if (event.button === 0) {
        // Left mouse button - start painting
        isPainting = true;
        isErasing = false;
        paintCell(event);
      } else if (event.button === 2) {
        // Right mouse button - start erasing
        isPainting = false;
        isErasing = true;
        eraseCell(event);
      }
    });
  
    gridContainer.addEventListener('mousemove', function (event) {
      if (isPainting) {
        paintCell(event);
      } else if (isErasing){
        eraseCell(event);
      }
    });
  
    gridContainer.addEventListener('mouseup', function () {
      isPainting = false;
      isErasing = false;
    });
  
    /*gridContainer.addEventListener('mouseleave', function () {
      isPainting = false;
    });*/
  
    // Paint the cell
    function paintCell(event) {
      if (event.target.classList.contains('cell') && !event.target.classList.contains('painted')) {
        // Add the painted class only if it's not already present
        event.target.classList.add('painted');
      }else if (event.target.parentElement.classList.contains('cell') && !event.target.parentElement.classList.contains('painted')){
        event.target.parentElement.classList.add('painted');
      }
    }
  
    // Erase the cell
    function eraseCell(event) {
      if (event.target.classList.contains('cell') && event.target.classList.contains('painted')) {
        // Remove the painted class if it's present
        event.target.classList.remove('painted');
      }else if (event.target.parentElement.classList.contains('cell') && event.target.parentElement.classList.contains('painted')){
        event.target.parentElement.classList.remove('painted');
      }
    }
  
    // Disable right-click context menu to improve the painting and erasing experience
    gridContainer.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });
//});

function addTagToChildren(parentElement, className) {
    const children = parentElement.children;  
    for (const child of children) {
        child.classList.add(className);
    }
}

function removeTagFromChildren(parentElement, className) {
    const children = parentElement.children; 
    for (const child of children) {
        child.classList.remove(className);
    }
}

function getRows(){
    var row1 = document.getElementById("row-1");
    var row2 = document.getElementById("row-2");
    var row3 = document.getElementById("row-3");
    var row4 = document.getElementById("row-4");
    var row5 = document.getElementById("row-5");
    var row6 = document.getElementById("row-6");
    var row7 = document.getElementById("row-7");
    var row8 = document.getElementById("row-8");
    var row9 = document.getElementById("row-9");
    var row10 = document.getElementById("row-10");
    var row11 = document.getElementById("row-11");
    var row12 = document.getElementById("row-12");
    var row13 = document.getElementById("row-13");
    var row14 = document.getElementById("row-14");
    var row15 = document.getElementById("row-15");
    var row16 = document.getElementById("row-16");
    var rows = [row1,row2,row3,row4,row5,row6,row7,row8,row9,row10,row11,row12,row13,row14,row15,row16]
    return rows;
}

function playMusic(){
    //and a flag to prevent double execution
    if(playMode==false){
        playMode=true;
        setPlayButton(true);
        var rows = getRows();
        playRows(convertTempoToDuration(tempo), rows);
    }else{
        playMode = false;
        setPlayButton(false);
    }
  }

function getChordFromList(list){
    var children = Array.from(list.children);
    var chord = [];
    for(var i=0;i<children.length; i++){
        if(children[i].classList.contains("painted")){
            chord.push(intToNote[i]);
        }
    }
    return chord;
}

function setPlayButton(stop){
    var playButton = document.getElementById("playButton");
    if(stop){
        playButton.innerHTML = "Stop";
    }else{
        playButton.innerHTML = "Play!";
    }
}

function getTempo(){
    tempo = document.getElementById("tempoSlider").value;
}

function convertTempoToDuration(){
    return 60/tempo;
}

function playRows(t, objectList) {
    function activateObject(obj) {
        addTagToChildren(obj, 'playing');
    }
    function deactivateObject(obj) {
        removeTagFromChildren(obj, 'playing');
    }
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function processObjectsSequentially() {
        for (const obj of objectList) {
            if(playMode){
                activateObject(obj);
                var chord = getChordFromList(obj);
                playChord(chord);
                await delay(t * 1000);
                deactivateObject(obj);
            }else{
                return;
            }
        }
    playMode = false;
    setPlayButton(false);
    }
    processObjectsSequentially();
}

function playChord(chord){
    if (chord.length > 0) {
      const synth = new Tone.PolySynth(Tone.Synth).toDestination();
      synth.triggerAttackRelease(chord, convertTempoToDuration(tempo)); 
    }
}

function clearGrid(){
    const elements = document.querySelectorAll('.painted');
    elements.forEach(element => {
        element.classList.remove('painted');
    });
}

function playNoteOnClick(input){
    var chord = [input];
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    synth.triggerAttackRelease(chord, convertTempoToDuration(tempo)); 
}

function toggleNoteNames(){
    if(namesOn){
        hideNoteNames();
        namesOn = true;
    }else{
        showNoteNames();
        namesOn = false;
    }
<<<<<<< HEAD
}
=======
  }
  function hideNoteNames() {
    const elements = document.getElementsByClassName("note-name");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none';
    }
  }
  function showNoteNames() {
    const elements = document.getElementsByClassName("note-name");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'inline';
    }
  }
  function sendGenerateRequest() {
      axios.post("http://127.0.0.1:5000", {name: "fart"}).then(function (response) {
          console.log(response)
          // do whatever you want if console is [object object] then stringify the response
      })
  }
  hideNoteNames();
>>>>>>> 9d234a7a3ab62dd51627bbfa9fb00957ea8b8cc1

function hideNoteNames(){
    const elements = document.getElementsByClassName("note-name");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
    }
}

function showNoteNames(){
    const elements = document.getElementsByClassName("note-name");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'inline';
    }
}

function toggleNoteNames(){
    var toggleButton = document.getElementById("noteToggle");
    if(namesOn){
        hideNoteNames();
        toggleButton.innerHTML="Note Names On";
        namesOn = false;
    }else{
        showNoteNames();
        toggleButton.innerHTML ="Note Names Off";
        namesOn = true;
    }
}   
