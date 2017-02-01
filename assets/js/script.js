var appField = document.getElementById("app-play-field"),
    appFieldItem = document.getElementsByClassName("play-field-item"),
    appChoice = document.getElementById("app-play-choice"),
    appStateX = document.getElementById("state-x"),
    appStateO = document.getElementById("state-o"),
    appFieldCover = document.getElementById("app-field-over"),
    appRestartBtn = document.getElementById("restart-btn");

/* Game core constants */

var winnerStates = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Cross
        [0, 4, 8],
        [2, 4, 6]
    ],
    game = {
        state: 0,
        user: 0,
        computer: 0,
        currentPlayer: 0,
        currentEnemy: 0,
        depth: 0,
        move: 0,
        curMap: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

// If player win isWinner function returns true
// is winner passed three variables player, curSteps
function isWinner(game, winStates) {
    var item,
        gameMoves = game.curMap;
    
    for (var i = 0; i < winStates.length; i++) {
        item = winStates[i];
        
        if (gameMoves[item[0]] === game.computer &&
            gameMoves[item[1]] === game.computer &&
            gameMoves[item[2]] === game.computer) {
            return [10, i];
        }
        if (gameMoves[item[0]] === game.user &&
            gameMoves[item[1]] === game.user &&
            gameMoves[item[2]] === game.user) {
            return [-10, i];
        }
    }
    return [0, 0];
}

// Make choice function 
function makeChoice(game, playerChoice) {
    game.player = playerChoice;
    return game; 
}

function getUserSign(player) {
    
    if (player === 1) {
        return 'url("assets/images/X-symbol.png")';
    }
    
    return 'url("assets/images/O-symbol-red.png")';
}

function firstComputerStep(game) {
    game.depth++;
    game.curMap[4] = game.computer;
}
// initialization 
function initGame(appField, appChoice, appStateX, appStateO, game) {
    game.depth = 0;
    game.curMap = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    appStateO.onclick = function() {
        game.state = 1;
        game.user = 2;
        game.computer = 1;
        game.currentPlayer = 1;
        appChoice.style.display = "none";
        appField.style.display = "block";
        firstComputerStep(game);
        appFieldItem[4].style.backgroundImage = getUserSign(game.computer);
    }
    appStateX.onclick = function() {
        game.state = 1;
        game.user = 1;
        game.computer = 2;
        game.currentPlayer = 1;
        appChoice.style.display = "none";
        appField.style.display = "block";
    }  
}

function minMax(game) {
    var isWinnerList = isWinner(game, winnerStates);
    if (isWinnerList[0] !== 0 || game.depth >= 9) {
        if (isWinnerList[0] === 10) {
            return [game.move, parseInt(1000/game.depth)];
        } else if (isWinnerList[0] === -10) {
            return [game.move, -10];
        }
        return [game.move, 0];
    } else {
        var min = 10000,
            max = -100,
            buffer = 0,
            minI = 0,
            maxI = 0,
            obj = [];
        game.depth++; 

        if (game.currentPlayer === 2) {
            game.currentPlayer = 1;
            game.currentEnemy = 2;
        } else {
            game.currentPlayer = 2;
            game.currentEnemy = 1;
        }
        for (var i = 0; i < 9; i++) {
            if (game.curMap[i] === 0) {
                game.curMap[i] = game.currentPlayer;
                game.move = i;
                if (game.currentPlayer === game.computer) {
                    obj = minMax(game);
                    if (obj[1] > max) {
                        maxI = i;
                        max = obj[1];
                    } 
                } else {
                    obj = minMax(game);
                    if (obj[1] < min) {
                        minI = i;
                        min = obj[1];
                    }
                }
                game.curMap[i] = 0;

            }
        }
        game.depth--;

        if (game.currentPlayer === 2) {
            game.currentPlayer = 1;
            game.currentEnemy = 2;
        } else {
            game.currentPlayer = 2;
            game.currentEnemy = 1;
        }   


        if (game.currentPlayer === game.computer) {
            return [minI, min];
        } else {
            return [maxI, max];
        }
    }
}

function drawCross(winner, numTypeCross, crossLayer) {
    var markerColor = "";
    if (winner === 1) {
        markerColor = "-red";
    }
    switch(numTypeCross) {
        case 0:
            crossLayer.style.backgroundImage = 'url("assets/images/horiz-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "50% 50px";
            break;
        case 1:
            appFieldCover.style.backgroundImage = 'url("assets/images/horiz-cross'+ markerColor + '.png")';
            appFieldCover.style.backgroundPosition = "50% 200px";
            break;
        case 2:
            crossLayer.style.backgroundImage = 'url("assets/images/horiz-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "50% 350px";
            break;
        case 3:
            crossLayer.style.backgroundImage = 'url("assets/images/vertic-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "80px 50%";
            break;
        case 4:
            crossLayer.style.backgroundImage = 'url("assets/images/vertic-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "250px 50%";
            break;
        case 5:
            crossLayer.style.backgroundImage = 'url("assets/images/vertic-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "450px 50%";
            break;
        case 6:
            crossLayer.style.backgroundImage = 'url("assets/images/1-9-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "50px 20px";
            break;
        case 7:
            crossLayer.style.backgroundImage = 'url("assets/images/3-7-cross'+ markerColor + '.png")';
            crossLayer.style.backgroundPosition = "50% 20px";
            break;            
    }
}
function clearFieldItems(fieldItems) {
    for (var i=0; i<fieldItems.length; i++) {
        fieldItems[i].style.backgroundImage = '';    
    }
    
}
var curField = [2, 1, 2, 0, 2, 0, 0, 0, 2];

var newGame = new Object(game);

initGame(appField, appChoice, appStateX, appStateO, newGame);

appField.onclick = function(element) {
    if (newGame.state === 1) {
        var fieldItem = element.target,
            currentPosition = -1,
            currentPcStep = -1;
        if (fieldItem.className !== "play-field-item") {
            return;
        }
        currentPosition = fieldItem.getAttribute("num");
        newGame.currentPlayer = newGame.user;
        newGame.currentEnemy = newGame.computer;
        if (newGame.curMap[currentPosition] !== 0) {
            return;
        }
        fieldItem.style.backgroundImage = getUserSign(newGame.user);
        newGame.curMap[currentPosition] = newGame.currentPlayer;
        newGame.depth++;
        var isWinnerList = isWinner(newGame, winnerStates);
        if (isWinnerList[0] === -10) {
            drawCross(game.currentPlayer,isWinnerList[1],appFieldCover);
            alert("You won!!!");
            newGame.state = 0;
        }

        if (newGame.depth < 9) {
			currentPcStep = minMax(newGame);
			newGame.curMap[currentPcStep[0]] = newGame.computer;
			appFieldItem[currentPcStep[0]].style.backgroundImage = getUserSign(newGame.computer);
			newGame.depth++;
			isWinnerList = isWinner(newGame, winnerStates)
		}
        if (isWinnerList[0] === 10) {
            appFieldCover.style.display = "block";
            drawCross(game.currentPlayer, isWinnerList[1], appFieldCover);
            alert("Computer won!!!");
            newGame.state = 0;
        } else { 
            if (newGame.depth >= 9) {
            alert("It is draw!!!");
            newGame.state = 0;
            }
        }
        if (newGame.state === 0) {
            appRestartBtn.style.display = "block";
        }
    }
}
appRestartBtn.onclick = function() {
    appRestartBtn.style.display = "none";
    appField.style.display = "none";
    appChoice.style.display = "inline-block";
    appFieldCover.style.backgroundImage = "";
    appFieldCover.style.display = "none";
    clearFieldItems(appFieldItem);
    
    var newGame = game;
    initGame(appField, appChoice, appStateX, appStateO, newGame);
}

