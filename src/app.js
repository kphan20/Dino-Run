/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3, Mesh, SphereGeometry, MeshPhongMaterial } from 'three';
import { SeedScene } from 'scenes';

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
const scene = new SeedScene(camera);
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(6, 3, -10);
camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// placeholder for handling game ending
const handleGameOver = () => {
    console.log("You Lost!");
}

// current implementation uses bounding boxes to detect collisions
// potentially more fancy methods we can use, but this should do for now
const handleCollisions = () => {
    // replace this once we get the player objects
    const playerObject = new Mesh(new SphereGeometry(), new MeshPhongMaterial());
    playerObject.geometry.computeBoundingBox()
    const playerBox = playerObject.geometry.boundingBox
    const obstacles = scene.obstacleManager.obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].children[0].geometry.computeBoundingBox()
        if (playerBox.intersectsBox(obstacles[i].children[0].geometry.boundingBox)) {
            handleGameOver();
            break;
        }
    }
}

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    handleCollisions();
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

window.addEventListener('keydown', (e) => {
    scene.player.position.x += 3;
});
