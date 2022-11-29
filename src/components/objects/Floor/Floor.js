import {
  PlaneGeometry,
  Group,
  Mesh,
  MeshBasicMaterial
} from 'three';

// Basic structure and organization derived from starter code for Flower.js
class Floor extends Group {
  constructor(parent) {
    super();

    // Set object state
    this.state = {
      width: 10000,
      height: 10000
    };

    // create object mesh (Example followed https://threejs.org/docs/#api/en/geometries/PlaneGeometry)
    const objGeo = new PlaneGeometry(
      this.state.width,
      this.state.height
    );
    const objMat = new MeshBasicMaterial({
      color: 0x006800,
    })
    const objMesh = new Mesh(objGeo, objMat);

    // rotate mesh to align horizontally
    objMesh.rotateX(Math.PI / -2);

    // set object position
    this.position.y = -2;

    // add mesh
    this.add(objMesh);
  }
}

export default Floor;