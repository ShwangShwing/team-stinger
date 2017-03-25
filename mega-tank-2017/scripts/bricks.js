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
            if(health >= 75){
            drawRotatingImg(context, bricksPic, positionX, positionY, 0, 24, 24);
            } else if(health >= 50){
            drawRotatingImg(context, littleBrokenBricksPic, positionX, positionY, 0, 24, 24);
            } else if (health >= 25){
            drawRotatingImg(context, mediumBrokenBricksPic, positionX, positionY, 0, 24, 24);
            } else {
            drawRotatingImg(context, brokenBricksPic, positionX, positionY, 0, 24, 24);
            }
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
