"use strict";
var disp = $('.disp');
var msg = $('.msg');

var dispWidthInPixels = 40;

for (var i = 0; i < dispWidthInPixels; i++) {
    for (var j = 0; j < dispWidthInPixels; j++) {
        var tmp = $('<div class="pixel" data-x="' + j + '" data-y="' + i + '"></div>')
            disp.append(tmp);
    }
}

var showMessage = function(ma, mb) {
    msg.find('.msg-a').text(ma);
    msg.find('.msg-b').text(mb);
}

var gameRunning = false;
var timeStep = 0;
var gameInterval;
var timeStep = 0;
var frameStep = 0;
var curTime = 0;

var DIR_DOWN = 'd';
var DIR_UP = 'u';
var DIR_RIGHT = 'r';
var DIR_LEFT = 'l';
var BAD_MOVE = 1;
var ACE_MOVE = 2;
var GOOD_MOVE = 3;

var availablePixels = [];
var currentCoin = [];

var adjustSpeed = function(l) {
    if (l >= 500) {
        frameStep = 50;
    } else if (l >= 400) {
        frameStep = 100;
    } else if (l >= 300) {
        frameStep = 150;
    } else if (l > 200) {
        frameStep = 200;
    }
};


var releasePixel = function(x, y) {
    $('div.pixel[data-x="' + x + '"][data-y="' + y + '"]').removeClass('taken');
    availablePixels.push(x + '|' + y)
}

var snake = {
    direction: DIR_RIGHT,
    bodyPixels: [],
    move: function() {
        var head = this.bodyPixels[this.bodyPixels.length - 1];
        var nextHead = [];
        if (this.direction === DIR_LEFT) {
            nextHead.push(head[0] - 1);
        } else if (this.direction === DIR_RIGHT) {
            nextHead.push(head[0] + 1);
        } else {
            nextHead.push(head[0]);
        }

        if (this.direction === DIR_UP) {
            nextHead.push(head[1] - 1);
        } else if (this.direction === DIR_DOWN) {
            nextHead.push(head[1] + 1);
        } else {
            nextHead.push(head[1]);
        }

        if (nextHead[0] == currentCoin[0] && nextHead[1] == currentCoin[1]) {
            this.bodyPixels.push(nextHead);
            adjustSpeed(this.bodyPixels.length);
            if (useNextRandomPixelForCoin()) {
                return GOOD_MOVE;
            } else {
                return ACE_MOVE;
            }
        } else if (tryAllocationPixel(nextHead[0], nextHead[1])) {
            this.bodyPixels.push(nextHead);
            var tail = this.bodyPixels.splice(0, 1)[0];
            releasePixel(tail[0], tail[1]);
            return GOOD_MOVE;
        } else {
            return BAD_MOVE;
        }
    }
};

var useNextRandomPixelForCoin = function() {
    var ap = availablePixels;
    if (ap.length === 0) {
        return false;
    }
    var idx = Math.floor(Math.random() * ap.length);
    currentCoin = ap.splice(idx, 1)[0].split('|');
    $('div.pixel[data-x="' + currentCoin[0] + '"][data-y="' + currentCoin[1] + '"]').addClass('taken');
    return true;
};

var tryAllocationPixel = function(x, y) {
    var ap = availablePixels;
    var p = x + '|' + y;
    var idx = ap.indexOf(p);
    if (idx !== -1) {
        ap.splice(idx, 1);
        $('div.pixel[data-x="' + x + '"][data-y="' + y + '"]').addClass('taken');
        return true;
    } else {
        return false;
    }
};

var init = function() {
    frameStep = 250;
    timeStep = 50;
    curTime = 0;

    for (var i = 0; i < dispWidthInPixels; i++) {
        for (var j = 0; j < dispWidthInPixels; j++) {
            availablePixels.push(i + '|' + j);
        }
    }

    // clearPixels();
    for (var i = 0; i < snake.bodyPixels.length; i++) {
        releasePixel(snake.bodyPixels[i][0], snake.bodyPixels[i][1]);
    }
    releasePixel(currentCoin[0], currentCoin[1]);
    snake.bodyPixels = []

        for (var i = 15, end = 25; i < end; i++) {
            tryAllocationPixel(i, 20);
            snake.bodyPixels.push([i, 20]);
        }
    useNextRandomPixelForCoin();
};

var startLoop = function() {
    gameInterval = setInterval(function() {
        curTime += timeStep;
        if (curTime >= frameStep) {
        var m = snake.move();
        if (m === BAD_MOVE) {
        clearInterval(gameInterval);
        gameRunning = false;
        showMessage('Game Over', 'Press space to start again');
        } else if (m === ACE_MOVE) {
        clearInterval(gameInterval);
        gameRunning = false;
        showMessage('You won', 'Press space to start again');
        }
        curTime %= frameStep;
        }
        }, timeStep);
    showMessage('', '');
};

$(window).keydown(function(e) {
    var k = e.which;
    e.preventDefault();
    // up
    if (k === 38) {
    if (snake.direction !== DIR_DOWN)
    snake.direction = DIR_UP;
    // down
    } else if (k === 40) {
    if (snake.direction !== DIR_UP)
    snake.direction = DIR_DOWN;
    // left
    } else if (k === 37) {
    if (snake.direction !== DIR_RIGHT)
    snake.direction = DIR_LEFT;
    // right
    } else if (k === 39) {
    if (snake.direction !== DIR_LEFT)
    snake.direction = DIR_RIGHT;
    // space
    } else if (k === 32) {
        if (!gameRunning) {
            init();
            startLoop();
            gameRunning = true;
        } else {
            if (!gameInterval) {
                startLoop();
            } else {
                clearInterval(gameInterval);
                gameInterval = null;
                showMessage('Paused', '');
            }
        }
    }
});

showMessage('SNAKE', 'Press space to start')
