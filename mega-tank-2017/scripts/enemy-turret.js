function getTurret(initialPositionX, initialPositionY, turretSize) {
    let positionX = initialPositionX;
    let positionY = initialPositionY;
    let health = 100;

    const width = turretSize;

    return {
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
            // the wall is stationarry
        },

        draw: function() {
            drawRotatingImg(context, turretBodyPic, positionX, positionY, 0, 24, 24);
            drawRotatingImg(context, turretWeaponPic, positionX, positionY, 0, 24, 24);
        },

        onColide: function(otherObject) {
        },

        takeDamage: function(damagePoints) {
            health -= damagePoints;
        },

        canRemove: function() {
            return health <= 0;
        }
    }
}
