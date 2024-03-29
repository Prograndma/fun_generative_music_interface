//global variables
var playMode = false;
var tempo = 100;
var major = true;
var noteLength = 2;
var maxNoteLength = 12;
const pianoRollHeight = 36;
const pianoRollLength = 32;
const sineSynth = new Tone.PolySynth(Tone.Synth).toDestination();
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
sineSynth.set({"portamento": 0.05});
var synth  = sineSynth;

const pianoSampler = new Tone.Sampler({
	urls: {
		G2: "G2.mp3",
		G3: "G3.mp3",
		G4: "G4.mp3",
        G5: "G5.mp3",
        C3: "C3.mp3",
        C4: "C4.mp3",
        E3: "E3.mp3",
        E4: "E4.mp3"
	},
	baseUrl: "samples/piano/",
}).toDestination();

const celloSampler = new Tone.Sampler({
	urls: {
		G2: "G2.mp3",
		G3: "G3.mp3",
		G4: "G4.mp3",
        C3: "C3.mp3",
        C4: "C4.mp3",
        E3: "E3.mp3",
        E4: "E4.mp3"
	},
	baseUrl: "samples/cello/",
}).toDestination();

const saxSampler = new Tone.Sampler({
	urls: {
		G2: "G2.mp3",
		G3: "G3.mp3",
		G4: "G4.mp3",
        C3: "C3.mp3",
        C4: "C4.mp3",
        E3: "E3.mp3",
        E4: "E4.mp3"
	},
	baseUrl: "samples/saxophone/",
}).toDestination();



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
  
document.addEventListener('mouseup', function () {
    isPainting = false;
    isErasing = false;
});
  
function getIndexInRow(element){
    return Array.prototype.indexOf.call(element.parentNode.childNodes, element);
}

function getNextNSiblings(element, n) {
    var siblings = [];
    for (var i = 0; i < n; i++) {
        if (element.nextElementSibling) {
            siblings.push(element.nextElementSibling);
            element = element.nextElementSibling;
        } else {
            break;
        }
    }
    return siblings;
}
function getLastNSiblings(element, n) {
    var siblings = [];
    for (var i = 0; i < n; i++) {
        if (element.previousElementSibling) {
            siblings.push(element.previousElementSibling);
            element = element.previousElementSibling;
        } else {
            break;
        }
    }
    return siblings;
}

function performPaint(tgt, length){
    if (tgt.parentElement.classList.contains('cell') && !tgt.parentElement.classList.contains('painted')){
        tgt = tgt.parentElement;
    }if(tgt.classList.contains('cell') && !tgt.classList.contains('painted')) {
        // Add the painted class only if it's not already present
        tgt.classList.add('painted');
        tgt.classList.add('start');
        tgt.children[0].innerHTML = length;
        var idx = getIndexInRow(tgt);
        var siblings = getNextNSiblings(tgt.parentElement, length);
        //traverse right for duration of note
        for (var i = 0; i < length-1; i++) {
            if(i<siblings.length){
                if(siblings[i].childNodes[idx].classList.contains('painted')){
                    //don't overwrite notes that already exist, defer to them instead
                    tgt.children[0].innerHTML = i+1;
                    break;
                }else{
                    siblings[i].childNodes[idx].classList.add('painted');
                    siblings[i].childNodes[idx].classList.add('continue');
                }
            }
        }        
    }
}

// Paint the cell
function paintCell(event) {
    var tgt = event.target;
    var length = noteLength;
    performPaint(tgt, length);
}
  
