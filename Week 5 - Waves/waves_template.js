// Global Variables
var BREAK = 1;

// Line Points
function generatePoints() {
    var verts = [];
    for (var i=-1.0; i<=1.0; i+= 0.1) {
        verts.push(i, 0, 0);
    }

    return verts;
}

function generateXLine() {
    var verts = [];
    
    for (var i=-1.0; i<=1.0; i+= 0.1) {
        verts.push(i, 0, 0);
    }

    return verts;
}

function generateYLine() {
    var verts = [];
    
    for (var i=-1.0; i<=1.0; i+= 0.1) {
        verts.push(0, i, 0);
    }

    return verts;
}

// Update Points
function updatePoints(verts) {
    var time = Date.now() / BREAK;
    for (var i=0; i<verts.length; i+=3) {
        verts[i+1] = Math.sin(time);
    }

    return verts;
}

// Color Random
function randomizeColor(vertices_length) {
    var colors = [];
    for (var i=0; i<vertices_length; i++) {
        colors.push(Math.random()+0.5);
    }

    return colors;
}

// Button Callbacks
function slowDown(amount) {
    if (BREAK+amount < 0) {
        BREAK = 1;
    } else {
        BREAK += amount;
    }
}

// Drawing Shapes
function drawVertex(canvas, shaderProgram, type, vertices, indices, colors) {
    // Initialize Vertex Buffer --> Enables you to assign points (vertices).
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Initialize Index Buffer --> Enables you to use indices.
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    // Initialize Color Buffer --> Enables you to use colors.
    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    var coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0); 
    gl.enableVertexAttribArray(coord);
            
    // (Changes) bind the color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    // (Changes) get the attribute location
    var color = gl.getAttribLocation(shaderProgram, "color");
    // (Changes) point attribute to the color buffer object
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false,0,0) ;
    // (Changes) enable the color attribute
    gl.enableVertexAttribArray(color);

    // Draw the Object (Change the indices.length/3 to indices.length/2 if things go wrong).
    // Or better yet, make different functions to suit every needs.
    // You will need this as we progress through the materials.
    gl.drawElements(type, indices.length/3, gl.UNSIGNED_SHORT, 0);
}

// -----------------------

$(document).ready(function (){
    // Finding Canvas is HTML Page
    var canvas = document.getElementById('my_Canvas');

    // Initializing WebGL
    gl = canvas.getContext('experimental-webgl');
    // (Changes) Vertex shader source code
    var vertCode = 'attribute vec3 coordinates;'+
        'attribute vec3 color;'+
        'varying vec3 vColor;'+
        'void main(void) {' +
        ' gl_Position = vec4(coordinates, 1.0);' +
        'vColor = color;'+
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    // (Changes) Fragment shader source code
    var fragCode = 'precision mediump float;'+
        'varying vec3 vColor;'+
        'void main(void) {'+
        'gl_FragColor = vec4(vColor, 1.);'+
        '}';
            
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragCode); 
    gl.compileShader(fragShader);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
        
    /*======== Defining and storing the geometry ===========*/
    
    // Vertices
    var vertices = [];
    vertices = generatePoints();

    var xLine = [];
    xLine = generateXLine();

    var yLine = [];
    yLine = generateYLine();
            
    // Indices
    var indices = [];
    for (var i=0; i<vertices.length; i++) {
        indices.push(i);
    }

    // Color
    var white = [];
    var color = [];
    for (var i=0; i<vertices.length; i++) {
        if (i%3 == 0) {
            color.push(0, 1, 0);
        }
        white.push(1);
    }

    // Start Drawing (or adding objects) !
    function drawFrame() {
        // Clear the canvas
        gl.clearColor(0, 0, 0, 1);

        // Enable the depth test
        gl.enable(gl.DEPTH_TEST);

        // Clear the color buffer bit
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the view port
        gl.viewport(0,0,canvas.width,canvas.height);


        vertices = updatePoints(vertices);
        drawVertex(canvas, shaderProgram, gl.LINE_STRIP, vertices, indices, color);
        drawVertex(canvas, shaderProgram, gl.LINE_STRIP, xLine, indices, white);
        drawVertex(canvas, shaderProgram, gl.LINE_STRIP, yLine, indices, white);
        window.requestAnimationFrame(drawFrame);
    }
    
    // Start Drawing (Refreshing) Frame
    drawFrame();
});