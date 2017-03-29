function getTurret(initialPositionX, initialPositionY, turretSize, launchShellFunction, startAngle, initialSpinSpeed) {
    const RELOAD_TIME = 5;
    let spinSpeed = initialSpinSpeed;
    let positionX = initialPositionX;
    let positionY = initialPositionY;
    let health = 100;
    let angle = startAngle;
    let framesBeforeMachineGunCanShootAgain = 0;
    const launchShell = launchShellFunction;
    const width = turretSize;
    const shootDistance = (width * 0.7071 + 20);

    function fireMachineGun() {
        if (framesBeforeMachineGunCanShootAgain > 0) {
            // reloading
            return;
        }
        launchShell(positionX + Math.cos(angle) * shootDistance,
            positionY + Math.sin(angle) * shootDistance,
            angle,
            7,
            40,
            1);
        framesBeforeMachineGunCanShootAgain = RELOAD_TIME;

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
            angle += spinSpeed;
            framesBeforeMachineGunCanShootAgain--;
        },

        draw: function() {
            drawRotatingImg(context, turretBodyPic, positionX, positionY, 0, 24, 24);
            drawRotatingImg(context, turretWeaponPic, positionX, positionY, angle, 24, 24);
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