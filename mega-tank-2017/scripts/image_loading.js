var tankPic = document.createElement('img');
var cannonPic = document.createElement('img');
var bricksPic = document.createElement('img');
var littleBrokenBricksPic = document.createElement('img');
var mediumBrokenBricksPic = document.createElement('img');
var bricksPic = document.createElement('img');
var brokenBricksPic = document.createElement('img');
var rockPic = document.createElement('img');

var picsToLoad = 0; // set default to 0

function loadImg(imgElem, fileName) {
    imgElem.src = "img/" + fileName;
}

function loadGraphics() {
    let imgList = [
        { name: bricksPic, file: "bricks.png" },
        { name: littleBrokenBricksPic, file: "little-broken-bricks.png" },
        { name: mediumBrokenBricksPic, file: "medium-broken-bricks.png" },
        { name: brokenBricksPic, file: "broken-bricks.png" },
        { name: tankPic, file: "tank.png" },
        { name: cannonPic, file: "cannon.png" },
        { name: rockPic, file: "rock.png"}
    ];

    picsToLoad = imgList.length;

    for (let i = 0; i < imgList.length; i += 1) {
        loadImg(imgList[i].name, imgList[i].file);
    }
}
