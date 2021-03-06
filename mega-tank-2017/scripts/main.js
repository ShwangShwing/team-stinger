const gameFramesPerSecond = 30;
let gameEngine;
let gameInteval;
let animationRequestId;

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

    gameEngine.setupNewGame();

    gameEngine.startOrResumeGame();
    gameInteval = setInterval(gameLoop, 1000 / gameFramesPerSecond);
}

function gameLoop() {
    // prevent animating when the game state is updating
    if (animationRequestId) {
        window.cancelAnimationFrame(animationRequestId);
        animationRequestId = undefined;
    }

    gameEngine.advanceOneFrame();

    animationRequestId = window.requestAnimationFrame(function() {
        gameEngine.drawFieldAndObjects();
        animationRequestId = undefined;
    });

    if (gameEngine.hasPlayerWon()) {
        animationRequestId = window.requestAnimationFrame(function() {
            drawRect(context, 0, 0, canvas.width, canvas.height, 'rgba(192,192,192,0.3)');
            drawText(context, "THE ENEMY IS DESTROYED!", 20, 320, 'red', '60px Pixeled');
            drawText(context, "Click to start a new game.", 330, 380, 'white', '30px Pixeled');
        });

        let winSound = new Audio('./sounds/win-sound.wav');
        winSound.play();

        clearInterval(gameInteval);

        // set click event after one second to avoid user clicking while still in the game prematurely starting new game
        setTimeout(function() {
            $(document).one('click', function keyPressed(evt) {
                startNewGame();
            });
        }, 1000);

    } else if (gameEngine.hasPlayerLost()) {
        animationRequestId = window.requestAnimationFrame(function() {
            drawRect(context, 0, 0, canvas.width, canvas.height, 'rgba(192,192,192,0.3)');
            drawText(context, "TANK DESTROYED!", 78, 320, 'red', '80px Pixeled');
            drawText(context, "Click to start a new game.", 330, 380, 'white', '30px Pixeled');
        });

        let gameOverSound = new Audio('./sounds/copyrighted-free-game-over.wav');
        gameOverSound.play();

        clearInterval(gameInteval);

        // set click event after one second to avoid user clicking while still in the game prematurely starting new game
        setTimeout(function() {
            $(document).one('click', function keyPressed(evt) {
                startNewGame();
            });
        }, 1000);

    }
}

function removeStartScreen() {
    var startScreen = document.getElementById('start-game');
    var startSound = new Audio('./sounds/start.wav')
    startSound.play();

    startScreen.style.display = 'none';
    soundTrack.pause();
}