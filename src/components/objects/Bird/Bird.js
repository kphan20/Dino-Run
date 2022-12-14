// import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { Box3, Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { drawWireFrameBox } from '../../../helpers';
import MODEL from './low_poly_bird/scene.gltf';
import { boxesIntersect } from '../../intersection.js';

require('./low_poly_bird/scene.bin');
require('./low_poly_bird/textures/lambert2_baseColor.png');
require('./low_poly_bird/textures/lambert2_metallicRoughness.png');
require('./low_poly_bird/textures/lambert2_normal.png');

// Basic structure and organization derived from starter code for Flower.js
class Bird extends Group {
    constructor() {
        super();
        this.frustumCulled = false;

        // Set object state
        this.state = {
            width: 5.0,
            height: 10.0,
            depth: 5.0,
        };

        this.name = 'bird';
        this.originalBoundingBox = new Box3();
        this.boundingBox = this.originalBoundingBox.clone();
        this.visible = false;

        this.minX = -4; // minimum bound for x coordinate
        this.maxX = 4; // maximum bound for x coordinate
        this.minY = -2; // minimum bound for y coordinate
        this.maxY = 0; // maximum bound for y coordinate
    }

    garbageCollect() {
        this.visible = false;
    }

    placeBottomAt(pos) {
        this.position.x = pos.x;
        this.position.y = pos.y + this.state.height / 2;
        this.position.z = pos.z;
        this.visible = true;
    }

    updateBoundingBox() {
        this.boundingBox = this.originalBoundingBox
            .clone()
            .translate(this.position);
    }

    checkCollision(playerBox) {
        if (!this.visible) return false;
        this.updateBoundingBox();
        return boxesIntersect(playerBox, this.boundingBox);
        // return playerBox.intersectsBox(this.boundingBox);
    }

    loadMesh(isDebugMode) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            loader.setResourcePath(
                'assets/src/components/objects/Bird/low_poly_bird/'
            );
            loader.load(MODEL, (gltf) => {
                gltf.scene.scale.setScalar(5);
                gltf.scene.rotateY(Math.PI);

                this.add(gltf.scene);
                this.originalBoundingBox.setFromObject(gltf.scene);
                gltf.scene.position.y =
                    -(
                        this.originalBoundingBox.max.y -
                        this.originalBoundingBox.min.y
                    ) / 2;
                this.originalBoundingBox.setFromObject(gltf.scene);
                if (isDebugMode) drawWireFrameBox(this);
                resolve(true);
            });
        });
    }
}

export default Bird;
