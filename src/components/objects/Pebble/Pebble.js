import {
    Box3,
    Vector3,
    BoxBufferGeometry,
    Group,
    DodecahedronGeometry,
    OctahedronGeometry, 
    IcosahedronGeometry,
    Mesh,
    MeshBasicMaterial,
    TextureLoader,
    Matrix4,
    Object3D,
} from 'three';

class Pebble extends Group {
    constructor(geo, mat) {
        super(); 
        this.frustumCulled = false; 
        this.name = 'pebble';

        const objMesh = new Mesh(geo, mat);
        this.add(objMesh);
        objMesh.position.y = 0;


        // GLTF file was causing too much expensive rendering
        // const loader = new GLTFLoader(loadingManager);
        // loader.setResourcePath('src/components/objects/Pebble/pebble_files1/');
        // this.originalBoundingBox = new Box3();
        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        //     gltf.scene.scale.set(0.5, 0.5, 0.5);
        //     this.originalBoundingBox.setFromObject(gltf.scene);
        //     gltf.scene.position.y = this.originalBoundingBox.max.y;
        //     const dimensions = new Vector3().subVectors(
        //         this.originalBoundingBox.max,
        //         this.originalBoundingBox.min
        //     );
        //     const boxGeo = new BoxBufferGeometry(
        //         dimensions.x,
        //         dimensions.y,
        //         dimensions.z
        //     );
        //     const matrix = new Matrix4().setPosition(
        //         dimensions
        //             .addVectors(
        //                 this.originalBoundingBox.min,
        //                 this.originalBoundingBox.max
        //             )
        //             .multiplyScalar(0.5)
        //     );
        //     boxGeo.applyMatrix4(matrix);
        // });        
    }
}

export default Pebble; 
