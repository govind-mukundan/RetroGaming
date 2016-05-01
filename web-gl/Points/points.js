
var gl;
function initGL(canvas) {
    try {
        //gl = canvas.getContext("experimental-webgl");
         gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        gl.getExtension('GL_OES_standard_derivatives');
        gl.getExtension('OES_standard_derivatives');
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
    //var k = shaderScript.firstChild;
    //while (k) {
    //    if (k.nodeType == 3) {
    //        str += k.textContent;
    //    }
    //    k = k.nextSibling;
    //}

    var shader;
    //if (shaderScript.type == "x-shader/x-fragment") {
    //    shader = gl.createShader(gl.FRAGMENT_SHADER);
    //} else if (shaderScript.type == "x-shader/x-vertex") {
    //    shader = gl.createShader(gl.VERTEX_SHADER);
    //} else {
    //    return null;
    //}

    if (shaderScript.id == "shader-fs-default") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        str = fs_point_default;
    }
    else if ( shaderScript.id == "fs-point-no-alias") {        
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
    if(type == 0)
        fragmentShader = getShader(gl, "shader-fs-default");
    else if(type == 1)
        fragmentShader = getShader(gl, "fs-point-no-alias");
    else if(type == 2)
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

    //shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    //shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    
    return shaderProgram;
}


//var mvMatrix = mat4.create();
//var pMatrix = mat4.create();

function setMatrixUniforms() {
    // gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}



var pointPosBuffer;
var colorBuffer;
var pointSizeBuffer;

function initBuffers() {
    pointPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointPosBuffer);
    var vertices = [
        0.0, 0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    pointPosBuffer.itemSize = 3;
    pointPosBuffer.numItems = 1;

    colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    vertices = [
         0.0, 1.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    colorBuffer.itemSize = 4;
    colorBuffer.numItems = 1;

    pointSizeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
    vertices = [200.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    pointSizeBuffer.itemSize = 1;
    pointSizeBuffer.numItems = 1;
}


function drawScene(shaderProgram) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    //mat4.identity(mvMatrix);

    //mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointPosBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pointPosBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pointSizeBuffer);
    gl.vertexAttribPointer(shaderProgram.pointSizeAttribute, pointSizeBuffer.itemSize, gl.FLOAT, false, 0, 0);


    //setMatrixUniforms();
    gl.drawArrays(gl.GL_POINTS, 0, 1);

}


var shaderPointCircle;
var shaderPointAliased;
var shaderPointDefault;

function webGLStart() {
    var canvas = document.getElementById("point-canvas");
    initGL(canvas);
    shaderPointDefault = initShaders(0);
    initBuffers(shaderPointDefault);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    drawScene(shaderPointDefault);
    
    
    canvas = document.getElementById("point-canvas-no-alias");
    initGL(canvas);
    shaderPointCircle = initShaders(1);
    initBuffers(shaderPointCircle);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    drawScene(shaderPointCircle);
    
    
    canvas = document.getElementById("point-canvas-alias");
    initGL(canvas);
    shaderPointCircle = initShaders(2);
    initBuffers(shaderPointCircle);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // To disable the background color of the canvas element
    gl.enable(gl.BLEND);
    drawScene(shaderPointCircle);
    
}
