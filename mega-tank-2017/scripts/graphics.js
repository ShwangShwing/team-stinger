(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            console.log('No native requestAnimationFrame function')
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawText(context, showWords, textX, textY, fillColor, font) {
    context.font = font;
    context.fillStyle = fillColor;
    context.fillText(showWords, textX, textY);
}

function drawRotatingObj(context, x, y, ang, axisX, axisY, length, thickness, color) {
    context.save();
    context.translate(x, y);
    context.rotate(ang);
    drawRect(context, -axisX, -axisY, length, thickness, color);
    context.restore();
}

function drawRotatingImg(context, bitmap, x, y, ang, axisX, axisY) {
    context.save();
    context.translate(x, y);
    context.rotate(ang);
    context.drawImage(bitmap, -axisX, -axisY);
    context.restore();
}