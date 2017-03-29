const gameFramesPerSecond = 30;
let gameEngine;
let gameInteval;

window.onload = function () {
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

    document.querySelector('#soundtrack-credits a').addEventListener('click', function () {
        gameEngine.pauseGame();
    })
}

function startNewGame() {
    clearInterval(gameInteval);
    removeStartScreen();

    gameEngine.setupNewGame();

    gameEngine.startOrResumeGame();
    gameInteval = setInterval(gameLoop, 1000 / gameFramesPerSecond);
}

function gameLoop() {
    gameEngine.advanceOneFrame();
    gameEngine.drawFieldAndObjects();
    if (gameEngine.isPlayerDead()) {
        drawRect(context, 0, 0, canvas.width, canvas.height, 'rgba(192,192,192,0.3)');
        drawText(context, "GAME OVER", 220, 320, 'red', '100px Pixeled');
        drawText(context, "Click to start a new game.", 330, 380, 'white', '30px Pixeled');

        gameEngine.gameOver();

        clearInterval(gameInteval);

        $(document).one('click', function keyPressed(evt) {
            startNewGame();
        });

    }
}

function removeStartScreen() {
    var startScreen = document.getElementById('start-game');
    var startSound = new Audio('./sounds/start.wav')
    startSound.play();

    startScreen.style.display = 'none';
    soundTrack.pause();
}