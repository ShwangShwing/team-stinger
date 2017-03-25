function getBricks(initialPositionX, initialPositionY) {
    let positionX = initialPositionX;
    let positionY = initialPositionY;
    let health = 100;
    return {
        getPositionX: function() {
            return positionX;
        },

        getPositionY: function() {
            return positionY;
        },

        getWidth: function() {
            return bricksPic.width;
        },

        getHealth: function() {
            return health;
        },

        advanceOneFrame: function() {
            // the wall is stationarry
        },

        draw: function() {
            drawRotatingImg(context, bricksPic, positionX, positionY, 0, 56, 56);
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