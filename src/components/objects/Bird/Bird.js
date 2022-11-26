import { 
    BoxGeometry, 
    Group, 
    Mesh, 
    MeshBasicMaterial 
} from 'three';

// Basic structure and organization derived from starter code for Flower.js
class Bird extends Group {
    constructor(parent) {
        super(); 

        // Set object state
        this.state = {
            width: 1.0, 
            height: 2.0, 
            depth: 1.0,
        };

        // create object mesh (Example followed https://threejs.org/manual/#en/fundamentals)
        const objGeo = new BoxGeometry(
            this.state.width, 
            this.state.height, 
            this.state.depth,
        );
        const objMat = new MeshBasicMaterial({
            color: 0x44aa88,
        })
        const objMesh = new Mesh(objGeo, objMat);

        // set object bottom to 0
        this.position.y = this.state.height / 2; 
        this.position.x = -3; 

        // add mesh
        this.add(objMesh);
    }
}

export default Bird;
