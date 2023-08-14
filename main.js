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
let selectedPiece;
  
/*----- cached elements  -----*/
const playAgainBtn = document.getElementById('playAgn');
const resetBtn = document.getElementById('reset');
const messageEl = document.querySelector('h1');
const gridEls = document.querySelectorAll('#board > div');
console.log(gridEls);
  
/*----- event listeners -----*/
document.getElementById('board').addEventListener('click', handleMove);
playAgainBtn.addEventListener('click', init);
resetBtn.addEventListener('click', handleSurrender);
  
/*----- functions -----*/
init()
  
function init(){
// // Create a 2D array to represent the game board with the initial pieces on each side
    board = [
       [1, 0, 1, 0, 0, 0, -1, 0],
       [0, 1, 0, 0, 0, -1, 0, -1],
       [1, 0, 1, 0, 0, 0, -1, 0],
       [0, 1, 0, 0, 0, -1, 0, -1],
       [1, 0, 1, 0, 0, 0, -1, 0],
       [0, 1, 0, 0, 0, -1, 0, -1],
       [1, 0, 1, 0, 0, 0, -1, ],
       [0, 1, 0, 0, 0, -1, 0, -1]
    ];
    currentPlayer = 1; //player 1(black) starts
    totalBlackPieces = 12;
    totalRedPieces = 12;
    selectedPiece = null;
    winner = null; 
    render(); 
}
  
function render() {
    renderBoard();
    renderMessage();
    renderControl();
}
  

function renderBoard() {
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];

            // Will highlight the selected piece
            if (selectedPiece && colIdx === selectedPiece[0] && rowIdx === selectedPiece[1]){
                cellEl.classList.add('selected');
            } else {
                cellEl.classList.remove('selected');
            }
        })
    })
}
  
function renderMessage() {
    if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins`
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[currentPlayer]}">${COLORS[currentPlayer].toUpperCase()}</span>'s Turn`
    }
}
  
function renderControl() {
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    resetBtn.style.visibility = !winner ? 'visible' : 'hidden';
}

function handleSurrender() {
    if (!winner) {
        winner = currentPlayer * -1;
        render()
    }
}
  // Function to handle player moves
function handleMove(evt) {
    const cellId = evt.target.id;
    const colIdx = parseInt(cellId.charAt(1));
    const rowIdx = parseInt(cellId.charAt(3));

    if (!selectedPiece) {
        const cellVal = board[colIdx][rowIdx];
        if (cellVal === currentPlayer) selectedPiece = [colIdx, rowIdx]; //Will store the selected Piece and store its col & row indexes
    } else {
        const startCol = selectedPiece[0];
        const startRow = selectedPiece[1];
        if(isValidMove(startCol, startRow, colIdx, rowIdx, currentPlayer)) {
            board[colIdx][rowIdx] = currentPlayer;
            board[startCol][startRow] = 0;
            selectedPiece = null;
            render();
        } else{
            return;
        }
    }
    //   Check if the selected move is valid for the current player's piece.
    //     Need to check wether the piece is class king or class knight
    //   If valid:
    //       Update the board array with the new piece positions.
    //       Check for captured opponent pieces and remove them from the board array.

    //       Switch the current player.
    //       check to see if there is a winner 
    //       Render the updated game board.
    //   If not valid:
    //       return so the player could choose another position
}

function isValidMove(startCol, startRow, endCol, endRow, currentPlayer) {
    // Need to check bounds first
    if (endRow < 0 || endRow >= board.length || endCol < 0 || endCol >= board[0].length){
        return false;
    }

    if(board[endCol][endRow] !== 0) return false;

    // checks if its diagonal move 
    if((endRow - startRow) !== (endCol - startCol)) return false;

    if ((currentPlayer === 1 && rowDiff < 0) || (currentPlayer === -1 && rowDiff > 0)) {
        return false;
    }
    // Additional checks specific to capturing and kinging might be needed
    return true;
}

  
  
  