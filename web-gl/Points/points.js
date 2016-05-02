﻿
var gl;
function initGL(canvas) {
    try {
        gl = canvas.getContext('webgl',{alpha:true,antialias: true}) || canvas.getContext('experimental-webgl',{alpha:true,antialias: true});

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.getExtension('GL_OES_standard_derivatives');
        gl.getExtension('OES_standard_derivatives');
        // Ref: https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/rendering/point-with-gl-pointcoord-in-fragment-shader.html
        var pointSizeRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
        console.log("point size range:"); console.log(pointSizeRange);
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var shader;

    if (shaderScript.id == "shader-fs-default") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        str = fs_point_default;
    }
    else if (shaderScript.id == "fs-point-no-alias") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        str = fs_point_no_alias;
    }
    else if (shaderScript.id == "fs-point-alias") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        str = fs_point_alias;
    }
    else if (shaderScript.id == "shader-vs") {
        shader = gl.createShader(gl.VERTEX_SHADER);
        str = vs_points;
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders(type) {
    var fragmentShader;
    if (type == 0)
        fragmentShader = getShader(gl, "shader-fs-default");
    else if (type == 1)
        fragmentShader = getShader(gl, "fs-point-no-alias");
    else if (type == 2)
        fragmentShader = getShader(gl, "fs-point-alias");

    var vertexShader = getShader(gl, "shader-vs");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vArgbColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pointSizeAttribute = gl.getAttribLocation(shaderProgram, "vPointSize");
    gl.enableVertexAttribArray(shaderProgram.pointSizeAttribute);

    return shaderProgram;
}

var pointPosBuffer;
var colorBuffer;
var pointSizeBuffer;

function initBuffers(point, color, size) {
    pointPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointPosBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    pointPosBuffer.itemSize = 3;
    pointPosBuffer.numItems = point.length / 3;

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
    colorBuffer.itemSize = 4;
    colorBuffer.numItems = color.length / 4;

    pointSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(size), gl.STATIC_DRAW);
    pointSizeBuffer.itemSize = 1;
    pointSizeBuffer.numItems = size.length;
}


function drawScene(shaderProgram) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pointPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
    gl.vertexAttribPointer(shaderProgram.pointSizeAttribute, pointSizeBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.GL_POINTS, 0, pointSizeBuffer.numItems);

}


function rf() {
    return (2.0 * Math.random() - 1.0);
}

var shaderPointCircle;
var shaderPointAliased;
var shaderPointDefault;

function webGLStart() {
    var point = [0.0, 0.0, 0.0];
    var color = [1.0, 0.0, 0.0, 1.0];
    var size = [200.0];

    var canvas = document.getElementById("point-canvas");
    initGL(canvas);
    shaderPointDefault = initShaders(0);
    initBuffers(point, color, size);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawScene(shaderPointDefault);


    canvas = document.getElementById("point-canvas-no-alias");
    initGL(canvas);
    shaderPointCircle = initShaders(1);
    initBuffers(point, color, size);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawScene(shaderPointCircle);


    canvas = document.getElementById("point-canvas-alias");
    initGL(canvas);
    shaderPointCircle = initShaders(2);
    initBuffers(point, color, size);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // To disable the background color of the canvas element
    gl.enable(gl.BLEND);
    drawScene(shaderPointCircle);
    //gl.disable(gl.BLEND);

    canvas = document.getElementById("fizz-canvas");
    initGL(canvas);
    shaderPointCircle = initShaders(2);
    // We can do this coz gl points to the fizz canvas at this point
var fuzz = () => {     

    //point.push(0.2); point.push(0); point.push(0);
    //color.push(Math.random()); color.push(Math.random()); color.push(Math.random()); color.push(.5);
    //size.push(200);
    // Generate a random collection of points with different sizes, colors and location
    for (var index = 0; index < 300; index++) {
        point.push(rf()); point.push(rf()); point.push(0);
        color.push(Math.random()); color.push(Math.random()); color.push(Math.random()); color.push(Math.random());
        size.push(Math.random() * 100);
    }

    initBuffers(point, color, size);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // To disable the background color of the canvas element
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    drawScene(shaderPointCircle);
    
    // Clear the elements of the arrays
    point = [];
    color = [];
    size = [];
};
    setInterval(fuzz, 100);


}
