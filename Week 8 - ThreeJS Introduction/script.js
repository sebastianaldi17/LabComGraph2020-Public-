/*
    Week 8: ThreeJS Introduction
    The objective of this week's assignment is to familiarize yourself
    with the ThreeJS API.

    What you need to do:
    1. Make a 3d shape at the center of the screen (you can choose whatever shape you want).
    2. Create lighting for that shape.
    3. Animate that shape. (either moving it around or rotating).
    4. "Rainbow" color effect (bonus point).
    
    You can see the expected result here:
        > https://raw.githubusercontent.com/sebastianaldi17/LabComGraph2020-Public-/master/Week%208%20-%20ThreeJS%20Introduction/result.gif

    Use these links to as reference:
    > https://threejs.org/docs/
    > https://www.youtube.com/watch?v=uzkedMF-l4Q
    > https://codepen.io/rachsmith/post/beginning-with-3d-webgl-pt-1-the-scene
    > https://threejsfundamentals.org/
*/

window.onload = function main() {
    const canvas = document.getElementById("c")
    const renderer = new THREE.WebGLRenderer({ canvas })

    // Setting up a camera
    const fov = 75;
    const aspect = 1;
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 2

    const scene = new THREE.Scene()

    // Light
    {
        // ...
    }

    // Material
    // ...
    
    // Geometry and Mesh
    // ...

    // Add objects to scene
    // ...

    // Render function that runs every frame.
    function render() {
        renderer.render(scene, camera)
        requestAnimationFrame(render)
    }

    render()
}