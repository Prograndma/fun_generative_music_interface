//global variables
var playMode = false;
var tempo = 100;
var namesOn = false;
var noteLength = 2;
var maxNoteLength = 12;
const pianoRollSize = 36;

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
    10: 'A4',
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

const noteToInt = {
    'G5': 0,
    'F#5': 1,
    'F5': 2,
    'E5': 3,
    'D#5': 4,
    'D5': 5,
    'C#5': 6,
    'C5': 7,
    'B4': 8,
    'A#4': 9,
    'A4': 10,
    'G#4': 11,
    'G4': 12,
    'F#4': 13,
    'F4': 14,
    'E4': 15,
    'D#4': 16,
    'D4': 17,
    'C#4': 18,
    'C4': 19,
    'B3': 20,
    'A#3': 21,
    'A3': 22,
    'G#3': 23,
    'G3': 24,
    'F#3': 25,
    'F3': 26,
    'E3': 27,
    'D#3': 28,
    'D3': 29,
    'C#3': 30,
    'C3': 31,
    'B2': 32,
    'A#2': 33,
    'A2': 34,
    'G#2': 35,
    'G2': 36,
};

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
        playRows(rows);
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

function playRows(objectList) {
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
                await delay(convertTempoToDuration(tempo) * 1000);
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
      synth.set({"portamento": 0.05});

    /*  synth.set({
        "volume": 0,
        "detune": 0,
        "portamento": 0.05,
        "envelope": {
            "attack": 0.05,
            "attackCurve": "exponential",
            "decay": 0.2,
            "decayCurve": "exponential",
            "release": 1.5,
            "releaseCurve": "exponential",
            "sustain": 0.2
        },
        "oscillator": {
            "partialCount": 0,
            "partials": [],
            "phase": 0,
            "type": "amtriangle",
            "harmonicity": 0.5,
            "modulationType": "sine"
        }
    });*/
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
}

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

function populateRow(input_info, row){
    const cells = row.children;
    for (let i = 0; i < input_info.length; i++){
        var note = input_info[i];
        idx = noteToInt[note];
        if(idx<=pianoRollSize && idx >=0){
            cells[idx].classList.add('painted');
        }
    }
}

function populateGrid(input){
    clearGrid();
    var rowNum = 16;
    //trim input
    if (input.length > rowNum) {
        input = input.slice(0, rowNum);
    }
    if(input.length < rowNum){
        extra = rowNum - input.length;
        for (let i = 0; i < extra; i++) {
            input.push([]);
        }       
    }
    var rows = getRows();
    //populate each row
    for (let i = 0; i < rowNum; i++) {
        populateRow(input[i] , rows[i]);
    }
}

var exampleMusic =[['C4', 'E4', 'G4', 'C5'],
['B3', 'D4', 'G4'],
['A3', 'C4', 'G4', 'A4'],
['G3', 'D4', 'G4', 'B4'],
['E3', 'E4', 'G4', 'C5'],
['D3', 'F4', 'B4', 'D5'],
['G#2', 'E4', 'B4', 'E5'],
['A2', 'E4', 'A4', 'C5'],
['A3', 'A4', 'C5', 'E5'],
['B3', 'G4', 'D5', 'G5'],
['G3', 'D4', 'B4', 'G5'],
['C4', 'D4', 'G4', 'E5'],
['E3', 'C4', 'G4', 'G5'],
['D3', 'C4', 'A4', 'F5'],
['G3', 'B3', 'G4', 'F5'],
['C3', 'C4', 'G4', 'E5']]

var twinkle = [[ "C4", "C3" ],
[ "C4", "C3" ],
[ "G4", "E3" ],
[ "G4", "E3" ],
[ "A4", "F3" ],
[ "A4", "F3" ],
[ "G4", "E3" ],
[],
[ "F4", "D3" ],
[ "F4", "D3" ],
[ "E4", "C3" ],
[ "E4", "C3" ],
[ "D4", "B2" ],
[ "D4", "G2" ],
[ "C4", "C3" ],
[]]

var mario = [
    ["E3", "E4"],
    ["E3", "E4"],
    ["E3", "E4"],
    ["C3", "C4"],
    ["E3", "E4"],
    ["G3", "G4"],
    ["G2", "G3"],
    [],
    ["C3", "C4"],
    ["G2", "G3"],
    ["E3"],    
    [], 
    ["A3", "A2"],
    ["B3", "B2"],
    ["A#3", "A#2"],
    ["A3", "A2"],

]

function readRow(row){
    var outArray = [];
    var children = row.children;
    for (let i = 0; i < children.length; i++){
        var child = children[i];
        if(child.classList.contains('painted')){
            outArray.push(intToNote[i]);
        }
    }
    return outArray;
}

function getInfoFromGrid(){
    var rowNum = 16;
    var rows = getRows();
    var outArray = [];
    for (let i = 0; i < rowNum; i++) {
        newRow = readRow(rows[i]);
        outArray.push(newRow);
    }
    console.log(JSON.stringify(outArray, null, 4)); 
    return outArray;
}

function transposeNote(note, interval){
    var noteVal = noteToInt[note];
    var newNoteVal = noteVal - interval;
    while(newNoteVal > pianoRollSize){
        newNoteVal -= pianoRollSize;
    }
    while(newNoteVal < 0){
        newNoteVal += pianoRollSize;
    }
    var newNote = intToNote[newNoteVal];
    return newNote;
}

function transposeGrid(interval){
    var contents = getInfoFromGrid();
    var newArray = [];
    for (let i = 0; i < contents.length; i++) {
        var currentRow = contents[i];
        var newRow = [];
        for (let i = 0; i < currentRow.length; i++) {
            newRow.push(transposeNote(currentRow[i], interval));
        }
        newArray.push(newRow);
    }    
    clearGrid();
    populateGrid(newArray);
}
function fakeTune(){
    populateGrid(tune);
    tempo = 175
}
function fakeChoral(){
    populateGrid(choral);
    tempo = 60
}

function incrementNoteLength(){
    if(noteLength<maxNoteLength){
        noteLength++;
    }
    updateNoteLength();
}
function decrementNoteLength(){
    if(noteLength>0){
        noteLength--;
    }
    updateNoteLength();
}
function updateNoteLength(){
    var length = document.getElementById("num");
    length.innerHTML= noteLength;
}


function sendGenerateRequest() {
    //get contents of grid
    var stuffToSend = getInfoFromGrid();
    axios.post("http://127.0.0.1:5000", {name: "fart"}).then(function (response) {
        console.log(response)
        // do whatever you want if console is [object object] then stringify the response
    })
}