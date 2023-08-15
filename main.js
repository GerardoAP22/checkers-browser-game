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
// const gridEls = document.querySelectorAll('#board > div');
  
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
        [1, 0, 1, 0, 0, 0, -1,],
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

        // Allows players to reselct a piece if they change thier mind
        if (colIdx === startCol && rowIdx === startRow) {
            selectedPiece = null;
        } else if(isValidMove(startCol, startRow, colIdx, rowIdx, currentPlayer)) {
            board[colIdx][rowIdx] = currentPlayer;
            board[startCol][startRow] = 0;
            selectedPiece = null;
            currentPlayer *= -1;
            checkWinner();
            render();
        } else{
            return;
        }
    }
}

function isValidMove(startCol, startRow, endCol, endRow, currentPlayer) {
    // Need to check if it is in bounds
    if (endRow < 0 || endRow >= board.length || endCol < 0 || endCol >= board[0].length){
        return false;
    }

    // Check if it is empty
    if(board[endCol][endRow] !== 0) return false;

    const colDiff = Math.abs(endCol - startCol);
    const rowDiff = Math.abs(endRow - startRow);

    // prevents horizontal & vertical movement
    if ((colDiff > 0 && endRow === startRow) || (rowDiff > 0 && endCol === startCol)) return false;

    // Check if its a valid diagonal move
    if (rowDiff !== colDiff) return false;

    // if the rowDiff & colDiff is === 2 check if there is an enemey in between
    if(rowDiff === 2 && colDiff === 2) {
        const enemyCol = (startCol + endCol)/ 2;
        const enemyRow = (startRow + endRow)/ 2;
        if (board[enemyCol][enemyRow] === -currentPlayer){
            board[enemyCol][enemyRow] = 0;
            if (-currentPlayer === 1){
                --totalBlackPieces;
            } else {
                --totalRedPieces;
            }
            return true;
        } else {
        return false;
        }
    } 
    
    // red will be -1 as it is moving downwards, black direction will be 1 as we are moving up 
    const direction = currentPlayer === 1 ? 1 : -1;

    // If it is not capturing a piece, we need to check the single diagonal move
    if (rowDiff === 1 && colDiff === 1 && (endRow - startRow === direction)) {
        return true;
    }

    return false;
}

function checkWinner() {
    if(totalRedPieces === 0){
        winner = 1;
    } else if (totalBlackPieces === 0) {
        winner = -1;
    } else {
        winner = null;
    }

}
  
