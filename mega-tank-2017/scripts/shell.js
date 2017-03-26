function getShell(initialPositionX, initialPositionY, shellWidth, shellDirection, shellSpeed, shellDamage) {
    let positionX = initialPositionX;
    let positionY = initialPositionY;

    const width = shellWidth;
    const direction = shellDirection;
    const speed = shellSpeed;
    const damage = shellDamage;

    let shellHit = false;

    return {
        // If this is defined and true than when colliding
        // with another object, the other object's onColide method won't be invoked.
        // It is true for shells as they manage their own destruction when they colide
        // with another object by using their own onCollideMethod
        isPassthough: true,

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
            return 1;
        },

        advanceOneFrame: function() {
            positionX += Math.cos(direction) * speed;
            positionY += Math.sin(direction) * speed;
        },

        draw: function(fieldCanvas) {
            context = fieldCanvas.getContext('2d');
            drawRotatingObj(context,
                positionX,
                positionY,
                direction,
                width / 2,
                width / 2,
                width,
                width,
                'black');
        },

        onColide: function(otherObject) {
            if (!shellHit) {
                // console.log('shell colides');
                shellHit = true;
                otherObject.takeDamage(damage);
            } else {
                // console.log('shell has already collided!!!!!!!!!!!!!!!!!1');
            }
        },

        takeDamage: function(damagePoints) {

        },

        canRemove: function() {
            //console.log(`canRemove shall return ${shellHit}`);
            return shellHit;
        }
    }
}