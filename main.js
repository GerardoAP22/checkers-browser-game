/*----- constants -----*/
const COLORS = {
    '0': null,
    '1': "black",
    "-1": "red",
};

const IMAGES = {
    '0': null,
    '1': "./assets/blackCheckerPiece.png",
    "-1": "./assets/redCheckerPiece.png",
    '2': "./assets/blackKingCheckerPiece.png",
    "-2": "./assets/redKingCheckerPiece.png",
};

/*----- state variables -----*/
let board;
let currentPlayer;
let winner;
let totalBlackPieces;
let totalRedPieces;
let previousTotalBlackPieces;
let previousTotalRedPieces;
let selectedPiece;

/*----- cached elements  -----*/
const playAgainBtn = document.getElementById("playAgn");
const resetBtn = document.getElementById("reset");
const messageEl = document.querySelector("h1");
const scoreboardEl = document.getElementById("scoreboard");
const kingUpgradeSound = document.getElementById('kingUpgrade');
const takePieceSound = document.getElementById('takePiece');
const movePieceSound = document.getElementById('movePiece');

/*----- event listeners -----*/
document.getElementById("board").addEventListener("click", handleMove);
playAgainBtn.addEventListener("click", init);
resetBtn.addEventListener("click", handleSurrender);

/*----- functions -----*/
init();

function init() {
    // // Create a 2D array to represent the game board with the initial pieces on each side
    board = [
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
        [1, 0, 1, 0, 0, 0, -1, 0],
        [0, 1, 0, 0, 0, -1, 0, -1],
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
    renderScoreboard();
    renderControl();
}

function renderBoard() {
    board.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.innerHTML = ""; // Clear the cell's content

            if (IMAGES[cellVal]) {
                const imgEl = document.createElement("img");
                imgEl.src = IMAGES[cellVal];
                cellEl.appendChild(imgEl);
            }
        });
    });
}

function renderMessage() {
    messageEl.innerHTML = winner
        ? `<span style="color: ${COLORS[winner]}">${COLORS[
            winner
        ].toUpperCase()}</span> Wins`
        : `<span style="color: ${COLORS[currentPlayer]}">${COLORS[
            currentPlayer
        ].toUpperCase()}</span>'s Turn`;
}

function renderScoreboard() {
    scoreboardEl.innerHTML = `<strong>Scoreboard:<br><br>
    <span style="color: ${COLORS[1]}"> Black Pieces left:</span> ${totalBlackPieces}
    <br><br>
    <span style="color: ${COLORS[-1]}"> Red Pieces left:</span> ${totalRedPieces}
    </strong>`;
}

function renderControl() {
    playAgainBtn.style.visibility = winner ? "visible" : "hidden";
    resetBtn.style.visibility = !winner ? "visible" : "hidden";
}

function handleSurrender() {
    if (!winner) {
        winner = currentPlayer * -1;
        render();
    }
}

// Function to handle player moves
function handleMove(evt) {
    let selectedPieceDiv;
    let selectedPieceImg;
    if (evt.target.id === 'board') return;
    //Source: Chat GPT destructuring assignment
    const [colIdx, rowIdx] = getCellIndexes(evt.target);
    previousTotalBlackPieces = totalBlackPieces;
    previousTotalRedPieces = totalRedPieces;

    selectedPieceDiv = document.getElementById(`c${colIdx}r${rowIdx}`);
    selectedPieceImg = selectedPieceDiv.querySelector('img');

    if (!selectedPiece) {
        selectedPiece = handlePieceSelection(colIdx, rowIdx, currentPlayer);
        //adds yellow border to checker piece
        if(selectedPiece === undefined) return; // Handles case where they click the div border
        if (selectedPieceImg) {
            selectedPieceImg.style.border = '0.15vmin solid yellow';
        }
    } else {
        const [startCol, startRow] = selectedPiece;

        // Allows players to reselct a piece if they change thier mind
        if (colIdx === startCol && rowIdx === startRow) {
            if (selectedPieceImg && selectedPieceImg.style) { // Check if selectedPieceImg exists and has a style property
                selectedPieceImg.style.border = '0.15vmin solid white';
            }
            selectedPiece = null;
        } else if (isValidMoveAndExecute(startCol, startRow, colIdx, rowIdx, currentPlayer)) {
            if (selectedPieceImg) {
                selectedPieceImg.style.border = '0.15vmin solid white';
            }
            selectedPiece = null;
            if ((currentPlayer === -1 && totalBlackPieces !== previousTotalBlackPieces) || (currentPlayer === 1 && totalRedPieces !== previousTotalRedPieces)) {
                currentPlayer = currentPlayer;
            } else {
                currentPlayer *= -1;
            }
            checkWinner();
            render();
        }
    }
}

