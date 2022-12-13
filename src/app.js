/**
 * app.js
 *
 * playerGroup is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Clock,
    AnimationMixer,
    LoopOnce,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

import { drawWireFrameBox } from './helpers';
import { handleFrustumCulling } from './frustum';
import { Hud } from './components/hud';
import { Player } from './components/objects/Player';
import deathSound from './resources/death.mp3';
import jumpSound from './resources/boing.mp3';
import runningModel from './components/objects/Player/running.fbx';
import fallModel from './components/objects/Player/fall.fbx';

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

const startGame = () => {
    playerMesh.visible = true;
    currCam = camera;
};

// Initialize core ThreeJS components
const startingCamera = new PerspectiveCamera();
let currCam = startingCamera;
const camera = new PerspectiveCamera();
let mixer = null;
let animations = [];
const clock = new Clock();
const scene = new SeedScene();
const playerMesh = new Player(camera, playerBody);
scene.player = playerMesh;
scene.add(playerMesh);
const loadPlayerMesh = () => {
    return new Promise((resolve, reject) => {
        const fbxLoader = new FBXLoader();
        fbxLoader.load(runningModel, (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            playerMesh.add(object);
            mixer = new AnimationMixer(object);
            fbxLoader.load(fallModel, (fallObject) => {
                const action = mixer.clipAction(fallObject.animations[0]);
                action.setLoop(LoopOnce);
                action.clampWhenFinished = true;
                animations.push(action);
            });

            object.animations.forEach((animation) => {
                animation = mixer.clipAction(animation);
                animations.push(animation);
                animation.play();
            });
            animations[0].timeScale = 0.8;
            playerMesh.originalBoundingBox.setFromObject(object);
            const oldMin = playerMesh.originalBoundingBox.min;
            const oldMax = playerMesh.originalBoundingBox.max;
            playerMesh.originalBoundingBox.min.set(
                oldMin.x + 0.5,
                oldMin.y,
                oldMin.z
            );
            playerMesh.originalBoundingBox.max.set(
                oldMax.x - 0.5,
                oldMax.y,
                oldMax.z
            );
            drawWireFrameBox(playerMesh);
            mixer.update(clock.getDelta());
            resolve(true);
        });
    });
};
const renderer = new WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance',
    logarithmicDepthBuffer: true,
});

const init = () => {
    camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
    playerBody.position.set(0, 0, 0);
    playerMesh.position.set(0, 0, 0);
    playerMesh.visible = false;
    scene.obstacleManager.resetObstacles();
    currCam = startingCamera;
    animations[2].stop();
    animations[2].reset();
    animations[0].play();
    mixer.update(clock.getDelta());
};

const hud = new Hud(startGame, init);

// Set up camera
const FRONT_VIEW = new Vector3(0, 1.4, 0.15);
const BACK_VIEW = new Vector3(0, 3, -5);

currCam.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
currCam.lookAt(new Vector3(0, 0, 0));
camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
camera.lookAt(new Vector3(0, 2, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

let dying = false;
const handleGameOver = () => {
    hud.showGameOver();
    const audio = new Audio(deathSound);
    audio.play();
    animations[0].stop();
    animations[2].play();
    dying = true;
};

// current implementation uses bounding boxes to detect collisions
// potentially more fancy methods we can use, but playerGroup should do for now
const handleCollisions = () => {
    const playerObject = scene.player;
    const playerBox = playerObject.boundingBox;
    const obstacles = scene.obstacleManager.obstacles;
    for (let i = 0; i < obstacles.length; i++) {
        // we should only compute and adjust playerGroup bounding box once
        if (obstacles[i].checkCollision(playerBox)) {
            handleGameOver();
            break;
        }
    }
};

// cannon debugger
// const cannonDebugger = new CannonDebugger(scene, physicsWorld);

// run physics simulation
const animate = () => {
    if (hud.gameStarted && !hud.gameOver && !hud.isPaused) {
        physicsWorld.fixedStep();
        scene.player.position.copy(playerBody.position);
    } else if (dying) {
        physicsWorld.fixedStep();
        scene.player.position.copy(playerBody.position);
        if (scene.player.isOnGround()) dying = false;
    }
    window.requestAnimationFrame(animate);
};

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    renderer.render(scene, currCam);
    scene.update && scene.update(timeStamp);

    if (mixer && !hud.isPaused) mixer.update(clock.getDelta());
    if (hud.gameStarted && !hud.gameOver && !hud.isPaused) {
        scene.player.movePlayer(0, 0, 1);

        if (scene.player.position.x > 4) {
            playerBody.position.x = 4;
        }
        if (scene.player.position.x < -4) {
            playerBody.position.x = -4;
        }
        handleCollisions();
        hud.updateScore(scene.player.position);
        scene.obstacleManager.handleObstacles(scene.player.position.z);
        scene.pebbleManager.handlePebbles(scene.player.position.z);
        handleFrustumCulling(scene, camera);
    } else if (!hud.gameStarted) {
        startingCamera.position.z += 1;
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};

Promise.all([
    loadPlayerMesh(),
    ...scene.obstacleManager.obstacles.map((obstacle) => obstacle.loadMesh()),
]).then(() => {
    renderer.compile(scene, camera);
    animate();
    window.requestAnimationFrame(onAnimationFrameHandler);
});

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    startingCamera.aspect = innerWidth / innerHeight;
    startingCamera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (hud.gameOver || hud.isPaused) return;

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
