function getBricks(initialPositionX, initialPositionY) {
    let positionX = initialPositionX;
    let positionY = initialPositionY;
    let hitted = false;
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
            return 1;
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
            if (!hitted) {
                hitted = true;
            } else {
                // console.log('shell has already collided!!!!!!!!!!!!!!!!!1');
            }
        },

        canRemove: function() {
            return hitted;
        }
    }
}