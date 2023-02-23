//-----Defining variables-----
const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
const gameSize = 500;
const pieceSize = gameSize / 3;
const winnerMoves = [[1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 5, 9], [3, 5, 7]];
let playerMoves = [];
let enemyMoves = [];
let playing = false;
const possibleCoordinates = [0, pieceSize, pieceSize * 2];
let OImage = new Image(pieceSize, pieceSize);
OImage.src = './GameGrapichs/O.png';
let XImage = new Image(pieceSize, pieceSize);
XImage.src = './GameGrapichs/X.png';
canvas.height = gameSize;
canvas.width = gameSize;


//-----Defining functions-----
function getTop(el) {return el.offsetTop + (el.offsetParent && getTop(el.offsetParent));}
function getLeft(el) {return el.offsetLeft + (el.offsetParent && getLeft(el.offsetParent));}

//The start/restart game function
function startGame() {
    c.clearRect(0, 0, gameSize, gameSize)
    gamebord.draw();
    playerMoves = [];
    enemyMoves = [];
    player.turn = true;
    playing = true;
}

//The resetScore function
function resetScore() {
    player.score = 0;
    document.getElementById("gameScoreId").innerHTML = "Score: " + player.score.toString();
}

// Rounds the input to nearest spot on the gamebord
function drawPosition(Pos) {
    if (Pos > 0 && Pos < pieceSize ){
        return 0
    } else if (Pos > pieceSize && Pos < pieceSize * 2) {
        return pieceSize
    } else if (Pos > pieceSize * 2 && Pos < gameSize) {
        return pieceSize * 2
    }
}

// Takes the coordinates and finds the equivelent tile on the gamebord
function getTile(coordinates) {
    let x = 0
    for (i in possibleCoordinates) {
        for (j in possibleCoordinates) {
            x += 1
            if (coordinates == possibleCoordinates[i].toString() + possibleCoordinates[j].toString()) {
                return x
            }
        }
    }

}


// Takes a list of moves and returns true if the moves contains a row of three and therefore a win
function checkIfGameWon(moves) {
    for (k in winnerMoves) {
        let x = []
        for (i in moves) {
            for (j in winnerMoves[k]) {
                if (winnerMoves[k][j] == moves[i]) {
                    x.push(moves[i])
                    x.sort((a, b) => a - b)
                    if (winnerMoves[k].join() == x.join()) {
                        return true
                    }
                }
            }
        }
    }
}

// Cheks who won
function endGame(thiswinner) {
    if (thiswinner == "Player") {
        console.log("Jubii")
        playing = false
        player.score += 1;
        drawEndScreen()
    }

    if (thiswinner == "Enemy") {
        console.log("Damn")
        playing = false
        drawEndScreen()
    }

}

// Function that describes what to do after a game
function drawEndScreen() {
    document.getElementById("gameScoreId").innerHTML = "Score: " + player.score.toString()
    c.beginPath()
    c.rect(gameSize / 5.2, gameSize / 2.3 , gameSize / 1.5, gameSize/ 10)
    c.fillStyle = "grey"
    c.fill()
    c.stroke()  
    c.fillStyle = "black"
    c.font = "30px Arial";
    c.fillText("Press Start to play again", gameSize / 5, gameSize / 2);
}

// This is the enemy player 
function enemymove() {
    if (playing) {
        while (!player.turn) {
            let enemyY = drawPosition(Math.floor(Math.random() * 500) + 1);
            let enemyX = drawPosition(Math.floor(Math.random() * 500) + 1);
            let thisMove = getTile(enemyX.toString() + enemyY.toString())
            if (!playerMoves.includes(thisMove) && !enemyMoves.includes(thisMove)) {
                enemyMoves.push(thisMove)
                if (player.teamFirst)
                    c.drawImage(OImage, enemyX, enemyY, pieceSize, pieceSize)
                if (!player.teamFirst)
                    c.drawImage(xImage, enemyX, enemyY, pieceSize, pieceSize)
                if (checkIfGameWon(enemyMoves)) {
                    endGame("Enemy")
                    player.turn = true
                }
                if (!checkIfGameWon(enemyMoves)) {
                    player.turn = true
                }

            }
        }
    }
}




addEventListener('click', (event) => {
    if (playing) {
        if (player.turn == true) {
            let xPosNew = drawPosition(event.clientX - getLeft(document.getElementById("gameCanvasId")))
            let yPosNew = drawPosition(event.clientY - getTop(document.getElementById("gameCanvasId")) + window.scrollY)
            let thisMove = getTile(xPosNew.toString() + yPosNew.toString())
            if (!playerMoves.includes(thisMove) && !enemyMoves.includes(thisMove)) {
                playerMoves.push(thisMove)
                if (player.teamFirst) {
                    c.drawImage(XImage, xPosNew, yPosNew, pieceSize, pieceSize)
                }
                if (!player.teamFirst) {
                    c.drawImage(OImage, xPosNew, yPosNew, pieceSize, pieceSize)
                }
                if (checkIfGameWon(playerMoves)) {
                    endGame("Player")
                }
                if (!checkIfGameWon(playerMoves)) {
                    player.turn = false
                    enemymove()
                }  
            }
        }
    }
})

//-----Defining Classes-----

// Gamebord class
class GameBord {
        constructor(size, position) {
            this.size = size;
            this.position = position;
        }
        draw() {
            c.beginPath();
            c.rect(this.position, this.position, (this.size / 3) * 2, this.size)
            c.rect(this.size / 3, this.position, this.size / 3 * 2, this.size)
            c.rect(this.position, this.size / 3, this.size, this.size / 3)
            c.stroke();
        }

}
// Player class
class Player {
    constructor(score, turn, teamFirst) {
        this.score = score
        this.turn = turn
        this.teamFirst = teamFirst
    }
}

//Creating the classes
player = new Player(0, true, true)
const gamebord = new GameBord(gameSize, 0)

startGame()