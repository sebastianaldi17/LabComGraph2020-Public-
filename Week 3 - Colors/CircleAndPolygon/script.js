// Circle
function circle(center_x, center_y, radius, points) {
    // "Center Point"
    var verts = [center_x, center_y, 0];

    // Maths
    for (var i=0; i<360; i+=360/points) {
        // Converts 'degrees' to 'radians'
        var rad = i * Math.PI/180;

        // Assign coordinates
        var x = Math.sin(rad) + 2*center_x;
        var y = Math.cos(rad) + 2*center_y;
        var z = 0; // Since this is 2D

        verts.push(
            x * radius,
            y * radius,
            z
        );
    }

    // Enclosing Triangle
    verts.push(verts[3], verts[4], verts[5]);
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

// Drawing Shapes
function drawVertex(canvas, shaderProgram, type, vertices, indices, colors) {
    // Initialize Vertex Buffer --> Enables you to asiign points (vertices).
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
    vertices = circle(-0.5, 0, 0.5, 6);

    var vertices2 = [];
    vertices2 = circle(0, 0.5, 0.5, 6);

    var vertices3 = [];
    vertices3 = circle(0.5, 0, 0.5, 6);

    var vertices4 = [];
    vertices4 = circle(0, -0.5, 0.5, 6);
            
    // Indices
    var indices = [];
    for (var i=0; i<vertices.length; i++) {
        indices.push(i);
    }

    var indices2 = [];
    for (var i=0; i<vertices2.length; i++) {
        indices2.push(i);
    }

    var indices3 = [];
    for (var i=0; i<vertices3.length; i++) {
        indices3.push(i);
    }

    var indices4 = [];
    for (var i=0; i<vertices4.length; i++) {
        indices4.push(i);
    }
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 1);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Start Drawing (or adding objects) !
    var colors = randomizeColor(vertices3.length);
    drawVertex(canvas, shaderProgram, gl.TRIANGLE_FAN, vertices, indices, colors);
    var colors = randomizeColor(vertices3.length);
    drawVertex(canvas, shaderProgram, gl.TRIANGLE_FAN, vertices2, indices2, colors);
    var colors = randomizeColor(vertices3.length);
    drawVertex(canvas, shaderProgram, gl.TRIANGLE_FAN, vertices3, indices3, colors);
    var colors = randomizeColor(vertices3.length);
    drawVertex(canvas, shaderProgram, gl.TRIANGLE_FAN, vertices4, indices4, colors);
    
});