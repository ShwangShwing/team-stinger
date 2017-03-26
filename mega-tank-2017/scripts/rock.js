function getRock() {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var posX, posY

    do {
      posX = getRandomInt(100, 1200)
    }
    while ((posX > 330 && posX < 450) && (posX > 650 && posX < 755))

    do {
      posY = getRandomInt(100, 500)
    }
    while ((posY > 190 && posY < 310) && (posY > 150 && posY < 400))

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
          otherObject.takeDamage(1);
        },

        takeDamage: function(damagePoints) {
            //Rocks are immortal for now!
        },

        canRemove: function() {
            return false;
        }

    }
}
