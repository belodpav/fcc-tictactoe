var appField = document.getElementById("app-play-field"),
    appFieldItem = document.getElementsByClassName("play-field-item"),
    appChoice = document.getElementById("app-play-choice"),
    appStateX = document.getElementById("state-x"),
    appStateO = document.getElementById("state-o");

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
            return 10;
        }
        if (gameMoves[item[0]] === game.user &&
            gameMoves[item[1]] === game.user &&
            gameMoves[item[2]] === game.user) {
            return -10;
        }
    }
    return 0;
}

// Make choice function 
function makeChoice(game, playerChoice) {
    game.player = playerChoice;
    return game; 
}

function getUserSign(player) {
    
    if (player === 1) {
        return "#000";
    }
    
    return "#f00";
}

function firstComputerStep(game) {
    game.depth++;
    game.curMap[4] = game.computer;
}
// initialization 
function initGame(appField, appChoice, appStateX, appStateO, game) {
    appStateO.onclick = function() {
        game.state = 1;
        game.user = 2;
        game.computer = 1;
        game.currentPlayer = 1;
        appChoice.style.display = "none";
        appField.style.display = "block";
        console.log(game);
        firstComputerStep(game);
        appFieldItem[4].style.backgroundColor = getUserSign(game.computer);
    }
    appStateX.onclick = function() {
        game.state = 1;
        game.user = 1;
        game.computer = 2;
        game.currentPlayer = 1;
        appChoice.style.display = "none";
        appField.style.display = "block";
        console.log(game);
    }
    
}

function minMax(game) {
    //console.log(game.depth, "curMap: ",game.curMap," curerent");
    if (isWinner(game, winnerStates) !== 0 || game.depth >= 9) {
        
        if (isWinner(game, winnerStates) === 10) {
            //console.log("=====Computer Win!===== ",game.curMap, game.currentPlayer);
            return [game.move, parseInt(1000/game.depth)];
        } else if (isWinner(game, winnerStates) === -10) {
            //console.log("Enemy win!");
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
            //console.log("print i = ",i,' current player = ',game.currentPlayer);
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
            //console.log("depth === ",game.depth, "current i === ",i ,"current MAX === ",max, "current MIN ===",min);
            //console.log("end of the loop");
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
        //console.log("min: ", min);
        return [minI, min];
    } else {
        //console.log("max: ", max);
        return [maxI, max];
    }
    }
}
var curField = [2, 1, 2, 0, 2, 0, 0, 0, 2];

var newGame = new Object(game);
/*newGame.curMap = [2, 1, 1,
                  1, 1, 2,
                  2, 0, 0];

*/
initGame(appField, appChoice, appStateX, appStateO, newGame);
/*newGame.depth = 7;
newGame.user = 1;
newGame.computer = 2;
newGame.currentPlayer = 1;
newGame.currentEnemy = 2;
console.log("hey: ====",minMax(newGame));
console.log(newGame);
console.log(isWinner(newGame, winnerStates));
*/
appField.onclick = function(element) {
    
    if (newGame.state === 1) {
        var fieldItem = element.target,
            currentPosition = -1,
            currentPcStep = -1;
        if (fieldItem.className !== "play-field-item") {
            return;
        }

        // Getting position what was clicked
        currentPosition = fieldItem.getAttribute("num");
        newGame.currentPlayer = newGame.user;
        newGame.currentEnemy = newGame.computer;
        if (newGame.curMap[currentPosition] !== 0) {
            return;
        }
        fieldItem.style.backgroundColor = getUserSign(newGame.user);
        newGame.curMap[currentPosition] = newGame.currentPlayer;
        newGame.depth++;
        if (isWinner(newGame, winnerStates) === -10) {
            alert("You won!!!");
            newGame.state = 0;
        }

        currentPcStep = minMax(newGame);
        newGame.curMap[currentPcStep[0]] = newGame.computer;
        //fieldItem.style.backgroundColor = "#000";
        appFieldItem[currentPcStep[0]].style.backgroundColor = getUserSign(newGame.computer);
        newGame.depth++;
        if (isWinner(newGame, winnerStates) === 10) {
            alert("Computer won!!!");
            newGame.state = 0;
        }
        if (newGame.depth >= 9) {
        alert("hmmmm!!!!");
        newGame.state = 0;
        }
        console.log(newGame.depth);
    }
}

