import {
    PlaneGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    MirroredRepeatWrapping,
} from 'three';
require('./rck_2.png');

// Basic structure and organization derived from starter code for Flower.js
class Left_Wall extends Group {
    constructor(parent) {
        super();

        // Disable automatic frustum culling (to use manual implementation)
        this.frustumCulled = false;

        // Set object state
        this.state = {
            width: 10000,
            height: 10000,
        };

        // create object mesh (Example followed https://threejs.org/docs/#api/en/geometries/PlaneGeometry)
        const objGeo = new PlaneGeometry(this.state.width, this.state.height);

        const loader = new TextureLoader();
        const texture = loader.load(
            'assets/src/components/objects/Left_Wall/rck_2.png'
        );
        texture.wrapS = MirroredRepeatWrapping;
        texture.wrapT = MirroredRepeatWrapping;
        texture.repeat.set(1024, 1024);

        const objMat = new MeshBasicMaterial({
            // color: 0x000000,
            transparent: true,
            opacity: 0,
            // map: texture,
            // precision: 'highp',
        });
        const objMesh = new Mesh(objGeo, objMat);

        // rotate mesh to align horizontally
        objMesh.rotateY(Math.PI / -2);

        // set object position
        this.position.x = 5;

        // add mesh
        this.add(objMesh);
    }
}

export default Left_Wall;
