/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Vector4,
    RGB_S3TC_DXT1_Format,
} from 'three';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { Hud } from './components/hud';
import deathSound from './resources/death.mp3';
import jumpSound from './resources/boing.mp3';

// Handle Physics
// Set up physics
const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0),
});

// floor boundary using plane
const floorBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
});
// rotate so it is horizontal
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(floorBody);

// player object (represented by sphere)
const playerBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Cylinder(),
});
playerBody.position.set(0, 10, 0);
physicsWorld.addBody(playerBody);

// Initialize core ThreeJS components
const camera = new PerspectiveCamera();
const scene = new SeedScene(camera, playerBody);
const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
});
const hud = new Hud();

// Set up camera
const FRONT_VIEW = new Vector3(0, 3, -2);
const BACK_VIEW = new Vector3(0, 3, -10);

camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
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
let gameOver = false;
const handleGameOver = () => {
    gameOver = true;
    const audio = new Audio(deathSound);
    audio.play();
};

// current implementation uses bounding boxes to detect collisions
// potentially more fancy methods we can use, but this should do for now
const handleCollisions = () => {
    const playerObject = scene.player;
    const playerBox = playerObject.geometry.boundingBox;
    const obstacles = scene.obstacleManager.obstacles;
    for (let i = 0; i < obstacles.length; i++) {
        // we should only compute and adjust this bounding box once
        if (obstacles[i].checkCollision(playerBox)) {
            handleGameOver();
            break;
        }
    }
};

// Frustum culling
const handleFrustumCulling = () => {
    scene.traverse((obj) => {
        obj.visible = inFrustum(obj);
    })
}
const inFrustum = (obj) => {    
    const projectionMatrix = camera.projectionMatrix; 
    const matrix = projectionMatrix;
    let boundingBox = null;
    if (obj === undefined) return true; 
    else if (obj.name === 'bird' || obj.name === 'cacti') {
        obj.updateBoundingBox();
        boundingBox = obj.boundingBox; 
    }
    else if (obj.geometry != undefined) {
        boundingBox = obj.geometry.boundingBox; 
    } 
    if (boundingBox === null) return true;

    // 8 vertices
    const min = boundingBox.min; 
    const max = boundingBox.max;

    const v1 = new Vector3(min.x, min.y, min.z);
    const v2 = new Vector3(min.x, min.y, max.z);
    const v3 = new Vector3(min.x, max.y, min.z);
    const v4 = new Vector3(min.x, max.y, max.z);
    const v5 = new Vector3(max.x, min.y, min.z);
    const v6 = new Vector3(max.x, min.y, max.z);
    const v7 = new Vector3(max.x, max.y, min.z);
    const v8 = new Vector3(max.x, max.y, max.z);
    const verts = [
        v1, v2, v3, v4, v5, v6, v7, v8,
    ];

    for (let i = 0; i < verts.length; i++) {
        const v = verts[i];
        const worldV = obj.localToWorld(v);
        const worldV4 = new Vector4(worldV.x, worldV.y, worldV.z, 1);
        const cameraV4 = worldV4.applyMatrix4(camera.matrixWorldInverse);

        const projV4 = cameraV4.applyMatrix4(matrix);
        const x = projV4.x; 
        const y = projV4.y; 
        const z = projV4.z; 
        const w = projV4.w; 

        if (
            x >= -w && 
            x <= w &&
            y >= -w &&
            y <= w &&
            z >= 0 &&
            z <= w
        ) return true; 
    }

    return false;
}

// cannon debugger
// const cannonDebugger = new CannonDebugger(scene, physicsWorld);

// run physics simulation
const animate = () => {
    if (!gameOver && !hud.isPaused) {
        physicsWorld.fixedStep();
        // cannonDebugger.update();
        scene.player.position.copy(playerBody.position);
    }
    window.requestAnimationFrame(animate);
};
animate();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);

    if (!gameOver && !hud.isPaused) {
        scene.player.movePlayer(0, 0, 0.1);
        handleCollisions();
        hud.updateScore(scene.player.position);
        scene.obstacleManager.handleObstacles(scene.player.position.z);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);

    scene.obstacleManager.handleObstacles(scene.player.position.z);
    handleFrustumCulling();
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
    const key = e.key;
    if (gameOver || hud.isPaused) return;

    if (key === 'ArrowLeft') {
        scene.player.rotatePlayerLeft();
    } else if (key === 'ArrowRight') {
        scene.player.rotatePlayerRight();
    } else if (key === 'ArrowUp') {
        const jumped = scene.player.jumpPlayer();
        if (jumped) {
            const audio = new Audio(jumpSound);
            audio.play();
        }
    } else if (key === 'v') {
        if (camera.position.z == BACK_VIEW.z)
            camera.position.set(FRONT_VIEW.x, FRONT_VIEW.y, FRONT_VIEW.z);
        else camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
    }
});
