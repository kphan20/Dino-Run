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
    AudioListener,
    Audio,
    AudioLoader,
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
import deathSoundFile from './resources/thud.mp3';
import jumpSoundFile from './resources/boing.mp3';
import runningSoundFile from './resources/sand.wav';
import runningModel from './components/objects/Player/running.fbx';
import fallModel from './components/objects/Player/fall.fbx';

const DEBUG_MODE = false;

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
const listener = new AudioListener();
const runningSound = new Audio(listener);
const deathSound = new Audio(listener);
const jumpSound = new Audio(listener);
const audioLoader = new AudioLoader();
const startGame = () => {
    playerMesh.visible = true;
    currCam = camera;
};

const startingCamera = new PerspectiveCamera();
let currCam = startingCamera;
const camera = new PerspectiveCamera();
camera.add(listener);
let mixer = null;
let animations = [];
const clock = new Clock();
const floorWidth = 5000;
const floorHeight = 5000;
const scene = new SeedScene(floorWidth, floorHeight);
const playerMesh = new Player(camera, playerBody);
scene.player = playerMesh;
scene.add(playerMesh);
const loadPlayerMesh = (isDebugMode) => {
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
            if (isDebugMode) drawWireFrameBox(playerMesh);
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
    playerMesh.rotation.y = 0;
    playerMesh.visible = false;
    speed = 0.3;
    frameCounter = 0;
    scene.obstacleManager.resetObstacles();
    scene.floor.position.z = 0;
    currCam = startingCamera;
    animations[2].stop();
    animations[2].reset();
    animations[0].play();
    mixer.update(clock.getDelta());
};

const hud = new Hud(startGame, init, runningSound);

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
    camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
    if (runningSound && runningSound.source) runningSound.stop();
    if (deathSound) deathSound.play();
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

// handle floor
const handleFloor = () => {
    const floorDepth = scene.floor.position.z;
    const frontierDepth = scene.player.position.z;
    const floorMinDepth = Math.floor(floorDepth - floorHeight / 2);
    const playerMinusFloorMinDepth = frontierDepth - floorMinDepth;
    if (playerMinusFloorMinDepth >= floorHeight / 2)
        scene.floor.translateFloor();
};

let frameCounter = 0;
let speed = 0.3;
const fps = 1000 / 60;
let prevTimeStamp = 0;
// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    if (timeStamp - prevTimeStamp > fps) {
        renderer.render(scene, currCam);
        scene.update && scene.update(timeStamp);

        if (mixer && !hud.isPaused) mixer.update(clock.getDelta());
        if (hud.gameStarted && !hud.gameOver && !hud.isPaused) {
            if (!runningSound.isPlaying && scene.player.isOnGround())
                runningSound.play();
            frameCounter++;
            if (frameCounter % 300 === 0) {
                speed += 0.1;
                hud.showSpeedingMessage();
            }
            scene.player.movePlayer(0, 0, speed);

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
            handleFloor();
        } else if (!hud.gameStarted) {
            startingCamera.position.z += 1;
            if (startingCamera.position.z > 500) {
                startingCamera.position.z = 0;
            }
        }
        prevTimeStamp = timeStamp;
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};

Promise.all([
    loadPlayerMesh(DEBUG_MODE),
    ...scene.obstacleManager.obstacles.map((obstacle) =>
        obstacle.loadMesh(DEBUG_MODE)
    ),
    new Promise((resolve) => {
        audioLoader.load(deathSoundFile, (buffer) => {
            deathSound.setBuffer(buffer);
            deathSound.setLoop(false);
            deathSound.setVolume(1.5);
            resolve(true);
        });
    }),
    new Promise((resolve) => {
        audioLoader.load(jumpSoundFile, (buffer) => {
            jumpSound.setBuffer(buffer);
            jumpSound.setLoop(false);
            resolve(true);
        });
    }),
    new Promise((resolve) => {
        audioLoader.load(runningSoundFile, (buffer) => {
            runningSound.setBuffer(buffer);
            runningSound.setLoop(true);
            runningSound.setVolume(1.5);
            resolve(true);
        });
    }),
]).then(() => {
    renderer.compile(scene, camera);
    hud.renderingStarted();
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
    if (!hud.gameStarted || hud.gameOver) return;
    if (hud.isPaused) {
        if (e.code === 'Space') hud.pauseOnClick();
        return;
    }

    if (key === 'ArrowLeft') {
        scene.player.rotatePlayerLeft();
    } else if (key === 'ArrowRight') {
        scene.player.rotatePlayerRight();
    } else if (key === 'ArrowUp') {
        const jumped = scene.player.jumpPlayer();
        if (jumped) {
            runningSound.stop();
            jumpSound.play();
        }
    } else if (key === 'v') {
        if (camera.position.z == BACK_VIEW.z)
            camera.position.set(FRONT_VIEW.x, FRONT_VIEW.y, FRONT_VIEW.z);
        else camera.position.set(BACK_VIEW.x, BACK_VIEW.y, BACK_VIEW.z);
    } else if (key === 's') {
        scene.floor.toggleFloor();
    } else if (e.code === 'Space') {
        hud.pauseOnClick();
    }
});
