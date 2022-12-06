import {
    BoxGeometry,
    Group,
    Mesh,
    MeshBasicMaterial
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './bird.gltf';

// Basic structure and organization derived from starter code for Flower.js
class Bird extends Group {
    constructor(parent) {
        super();

        // Set object state
        this.state = {
            // gui: parent.state.gui,
            width: 1.0,
            height: 2.0,
            depth: 1.0,
        };

        // // Load object
        const loader = new GLTFLoader();

        this.name = 'bird';
        loader.load('src/components/objects/Bird/scene.gltf', (gltf) => {
            this.add(gltf.scene);
        });

        // create object mesh (Example followed https://threejs.org/manual/#en/fundamentals)
        // const objGeo = new BoxGeometry(
        //     this.state.width,
        //     this.state.height,
        //     this.state.depth,
        // );
        // const objMat = new MeshBasicMaterial({
        //     color: 0x44aa88,
        // })
        // const objMesh = new Mesh(objGeo, objMat);

        // set object bottom to 0
        // this.position.y = this.state.height / 2;
        // this.position.x = -3;

        // this.visible = false;

        // add mesh
        // this.add(objMesh);
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
        const geo = this.children[0].geometry;
        geo.computeBoundingBox();
        geo.boundingBox.translate(this.position);
    }

    checkCollision(playerBox) {
        this.updateBoundingBox();
        return playerBox.intersectsBox(this.children[0].geometry.boundingBox);
    }
}

export default Bird;
