import {
    Box3,
    Vector3,
    BoxBufferGeometry,
    Matrix4,
    Object3D,
} from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL from './pebble_files1/scene.gltf';


class Pebble extends Object3D {
    constructor() {
        super(); 
        this.frustumCulled = false; 
        this.name = 'pebble';

        const loader = new GLTFLoader();
        loader.setResourcePath('src/components/objects/Pebble/pebble_files1/');
        this.originalBoundingBox = new Box3();
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            this.originalBoundingBox.setFromObject(gltf.scene);
            gltf.scene.position.y = this.originalBoundingBox.max.y;
            const dimensions = new Vector3().subVectors(
                this.originalBoundingBox.max,
                this.originalBoundingBox.min
            );
            const boxGeo = new BoxBufferGeometry(
                dimensions.x,
                dimensions.y,
                dimensions.z
            );
            const matrix = new Matrix4().setPosition(
                dimensions
                    .addVectors(
                        this.originalBoundingBox.min,
                        this.originalBoundingBox.max
                    )
                    .multiplyScalar(0.5)
            );
            boxGeo.applyMatrix4(matrix);
        });        
    }
}

export default Pebble; 
