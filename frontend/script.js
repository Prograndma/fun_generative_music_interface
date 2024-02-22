document.addEventListener('DOMContentLoaded', function () {
    const gridContainer = document.getElementById('grid-container');
  
    // Variable to track painting or erasing
    let isPainting = false;
    let isErasing = false;
  
    // Create the grid
    function createGrid(rows, cols) {
      for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridContainer.appendChild(cell);
      }
    }
  
    // Initialize grid with 20 rows and 20 columns
    //createGrid(20, 20);
  
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
  });

  function playMusic(){
    console.log('doo doo doo');
  }


  let namesOn =false;
  function toggleNoteNames(){
    if(namesOn){
        hideNoteNames();
        namesOn = true;
    }else{
        showNoteNames();
        namesOn = false;
    }
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

