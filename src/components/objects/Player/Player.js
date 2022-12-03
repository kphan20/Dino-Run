import { Mesh, CylinderGeometry, MeshPhongMaterial } from 'three';

class Player extends Mesh {
    constructor(parent, camera) {
        // Call parent Group() constructor
        super(new CylinderGeometry(), new MeshPhongMaterial());
        this.add(camera);
        this.geometry.computeBoundingBox();

        // Add self to parent's update list
        parent.addToUpdateList(this);

        // How much to rotate by for each key press
        this.rotationDelta = Math.PI / 16; 
    }

    rotatePlayerLeft() {
        this.rotation.y += this.rotationDelta; 
    }

    rotatePlayerRight() {
        this.rotation.y -= this.rotationDelta; 
    }

    movePlayer(dx, dy, dz) {
        this.translateX(dx);
        this.translateY(dy);
        this.translateZ(dz);
        this.geometry.boundingBox.min.add(this.position);
        this.geometry.boundingBox.max.add(this.position);
    }

    update(timeStamp) { }
}

export default Player;
