// import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';
import { Box3, Group, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL from './low_poly_bird/scene.gltf';

// Basic structure and organization derived from starter code for Flower.js
class Bird extends Group {
    constructor(parent) {
        super(); 
        this.frustumCulled = false;

        // Set object state
        this.state = {
            width: 5.0,
            height: 10.0,
            depth: 5.0,
        };

        const loader = new GLTFLoader();
        loader.setResourcePath('src/components/objects/Bird/low_poly_bird/');
        this.name = 'bird';

        this.originalBoundingBox = new Box3();

        loader.load(MODEL, (gltf) => {
            gltf.scene.scale.setScalar(5);

            this.add(gltf.scene);
            const geometries = [];
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    geometries.push(child.geometry);
                }
            });
            const newMin = new Vector3(Infinity, Infinity, Infinity);
            const newMax = new Vector3(-Infinity, -Infinity, -Infinity);
            geometries.forEach((geo) => {
                geo.computeBoundingBox();
                const bbox = geo.boundingBox;
                const min = bbox.min;
                const max = bbox.max;
                newMin.x = Math.min(newMin.x, min.x);
                newMin.y = Math.min(newMin.y, min.y);
                newMin.z = Math.min(newMin.z, min.z);
                newMax.x = Math.max(newMax.x, max.x);
                newMax.y = Math.max(newMax.y, max.y);
                newMax.z = Math.max(newMax.z, max.z);
            });
            this.originalBoundingBox.min = newMin;
            this.originalBoundingBox.max = newMax;
        });
        this.boundingBox = this.originalBoundingBox.clone();

        this.visible = false;
    }

    garbageCollect() {
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
        return playerBox.intersectsBox(this.boundingBox);
    }
}

export default Bird;
