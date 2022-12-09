import {
    Box3,
    Group,
    Vector3,
    BoxBufferGeometry,
    Matrix4,
    WireframeGeometry,
    LineSegments,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import MODEL from './cactus_files2/scene.gltf';
import MODEL2 from './cactus.gltf';

// Basic structure and organization derived from starter code for Flower.js
class Cactus extends Group {
    constructor(parent) {
        super();

        // Set object state
        this.state = {
            width: 1.0,
            height: 2.0,
            depth: 1.0,
        };

        const loader = new GLTFLoader();
        //loader.setResourcePath('src/components/objects/Cactus/cactus-threejs/');
        this.name = 'cacti';
        this.originalBoundingBox = new Box3();
        loader.load(MODEL2, (gltf) => {
            gltf.scene.scale.set(0.5, 0.5, 0.5);
            this.add(gltf.scene);
            this.originalBoundingBox.setFromObject(gltf.scene);
            gltf.scene.position.y =
                -(
                    this.originalBoundingBox.max.y -
                    this.originalBoundingBox.min.y
                ) / 2;
            this.originalBoundingBox.setFromObject(gltf.scene);
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
            this.wireframe = new WireframeGeometry(boxGeo);
            const line = new LineSegments(this.wireframe);
            line.material.depthTest = false;
            line.material.opacity = 0.25;
            line.material.transparent = true;
            this.add(line);
        });
        this.boundingBox = this.originalBoundingBox.clone();

        this.visible = false;
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
        return playerBox.intersectsBox(this.boundingBox);
    }
}

export default Cactus;
