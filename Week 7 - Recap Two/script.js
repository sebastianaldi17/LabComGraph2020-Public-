// --------------------------------------------------
// Utility Functions
// --------------------------------------------------


/*
    eqtHeight: Returns the height of an equilateral triangle.
        side_length -> The length of an equilateral triangle.
    returns: A number that represents the height of an equilateral triangle.
*/
function eqtHeight(side_length) {
    return side_length * Math.sqrt(3) / 2
}

/*
    equilateralTriangle: Make a triangle at x and y.
        side_length -> The length of the equilateral triangle.
        x           -> The horizontal position of the bottom left point of the triangle.
        y           -> The vertical position of the bottom left point of the triangle.
    returns: Array of float (decimal number) that symbolizes coordinates (x, y, z) - Or commonly known as vertices.
*/
function equilateralTriangle(side_length, x, y) {
    var tri = [x, y, 0.0,
        x + side_length, y, 0.0,
        x + side_length / 2, y + eqtHeight(side_length), 0.0];
    return tri;
}

/*
    rectangle: Make a rectangle at x and y.
        height -> Height of the rectangle.
        width  -> Width of the rectangle.
        x      -> The horizontal position of the bottom left point of the rectangle.
        y      -> The vertical position of the bottom left point of the rectangle.
    returns: Array of float (decimal number) that symbolizes coordinates (x, y, z) - Or commonly known as vertices.
    note: use gl.TRIANGLE_FAN for solid. ANCHOR STARTS AT BOTTOM LEFT!
*/
function rectangle(height, width, x, y) {
    var rect = [x, y, 0,
        x + width, y, 0,
        x + width, y + height, 0,
        x, y + height, 0
    ];
    return rect;
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
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    // (Changes) enable the color attribute
    gl.enableVertexAttribArray(color);

    // Bind rotation matrix
    var rad = Date.now() / 1000;
    var sin = Math.sin(rad), cos = Math.cos(rad)
    var rotMatrix = new Float32Array([
        cos, -sin, 0.0, 0.0,
        sin, cos, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    var u_rotMatrix = gl.getUniformLocation(shaderProgram, 'rotMatrix');
    gl.uniformMatrix4fv(u_rotMatrix, false, rotMatrix);


    // Draw the Object (Change the indices.length/3 to indices.length/2 if things go wrong).
    // Or better yet, make different functions to suit every needs.
    // You will need this as we progress through the materials.
    gl.drawElements(type, indices.length / 3, gl.UNSIGNED_SHORT, 0);
}

// -----------------------
$(document).ready(function () {

    // Finding Canvas is HTML Page
    var canvas = document.getElementById('my_Canvas');

    // Initializing WebGL
    gl = canvas.getContext('experimental-webgl');
    // (Changes) Vertex shader source code
    var vertCode = 'attribute vec3 coordinates;' +
        'attribute vec3 color;' +
        'varying vec3 vColor;' +
        'uniform mat4 rotMatrix;' +
        'void main(void) {' +
        ' gl_Position = rotMatrix * vec4(coordinates, 1.0);' +
        ' vColor = color;' +
        '}';

    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.compileShader(vertShader);

    // (Changes) Fragment shader source code
    var fragCode = 'precision mediump float;' +
        'varying vec3 vColor;' +
        'void main(void) {' +
        'gl_FragColor = vec4(vColor, 1.);' +
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
    var tri = equilateralTriangle(0.5, -0.25, 0)

    // Indices
    var indices = [];

    for (var i = 0; i < tri.length; i++) {
        indices.push(i);
    }

    // Color
    var black = [];
    for (var i = 0; i < tri.length; i++) {
        black.push(0);
    }

    var increment = 0
    // Start Drawing (or adding objects) !
    function drawFrame() {
        // Reset background
        gl.clearColor(1, 1, 1, 1);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, canvas.width, canvas.height);

        // Bind needle speeds
        // Draw Elements!
        // Topmost code is shown at the front! 
        drawVertex(canvas, shaderProgram, gl.TRIANGLES, tri, indices, black);

        window.requestAnimationFrame(drawFrame);
    }

    // Start Drawing (Refreshing) Frame
    drawFrame();
});