var canvas = document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var ctx = canvas.getContext("2d");

var list = [];

var timeout;

var interval = 50;

var limit = 30;

var color;

ctx.strokeStyle = '#ff00ff';

function drawLine(ctx, line) {
    list.push(line);
}


function clear(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function doClear() {
    clear(canvas, ctx);
}

function rotateLine(line, angle) {
    var x = line[0][0] + (line[1][0] - line[0][0]) * Math.cos(angle) - (line[1][1] - line[0][1]) * Math.sin(angle);
    var y = line[0][1] + (line[1][0] - line[0][0]) * Math.sin(angle) + (line[1][1] - line[0][1]) * Math.cos(angle);

    return [
        line[0],
        [x, y]
    ]
}

function revertLine(line) {
    return [
        line[1],
        line[0]
    ]
}

function drawTriangle(counter, line, angle) {
    counter++;
    if (counter > limit) {
        return;
    }

    var xOffset = Math.abs(line[0][0] - line[1][0]);
    var yOffset = Math.abs(line[0][1] - line[1][1]);


    /*
        X = x1+(x2-x1)*cos(A)-(y2-y1)*sin(A)
        Y = y1+(x2-x1)*sin(A)+(y2-y1)*cos(A)
    */
    var line11 = rotateLine(line, angle);
    drawLine(ctx, line11);
    drawLine(ctx, [line11[1], line[1]]);
    drawTriangle(counter, [line11[1], line[1]], angle);
    /*
        var line21 = rotateLine(line, - Math.PI / 2);
        drawLine(ctx, line21);
        drawLine(ctx, [line21[1], line[1]]);

        var line12 = rotateLine(revertLine(line), Math.PI / 2);
        drawLine(ctx, line12);
        drawLine(ctx, [line12[1], line[0]]);

        var line22 = rotateLine(revertLine(line), - Math.PI / 2);
        drawLine(ctx, line22);
        drawLine(ctx, [line22[1], line[0]]); */
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function runDraw() {
    if (list.length) {
        ctx.strokeStyle = color || getRandomColor();

        var line = list.splice(0, 1)[0];
        ctx.beginPath();
        ctx.moveTo(line[0][0], line[0][1]);
        ctx.lineTo(line[1][0], line[1][1]);
        ctx.stroke();
    }
    timeout = setTimeout(runDraw, interval);
}

function redraw() {
    list = [];
    clearTimeout(timeout);
    if (document.getElementById('clear').checked) {
        doClear();
    }


    var size = parseFloat(document.getElementById('size').value) || 2;

    var line = [
        [canvas.width / 2, canvas.height / 2 - size],
        [canvas.width / 2, canvas.height / 2]
    ];

    var n = parseFloat(document.getElementById('n').value) || 2;
    interval = parseFloat(document.getElementById('interval').value) || 50;
    limit = parseFloat(document.getElementById('limit').value) || 30;

    ctx.lineWidth = parseInt(document.getElementById('lineWidth').value) || 1;

    var tmpColor = document.getElementById('color').value;

    if (/^\#[0-9a-fA-F]{6}$/.test(tmpColor)) {
        color = tmpColor;
    } else {
        color = false;
    }

    drawLine(ctx, line);
    drawTriangle(1, line, Math.PI / n);
    drawTriangle(1, line, -Math.PI / n);
    drawTriangle(1, revertLine(line), Math.PI / n);
    drawTriangle(1, revertLine(line), -Math.PI / n);

    runDraw();

}


function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}