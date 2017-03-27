function getGameEngine(gameCanvas) {
    const fieldCanvas = gameCanvas;

    let isGameRunning = false;
    var isGameOver = false;
    // Credits: band - Cupola, song - War, Album - Mistaken By Design
    const gameSoundtrack = new Audio('./sounds/Cupola-War.mp3');
    gameSoundtrack.loop = true;
    gameSoundtrack.volume = 0.5;

    gameSoundtrack.addEventListener('play', function() {
        document.getElementById('soundtrack-credits').style.display = "block";
    });

    gameSoundtrack.addEventListener('pause', function() {
        document.getElementById('soundtrack-credits').style.display = "none";
    });

    let fieldObjects = [];
    let playerTank;
    let enemyTurret;

    const PAUSE_GAME_TEXT_BLINK_TIME_MS = 400;
    let pauseGameTextLastDisplayTime = 0;

    // Use this function to launch shells. Provide it to a shooting object (e. g. turret) and use it from there
    function launchShell(positionX, positionY, shellDirection, shellWidth = 16, shellSpeed = 20, shellDamage = 30) {
        let shell = getShell(positionX, positionY, shellWidth, shellDirection, shellSpeed, shellDamage);
        fieldObjects.push(shell);
        // console.log('launched shell');
        // console.log('positionX = ', positionX);
        // console.log('positionY = ', shellDirection);
        // console.log('shellSpeed = ', shellSpeed);
        // console.log('shellDamage = ', shellDamage);
        // console.log('fieldObjects count = ' + fieldObjects.length);
    }

    function processCollisions() {
        let objectCount = fieldObjects.length;
        for (let i = 0; i < objectCount; i++) {
            for (let j = i + 1; j < objectCount; j++) {
                let object1 = fieldObjects[i];
                let object2 = fieldObjects[j];

                let object1LeftBorder = object1.getPositionX() - object1.getWidth() / 2;
                let object1RightBorder = object1.getPositionX() + object1.getWidth() / 2;
                let object1TopBorder = object1.getPositionY() - object1.getWidth() / 2;
                let object1BottomBorder = object1.getPositionY() + object1.getWidth() / 2;

                let object2LeftBorder = object2.getPositionX() - object2.getWidth() / 2;
                let object2RightBorder = object2.getPositionX() + object2.getWidth() / 2;
                let object2TopBorder = object2.getPositionY() - object2.getWidth() / 2;
                let object2BottomBorder = object2.getPositionY() + object2.getWidth() / 2;

                if (object1LeftBorder < object2RightBorder &&
                    object1RightBorder > object2LeftBorder &&
                    object1TopBorder < object2BottomBorder &&
                    object1BottomBorder > object2TopBorder) {
                    // Collision between object1 and object2 detected

                    // console.log('collision:');
                    // console.log('object1LeftBorder =' + object1LeftBorder);
                    // console.log('object1RightBorder =' + object1RightBorder);
                    // console.log('object1TopBorder =' + object1TopBorder);
                    // console.log('object1BottomBorder =' + object1BottomBorder);
                    // console.log('object2LeftBorder =' + object2LeftBorder);
                    // console.log('object2RightBorder =' + object2RightBorder);
                    // console.log('object2TopBorder =' + object2TopBorder);
                    // console.log('object2BottomBorder =' + object2BottomBorder);

                    // don't invoke onColide when coliding with passthrough objects (like shells)
                    if (!object2.isPassthough) {
                        object1.onColide(object2);
                    }
                    if (!object1.isPassthough) {
                        object2.onColide(object1);
                    }
                }
            }
        }
    }

    return {
        setupNewGame: function() {
            isGameRunning = false;
            isGameOver = false;
            gameSoundtrack.pause();
            gameSoundtrack.currentTime = 0;

            fieldObjects = [];

            const fieldBordersWidth = Math.max(fieldCanvas.width, fieldCanvas.height);

            const topFieldBorder = getInvisibleWall(
                fieldCanvas.width / 2, -fieldBordersWidth / 2, fieldBordersWidth);

            const rightFieldBorder = getInvisibleWall(
                fieldCanvas.width + fieldBordersWidth / 2, fieldCanvas.height / 2, fieldBordersWidth);

            const bottomFieldBorder = getInvisibleWall(
                fieldCanvas.width / 2, fieldCanvas.height + fieldBordersWidth / 2, fieldBordersWidth);

            const leftFieldBorder = getInvisibleWall(-fieldBordersWidth / 2, fieldCanvas.height / 2, fieldBordersWidth);

            const bricksWall = [];
            for (let i = 1; i <= 5; i += 1) {
                bricksWall.push(getBricks(700, 100 + (i * 50), 50));
            }


            const rockOne = getRock(1000, 300);
            const rockTwo = getRock(200, 400);

            playerTank = getPlayerTank(390, 250, 100, launchShell);

            enemyTurrets = [getTurret(900, 150, 50, launchShell, 90, -0.02),   
                getTurret(900, 500, 50, launchShell, 25, 0.03)];

            fieldObjects.push(topFieldBorder,
                rightFieldBorder,
                bottomFieldBorder,
                leftFieldBorder,
                playerTank,
                ...bricksWall,
                ...enemyTurrets,
                rockOne,
                rockTwo);
        },

        startOrResumeGame: function() {
            isGameRunning = true;
            gameSoundtrack.play();
        },

        pauseGame: function() {
            isGameRunning = false;
            gameSoundtrack.pause();
        },

        gameOver: function() {
            isGameOver = true;
            gameSoundtrack.pause();
        },

        advanceOneFrame: function() {
            if (!isGameRunning) {
                return;
            }
            if (isGameOver) {
                return;
            }

            fieldObjects.forEach(obj => obj.advanceOneFrame());
            processCollisions();
            fieldObjects = fieldObjects.filter(obj => !obj.canRemove())
        },

        drawFieldAndObjects: function() {
            let context = fieldCanvas.getContext('2d');
            drawRect(context, 0, 0, fieldCanvas.width, fieldCanvas.height, 'green');

            context.drawImage(grassPatternPic, 0, 0);

            fieldObjects.forEach(obj => obj.draw(fieldCanvas));

            drawText(context, playerTank.getHealth() + ' HP', 20, 580, 'white', '20px Pixeled');

            if (!isGameRunning) {
                let nowTimeStamp = Date.now();
                if (nowTimeStamp - pauseGameTextLastDisplayTime > PAUSE_GAME_TEXT_BLINK_TIME_MS * 2) {
                    pauseGameTextLastDisplayTime = nowTimeStamp;
                }
                if (nowTimeStamp - pauseGameTextLastDisplayTime < PAUSE_GAME_TEXT_BLINK_TIME_MS) {
                    drawText(context, "Game paused. Press spacebar to resume.", 20, 35, 'red', '16px Pixeled');
                }
            }
        },

        isPlayerDead: function() {
            return playerTank.getHealth() <= 0;
        }
    }
};