function isValidMove(startCol, startRow, endCol, endRow, currentPlayer) {
    // Need to check if it is in bounds
    if (!isInBounds(endCol, endRow)) return false;

    // Check if it is empty
    if (board[endCol][endRow] !== 0) return false;

    const colDiff = Math.abs(endCol - startCol);
    const rowDiff = Math.abs(endRow - startRow);

    // prevents horizontal & vertical movement and checks that it is a valid diagonal move
    if (!isValidDirection(colDiff, rowDiff) && !isValidDiagonal(colDiff, rowDiff)) return false;

    // King Pieces
    if (isKingPiece(startCol, startRow)) {
        // allow king pieces to move either diagonal direction
        if (isKingDiagonalMove(colDiff, rowDiff)) return true;

        // Check if there is a piece in between and if it is an enemy, allow 2 space move
        if (rowDiff === 2 && colDiff === 2) {
            const enemyCol = (startCol + endCol) / 2;
            const enemyRow = (startRow + endRow) / 2;

            // Check if enemyCol and enemyRow are within valid bounds
            if (isInBounds(enemyCol, enemyRow)) {
                return isKingCaptureMove(enemyCol, enemyRow, currentPlayer);
            }
        }
    }

    // Regular Pieces
    if (isRegularPiece(startCol, startRow, currentPlayer)) {
        // red will be -1 as it is moving downwards, black direction will be 1 as we are moving up
        const direction = currentPlayer === 1 ? 1 : -1;

        // If it is not capturing a piece, we need to check the single diagonal move
        if (isSingleDiagonalMove(startRow, endRow, colDiff, rowDiff, direction)) {
            return true;
        }

        // Check if there is a piece in between and if it is an enemy, allow 2 space move
        if (rowDiff === 2 && colDiff === 2 && endRow - startRow === direction * 2) {
            const enemyCol = (startCol + endCol) / 2;
            const enemyRow = (startRow + endRow) / 2;

            // Check if enemyCol and enemyRow are within valid bounds
            if (isInBounds(enemyCol, enemyRow)) {
                return isRegularCaptureMove(enemyCol, enemyRow, currentPlayer);
            }
        }
    }

    return false;
}

function checkWinner() {
    winner = totalRedPieces === 0 ? 1 : totalBlackPieces === 0 ? -1 : null;
}

function makeKing(colIdx, rowIdx, currentPlayer) {
    if (currentPlayer === 1 && rowIdx === 7) {
        // Make piece into a king
        board[colIdx][rowIdx] = 2;
    } else if (currentPlayer === -1 && rowIdx === 0) {
        board[colIdx][rowIdx] = -2;
    }
    return;
}

function getCellIndexes(element) {
    if (element.tagName === 'IMG') {
        element = element.parentNode;
    }
    const cellId = element.id;
    const colIdx = parseInt(cellId.charAt(1));
    const rowIdx = parseInt(cellId.charAt(3));
    return [colIdx, rowIdx];
}

function handlePieceSelection(colIdx, rowIdx, currentPlayer) {
    const cellVal = board[colIdx][rowIdx];
    if (cellVal === currentPlayer || cellVal === currentPlayer * 2)
        return [colIdx, rowIdx];
}

function isValidMoveAndExecute(startCol, startRow, colIdx, rowIdx, currentPlayer) {
    if (isValidMove(startCol, startRow, colIdx, rowIdx, currentPlayer)) {
        if (rowIdx === 0 || rowIdx === 7) {
            makeKing(colIdx, rowIdx, currentPlayer);
            playKingUpgradeSound();
        } else {
            // Check if the piece being moved is a king, if yes then maintain its king value
            if (board[startCol][startRow] === 2 || board[startCol][startRow] === -2) {
                board[colIdx][rowIdx] = board[startCol][startRow];
            } else {
                board[colIdx][rowIdx] = currentPlayer;
            }
        }
        board[startCol][startRow] = 0;
        playMovePieceSound();
        return true;
    }
    return false;
}

function isInBounds(col, row) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

function isValidDirection(colDiff, rowDiff) {
    return (colDiff > 0 && rowDiff === 0) || (rowDiff > 0 && colDiff === 0);
}

function isValidDiagonal(colDiff, rowDiff) {
    return colDiff === rowDiff;
}

function isKingPiece(col, row) {
    const piece = board[col][row];
    return piece === 2 || piece === -2;
}

function isKingDiagonalMove(colDiff, rowDiff) {
    return rowDiff === 1 && colDiff === 1;
}

function isKingCaptureMove(enemyCol, enemyRow, currentPlayer) {
    if (board[enemyCol][enemyRow] === -currentPlayer || board[enemyCol][enemyRow] === -currentPlayer * 2) {
        board[enemyCol][enemyRow] = 0;
        if (-currentPlayer === 1) {
            --totalBlackPieces;
        } else {
            --totalRedPieces;
        }
        playTakePieceSound();
        return true;
    } else {
        return false;
    }
}

function isRegularPiece(col, row, currentPlayer) {
    const piece = board[col][row];
    return piece === currentPlayer;
}

function isSingleDiagonalMove(startRow, endRow, colDiff, rowDiff, direction) {
    return rowDiff === 1 && colDiff === 1 && (endRow - startRow === direction);
}

function isRegularCaptureMove(enemyCol, enemyRow, currentPlayer) {
    if (board[enemyCol][enemyRow] !== currentPlayer && board[enemyCol][enemyRow] !== currentPlayer * 2) {
        board[enemyCol][enemyRow] = 0;
        if (-currentPlayer === 1) {
            --totalBlackPieces;
        } else {
            --totalRedPieces;
        }
        playTakePieceSound();
        return true;
    } else {
        return false;
    }
}

// Sound functions structure source: Felix Carela
function playKingUpgradeSound() {
    movePieceSound.pause();
    movePieceSound.currentTime = 0;
    kingUpgradeSound.play();
}

function playTakePieceSound() {
    movePieceSound.pause();
    movePieceSound.currentTime = 0;
    takePieceSound.play();
}

function playMovePieceSound() {
    movePieceSound.pause();
    movePieceSound.currentTime = 0;
    movePieceSound.play();
}