/*----- constants -----*/
// Will use colors while first building the game and then transition to using images
const COLORS = {
    '0': null,
    '1': 'black',
    '-1': 'red'
}
  
/*----- state variables -----*/
let board;  
let currentPlayer; 
let winner; 
let totalBlackPieces;
let totalRedPieces;
  
/*----- cached elements  -----*/
const playAgainBtn = document.getElementById('playAgn');
const resetBtn = document.getElementById('reset');
const messageEl = document.querySelector('h1');
const gridEls = document.querySelectorAll('.board > div');
  
/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);
resetBtn.addEventListener('click', init);
  
/*----- functions -----*/
// init()
  
function init(){
// // Create a 2D array to represent the game board with the initial pieces on each side
    board = [
       [null, 1, null, 1, null, 1, null, 1],
       [1, null, 1, null, 1, null, 1, null],
       [null, 1, null, 1, null, 1, null, 1],
       [null, null, null, null, null, null, null, null],
       [null, null, null, null, null, null, null, null],
       [-1, null, -1, null, -1, null, -1, null],
       [null, -1, null, -1, null, -1, null, -1],
       [-1, null, -1, null, -1, null, -1, null]
    ];
    currentPlayer = "BP"; //player 1(black) starts
    totalBlackPieces = 12;
    totalRedPieces = 12;
    winner = null; 
    // render(); 
}
  
// function render() {
        // renderBoard();
        // renderMessage();
        // renderControl();
// }
  

// function renderBoard() {
//     board.forEach(function (colArr, colIdx) {
//         colArr.forEach(function (cellVal, rowIdx) {
//             const cellId = `c${colIdx}r${rowIdx}`;
//             const cellEl = document.getElementById(cellId);
//             cellEl.style.backgroundColor = COLORS[cellVal];
//         })
//     })
// }
  
// function renderMessage() {
//     if (winner === 'R') {
//         messageEl.innerText = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span> Surrendered! <span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins`
//     } else if (winner) {
//         messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins`
//     } else {
//         messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`
//     }
// }
  
// function renderControl() {
//     playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
//     resetBtn.style.visibility = !winner ? 'visible' : 'hidden';
// }
  
  // Function to handle player moves
  // function handleMove(startRow, startCol, endRow, endCol) {
  //     Check if the selected move is valid for the current player's piece.
  //       Need to check wether the piece is class king or class knight
  //     If valid:
  //         Update the board array with the new piece positions.
  //         Check for captured opponent pieces and remove them from the board array.
        
  //         Switch the current player.
  //         check to see if there is a winner 
  //         Render the updated game board.
  //     If not valid:
  //         return so the player could choose another position
  // }
  
  
  