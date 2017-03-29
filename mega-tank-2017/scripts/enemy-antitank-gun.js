function getEnemyAntitankGun(initialPositionX, initialPositionY, turretSize, launchShellFunction, startAngle, initialSpinSpeed, initialTarget) {
    const RELOAD_TIME = 120;
    let spinSpeed = initialSpinSpeed;
    let positionX = initialPositionX;
    let positionY = initialPositionY;
    let health = 100;
    let angle = startAngle;
    let framesBeforeAntitankGunCanShootAgain = 0;
    const launchShell = launchShellFunction;
    const width = turretSize;
    const shootDistance = (width * 0.7071 + 20);
    let target = initialTarget;

    function fireMachineGun() {
        if (framesBeforeAntitankGunCanShootAgain > 0) {
            // reloading
            return;
        }
        launchShell(positionX + Math.cos(angle) * shootDistance,
            positionY + Math.sin(angle) * shootDistance,
            angle,
            16,
            40,
            40);
        framesBeforeAntitankGunCanShootAgain = RELOAD_TIME;

    }

    function aim() {
        let aimAngle = angle;

        aimAngle = Math.atan2(target.getPositionY() - positionY, target.getPositionX() - positionX);

        if (aimAngle !== angle) {
            // this is the difference between the desired cannon angle and the current angle
            let angleDifference;
            if (aimAngle >= 0 && angle >= 0) {
                angleDifference = aimAngle - angle;
            } else if (aimAngle >= 0 && angle < 0) {
                angleDifference = aimAngle - (2 * Math.PI + angle);
            } else if (aimAngle < 0 && angle >= 0) {
                angleDifference = (2 * Math.PI + aimAngle) - angle;
            } else if (aimAngle < 0 && angle < 0) {
                angleDifference = (2 * Math.PI + aimAngle) - (2 * Math.PI + angle);
            }

            let newAngle = angle;
            if (angleDifference > 0 && angleDifference < Math.PI ||
                angleDifference < 0 && angleDifference < -Math.PI) {
                // clockwise
                if (Math.abs(angleDifference) < Math.abs(spinSpeed)) {
                    newAngle = aimAngle;
                } else {
                    newAngle = angle + Math.abs(spinSpeed);
                }
            } else {
                // counterclockwise
                if (Math.abs(angleDifference) < Math.abs(spinSpeed)) {
                    newAngle = aimAngle;
                } else {
                    newAngle = angle - Math.abs(spinSpeed);
                }
            }

            // normalize cannon angle so it lies between -PI and PI
            while (newAngle < -Math.PI) {
                newAngle += 2 * Math.PI;
            }

            while (newAngle > Math.PI) {
                newAngle -= 2 * Math.PI;
            }

            angle = newAngle;
        }
    }


    return {
        isEnemy: true,

        getPositionX: function() {
            return positionX;
        },

        getPositionY: function() {
            return positionY;
        },

        getWidth: function() {
            return width;
        },

        getHealth: function() {
            return health;
        },

        advanceOneFrame: function() {
            fireMachineGun();
            if (target) {
                aim();
            } else {
                angle += spinSpeed;
            }
            framesBeforeAntitankGunCanShootAgain--;
        },

        draw: function() {
            drawRotatingImg(context, antitankGunBodyPic, positionX, positionY, 0, 24, 24);
            drawRotatingImg(context, antitankGunWeaponPic, positionX, positionY, angle, 24, 24);
        },

        onColide: function(otherObject) {},

        takeDamage: function(damagePoints) {
            health -= damagePoints;
        },

        canRemove: function() {
            return health <= 0;
        }
    }
}