function getPlayerTank(initialPositionX, initialPositionY, initialHealth, launchShellFunction) {
    // keyCodes
    const KEY_W = 87;
    const KEY_S = 83;
    const KEY_A = 65;
    const KEY_D = 68;

    // key flags
    var keyHeld_Gas = false;
    var keyHeld_Reverse = false;
    var keyHeld_TurnLeft = false;
    var keyHeld_TurnRight = false;

    // don't rotate the cannon towards the mouse
    let isManualAim = false;
    // manual rotation:
    let rotateCannonClockwise = false;
    let rotateCannonCounterclockwise = false;
    let doParkCannon = false; // when this is true align the cannon with the tank

    // mouse flags
    let hasLeftMouseButtonBeenClicked = false;
    let isRightMouseButtonDown = false;

    let tankSpeed = 0;
    let tankAng = 0;

    const CANNON_THICK = 15;
    const CANNON_LENGTH = 100;
    const CANNON_TURN_RATE = 0.060;
    let cannonAngle = 0;;

    let framesBeforeMachineGunCanShootAgain = 0;
    const MACHINE_GUN_RELOAD_TIME_IN_FRAMES = 3;

    let framesBeforeCannonCanShootAgain = 0;
    const CANNON_RELOAD_TIME_IN_FRAMES = 30;

    const TANK_THICK = 75;
    const TANK_LENGHT = 120;

    const GROUNDSPEED_DECAY = 0.90;
    const MAX_SPEED = 20;
    const DRIVE_POWER = 0.30;
    const REVERSE_POWER = 0.15;
    const TURN_RATE = 0.030;

    let tankCenterPositionX = initialPositionX;
    let tankCenterPositionY = initialPositionY;
    let health = initialHealth;
    const width = 120;
    const launchShell = launchShellFunction;

    // The distance from the center of the tank where the shell appears when fired.
    // 0.7071 is sin(45 degrees)
    const shootDistance = (width * 0.7071 + 20);

    let mouseX = tankCenterPositionX;
    let mouseY = tankCenterPositionY;

    // SOUNDS
    const moveAudio = new Audio('./sounds/move.wav');
    const shotAudio = new Audio('./sounds/shot.wav');
    const machinegunAudio = new Audio('./sounds/machinegun.wav');

    // INPUT FUNCTIONS
    function aim() {
        let aimAngle = cannonAngle;

        if (isManualAim) {
            if (doParkCannon) {
                aimAngle = tankAng;
            } else {
                if (rotateCannonClockwise) {
                    aimAngle += CANNON_TURN_RATE;
                } else if (rotateCannonCounterclockwise) {
                    aimAngle -= CANNON_TURN_RATE;
                }
            }

            // normalize aim angle so it lies between -PI and PI
            while (aimAngle < -Math.PI) {
                aimAngle += 2 * Math.PI;
            }

            while (aimAngle > Math.PI) {
                aimAngle -= 2 * Math.PI;
            }
        } else {
            aimAngle = Math.atan2(mouseY - tankCenterPositionY, mouseX - tankCenterPositionX);
        }
        if (aimAngle !== cannonAngle) {
            // this is the difference between the desired cannon angle and the current angle
            let angleDifference;
            if (aimAngle >= 0 && cannonAngle >= 0) {
                angleDifference = aimAngle - cannonAngle;
            } else if (aimAngle >= 0 && cannonAngle < 0) {
                angleDifference = aimAngle - (2 * Math.PI + cannonAngle);
            } else if (aimAngle < 0 && cannonAngle >= 0) {
                angleDifference = (2 * Math.PI + aimAngle) - cannonAngle;
            } else if (aimAngle < 0 && cannonAngle < 0) {
                angleDifference = (2 * Math.PI + aimAngle) - (2 * Math.PI + cannonAngle);
            }

            let newCannonAngle = cannonAngle;
            if (angleDifference > 0 && angleDifference < Math.PI ||
                angleDifference < 0 && angleDifference < -Math.PI) {
                // clockwise
                if (Math.abs(angleDifference) < CANNON_TURN_RATE) {
                    newCannonAngle = aimAngle;
                } else {
                    newCannonAngle = cannonAngle + CANNON_TURN_RATE;
                }
            } else {
                // counterclockwise
                if (Math.abs(angleDifference) < CANNON_TURN_RATE) {
                    newCannonAngle = aimAngle;
                } else {
                    newCannonAngle = cannonAngle - CANNON_TURN_RATE;
                }
            }

            // normalize cannon angle so it lies between -PI and PI
            while (newCannonAngle < -Math.PI) {
                newCannonAngle += 2 * Math.PI;
            }

            while (newCannonAngle > Math.PI) {
                newCannonAngle -= 2 * Math.PI;
            }

            cannonAngle = newCannonAngle;
        }
    }

    function handleMouse(evt) {
        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;

        mouseX = evt.clientX - rect.left - root.scrollLeft;
        mouseY = evt.clientY - rect.top - root.scrollTop;
    }


    function fireCannon() {
        if (framesBeforeCannonCanShootAgain > 0) {
            // reloading
            return;
        }
        launchShell(tankCenterPositionX + Math.cos(cannonAngle) * shootDistance,
            tankCenterPositionY + Math.sin(cannonAngle) * shootDistance,
            cannonAngle);
        framesBeforeCannonCanShootAgain = CANNON_RELOAD_TIME_IN_FRAMES;
        shotAudio.play();
    }

    function fireMachineGun() {
        if (framesBeforeMachineGunCanShootAgain > 0) {
            // reloading
            return;
        }
        launchShell(tankCenterPositionX + Math.cos(tankAng) * shootDistance,
            tankCenterPositionY + Math.sin(tankAng) * shootDistance,
            tankAng,
            7,
            40,
            1);
        framesBeforeMachineGunCanShootAgain = MACHINE_GUN_RELOAD_TIME_IN_FRAMES;

    }

    function handleMouseClick(evt) {
        hasLeftMouseButtonBeenClicked = true;
    }

    function handleRightMouseClick(evt) {
        evt.preventDefault();
    }

    function handleMouseDown(evt) {
        if (evt.button == 2) {
            isRightMouseButtonDown = true;
            evt.preventDefault();
        }
    }

    function handleMouseUp(evt) {
        if (evt.button == 2) {
            isRightMouseButtonDown = false;
            evt.preventDefault();
        }
    }

    function keyPressed(evt) {
        // console.log("key pressed: ", evt);

        if (evt.keyCode == KEY_A) {
            keyHeld_TurnLeft = true;
        }
        if (evt.keyCode == KEY_W) {
            keyHeld_Gas = true;
        }
        if (evt.keyCode == KEY_D) {
            keyHeld_TurnRight = true;
        }
        if (evt.keyCode == KEY_S) {
            keyHeld_Reverse = true;
        }
        if (evt.key == 'Shift') {
            isManualAim = true;
        }
        if (evt.code == 'KeyQ') {
            rotateCannonCounterclockwise = true;
            doParkCannon = false;
        }
        if (evt.code == 'KeyE') {
            rotateCannonClockwise = true;
            doParkCannon = false;
        }
        if (evt.key == 'Alt') {
            doParkCannon = true;
        }
        evt.preventDefault();
    }

    function keyReleased(evt) {
        //console.log("key released: ", evt);

        if (evt.keyCode == KEY_A) {
            keyHeld_TurnLeft = false;
        }
        if (evt.keyCode == KEY_W) {
            keyHeld_Gas = false;
        }
        if (evt.keyCode == KEY_D) {
            keyHeld_TurnRight = false;
        }
        if (evt.keyCode == KEY_S) {
            keyHeld_Reverse = false;
        }
        if (evt.key == 'Shift') {
            isManualAim = false;
            doParkCannon = false;
        }
        if (evt.code == 'KeyQ') {
            rotateCannonCounterclockwise = false;
        }
        if (evt.code == 'KeyE') {
            rotateCannonClockwise = false;
        }
        evt.preventDefault();
    }

    // play move.wav when key down and stop when up. Up to 36secs. Will try to loop it
    function movePlaySound() {
        if (keyHeld_Gas || keyHeld_Reverse || keyHeld_TurnLeft || keyHeld_TurnRight) {
            moveAudio.play();
        } else {
            moveAudio.pause();
            moveAudio.currentTime = 0;
        }
    }

    function machinegunPlaySound() {
        if (isRightMouseButtonDown) {
            machinegunAudio.play();
        } else {
            machinegunAudio.pause();
            machinegunAudio.currentTime = 0;
        }
    }

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('contextmenu', handleRightMouseClick);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);

    // prevent selecting the canvas when user is anxious and shoots too much
    canvas.onselectstart = function() { return false; }

    function drawTankBody(context) {
        drawRotatingImg(context, tankPic, tankCenterPositionX, tankCenterPositionY, tankAng, tankPic.width / 2, tankPic.height / 2);

        // *** option with simple rectangle instead of tankPic ***
        // drawRotatingObj(tankX, tankY, tankAng, TANK_LENGHT/2, TANK_THICK/2, TANK_LENGHT, TANK_THICK, 'DarkOliveGreen');
    }

    function drawCannon(context) {
        drawRotatingImg(context, cannonPic, tankCenterPositionX, tankCenterPositionY, cannonAngle, cannonPic.width * 0.25, cannonPic.height / 2);

        // *** option with simple rectangle instead of cannonPic ***
        // drawRotatingObj(tankX, tankY, cannonAng, CANNON_LENGTH * 0.1, CANNON_THICK/2, CANNON_LENGTH, CANNON_THICK, 'OliveDrab');
    }

    function moveTank() {
        tankSpeed *= GROUNDSPEED_DECAY;

        if (Math.abs(tankSpeed) < MAX_SPEED) {
            if (keyHeld_Gas) {
                tankSpeed += DRIVE_POWER;
            }
            if (keyHeld_Reverse) {
                tankSpeed -= REVERSE_POWER;
            }
        }

        if (keyHeld_TurnLeft) {
            cannonAngle -= TURN_RATE;
            tankAng -= TURN_RATE;
        }
        if (keyHeld_TurnRight) {
            cannonAngle += TURN_RATE;
            tankAng += TURN_RATE;
        }

        tankCenterPositionX += Math.cos(tankAng) * tankSpeed;
        tankCenterPositionY += Math.sin(tankAng) * tankSpeed;
        console.log("Tank angle: " + tankAng);
    }

    return {
        getPositionX: function() {
            return tankCenterPositionX;
        },

        getPositionY: function() {
            return tankCenterPositionY;
        },

        getWidth: function() {
            return width;
        },

        getHealth: function() {
            return health;
        },

        advanceOneFrame: function() {
            moveTank();
            aim();
            movePlaySound();
            machinegunPlaySound();
            if (hasLeftMouseButtonBeenClicked) {
                fireCannon();
                hasLeftMouseButtonBeenClicked = false;
            }
            if (isRightMouseButtonDown) {
                fireMachineGun();
            }
            framesBeforeCannonCanShootAgain--;
            framesBeforeMachineGunCanShootAgain--;
        },

        draw: function(fieldCanvas) {
            context = fieldCanvas.getContext('2d');
            drawTankBody(context);
            drawCannon(context);
        },

        onColide: function(otherObject) {
            //console.log('player tank colided with another object');
            // stop tank from moving and unstack
            tankSpeed = 0;
            let newCenterTankPositionX = tankCenterPositionX;
            let newCenterTankPositionY = tankCenterPositionY;

            let tankLeftBorder = this.getPositionX() - this.getWidth() / 2;
            let tankRightBorder = this.getPositionX() + this.getWidth() / 2;
            let tankTopBorder = this.getPositionY() - this.getWidth() / 2;
            let tankBottomBorder = this.getPositionY() + this.getWidth() / 2;

            let otherObjectLeftBorder = otherObject.getPositionX() - otherObject.getWidth() / 2;
            let otherObjectRightBorder = otherObject.getPositionX() + otherObject.getWidth() / 2;
            let otherObjectTopBorder = otherObject.getPositionY() - otherObject.getWidth() / 2;
            let otherObjectBottomBorder = otherObject.getPositionY() + otherObject.getWidth() / 2;

            let moveDownToUnstack = otherObjectBottomBorder - tankTopBorder;
            let moveUpToUnstack = tankBottomBorder - otherObjectTopBorder;
            let moveRightToUnstack = otherObjectRightBorder - tankLeftBorder;
            let moveLeftToUnstack = tankRightBorder - otherObjectLeftBorder;

            //unstack to the direction with minimal movement
            if (moveDownToUnstack < moveUpToUnstack &&
                moveDownToUnstack < moveRightToUnstack &&
                moveDownToUnstack < moveLeftToUnstack) {
                //console.log('unstack down');
                newCenterTankPositionY = this.getPositionY() + moveDownToUnstack;
            } else if (moveUpToUnstack < moveDownToUnstack &&
                moveUpToUnstack < moveRightToUnstack &&
                moveUpToUnstack < moveLeftToUnstack) {
                //console.log('unstack up');
                newCenterTankPositionY = this.getPositionY() - moveUpToUnstack;
            } else if (moveRightToUnstack < moveDownToUnstack &&
                moveRightToUnstack < moveUpToUnstack &&
                moveRightToUnstack < moveLeftToUnstack) {
                //console.log('unstack right');
                newCenterTankPositionX = this.getPositionX() + moveRightToUnstack;
            } else if (moveLeftToUnstack < moveDownToUnstack &&
                moveLeftToUnstack < moveUpToUnstack &&
                moveLeftToUnstack < moveRightToUnstack) {
                //console.log('unstack left');
                newCenterTankPositionX = this.getPositionX() - moveLeftToUnstack;
            }

            tankCenterPositionX = newCenterTankPositionX;
            tankCenterPositionY = newCenterTankPositionY;
            //console.log(`collision detected at ${this.getPositionX()}, ${this.getPositionY()}; width: ${this.getWidth()}`);
        },

        takeDamage: function(damagePoints) {
            health -= damagePoints;
        },

        canRemove: function() {
            //never remove the tank. The engine will end the game when the tank has helth <= 0
            return false;
        }
    }
}