// Erase the cell
function eraseCell(event) {
    var tgt = event.target;
    if (tgt.parentElement.classList.contains('cell') && tgt.parentElement.classList.contains('painted')){
        tgt = tgt.parentElement;
    }if(tgt.classList.contains('cell') &&tgt.classList.contains('painted')) {
        // Remove the painted class if it's present
        tgt.classList.remove('painted');
        var started = false;
        if(tgt.classList.contains('start')){
            tgt.classList.remove('start');
            tgt.children[0].innerHTML ='';
            started = true;
        }
        var idx = getIndexInRow(tgt);
        var siblings = getNextNSiblings(tgt.parentElement, noteLength);
        //traverse right for duration of note
        for (var i = 0; i < maxNoteLength-1; i++) {
            if(i<siblings.length){
                //check if next sibling is a continue
                if(siblings[i].childNodes[idx].classList.contains('painted')&&!siblings[i].childNodes[idx].classList.contains('start')){
                    siblings[i].childNodes[idx].classList.remove('painted');
                    siblings[i].childNodes[idx].classList.remove('continue');
                }else{
                    break;
                }
            }
        }
        //traverse left if we didn't hit the start of the note 
        if(!started){
            var previousSiblings = getLastNSiblings(tgt.parentElement, maxNoteLength);
            for (var i = 0; i < maxNoteLength-1; i++) {
                if(i<previousSiblings.length){
                    //check if next sibling is a continue
                    if(previousSiblings[i].childNodes[idx].classList.contains('painted')&&previousSiblings[i].childNodes[idx].classList.contains('continue')){
                        previousSiblings[i].childNodes[idx].classList.remove('painted');
                        previousSiblings[i].childNodes[idx].classList.remove('continue');
                    }else if(previousSiblings[i].childNodes[idx].classList.contains('start')) {
                        previousSiblings[i].childNodes[idx].classList.remove('painted');
                        previousSiblings[i].childNodes[idx].classList.remove('start');
                        previousSiblings[i].childNodes[idx].children[0].innerHTML ='';
                        break;
                    }
                }
            }
        }
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
    var siblings = getNextNSiblings(row1, 31);
    siblings.unshift(row1);
    return siblings;
}

function playMusic(){
    //add a flag to prevent double execution
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

function getChordsFromList(list){
    var children = Array.from(list.children);
    var one = [];
    var two = [];
    var three = [];
    var four = [];
    var five = [];
    var six = [];
    var seven = [];
    var eight = [];
    var nine = [];
    var ten = [];
    var eleven = [];
    var twelve = [];
    for(var i=0;i<children.length; i++){
        var note = children[i];
        if(note.classList.contains("start")){
            var length = note.childNodes[0].innerHTML;
            if(length == 1){
                one.push(intToNote[i]);
            }else if(length == 2){
                two.push(intToNote[i]);
            }else if(length == 3){
                three.push(intToNote[i]);
            }else if(length == 4){
                four.push(intToNote[i]);
            }else if(length == 5){
                five.push(intToNote[i]);
            }else if(length == 6){
                six.push(intToNote[i]);
            }else if(length == 7){
                seven.push(intToNote[i]);
            }else if(length == 8){
                eight.push(intToNote[i]);
            }else if(length == 9){
                nine.push(intToNote[i]);
            }else if(length == 10){
                ten.push(intToNote[i]);
            }else if(length == 11){
                eleven.push(intToNote[i]);
            }else if(length == 12){
                twelve.push(intToNote[i]);
            }
        }
    }
    return [one,two,three,four,five,six,seven,eight,nine,ten,eleven,twelve];
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
                var chords = getChordsFromList(obj);
                playChords(chords);
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
      synth.triggerAttackRelease(chord, convertTempoToDuration(tempo)); 
    }
}
function playChords(chords){
    for(var i=0;i<12; i++){
        chord = chords[i];
        if (chord.length > 0) {
            synth.triggerAttackRelease(chord, convertTempoToDuration(tempo) * (i+1)); 
          }
    }
}


function clearButton(){
    if(playMode){
        playMode = false;
        setPlayButton(false);
    }
    clearGrid();
}

function clearGrid(){
    const elements = document.querySelectorAll('.painted');
    elements.forEach(element => {
        element.classList.remove('painted');
        element.classList.remove('continue');
        element.classList.remove('start');
        element.children[0].innerHTML='';
    });
}

function playNoteOnClick(input){
    var chord = [input];
    synth.triggerAttackRelease(chord, convertTempoToDuration(tempo)); 
}

function playNoteOnClickTempoInvariant(input){
    var chord = [input];
    synth.triggerAttackRelease(chord, .5); 
}


function populateRow(input_info, row){
    const cells = row.children;
    for (let i = 0; i < input_info.length; i++){
        var note = input_info[i];
        if(typeof(note)!="object"){
            note = [note, 1]
        }
        idx = noteToInt[note[0]];
        if(idx<=pianoRollHeight && idx >=0){
            performPaint(cells[idx], note[1]);
        }
    }
}

function populateGrid(input){
    clearGrid();
    //trim input
    if (input.length > pianoRollLength) {
        input = input.slice(0, pianoRollLength);
    }
    if(input.length < pianoRollLength){
        extra = pianoRollLength - input.length;
        for (let i = 0; i < extra; i++) {
            input.push([]);
        }       
    }
    var rows = getRows();
    //populate each row
    for (let i = 0; i < pianoRollLength; i++) {
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
        if(child.classList.contains('start')){
            var length = child.children[0].innerHTML;
            outArray.push([intToNote[i], length]);
        }
    }
    return outArray;
}

function getInfoFromGrid(){
    var rows = getRows();
    var outArray = [];
    for (let i = 0; i < pianoRollLength; i++) {
        newRow = readRow(rows[i]);
        outArray.push(newRow);
    }
    return outArray;
}

function transposeNote(note, interval){
    var noteVal = noteToInt[note[0]];
    var newNoteVal = noteVal - interval;
    while(newNoteVal > pianoRollHeight){
        newNoteVal -= pianoRollHeight;
    }
    while(newNoteVal < 0){
        newNoteVal += pianoRollHeight;
    }
    var newNote = intToNote[newNoteVal];
    return [newNote, note[1]];
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


function majorMode(input){
    var majorButton =  document.getElementById("major");
    var minorButton =  document.getElementById("minor");
    if(input == true){
        majorButton.classList.add('selected');
        minorButton.classList.remove('selected');
        major = true; 
    }else{
        majorButton.classList.remove('selected');
        minorButton.classList.add('selected');
        major = false; 
    }
}

function setInstrument(instrument){
    var celloButton = document.getElementById('celloButton');
    var pianoButton = document.getElementById('pianoButton');
    var synthButton = document.getElementById('synthButton');
    celloButton.classList.remove('selected');
    pianoButton.classList.remove('selected');
    synthButton.classList.remove('selected');
    if(instrument=='cello'){
        celloButton.classList.add('selected');
        synth = celloSampler;
    }else if(instrument=='piano'){
        pianoButton.classList.add('selected');
        synth = pianoSampler;
    }else if(instrument=='sax'){
        saxButton.classList.add('selected');
        synth = saxSampler;
    }else{
        synthButton.classList.add('selected');
        synth = sineSynth;
    }
}

function smoothNote(note){
    var howFarToGo = maxNoteLength-1;
    var idx = getIndexInRow(note);
    var siblings = getNextNSiblings(note.parentElement, howFarToGo);
    //traverse right for duration of note
    var length = 1;
    for (var i = 0; i < howFarToGo-1; i++) {
        if(i<siblings.length){
            if(siblings[i].childNodes[idx].classList.contains('painted')){
                //remove start
                if(siblings[i].childNodes[idx].classList.contains('start')){
                    siblings[i].childNodes[idx].classList.remove('start');
                }
                length++;
                siblings[i].childNodes[idx].innerHTML = '<div class="cell-contents"></div>';
            }else{
                note.children[0].innerHTML = length;
                return;
            }
        }
    }
    note.children[0].innerHTML = length;
}

function smoothGrid(){
    var rows = getRows();
    for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].children;
        for (var j = 0; j < cells.length; j++){
            if(cells[j].classList.contains("painted")){
                smoothNote(cells[j]);
            }
        }
    }
}

