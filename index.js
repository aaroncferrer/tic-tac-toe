const cells = document.querySelectorAll('.cell');
const gameContainer = document.querySelector('.game-container');
const statusText = document.querySelector('.status-text');
const restartBtn = document.querySelector('.restart-btn');
const introContainer = document.querySelector('.intro-container');
const startBtn = document.querySelector('.intro-btn');
const nextBtn = document.querySelector('.next-btn');
const previousBtn = document.querySelector('.previous-btn');

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// -------->>> TO BE DELETED <<<--------
// let player1 = prompt("Player 1, please enter your name:");
// while (player1.trim() === '') {
//     player1 = prompt("Player 1, please enter a valid name:");
// }

// let player2 = prompt("Player 2, please enter your name:");
// while (player2.trim() === '') {
//     player2 = prompt("Player 2, please enter a valid name:");
// }
// let currentPlayer = player1; // set the current player to player 1

let options = ['', '', '', '', '', '', '', '', ''];

// let currentPlayer = 'X';
let running = false;
let moveHistory = [];
let currentMoveIndex = -1;
// console.log(moveHistory.length);
// console.log(moveHistory);

startBtn.addEventListener('click', () => {
    player1 = prompt("Player 1, please enter your name:");
    while (player1.trim() === '') {
        player1 = prompt("Player 1, please enter a valid name:");
    }

    player2 = prompt("Player 2, please enter your name:");
    while (player2.trim() === '') {
        player2 = prompt("Player 2, please enter a valid name:");
    }
    currentPlayer = player1; // set the current player to player 1
    introContainer.classList.add('slide');
    
    introContainer.addEventListener('transitionend', () => {
        introContainer.remove();
    })

    gameContainer.classList.remove('blur');
    initializeGame()
})


function initializeGame(){
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    nextBtn.addEventListener('click', nextMove);
    previousBtn.addEventListener('click', previousMove);
    statusText.innerText = `${currentPlayer}'s Turn`;
    running = true;
    // nextBtn.disabled = true;
    // previousBtn.disabled = true;
    nextBtn.style.display = 'none';
    previousBtn.style.display = 'none';
}

function cellClicked(event){
    const cellIndex = event.target.getAttribute('cellIndex');

    if(options[cellIndex] != '' || !running){
        return;
    } else {
        updateCell(event.target, cellIndex);
        checkWinner();
        addMoveToHistory();
    }
}

function updateCell(cell, index){
    options[index] = (currentPlayer === player1) ? 'X' : 'O';
    cell.innerText = options[index];

    if (moveHistory.length === 0) {
        nextBtn.style.display = 'inline-block';
        previousBtn.style.display = 'inline-block';
    }
}

function changePlayer(){
    currentPlayer = (currentPlayer === player1) ? player2 : player1;
    statusText.innerText = `${(currentPlayer === player1) ? player1 : player2}'s Turn`;
}

function checkWinner() {
    let roundWon = false;
    const checkMark = '<i class="fa-solid fa-check checkmark"></i>';
  
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];
  
        if (cellA === '' || cellB === '' || cellC === '') {
            continue;
        }

        if (cellA === 'X' && cellB === 'X' && cellC === 'X') {
            cells[condition[0]].innerHTML += checkMark;
            cells[condition[1]].innerHTML += checkMark;
            cells[condition[2]].innerHTML += checkMark;
            roundWon = true;
            break;
        } else if (cellA === 'O' && cellB === 'O' && cellC === 'O') {
            cells[condition[0]].innerHTML += checkMark;
            cells[condition[1]].innerHTML += checkMark;
            cells[condition[2]].innerHTML += checkMark;
            roundWon = true;
            break;
        }
    }
  
    if (roundWon) {
        statusText.innerText = `${(currentPlayer === player1) ? player1 : player2} wins with ${(currentPlayer === player1) ? 'X' : 'O'}!`;
        running = false;

    } else if(!options.includes('')) {
        statusText.innerText = 'Draw!';
        running = false;
    } else {
        changePlayer();
    }

    // nextBtn.disabled = !roundWon && !options.includes('');
    // previousBtn.disabled = true;

    if (running) {
        currentMoveIndex++;
    }
}
  
function restartGame(){
    options = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => cell.innerText = '');
    running = true;
    moveHistory = [];
    currentMoveIndex = -1;
    nextBtn.style.display = 'none';
    previousBtn.style.display = 'none';
    currentPlayer = player1; // set the current player back to player 1
    statusText.innerText = `${currentPlayer}'s Turn`;
}
  
    
function addMoveToHistory(){
    moveHistory[currentMoveIndex] = {
        options: [...options],
        currentPlayer: currentPlayer
    }
    console.log(moveHistory);
}

function nextMove(){
    console.log(currentMoveIndex);
    if (!running) {
        alert('Please restart the game to continue.');
        return;
    }
        
    if (currentMoveIndex + 1 >= moveHistory.length) {
        alert('There is nothing to redo.');
        return;
    }

    if(currentMoveIndex >= moveHistory.length - 1){
        return;
    }
    
    currentMoveIndex++;
    const currentMove = moveHistory[currentMoveIndex];
    options = currentMove.options;
    currentPlayer = currentMove.currentPlayer;
    
    for(let i = 0; i < cells.length; i++){
        cells[i].textContent = options[i];
    }
    
    statusText.innerText = `${currentPlayer}'s Turn`;
    nextBtn.disabled = currentMoveIndex === moveHistory.length - 1;
    previousBtn.disabled = false;
    running = true;
}
      
function previousMove() {
    console.log(currentMoveIndex);
    if (currentMoveIndex <= 0) {
        previousBtn.disabled = true;
          return;
    }
      
    currentMoveIndex--;
    const currentMove = moveHistory[currentMoveIndex];
    options = currentMove.options;
    currentPlayer = currentMove.currentPlayer;
      
    for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = options[i];
    }
      
    statusText.innerText = `${currentPlayer}'s Turn`;
    // previousBtn.disabled = currentMoveIndex === 0;
    nextBtn.disabled = false;
    running = true;
}

cells.forEach(cell => {
    cell.addEventListener('mouseover', showPreview);
    cell.addEventListener('mouseout', hidePreview);
});

function showPreview(event) {
    if (options[event.target.getAttribute('cellIndex')] === '' && running) {
        event.target.textContent = (currentPlayer === player1) ? 'X' : 'O';
    }
}

function hidePreview(event) {
    if (options[event.target.getAttribute('cellIndex')] === '' && running) {
        event.target.textContent = "";
    }
}
