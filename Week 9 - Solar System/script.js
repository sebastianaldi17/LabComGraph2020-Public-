/*
    Week 9: Solar System
    The objective of this week's assignment is to familiarize yourself
    with textures, bump map, and scenegraph.

    All textures can be found at this week's github folder.
    For those of you that have problems with CORS policy, I recommend:
        > Use the URL from the github (https://raw.githubusercontent.com/sebastianaldi17/LabComGraph2020-Public-/master/Week%209%20-%20Solar%20System/textures/earthbump1k.jpg) and so on.
        > Host your own local server (I use node.js live-server, this has the least problems with cache)
        
    What you need to do:
    1. Create a sun.
    2. Create all 9 planets (including pluto).
    2a. For saturn and uranus, create a RingGeometry to act as the ring for the planet.
    3. Add lighting based on the sun's location (I used 6 PointLights, this is up to you).
    4. Rotate the sun and planets.
    5. Create a "skybox" (the stars surrounding the planets).
    6. Create a button to pause the orbits.
    
    You can see the expected result here:
        > https://raw.githubusercontent.com/sebastianaldi17/LabComGraph2020-Public-/master/Week%209%20-%20Solar%20System/results.gif

    Use these links to as reference:
    > http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
    > https://threejsfundamentals.org/threejs/lessons/threejs-scenegraph.html
*/
window.onload = function main() {
    const canvas = document.getElementById("c")
    const renderer = new THREE.WebGLRenderer({ canvas })
    const loader = new THREE.TextureLoader()

    // Setting up a camera
    const fov = 75;
    const aspect = 1;
    const near = 0.1;
    const far = 10000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    const controls = new THREE.OrbitControls(camera, renderer.domElement)

    camera.position.z = 200
    controls.update()

    const scene = new THREE.Scene()

    // Textures
    var sunMap = loader.load('https://raw.githubusercontent.com/sebastianaldi17/LabComGraph2020-Public-/master/Week%209%20-%20Solar%20System/textures/sunmap.jpg')
    // var earthMap = loader.load('textures/earthmap1k.jpg')
    // var earthBump = loader.load('textures/earthbump1k.jpg')

    // Light
    var ambientLight = new THREE.AmbientLight(0x404040)

    // Material
    var sunMaterial = new THREE.MeshPhongMaterial({ map: sunMap })
    // var earthMaterial = new THREE.MeshPhongMaterial({ map: earthMap })

    // Material properties (bump, specular, etc.)
    // earthMaterial.bumpMap = earthBump
    // earthMaterial.bumpScale = 0.05

    // Geometry
    var sphereGeometry = new THREE.SphereGeometry(50, 32, 32)

    // Mesh
    var sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
    // var earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)

    // Set Mesh properties


    // Add objects to scene
    scene.add(sunMesh)
    scene.add(ambientLight)

    // Render function that runs every frame.
    function render() {
        renderer.render(scene, camera)
        sunMesh.rotation.y += 0.01

        controls.update()

        requestAnimationFrame(render)
    }

    render()
}