document.body.addEventListener('keydown', function (event) {
    const key = event.key;
    switch (key) {
        case "ArrowLeft":
            decrementNoteLength();
            break;
        case "ArrowRight":
            incrementNoteLength();
            break;
        case "ArrowUp":
            incrementNoteLength();
            break;
        case "ArrowDown":
            decrementNoteLength();
            break;
    }
});

const majorScale = [0, 2, 4, 5, 7, 9, 11];
const minorScale = [0, 2, 3, 5, 7, 8, 11];

function getKey(min=8,max=19){
    const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive      
}

function getNoteLength(){
    var randomNum = Math.random();
    if(randomNum < .33){
        return 2;
    }else if(randomNum <.66){
        return 1;
    }else if(randomNum < .85){
        return 4;
    }else{
        return 3;
    }
}

function getOffset(){
    var randomNum = Math.random();
    if(randomNum < .2){
        return 0;
    }else if(randomNum <.4){
        return 4;
    }else if(randomNum < .55){
        return 2;
    }else if(randomNum < .7){
        return 3;
    }else if(randomNum < .85){
        return 5;
    }else if(randomNum < .925){
        return 1;
    }else{
        return 6;
    }
}

function writeMelody(){
    clearGrid();
    var scale;
    if(major){
        scale= majorScale;
    }else{
        scale = minorScale;
    }
    //get starting pitch
    var startingPitch = getKey(13,24);
    //start writing at index 0;
    currentIdx = 0;
    var grid = []
    while(currentIdx < pianoRollLength){
        //sample a note length
        var noteLength =getNoteLength();
        if((currentIdx + noteLength) > pianoRollLength){
            noteLength = pianoRollLength - currentIdx;
        }
        //sample a pitch
        var offset = getOffset();
        var pitch = intToNote[startingPitch - scale[offset]];
        var note  = [pitch, noteLength]
        grid.push([note]);
        if(noteLength > 1){
            for (var i = 0; i < noteLength-1; i++) {
                grid.push([]);
            }
        }
        currentIdx+=noteLength;
    }
    populateGrid(grid);

}




function sendGenerateRequest() {
    //get contents of grid
    var notesToSend = getInfoFromGrid();            // Need to create a new function that puts the duration at the beginning of the note. For backend purposes. 
    axios.post("http://127.0.0.1:5000", {name: "song", songTempo: tempo, notes: notesToSend}).then(function (response) {
        console.log(response)
    })
}

