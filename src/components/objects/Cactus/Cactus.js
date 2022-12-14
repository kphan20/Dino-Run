import { Box3, Group, MeshPhongMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader';
import MODEL2 from './cactus.gltf';
import { drawWireFrameBox } from '../../../helpers';
import CACTUS_TEXTURE from './cactus/normal.tga';
import { boxesIntersect } from '../../intersection.js';

// Basic structure and organization derived from starter code for Flower.js
class Cactus extends Group {
    constructor(rightBound = false, leftBound = false) {
        super();
        // Set object state
        this.state = {
            width: 1.0,
            height: 2.0,
            depth: 1.0,
        };
        this.frustumCulled = false;
        this.name = 'cacti';
        this.originalBoundingBox = new Box3();
        this.boundingBox = this.originalBoundingBox.clone();

        this.visible = false;

        this.minX = leftBound ? 4 : -4; // minimum bound for x coordinate
        this.maxX = rightBound ? -4 : 4; // maximum bound for x coordinate
        this.minY = 0; // minimum bound for y coordinate
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
    }

    loadMesh() {
        return new Promise((resolve, reject) => {
            resolve(true);
            const tgaLoader = new TGALoader();
            tgaLoader.resourcePath = './src/components/objects/Cactus/cactus/';
            tgaLoader.load(CACTUS_TEXTURE, (texture) => {
                const material = new MeshPhongMaterial({
                    color: 0x2bd452,
                    map: texture,
                });
                material.flatShading = true;
                const loader = new GLTFLoader();
                loader.load(MODEL2, (gltf) => {
                    gltf.scene.scale.set(0.5, 0.5, 0.5);
                    this.add(gltf.scene);
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.material = material;
                            child.geometry.computeVertexNormals();
                        }
                    });
                    this.originalBoundingBox.setFromObject(gltf.scene);
                    gltf.scene.position.y =
                        -(
                            this.originalBoundingBox.max.y -
                            this.originalBoundingBox.min.y
                        ) / 2;
                    this.originalBoundingBox.setFromObject(gltf.scene);
                    drawWireFrameBox(this);
                    resolve(true);
                });
            });
        });
    }
}

export default Cactus;
