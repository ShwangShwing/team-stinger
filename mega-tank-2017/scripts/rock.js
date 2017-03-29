function getRock(initialPositionX, initialPositionY) {
    var posX = initialPositionX
    var posY = initialPositionY;
    const width = 75; // rock size

    function drawRock(context) {
        drawRotatingImg(context, rockPic, posX, posY, 0, 35, 35);
    }
    return {
        getPositionX: function() {
            return posX;
        },

        getPositionY: function() {
            return posY;
        },

        getWidth: function() {
            return width;
        },

        getHealth: function() {
            return 1;
        },

        advanceOneFrame: function() {
            // rocks don't move
        },

        draw: function(fieldCanvas) {
            context = fieldCanvas.getContext('2d');
            drawRock(context)
        },

        onColide: function(otherObject) {
            //The rock is stationary, therefore only other objects collide with it.
        },

        takeDamage: function(damagePoints) {
            //Rocks are immortal for now!
        },

        canRemove: function() {
            return false;
        }

    }
}
