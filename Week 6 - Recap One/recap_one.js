// Utility Functions
function circle(center_x, center_y, radius, points) {
    var verts = [center_x, center_y, 0]
    
    for (var i=0; i<=360; i+=360/points) {
        var rad = i * Math.PI/180;
        
        var x, y, z;
        x = Math.cos(rad) *radius + center_x;
        y = Math.sin(rad) *radius + center_y;
        z = 0;
        
        verts.push(x, y, z);
    }
    
    return verts;
 }

function drawVertex(gl, shaderProgram, type, vertices, indices, colors) {
    // Initialize Vertex Buffer --> Enables you to asiign points (vertices).
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Initialize Index Buffer --> Enables you to use indices.
    var index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

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
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0) ;
    // (Changes) enable the color attribute
    gl.enableVertexAttribArray(color);

    // Draw the Object (Change the indices.length/3 to indices.length/2 if things go wrong).
    // Or better yet, make different functions to suit every needs.
    // You will need this as we progress through the materials.
    gl.drawElements(type, indices.length/3, gl.UNSIGNED_SHORT, 0);
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

$(document).ready(function (){

    // Canvas Declaration
    var colorCanvas = document.getElementById('color');
    var circlePolygonCanvas = document.getElementById('circlePolygon');
    var userInteractionCanvas = document.getElementById('userInteraction');

    // GL for each canvas
    var colorCanvasGl = colorCanvas.getContext('experimental-webgl');
    var circlePolygonCanvasGl = circlePolygonCanvas.getContext('experimental-webgl');
    var userInteractionCanvasGl = userInteractionCanvas.getContext('experimental-webgl');

    // Vertex Shader Code for each canvas
    var colorCanvasVertCode = 'attribute vec3 coordinates;' +
    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
    '}';
    var colorCanvasFragCode = 'void main(void) {' +
        ' gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);' +
    '}';
    var colorCanvasVertShader = colorCanvasGl.createShader(colorCanvasGl.VERTEX_SHADER);
    var colorCanvasFragShader = colorCanvasGl.createShader(colorCanvasGl.FRAGMENT_SHADER);

    colorCanvasGl.shaderSource(colorCanvasVertShader, colorCanvasVertCode);
    colorCanvasGl.shaderSource(colorCanvasFragShader, colorCanvasFragCode);

    colorCanvasGl.compileShader(colorCanvasVertShader);
    colorCanvasGl.compileShader(colorCanvasFragShader);

    var colorCanvasShaderProgram = colorCanvasGl.createProgram();
    colorCanvasGl.attachShader(colorCanvasShaderProgram, colorCanvasVertShader);
    colorCanvasGl.attachShader(colorCanvasShaderProgram, colorCanvasFragShader);
    colorCanvasGl.linkProgram(colorCanvasShaderProgram);
    colorCanvasGl.useProgram(colorCanvasShaderProgram);


    var circlePolygonCanvasVertCode = 'attribute vec3 coordinates;' +
    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
    '}';
    var circlePolygonCanvasFragCode = 'void main(void) {' +
        ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);' +
    '}';
    var circlePolygonCanvasVertShader = circlePolygonCanvasGl.createShader(circlePolygonCanvasGl.VERTEX_SHADER);
    var circlePolygonCanvasFragShader = circlePolygonCanvasGl.createShader(circlePolygonCanvasGl.FRAGMENT_SHADER);

    circlePolygonCanvasGl.shaderSource(circlePolygonCanvasVertShader, circlePolygonCanvasVertCode);
    circlePolygonCanvasGl.shaderSource(circlePolygonCanvasFragShader, circlePolygonCanvasFragCode);

    circlePolygonCanvasGl.compileShader(circlePolygonCanvasVertShader);
    circlePolygonCanvasGl.compileShader(circlePolygonCanvasFragShader);

    var circlePolygonCanvasShaderProgram = circlePolygonCanvasGl.createProgram();
    circlePolygonCanvasGl.attachShader(circlePolygonCanvasShaderProgram, circlePolygonCanvasVertShader);
    circlePolygonCanvasGl.attachShader(circlePolygonCanvasShaderProgram, circlePolygonCanvasFragShader);
    circlePolygonCanvasGl.linkProgram(circlePolygonCanvasShaderProgram);
    circlePolygonCanvasGl.useProgram(circlePolygonCanvasShaderProgram);


    var userInteractionCanvasVertCode = 'attribute vec3 coordinates;' +
    'void main(void) {' +
       ' gl_Position = vec4(coordinates, 1.0);' +
    '}';
    var userInteractionCanvasFragCode = 'void main(void) {' +
        ' gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);' +
    '}';
    var userInteractionCanvasVertShader = userInteractionCanvasGl.createShader(userInteractionCanvasGl.VERTEX_SHADER);
    var userInteractionCanvasFragShader = userInteractionCanvasGl.createShader(userInteractionCanvasGl.FRAGMENT_SHADER);

    userInteractionCanvasGl.shaderSource(userInteractionCanvasVertShader, userInteractionCanvasVertCode);
    userInteractionCanvasGl.shaderSource(userInteractionCanvasFragShader, userInteractionCanvasFragCode);

    userInteractionCanvasGl.compileShader(userInteractionCanvasVertShader);
    userInteractionCanvasGl.compileShader(userInteractionCanvasFragShader);

    var userInteractionCanvasShaderProgram = userInteractionCanvasGl.createProgram();
    userInteractionCanvasGl.attachShader(userInteractionCanvasShaderProgram, userInteractionCanvasVertShader);
    userInteractionCanvasGl.attachShader(userInteractionCanvasShaderProgram, userInteractionCanvasFragShader);
    userInteractionCanvasGl.linkProgram(userInteractionCanvasShaderProgram);
    userInteractionCanvasGl.useProgram(userInteractionCanvasShaderProgram);

    // Geometry Data (Vertices, Indices, etc.)
    var circ = circle(0, 0, 0.5, 360);
    var circ2 = circle(1, 1, 0.3, 360);
    var circ3 = circle(-1, 1, 0.3, 360);
    var circ4 = circle(1, -1, 0.3, 360);
    var circ5 = circle(-1, -1, 0.3, 360);
    var indices = [];
    for (var i=0; i<circ.length; i++) {
        indices.push(i);
    }

    // Draw
    colorCanvasGl.clearColor(0, 0, 0, 1);
    colorCanvasGl.enable(colorCanvasGl.DEPTH_TEST);
    colorCanvasGl.clear(colorCanvasGl.COLOR_BUFFER_BIT);
    colorCanvasGl.viewport(0,0,colorCanvas.width,colorCanvas.height);
    drawVertex(colorCanvasGl, colorCanvasShaderProgram, colorCanvasGl.TRIANGLE_FAN, circ, indices,[]);
    drawVertex(colorCanvasGl, colorCanvasShaderProgram, colorCanvasGl.TRIANGLE_FAN, circ2, indices, []);
    drawVertex(colorCanvasGl, colorCanvasShaderProgram, colorCanvasGl.TRIANGLE_FAN, circ3, indices, []);
    drawVertex(colorCanvasGl, colorCanvasShaderProgram, colorCanvasGl.TRIANGLE_FAN, circ4, indices, []);
    drawVertex(colorCanvasGl, colorCanvasShaderProgram, colorCanvasGl.TRIANGLE_FAN, circ5, indices, []);

    circlePolygonCanvasGl.clearColor(0, 0, 0, 1);
    circlePolygonCanvasGl.enable(circlePolygonCanvasGl.DEPTH_TEST);
    circlePolygonCanvasGl.clear(circlePolygonCanvasGl.COLOR_BUFFER_BIT);
    circlePolygonCanvasGl.viewport(0,0,circlePolygonCanvas.width,circlePolygonCanvas.height);
    
    userInteractionCanvasGl.clearColor(0, 0, 0, 1);
    userInteractionCanvasGl.enable(userInteractionCanvasGl.DEPTH_TEST);
    userInteractionCanvasGl.clear(userInteractionCanvasGl.COLOR_BUFFER_BIT);
    userInteractionCanvasGl.viewport(0,0,userInteractionCanvas.width,userInteractionCanvas.height);
});