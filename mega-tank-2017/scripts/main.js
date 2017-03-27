const gameFramesPerSecond = 30;
let gameEngine;
let gameInteval;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');

    loadGraphics();

    gameEngine = getGameEngine(canvas);

    document.addEventListener('keydown', function keyPressed(evt) {
        if (evt.code == "KeyP") {
            gameEngine.pauseGame();
        };

    });

    document.addEventListener('keyup', function keyPressed(evt) {
        if (evt.code == "Space") {
            if (document.getElementById('start-game').style.display == 'none') {
                gameEngine.startOrResumeGame();
            }
        };
    });

    document.querySelector('#soundtrack-credits a').addEventListener('click', function() {
        gameEngine.pauseGame();
    })
}

function startNewGame() {
    clearInterval(gameInteval);
    removeStartScreen();
    removeGameOverScreen();

    gameEngine.setupNewGame();

    gameEngine.startOrResumeGame();

    gameInteval = setInterval(gameLoop, 1000 / gameFramesPerSecond);

}

function gameLoop() {
    gameEngine.advanceOneFrame();
    gameEngine.drawFieldAndObjects();

    if (gameEngine.isPlayerDead()) {
        console.log('player is dead');
        clearInterval(gameInteval);
        displayGameOverScreen();
    }
}

function removeStartScreen() {
    var startScreen = document.getElementById('start-game');
    var startSound = new Audio('./sounds/start.wav')
    startSound.play();

    startScreen.style.display = 'none';
    soundTrack.pause();
}


function displayGameOverScreen() {

    var gameOverScreen = document.getElementById('game-over');
    gameOverScreen.style.display = 'inline-block';


}

function removeGameOverScreen() {
    var gameOverScreen = document.getElementById('game-over');
    gameOverScreen.style.display = 'none';
}